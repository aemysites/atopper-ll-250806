/* global WebImporter */
export default function parse(element, { document }) {
  // Find the desktop nav container which contains the visible nav items
  const nav = element.querySelector('nav');
  if (!nav) return;
  const wrapper = nav.querySelector('.c-blog-secondarynav__wrapper');
  if (!wrapper) return;
  const desktopContainer = wrapper.querySelector('.c-blog-secondarynav__d-container');
  if (!desktopContainer) return;
  const navList = desktopContainer.querySelector('ul.c-blog-secondarynav__nav-items');
  if (!navList) return;
  const lis = navList.querySelectorAll('li');

  // For each li, preserve ALL its content in a wrapper div (so any text, icons, links, etc. remain intact and in order)
  const columns = Array.from(lis).map((li) => {
    const div = document.createElement('div');
    // Append all children (including text nodes) of li to div
    li.childNodes.forEach((node) => {
      div.appendChild(node);
    });
    return div;
  });

  // Table: header row is a single cell, content row contains all columns
  const headerRow = ['Columns (columns21)'];
  const contentRow = columns;
  const tableRows = [headerRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
