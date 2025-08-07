/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get <picture> containing the background image from the hero right side
  function getBackgroundPicture() {
    // The background image is always in div.c-article__header-img > picture
    const imgWrap = element.querySelector('.c-article__header-img picture');
    return imgWrap || '';
  }

  // Helper: Get the text content block: title, summary, CTA
  function getTextBlock() {
    // header-text-container contains h1, summary, and below: CTA in a button, and references (i.e., Trustpilot row)
    const textContainer = element.querySelector('.c-article__header-text-container');
    if (!textContainer) return '';

    // Compose fragments for text: h1 + summary + CTA button + Trustpilot if present (all as siblings)
    const frag = document.createDocumentFragment();
    // Title
    const h1 = textContainer.querySelector('h1');
    if (h1) frag.appendChild(h1);
    // Summary
    const summary = textContainer.querySelector('.c-article__summary-text');
    if (summary) frag.appendChild(summary);
    // CTA (button)
    // May be deeply nested (ex: .c-btn__container)
    const btn = textContainer.querySelector('.c-btn__container a');
    if (btn) {
      // Add spacing for visual separation
      frag.appendChild(document.createElement('br'));
      frag.appendChild(btn);
    }
    // Trustpilot row: find any .c-trustpilot__container inside textContainer
    const trustpilot = textContainer.querySelector('.c-trustpilot__container');
    if (trustpilot) {
      // Add a line break before trustpilot row (matches visual)
      frag.appendChild(document.createElement('br'));
      frag.appendChild(trustpilot);
    }
    return frag;
  }

  // Compose block rows
  const headerRow = ['Hero (hero11)'];
  const imageRow = [getBackgroundPicture()];
  const textRow = [getTextBlock()];

  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
