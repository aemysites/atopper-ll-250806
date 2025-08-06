/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main cmp-container__body which has the aem-Grid
  const containerBody = element.querySelector('.cmp-container__body');
  if (!containerBody) return;
  const grid = containerBody.querySelector('.aem-Grid');
  if (!grid) return;

  // Find columns: left is typically the text heading and intro, right is image+subtext
  // Let's extract all direct children of aem-Grid that represent blocks of content
  const gridChildren = Array.from(grid.children);

  // First column: all text blocks (heading, description) from first logical group
  // (Find all consecutive .text elements at the top. These are the heading and lead text.)
  const firstColContent = [];
  for (let i = 0; i < gridChildren.length; i++) {
    const child = gridChildren[i];
    if (child.classList.contains('text')) {
      const content = child.querySelector('.cmp-text');
      if (content) firstColContent.push(content);
    } else {
      break;
    }
  }

  // Second column: image (and any adjacent subblock with more text)
  // Find an image block
  let imgCol = null;
  let imgEl = null;
  for (let i = 0; i < gridChildren.length; i++) {
    const child = gridChildren[i];
    if (child.classList.contains('image')) {
      imgCol = child;
      imgEl = child.querySelector('picture') || child.querySelector('img');
      break;
    }
  }
  // If there is a text container after image, treat as part of this column
  let imgColIndex = imgCol ? gridChildren.indexOf(imgCol) : -1;
  let textAfterImg = null;
  if (imgColIndex !== -1 && gridChildren.length > imgColIndex + 1) {
    // See if next is a container with more text
    const next = gridChildren[imgColIndex + 1];
    if (next && next.classList.contains('container')) {
      const subBody = next.querySelector('.cmp-container__body');
      if (subBody) {
        // Find all text blocks in here
        const moreTexts = Array.from(subBody.querySelectorAll('.cmp-text'));
        if (moreTexts.length > 0) {
          textAfterImg = moreTexts;
        }
      }
    }
  }

  // Compose columns: left is all heading/intro text; right is image + more text if present
  const columns = [];
  if (firstColContent.length > 0) {
    columns.push(firstColContent.length === 1 ? firstColContent[0] : firstColContent);
  } else {
    // Fallback: push whole grid child if nothing found
    columns.push(gridChildren[0]);
  }

  const rightCol = [];
  if (imgEl) rightCol.push(imgEl);
  if (textAfterImg) rightCol.push(...textAfterImg);
  if (rightCol.length > 0) {
    columns.push(rightCol.length === 1 ? rightCol[0] : rightCol);
  } else if (imgCol) {
    columns.push(imgCol);
  } else {
    // Fallback: try next block
    columns.push(gridChildren[1]);
  }

  // Assemble the block
  const cells = [
    ['Columns (columns47)'],
    columns,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
