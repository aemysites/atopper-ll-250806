/* global WebImporter */
export default function parse(element, { document }) {
  // Find all descendant tables with class 'table-lines' (the main content tables for 'Table (bordered)')
  const tables = element.querySelectorAll('table.table-lines');
  tables.forEach((table) => {
    // Get the table header cells (th elements), extracting their text content as in the example
    const thead = table.querySelector('thead');
    const headerCells = Array.from(
      (thead && thead.querySelectorAll('th')) || []
    ).map((th) => {
      const p = th.querySelector('p');
      return p ? p.textContent.trim() : th.textContent.trim();
    });

    const blockHeader = ['Table (bordered)'];
    const columnHeaders = headerCells;

    // Process each row of tbody as a data row
    const tbody = table.querySelector('tbody');
    const rows = Array.from((tbody && tbody.querySelectorAll('tr')) || []);
    const dataRows = rows.map((tr) => {
      // For each cell (td), use its first <p> if only one, otherwise all ps, otherwise the content fragment
      return Array.from(tr.children).map((td) => {
        const ps = td.querySelectorAll(':scope > p');
        if (ps.length === 1 && td.childNodes.length === 1) {
          return ps[0];
        } else if (ps.length > 1) {
          return Array.from(ps);
        } else {
          // Instead of returning td itself, return a DocumentFragment with all child nodes of td
          const frag = document.createDocumentFragment();
          Array.from(td.childNodes).forEach((node) => frag.appendChild(node.cloneNode(true)));
          // If nothing was appended (empty cell), return empty string
          if (!frag.hasChildNodes()) {
            return '';
          }
          return frag;
        }
      });
    });

    const cells = [blockHeader, columnHeaders, ...dataRows];
    const blockTable = WebImporter.DOMUtils.createTable(cells, document);
    table.replaceWith(blockTable);
  });
}
