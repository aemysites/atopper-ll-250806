/* global WebImporter */
export default function parse(element, { document }) {
  // Recursive conversion of non-image elements with src (eg. iframe) to links
  function convertSrcElementsToLinks(container) {
    if (!container) return;
    // If container is a single element, make a node list for uniformity
    let nodeList = container instanceof Element && !container.children.length ? [container] : (container.querySelectorAll('*[src]') || []);
    // First, process direct children
    for (const el of nodeList) {
      if (el.tagName === 'IMG' || el.closest('picture')) continue; // Don't convert images
      const src = el.getAttribute('src');
      if (src) {
        const link = document.createElement('a');
        link.href = src;
        link.textContent = src;
        el.replaceWith(link);
      }
    }
  }

  // 1. Main content columns
  const mainContent = element.querySelector('#mainContent');
  if (!mainContent) return;
  const mainGrid = mainContent.querySelector('.aem-Grid');
  if (!mainGrid) return;

  // Two main columns
  const columns = Array.from(mainGrid.children).filter(col =>
    col.classList.contains('aem-GridColumn--default--6')
  );
  if (columns.length < 2) return;
  const leftCol = columns[0];
  const rightCol = columns[1];

  // LEFT
  const leftColBody = leftCol.querySelector('div > div.cmp-container__body');
  if (leftColBody) convertSrcElementsToLinks(leftColBody);
  let leftCellContent = leftColBody ? [leftColBody] : [leftCol];

  // RIGHT
  const rightImage = rightCol.querySelector('.image .c-image');
  if (rightImage) convertSrcElementsToLinks(rightImage);
  let rightCellContent = rightImage ? [rightImage] : [rightCol];

  // 2. Centered heading/intro: first .text.aem-GridColumn after mainGrid
  let centeredText = null;
  let afterMainGrid = mainGrid.parentElement.nextElementSibling;
  while (afterMainGrid) {
    if (afterMainGrid.classList.contains('text')) {
      centeredText = afterMainGrid;
      break;
    }
    afterMainGrid = afterMainGrid.nextElementSibling;
  }
  if (centeredText) convertSrcElementsToLinks(centeredText);

  // 3. Steps row: find .aem-Grid--12 with three .aem-GridColumn--default--4, each with .cmp-container__body
  let stepsColumns = [];
  for (let grid of element.querySelectorAll('.aem-Grid--12')) {
    let cols = Array.from(grid.children).filter(col => col.classList.contains('aem-GridColumn--default--4'));
    if (cols.length === 3 && cols.every(col => col.querySelector('.cmp-container__body .image') && col.querySelector('.cmp-container__body .text'))) {
      stepsColumns = cols.map(col => {
        const body = col.querySelector('.cmp-container__body');
        if (body) convertSrcElementsToLinks(body);
        return body ? body : col;
      });
      break;
    }
  }

  // Compose the table
  // 1. Header row
  // 2. [leftColContent, rightColContent]
  // 3. [centeredText, '']
  // 4. [steps 1+2, step 3]
  const cells = [];
  cells.push(['Columns (columns27)']);
  cells.push([leftCellContent, rightCellContent]);
  if (centeredText) {
    cells.push([centeredText, '']);
  }
  if (stepsColumns.length === 3) {
    cells.push([[stepsColumns[0], stepsColumns[1]], stepsColumns[2]]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
