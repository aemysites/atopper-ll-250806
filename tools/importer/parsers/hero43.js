/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the background image <img> (first prominent background image in the hero)
  function findBackgroundImageEl() {
    const bgPic = element.querySelector('.cmp-container__bg-img__container picture img');
    return bgPic || null;
  }

  // Helper: Find the main hero text container (title + paragraph)
  function findHeroText() {
    // The actual text content is in .c-htxt__container
    const htxt = element.querySelector('.c-htxt__container');
    return htxt || null;
  }

  // Helper: Find the primary CTA (first c-btn in hero area)
  function findCTA() {
    // Only select the button in the upper grid, not in the brand bar
    const cta = element.querySelector('a.c-btn');
    return cta || null;
  }

  // Helper: Find brand bar (logo + trustpilot)
  function findBrandBar() {
    // Try to find logo (lifelock logo)
    const logoImg = element.querySelector('.image .c-image');
    // Try to find trustpilot section
    const trust = element.querySelector('.trustpilot .c-trustpilot__container');
    if (logoImg && trust) {
      const brandBar = document.createElement('div');
      brandBar.appendChild(logoImg);
      brandBar.appendChild(trust);
      return brandBar;
    } else if (logoImg) {
      return logoImg;
    } else if (trust) {
      return trust;
    }
    return null;
  }

  // Build block rows: strictly 3 rows, 1 column each
  const headerRow = ['Hero (hero43)'];

  // 2nd row: background image (or blank)
  const bgImg = findBackgroundImageEl();
  const bgRow = [bgImg ? bgImg : ''];

  // 3rd row: heading, subheading, CTA, brand bar (all in one cell, order preserved)
  const heroText = findHeroText();
  const cta = findCTA();
  const brandBar = findBrandBar();
  const contentBits = [];
  if (heroText) contentBits.push(heroText);
  if (cta) contentBits.push(cta);
  if (brandBar) contentBits.push(brandBar);
  // If nothing, cell is blank
  const contentRow = [contentBits.length ? contentBits : ''];

  // Build and replace
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
