/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as in the example
  const headerRow = ['Hero (hero39)'];

  // --- Background Image Row
  // Try to find <picture> or <img> directly inside the image container
  let picture = element.querySelector('.c-article__header-img picture');
  if (!picture) {
    // If no picture, look for img inside image container
    const img = element.querySelector('.c-article__header-img img');
    if (img) {
      // Use img directly, as fallback
      picture = img;
    }
  }
  // If nothing, leave blank
  const backgroundRow = [picture ? picture : ''];

  // --- Content Row (title/subheading/cta)
  // Find the .c-article__header-text-container, which contains the heading etc
  const textContainer = element.querySelector('.c-article__header-text-container');
  // If it exists and has at least an h1, use the container as the content cell
  let contentCell;
  if (textContainer && textContainer.children.length > 0) {
    contentCell = textContainer;
  } else {
    // Fallback: try direct h1
    const h1 = element.querySelector('h1');
    contentCell = h1 ? h1 : '';
  }
  const contentRow = [contentCell];

  // --- Compose rows and create table
  const rows = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
