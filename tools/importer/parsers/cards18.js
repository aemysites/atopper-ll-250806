/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards18) block: extract author cards with image, name, title, and link
  const cardsContainer = element.querySelector('.c-authorlist__container');
  if (!cardsContainer) return;

  // Only select cards that do NOT have 'glide__slide--clone' class
  const cardEls = Array.from(cardsContainer.querySelectorAll('.c-authorlist-card'))
    .filter(card => !card.classList.contains('glide__slide--clone'));

  const cards = cardEls.length ? cardEls : Array.from(cardsContainer.querySelectorAll('.c-authorlist-card'));

  const rows = [];
  rows.push(['Cards (cards18)']);

  cards.forEach(card => {
    // Image (first cell)
    const img = card.querySelector('img');
    const imgCell = img ? img : '';

    // Text (second cell)
    const nameEl = card.querySelector('.c-authorlist-card__name');
    const titleEl = card.querySelector('.c-authorlist-card__title');
    const linkEl = card.querySelector('.c-authorlist-card__content-link');
    const nameText = nameEl ? nameEl.textContent.trim() : '';
    const titleText = titleEl ? titleEl.textContent.trim() : '';
    const linkHref = linkEl ? linkEl.getAttribute('href') : '';

    // Compose text cell: name as link, then title below
    const textCell = document.createElement('div');
    if (nameText) {
      let nameNode;
      if (linkHref) {
        nameNode = document.createElement('a');
        nameNode.href = linkHref;
        nameNode.target = '_blank';
        nameNode.appendChild(document.createElement('strong')).textContent = nameText;
      } else {
        nameNode = document.createElement('strong');
        nameNode.textContent = nameText;
      }
      textCell.appendChild(nameNode);
      textCell.appendChild(document.createElement('br'));
    }
    if (titleText) {
      textCell.appendChild(document.createTextNode(titleText));
    }

    rows.push([imgCell, textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
