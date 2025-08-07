/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container for the footer block
  const container = element.querySelector('.c-footll__container');
  if (!container) return;
  const cFootll = container.querySelector('.c-footll');
  if (!cFootll) return;

  // Find the columns in the nav (Company, Help, Business Solutions)
  const nav = cFootll.querySelector('.c-footll__navlinks');
  let navColumns = [];
  if (nav) {
    navColumns = Array.from(nav.querySelectorAll(':scope > .c-footll__col'));
  }

  // Find the social icons column
  const socialIcons = cFootll.querySelector('.c-footll__social-icons');

  // Build the second row with as many columns as present nav columns + social icons
  const contentRow = [...navColumns];
  if (socialIcons) {
    contentRow.push(socialIcons);
  }

  // Find logo/copyright
  const logoCopyrightWrapper = cFootll.querySelector('.c-footll__logo-copyright-wrapper');
  let logoDiv = logoCopyrightWrapper ? logoCopyrightWrapper.querySelector('.c-footll__logo') : null;
  const copyright = cFootll.querySelector('.c-footll__copyright');

  // Compose third row if logo or copyright present
  let thirdRow = null;
  if (logoDiv && copyright) {
    thirdRow = [logoDiv, copyright];
  } else if (logoDiv && !copyright) {
    thirdRow = [logoDiv];
  } else if (!logoDiv && copyright) {
    thirdRow = ['', copyright];
  }

  // Now build the cells array
  // The header row must be a single cell (one column), regardless of the number of columns in the following rows
  const headerRow = ['Columns (columns45)'];
  const cells = [headerRow, contentRow];
  if (thirdRow) cells.push(thirdRow);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Set the header row to span all columns (colspan) to match the markdown example visually and structurally
  const th = block.querySelector('tr:first-child th');
  if (th && contentRow.length > 1) {
    th.setAttribute('colspan', contentRow.length);
  }

  // Replace the original element
  element.replaceWith(block);
}
