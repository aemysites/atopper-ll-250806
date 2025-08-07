/* global WebImporter */
export default function parse(element, { document }) {
  // Find main columns for the block
  // Should be two columns: left (text/bio/social), right (image)
  const children = element.querySelectorAll(':scope > div');
  let textCol = null;
  let imgCol = null;
  if (children.length >= 2) {
    // Heuristic: text content comes before image
    if (children[0].classList.contains('c-authorheader__container__text')) {
      textCol = children[0];
      imgCol = children[1];
    } else {
      textCol = element.querySelector('.c-authorheader__container__text');
      imgCol = element.querySelector('.c-authorheader__container__img');
    }
  } else {
    textCol = element.querySelector('.c-authorheader__container__text');
    imgCol = element.querySelector('.c-authorheader__container__img');
  }
  if (!textCol) textCol = document.createElement('div');
  if (!imgCol) imgCol = document.createElement('div');

  // Header row must match number of columns in content row
  const headerRow = ['Columns (columns13)', ''];
  const contentRow = [textCol, imgCol];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}