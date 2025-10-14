/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main block container
  let block = element.querySelector('.c-blogimagemodal');
  if (!block) {
    block = element.querySelector('[class*="c-blogimagemodal"]');
  }
  if (!block) {
    element.replaceWith(document.createElement('div'));
    return;
  }

  // Get image element (background image)
  let heroImg = block.querySelector('.c-blogimagemodal__modal__dialog-img');
  if (!heroImg) {
    heroImg = block.querySelector('.c-blogimagemodal__container__content-img');
  }

  // Get caption text
  let captionText = '';
  const captionEl = block.querySelector('.c-blogimagemodal__modal__dialog-caption');
  if (captionEl && captionEl.textContent.trim()) {
    captionText = captionEl.textContent.trim();
  }

  // Get alt text from image
  let altText = '';
  if (heroImg && heroImg.alt && heroImg.alt.trim()) {
    altText = heroImg.alt.trim();
  }

  // Compose all available text content from HTML (alt text and caption)
  const textCell = document.createElement('div');
  if (altText) {
    const p = document.createElement('p');
    p.textContent = altText;
    textCell.appendChild(p);
  }
  if (captionText && captionText !== altText) {
    const p = document.createElement('p');
    p.textContent = captionText;
    textCell.appendChild(p);
  }

  const headerRow = ['Hero (hero3)'];
  const rows = [
    headerRow,
    [heroImg || ''],
    [textCell]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
