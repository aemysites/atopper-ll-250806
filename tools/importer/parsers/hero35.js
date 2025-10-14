/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the background image (decorative, not content image)
  function findBackgroundImage(el) {
    // Look for a .cmp-container__bg-img__container or similar
    const bgImgContainer = el.querySelector('.cmp-container__bg-img__container, .cmp-container__bg-img--fullwidth');
    if (bgImgContainer) {
      const img = bgImgContainer.querySelector('img');
      if (img) return img;
    }
    return null;
  }

  // Helper: Find the main heading and subheading
  function findHeroText(el) {
    // Look for herotext block
    const htxt = el.querySelector('.herotext .c-htxt__container, .c-htxt__container');
    if (!htxt) return null;
    // Heading
    const heading = htxt.querySelector('.c-htxt__heading h1, .c-htxt__heading-xx-large h1, h1');
    // Subheading
    const subheading = htxt.querySelector('.c-htxt__heading-medium p, .c-htxt__heading-medium, p');
    // Compose fragment
    const frag = document.createElement('div');
    if (heading) frag.appendChild(heading);
    if (subheading) frag.appendChild(subheading);
    return frag.childNodes.length ? frag : null;
  }

  // Helper: Find CTA button
  function findCTA(el) {
    // Look for .button .c-btn__container a
    const cta = el.querySelector('.button .c-btn__container a, .c-btn__container a.c-btn');
    if (cta) return cta;
    return null;
  }

  // Helper: Find trust indicators (logo, rating, reviews, Trustpilot logo)
  function findTrustIndicators(el) {
    // Look for .trustpilot .c-trustpilot__container-link
    const trustpilot = el.querySelector('.trustpilot .c-trustpilot__container-link');
    if (trustpilot) return trustpilot;
    return null;
  }

  // Compose the header row
  const headerRow = ['Hero (hero35)'];

  // Compose the background image row
  const bgImg = findBackgroundImage(element);
  const bgImgRow = [bgImg ? bgImg : ''];

  // Compose the content row
  const heroText = findHeroText(element);
  const cta = findCTA(element);
  const trustIndicators = findTrustIndicators(element);
  // Compose content cell
  const contentCell = document.createElement('div');
  if (heroText) contentCell.appendChild(heroText);
  if (cta) contentCell.appendChild(cta);
  if (trustIndicators) contentCell.appendChild(trustIndicators);
  const contentRow = [contentCell];

  // Compose the table
  const cells = [
    headerRow,
    bgImgRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
