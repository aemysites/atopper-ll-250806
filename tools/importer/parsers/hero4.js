/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Hero (hero4)'];

  // 2. Image row: find the image inside .c-article__header-img > picture > img
  let imgEl = null;
  const headerImgDiv = getDirectChildByClass(element, 'c-article__header-img');
  if (headerImgDiv) {
    const picture = getDirectChildByClass(headerImgDiv, 'c-article__picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }
  }
  const imageRow = [imgEl ? imgEl : ''];

  // 3. Content row: headline, optional subheading, optional CTA
  const headerContentSection = getDirectChildByClass(element, 'c-article__header-content');
  let contentCell = [];
  if (headerContentSection) {
    const headerTextDiv = getDirectChildByClass(headerContentSection, 'c-article__header-text');
    if (headerTextDiv) {
      const headerTextContainer = getDirectChildByClass(headerTextDiv, 'c-article__header-text-container');
      if (headerTextContainer) {
        // Headline
        const headline = headerTextContainer.querySelector('h1');
        if (headline) contentCell.push(headline);
        // Subheading/summary (optional)
        const summary = headerTextContainer.querySelector('.c-article__summary-text');
        if (summary) contentCell.push(summary);
        // CTA (optional)
        const ctaContainer = headerTextContainer.querySelector('.c-article__header__cta-container');
        if (ctaContainer && ctaContainer.children.length > 0) {
          contentCell.push(ctaContainer);
        }
      }
    }
  }
  // Defensive: If nothing found, fallback to headline anywhere
  if (contentCell.length === 0) {
    const headline = element.querySelector('h1');
    if (headline) contentCell.push(headline);
  }
  const contentRow = [contentCell.length > 0 ? contentCell : ''];

  // Compose table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}