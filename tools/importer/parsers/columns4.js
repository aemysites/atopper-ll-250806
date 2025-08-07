/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container for the footer columns
  const container = element.querySelector('.c-footll');
  if (!container) return;

  // Get navlinks (columns)
  const nav = container.querySelector('.c-footll__navlinks');
  let navCols = [];
  if (nav) {
    navCols = Array.from(nav.querySelectorAll('.c-footll__col'));
  }

  // Social icons
  const socialCol = container.querySelector('.c-footll__social-icons');

  // Logo and copyright
  const logoWrap = container.querySelector('.c-footll__logo');
  const copyrightWrap = container.querySelector('.c-footll__copyright');

  // Defensive: ensure at least three navCols
  while (navCols.length < 3) navCols.push(document.createElement('div'));

  // First row: three nav columns + social icons
  const firstRow = [navCols[0], navCols[1], navCols[2], socialCol || document.createElement('div')];
  // Second row: logo left, copyright right, rest blank
  const secondRow = [logoWrap || document.createElement('div'), copyrightWrap || document.createElement('div'), '', ''];

  // The header row: block name (Columns) in a single cell (matches example)
  const headerRow = ['Columns'];

  const cells = [
    headerRow,
    firstRow,
    secondRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
