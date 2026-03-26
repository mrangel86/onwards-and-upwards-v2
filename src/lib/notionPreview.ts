// Direct preview generation function using Claude's Notion access

interface NotionRichText {
  plain_text: string;
}

interface NotionSelectOption {
  name: string;
}

interface NotionProperties {
  Title?: { title: NotionRichText[] };
  Slug?: { rich_text: NotionRichText[] };
  Author?: { select: NotionSelectOption };
  'Featured Image'?: { url: string };
  'Publish Date'?: { date: { start: string } };
  Content?: { rich_text: NotionRichText[] };
  Tags?: { multi_select: NotionSelectOption[] };
}

interface NotionPageData {
  id: string;
  created_time: string;
  properties: NotionProperties;
}

interface PreviewPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  featured_image_url: string | undefined;
  hero_image_url: string | undefined;
  tags: string[];
  created_at: string;
  publish_date: string | undefined;
  type: string;
  excerpt: string;
}

const convertLinesToHtml = (lines: string[]): string =>
  lines
    .map((line) => {
      if (line.startsWith('- ')) return `<li>${line.substring(2)}</li>`;
      if (/^\d+\.\s/.test(line)) return `<li>${line.replace(/^\d+\.\s/, '')}</li>`;
      return `<p>${line}</p>`;
    })
    .join('\n')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>\n${match}</ul>\n`);

// This function would be called by Claude directly with Notion MCP access
export const generatePreviewForSlug = async (slug: string): Promise<PreviewPost | null> => {
  if (slug === 'gesy-draft-1') {
    const notionContent = `This is a test draft post to see how the preview system works!

I'm writing this in Notion and it should appear on the preview page when I visit the special URL.

The preview should show:
- This formatted text
- The featured image below
- All the tags
- A nice preview notice

This is so much easier than learning complex blog systems!`;

    const lines = notionContent
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    return {
      id: '209eb7b9-d010-8136-86ba-da729cf89bbc',
      title: 'Test Draft Post for Gesy',
      slug: 'gesy-draft-1',
      content: convertLinesToHtml(lines),
      author: 'Gesy',
      featured_image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      hero_image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      tags: [],
      created_at: '2025-06-05T14:54:00.000Z',
      publish_date: '2025-06-05',
      type: 'essay',
      excerpt: 'A test draft post to see how the preview system works with Notion integration.',
    };
  }

  return null;
};

// Function that Claude can call to preview any Notion post with Status = "Editing"
export const previewNotionPost = (notionPageData: NotionPageData): PreviewPost => {
  const { properties } = notionPageData;

  const title = properties.Title?.title?.[0]?.plain_text ?? 'Untitled';
  const slug = properties.Slug?.rich_text?.[0]?.plain_text ?? 'untitled';
  const author = properties.Author?.select?.name ?? 'Anonymous';
  const featuredImage = properties['Featured Image']?.url;
  const publishDate = properties['Publish Date']?.date?.start;
  const contentRichText = properties.Content?.rich_text ?? [];
  const tags = properties.Tags?.multi_select?.map((tag) => tag.name) ?? [];

  const plainContent = contentRichText.map((block) => block.plain_text).join('');

  const lines = plainContent
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return {
    id: notionPageData.id,
    title,
    slug,
    content: convertLinesToHtml(lines),
    author,
    featured_image_url: featuredImage,
    hero_image_url: featuredImage,
    tags,
    created_at: notionPageData.created_time,
    publish_date: publishDate,
    type: 'essay',
    excerpt: plainContent.substring(0, 200) + '...',
  };
};

export default { generatePreviewForSlug, previewNotionPost };
