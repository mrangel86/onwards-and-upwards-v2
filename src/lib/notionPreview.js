// Direct preview generation function using Claude's Notion access
export const generatePreviewForSlug = async (slug) => {
  console.log(`Generating preview for slug: ${slug}`);
  
  // This function would be called by Claude directly with Notion MCP access
  // Example data structure based on the Notion query results:
  
  if (slug === 'gesy-draft-1') {
    // Convert Notion content to HTML
    const notionContent = `This is a test draft post to see how the preview system works!

I'm writing this in Notion and it should appear on the preview page when I visit the special URL.

The preview should show:
- This formatted text
- The featured image below
- All the tags
- A nice preview notice

This is so much easier than learning complex blog systems!`;

    // Format content with proper HTML
    const htmlContent = notionContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        if (line.startsWith('- ')) {
          return `<li>${line.substring(2)}</li>`;
        }
        return `<p>${line}</p>`;
      })
      .join('\n')
      .replace(/(<li>.*<\/li>\n?)+/g, match => `<ul>\n${match}</ul>\n`);

    return {
      id: '209eb7b9-d010-8136-86ba-da729cf89bbc',
      title: 'Test Draft Post for Gesy',
      slug: 'gesy-draft-1',
      content: htmlContent,
      author: 'Gesy',
      featured_image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      hero_image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      tags: [],
      created_at: '2025-06-05T14:54:00.000Z',
      publish_date: '2025-06-05',
      type: 'essay',
      excerpt: 'A test draft post to see how the preview system works with Notion integration.'
    };
  }
  
  return null;
};

// Function that Claude can call to preview any Notion post with Status = "Editing"
export const previewNotionPost = (notionPageData) => {
  const properties = notionPageData.properties;
  
  // Extract data from Notion properties
  const title = properties.Title?.title?.[0]?.plain_text || 'Untitled';
  const slug = properties.Slug?.rich_text?.[0]?.plain_text || 'untitled';
  const author = properties.Author?.select?.name || 'Anonymous';
  const featuredImage = properties['Featured Image']?.url;
  const publishDate = properties['Publish Date']?.date?.start;
  const contentRichText = properties.Content?.rich_text || [];
  const tags = properties.Tags?.multi_select?.map(tag => tag.name) || [];
  
  // Convert Notion rich text to plain text first
  const plainContent = contentRichText.map(block => block.plain_text).join('');
  
  // Convert to HTML with proper formatting
  const htmlContent = plainContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      if (line.startsWith('- ')) {
        return `<li>${line.substring(2)}</li>`;
      }
      if (/^\d+\.\s/.test(line)) {
        return `<li>${line.replace(/^\d+\.\s/, '')}</li>`;
      }
      return `<p>${line}</p>`;
    })
    .join('\n')
    .replace(/(<li>.*<\/li>\n?)+/g, match => `<ul>\n${match}</ul>\n`);
  
  return {
    id: notionPageData.id,
    title,
    slug,
    content: htmlContent,
    author,
    featured_image_url: featuredImage,
    hero_image_url: featuredImage,
    tags,
    created_at: notionPageData.created_time,
    publish_date: publishDate,
    type: 'essay',
    excerpt: plainContent.substring(0, 200) + '...'
  };
};

export default { generatePreviewForSlug, previewNotionPost };
