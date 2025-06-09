import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Plus, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface DraftPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  hero_image_url: string | null;
  author: string | null;
  excerpt: string | null;
  created_at: string;
  type: string;
}

const DraftManager = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingDraft, setEditingDraft] = useState<DraftPost | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    hero_image_url: "",
    author: "",
    excerpt: "",
    type: "essay" as const
  });

  // Fetch all draft posts
  const { data: drafts, isLoading } = useQuery({
    queryKey: ['drafts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DraftPost[];
    }
  });

  // Create new draft mutation
  const createDraftMutation = useMutation({
    mutationFn: async (newDraft: typeof formData) => {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          ...newDraft,
          published: false
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      setShowCreateForm(false);
      resetForm();
      toast.success("Draft created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create draft: " + error.message);
    }
  });

  // Update draft mutation
  const updateDraftMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<typeof formData> }) => {
      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      setEditingDraft(null);
      resetForm();
      toast.success("Draft updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update draft: " + error.message);
    }
  });

  // Delete draft mutation
  const deleteDraftMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      toast.success("Draft deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete draft: " + error.message);
    }
  });

  // Publish draft mutation
  const publishDraftMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('posts')
        .update({ published: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['drafts'] });
      toast.success("Draft published successfully!");
      navigate(`/posts/${data.slug}`);
    },
    onError: (error) => {
      toast.error("Failed to publish draft: " + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      hero_image_url: "",
      author: "",
      excerpt: "",
      type: "essay"
    });
  };

  const handleEdit = (draft: DraftPost) => {
    setEditingDraft(draft);
    setFormData({
      title: draft.title,
      slug: draft.slug,
      content: draft.content || "",
      hero_image_url: draft.hero_image_url || "",
      author: draft.author || "",
      excerpt: draft.excerpt || "",
      type: draft.type as any
    });
    setShowCreateForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDraft) {
      updateDraftMutation.mutate({ id: editingDraft.id, updates: formData });
    } else {
      createDraftMutation.mutate(formData);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  if (isLoading) {
    return (
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
          <p className="text-center">Loading drafts...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-playfair text-3xl font-bold text-primary">Draft Manager</h1>
          <Button 
            onClick={() => {
              setShowCreateForm(true);
              setEditingDraft(null);
              resetForm();
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Draft
          </Button>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingDraft ? 'Edit Draft' : 'Create New Draft'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          title,
                          slug: generateSlug(title)
                        }));
                      }}
                      placeholder="Post title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Slug</label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="post-slug"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Author</label>
                    <Input
                      value={formData.author}
                      onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="Author name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hero Image URL</label>
                    <Input
                      value={formData.hero_image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, hero_image_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Excerpt</label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of the post"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content (HTML)</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="<p>Your HTML content here...</p>"
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createDraftMutation.isPending || updateDraftMutation.isPending}>
                    {editingDraft ? 'Update Draft' : 'Create Draft'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingDraft(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Drafts List */}
        <div className="grid gap-4">
          {drafts?.map((draft) => (
            <Card key={draft.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-playfair text-xl font-semibold mb-2">{draft.title}</h3>
                    <p className="text-gray-600 mb-2">Slug: <code className="bg-gray-100 px-2 py-1 rounded">{draft.slug}</code></p>
                    {draft.excerpt && (
                      <p className="text-gray-700 text-sm mb-2">{draft.excerpt}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Badge variant="secondary">{draft.type}</Badge>
                      <span>by {draft.author || 'Anonymous'}</span>
                      <span>•</span>
                      <span>{new Date(draft.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/preview/${draft.slug}`)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(draft)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => publishDraftMutation.mutate(draft.id)}
                      disabled={publishDraftMutation.isPending}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Publish
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this draft?')) {
                          deleteDraftMutation.mutate(draft.id);
                        }
                      }}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {drafts?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No drafts found.</p>
            <Button onClick={() => setShowCreateForm(true)}>Create your first draft</Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DraftManager;
