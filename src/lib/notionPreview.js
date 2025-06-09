// Helper function to convert Notion rich text to HTML
const convertNotionToHTML = (richText) => {
  if (!richText || richText.length === 0) return '';
  
  return richText.map(block => {
    const text = block.plain_text || '';
    const annotations = block.annotations || {};
    
    let html = text;
    
    // Apply formatting
    if (annotations.bold) html = `<strong>${html}</strong>`;
    if (annotations.italic) html = `<em>${html}</em>`;
    if (annotations.code) html = `<code>${html}</code>`;
    if (annotations.strikethrough) html = `<del>${html}</del>`;
    if (annotations.underline) html = `<u>${html}</u>`;
    
    // Handle links
    if (block.href) {
      html = `<a href="${block.href}" target="_blank" rel="noopener noreferrer">${html}</a>`;
    }
    
    return html;
  }).join('');
};

// Helper function to format content with proper paragraphs
const formatContentToHTML = (content) => {
  if (!content) return '';
  
  return content
    .split('\n')
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map(paragraph => {
      // Check if it's a list item
      if (paragraph.startsWith('- ')) {
        return `<li>${paragraph.substring(2)}</li>`;
      }
      // Check if it's a numbered list
      if (/^\d+\.\s/.test(paragraph)) {
        return `<li>${paragraph.replace(/^\d+\.\s/, '')}</li>`;
      }
      // Regular paragraph
      return `<p>${paragraph}</p>`;
    })
    .join('\n')
    // Wrap consecutive list items in ul tags
    .replace(/(<li>.*<\/li>\n?)+/g, match => `<ul>\n${match}</ul>\n`);
};

// Main function to generate a preview for a specific Notion post
export const generateNotionPreview = async (slug) => {
  try {
    // This would be called by Claude with direct access to Notion
    // For now, we'll simulate the data structure based on what we saw
    
    // In a real implementation, this would:
    // 1. Query the Notion database for Status = "Editing" and matching slug
    // 2. Convert the rich text content to HTML
    // 3. Return the formatted post data
    
    console.log(`Generating preview for slug: ${slug}`);
    
    // Placeholder return structure
    return {
      id: 'notion-preview-id',
      title: 'Post title from Notion',
      slug: slug,
      content: '<p>Formatted HTML content from Notion</p>',
      author: 'Author from Notion',
      featured_image_url: 'https://example.com/image.jpg',
      tags: ['tag1', 'tag2'],
      created_at: new Date().toISOString(),
      type: 'essay'
    };
    
  } catch (error) {
    console.error('Error generating Notion preview:', error);
    throw error;
  }
};

export default generateNotionPreview;
