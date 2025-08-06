/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the background image (prefer desktop, fallback to others)
  let bgImg = null;
  const bgImgContainer = element.querySelector('.cmp-container__bg-img__container');
  if (bgImgContainer) {
    const picture = bgImgContainer.querySelector('picture');
    if (picture) {
      // Prefer desktop source if available
      let src = '';
      const sources = Array.from(picture.querySelectorAll('source'));
      let desktopSource = sources.find(s => s.media && s.media.includes('1022'));
      if (desktopSource) {
        src = desktopSource.srcset;
      } else if (sources.length > 0) {
        src = sources[0].srcset;
      } else {
        const img = picture.querySelector('img');
        if (img) src = img.src;
      }
      if (src) {
        // Use existing <img> if available with desktop src
        const img = picture.querySelector('img');
        if (img && img.src === src) {
          bgImg = img;
        } else {
          // Create a new <img> with correct src
          bgImg = document.createElement('img');
          bgImg.src = src;
          bgImg.alt = img ? img.alt || '' : '';
        }
      }
    }
  }

  // Compose the text and CTA content
  let contentItems = [];

  // Get the main heading and description
  const htxt = element.querySelector('.c-htxt__container');
  if (htxt) {
    const heading = htxt.querySelector('.c-htxt__heading, .c-htxt__heading-xx-large');
    if (heading) contentItems.push(heading);
    const subhead = htxt.querySelector('.c-htxt__heading-medium, .c-htxt__heading--medium');
    if (subhead) contentItems.push(subhead);
  }

  // Get CTA button
  const btnContainer = element.querySelector('.c-btn__container');
  if (btnContainer) {
    contentItems.push(btnContainer);
  }

  // Get legal/disclaimer text
  const legalText = element.querySelector('.cmp-text');
  if (legalText) {
    contentItems.push(legalText);
  }

  // Defensive: If everything is empty, fallback to an empty string
  if (contentItems.length === 0) {
    contentItems = [''];
  }

  // Compose the table as per example: header, bg image, then content/cta
  const rows = [
    ['Hero (hero41)'],
    [bgImg ? bgImg : ''],
    [contentItems]
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
