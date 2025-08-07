/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all <h3> between the relevant H2 and the next H2 (if any)
  function getCardsSectionRows(startH2) {
    const rows = [];
    let el = startH2.nextElementSibling;
    while (el) {
      if (el.tagName && el.tagName.match(/^H2$/)) break;
      if (el.tagName === 'H3') {
        // IMAGE: Find the first image in the next siblings, up to 5 ahead
        let img = null;
        let imgSearch = el.nextElementSibling;
        let imgSteps = 0;
        while (imgSearch && imgSteps < 5 && !(imgSearch.tagName && imgSearch.tagName.match(/^H[2-3]$/))) {
          const foundImg = imgSearch.querySelector && imgSearch.querySelector('img');
          if (foundImg) {
            img = foundImg;
            break;
          }
          imgSearch = imgSearch.nextElementSibling;
          imgSteps++;
        }
        // TEXT: Collect all siblings from <h3> until the next <h3> or <h2>
        let textNodes = [];
        // Title as <strong> for card title
        const strong = document.createElement('strong');
        strong.textContent = el.textContent.trim();
        textNodes.push(strong);
        let textEl = el.nextElementSibling;
        while (textEl && !(textEl.tagName && textEl.tagName.match(/^H[23]$/))) {
          // Skip image wrappers (image is already handled)
          if (textEl.querySelector && textEl.querySelector('img')) {
            textEl = textEl.nextElementSibling;
            continue;
          }
          // Include only actual content nodes with text, or lists
          if ((textEl.tagName === 'P' && textEl.textContent.trim()) || textEl.tagName === 'UL' || textEl.tagName === 'OL') {
            textNodes.push(textEl);
          }
          textEl = textEl.nextElementSibling;
        }
        rows.push([img ? img : '', textNodes]);
      }
      el = el.nextElementSibling;
    }
    return rows;
  }
  // Find the correct <h2> for '5 types of bank scams'
  const h2s = element.querySelectorAll('h2');
  let targetH2 = null;
  for (const h2 of h2s) {
    if (h2.textContent.trim() === '5 types of bank scams') {
      targetH2 = h2;
      break;
    }
  }
  // Fallback: case-insensitive contains
  if (!targetH2) {
    for (const h2 of h2s) {
      if (h2.textContent.trim().toLowerCase().includes('5 types of bank scams')) {
        targetH2 = h2;
        break;
      }
    }
  }
  if (!targetH2) return;
  // Compose table rows
  const cells = [['Cards (cards2)']];
  const cardRows = getCardsSectionRows(targetH2);
  for (const row of cardRows) {
    // Only add row if at least image or text exists
    if ((row[0] && row[0].src) || (row[1] && row[1].length > 0)) {
      cells.push(row);
    }
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
