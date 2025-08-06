/* global WebImporter */
export default function parse(element, { document }) {
  // Find all top-level .cmp-container--round-corners representing columns
  const columnBoxes = element.querySelectorAll('.cmp-container--round-corners');
  const columns = [];
  for (let i = 0; i < columnBoxes.length && columns.length < 2; i++) {
    const box = columnBoxes[i];
    const body = box.querySelector('.cmp-container__body');
    columns.push(body || box);
  }
  // Fallbacks for edge cases
  if (columns.length < 2) {
    const fallbackBoxes = element.querySelectorAll('.cmp-container.bg-ll-gray05');
    for (let i = 0; i < fallbackBoxes.length && columns.length < 2; i++) {
      const box = fallbackBoxes[i];
      const body = box.querySelector('.cmp-container__body');
      columns.push(body || box);
    }
  }
  if (columns.length < 2) {
    const fallbackBodies = element.querySelectorAll('.cmp-container > .cmp-container__body');
    for (let i = 0; i < fallbackBodies.length && columns.length < 2; i++) {
      columns.push(fallbackBodies[i]);
    }
  }
  while (columns.length < 2) {
    columns.push(document.createElement('div'));
  }

  // Use createTable for the content
  const cells = [columns];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Manually add thead row with correct colspan to match the markdown/table spec
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns31)';
  th.setAttribute('colspan', columns.length);
  tr.appendChild(th);
  thead.appendChild(tr);
  table.insertBefore(thead, table.firstChild);
  // Remove original first row since createTable would have put the non-colspan version in tbody
  table.deleteRow(0);

  element.replaceWith(table);
}
