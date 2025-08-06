/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all relevant tables for the block
  function extractBlogTables(root) {
    // Blog tables are .blogtable tables within the block
    // Each .blogtable may have .c-blogtable__scroll-container table, or just table
    const tables = Array.from(root.querySelectorAll('.blogtable table'));
    return tables;
  }

  // Find all blogtable tables inside the given block
  const blogTables = extractBlogTables(element);

  blogTables.forEach((table) => {
    // Get the rows
    const rows = Array.from(table.rows);
    if (!rows.length) return;
    // The first row is the table's header
    const headerCells = Array.from(rows[0].children).map((cell) => {
      // Prefer <p> for styling, but fallback to textContent
      const p = cell.querySelector('p');
      return p ? p.textContent.trim() : cell.textContent.trim();
    });
    // The rest of the rows are data rows
    const dataRows = rows.slice(1).map((tr) => {
      return Array.from(tr.children).map((cell) => {
        // If the cell has a <p>, keep the <p> (to preserve inline HTML)
        const p = cell.querySelector('p');
        if (p) return p;
        // If the cell has an <a> (e.g., link), keep the <a>
        const a = cell.querySelector('a');
        if (a) return a;
        // Otherwise, just use text content
        return cell.textContent.trim();
      });
    });
    // Build the inner table DOM node for the block's cell
    const realTable = document.createElement('table');
    // Build header
    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    headerCells.forEach((header) => {
      const th = document.createElement('th');
      th.textContent = header;
      trh.appendChild(th);
    });
    thead.appendChild(trh);
    realTable.appendChild(thead);
    // Build body
    const tbody = document.createElement('tbody');
    dataRows.forEach((rowArr) => {
      const tr = document.createElement('tr');
      rowArr.forEach((cellContent) => {
        const td = document.createElement('td');
        if (typeof cellContent === 'string') {
          td.textContent = cellContent;
        } else {
          td.appendChild(cellContent);
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    realTable.appendChild(tbody);
    // Compose the block table structure
    const blockTable = [
      ['Table (table34)'], // Exact header required per instructions
      [realTable]
    ];
    // Create and insert the block table
    const block = WebImporter.DOMUtils.createTable(blockTable, document);
    table.replaceWith(block);
  });
}
