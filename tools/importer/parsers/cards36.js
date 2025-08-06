/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table header as in the example
  const cells = [['Cards (cards36)']];

  // Select unique cards (deduplicate carousel clones)
  const cards = Array.from(element.querySelectorAll('.c-authorlist-card'));
  const seen = new Set();

  for (const card of cards) {
    const img = card.querySelector('img');
    const content = card.querySelector('.c-authorlist-card__content');
    if (!img || !content) continue;
    // Dedupe based on img src + content text
    const key = (img.src || '') + '::' + content.textContent.trim();
    if (seen.has(key)) continue;
    seen.add(key);

    // First cell: the image element (reference only)
    // Second cell: all textual content (name in bold, title below)
    // We'll reconstruct the text cell to ensure semantic meaning and all text preserved
    const nameElem = content.querySelector('.c-authorlist-card__name');
    const titleElem = content.querySelector('.c-authorlist-card__title');
    const textCell = document.createElement('div');
    // Name as strong
    if (nameElem) {
      const strong = document.createElement('strong');
      strong.textContent = nameElem.textContent.trim();
      textCell.appendChild(strong);
    }
    if (titleElem && titleElem.textContent.trim()) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(document.createTextNode(titleElem.textContent.trim()));
    }
    cells.push([img, textCell]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
