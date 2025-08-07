/* global WebImporter */
export default function parse(element, { document }) {
  // Find the table inside the blogtable block
  const blogTable = element.querySelector('.c-blogtable__scroll-container table');
  if (!blogTable) return;

  // Compose cells for createTable.
  // First row is always a single cell with 'Table (table16)'
  const cells = [['Table (table16)']];

  // Next row: real table header (from <thead><tr> or first row)
  let headerCells = [];
  const thead = blogTable.querySelector('thead');
  if (thead) {
    const headerTr = thead.querySelector('tr');
    if (headerTr) {
      headerCells = Array.from(headerTr.children).map(th => th.textContent.trim());
    }
  } else {
    // fallback: first row of table
    const firstTr = blogTable.querySelector('tr');
    if (firstTr) {
      headerCells = Array.from(firstTr.children).map(th => th.textContent.trim());
    }
  }
  if (headerCells.length) {
    cells.push(headerCells);
  }

  // Data rows (from <tbody><tr> or remaining rows)
  let rows = [];
  const tbody = blogTable.querySelector('tbody');
  if (tbody) {
    rows = Array.from(tbody.querySelectorAll('tr'));
  } else {
    // fallback: all <tr> except the first one (header)
    const allRows = Array.from(blogTable.querySelectorAll('tr'));
    rows = allRows.slice(1);
  }

  rows.forEach(tr => {
    const rowCells = Array.from(tr.children).map(td => {
      // If cell has <p> child, use its child nodes, else use all childNodes
      if (
        td.childElementCount === 1 &&
        td.firstElementChild.tagName === 'P'
      ) {
        return Array.from(td.firstElementChild.childNodes);
      }
      if (td.childNodes.length > 0) {
        return Array.from(td.childNodes);
      }
      return td.textContent.trim();
    });
    cells.push(rowCells);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the full .c-blogtable element for atomicity
  const toReplace = blogTable.closest('.c-blogtable') || blogTable.parentElement;
  toReplace.replaceWith(block);
}
