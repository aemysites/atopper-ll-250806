/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns (columns8)
  const headerRow = ['Columns (columns8)'];

  // Defensive: find the main container for the columns content
  const container = element.querySelector('.c-blogcom__container');
  if (!container) return;

  // There are two main children: image container and content container
  const imageContainer = container.querySelector('.c-blogcom__image-container');
  const contentContainer = container.querySelector('.c-blogcom__content');

  // Defensive: ensure both columns exist
  if (!imageContainer || !contentContainer) return;

  // The left column: grab the content block (heading + paragraph)
  // The right column: grab the image (the <picture> element)
  // Use the entire contentContainer and imageContainer for resilience
  const leftCol = contentContainer;
  const rightCol = imageContainer;

  // Build the table rows
  const rows = [
    headerRow,
    [leftCol, rightCol],
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
