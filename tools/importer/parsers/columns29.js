/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // Step 1: Find the main content block
  let cRefContainer = getChildByClass(element, 'c-ref__container');
  if (!cRefContainer) return;
  let cRef = getChildByClass(cRefContainer, 'c-ref');
  if (!cRef) return;
  let footllContainer = getChildByClass(cRef, 'c-footll__container');
  if (!footllContainer) return;
  let lContainer = getChildByClass(footllContainer, 'l-container');
  if (!lContainer) return;
  let cFootll = getChildByClass(lContainer, 'c-footll');
  if (!cFootll) return;

  // Step 2: Get the nav columns
  let navLinks = getChildByClass(cFootll, 'c-footll__navlinks');
  let columns = [];
  if (navLinks) {
    const colDivs = Array.from(navLinks.children).filter((el) => el.classList.contains('c-footll__col'));
    columns = colDivs.map((colDiv) => {
      const colChildren = Array.from(colDiv.children).filter((child) => !child.classList.contains('c-footll__toggle'));
      const colWrapper = document.createElement('div');
      colChildren.forEach((child) => colWrapper.appendChild(child));
      return colWrapper;
    });
  }

  // Step 3: Get social icons
  let socialIconsDiv = getChildByClass(cFootll, 'c-footll__social-icons');
  let socialIcons = [];
  if (socialIconsDiv) {
    socialIcons = Array.from(socialIconsDiv.querySelectorAll('a')).map((a) => a);
  }
  let socialIconsWrapper = null;
  if (socialIcons.length > 0) {
    socialIconsWrapper = document.createElement('div');
    socialIcons.forEach((icon) => socialIconsWrapper.appendChild(icon));
  }

  // Step 4: Get logo and copyright for a single cell spanning all columns
  let logoCopyrightDiv = getChildByClass(cFootll, 'c-footll__logo-copyright-wrapper');
  let logoDiv = logoCopyrightDiv ? getChildByClass(logoCopyrightDiv, 'c-footll__logo') : null;
  let copyrightDiv = getChildByClass(cFootll, 'c-footll__copyright');
  let logoCopyrightCell = '';
  if (logoDiv || copyrightDiv) {
    let cellDiv = document.createElement('div');
    if (logoDiv) {
      let picture = logoDiv.querySelector('picture');
      if (picture) cellDiv.appendChild(picture);
    }
    if (copyrightDiv) {
      let p = copyrightDiv.querySelector('p');
      if (p) cellDiv.appendChild(p);
    }
    logoCopyrightCell = cellDiv;
  }

  // Step 5: Build table rows
  const headerRow = ['Columns (columns29)'];
  const secondRow = [
    columns[0] || '',
    columns[1] || '',
    columns[2] || '',
    socialIconsWrapper || ''
  ];
  // Third row: logo and copyright in a single cell spanning all columns
  const thirdRow = [logoCopyrightCell || ''];
  const cells = [
    headerRow,
    secondRow,
    thirdRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Make the last row's cell span all columns
  if (block.rows.length === 3) {
    const lastRow = block.rows[2];
    if (lastRow.cells.length === 1) {
      lastRow.cells[0].setAttribute('colspan', '4');
    }
  }
  element.replaceWith(block);
}
