/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find first image in hero background
  function getHeroImage() {
    const img = element.querySelector('.c-article__header-img img');
    return img || null;
  }

  // Helper: Find main heading
  function getHeading() {
    const h1 = element.querySelector('h1');
    return h1 || null;
  }

  // Helper: Find summary/subheading paragraph
  function getSubheading() {
    const summary = element.querySelector('.c-article__summary-text p');
    return summary || null;
  }

  // Helper: Find CTA button (anchor)
  function getCTA() {
    const btnContainer = element.querySelector('.c-btn__container');
    if (btnContainer) {
      const a = btnContainer.querySelector('a');
      return a || null;
    }
    return null;
  }

  // Helper: Find Trustpilot review bar
  function getTrustpilot() {
    const trustpilot = element.querySelector('.c-trustpilot__container');
    return trustpilot || null;
  }

  // Compose text block (heading, subheading, CTA)
  function getTextBlock() {
    const block = [];
    const heading = getHeading();
    if (heading) block.push(heading);
    const subheading = getSubheading();
    if (subheading) block.push(subheading);
    const cta = getCTA();
    if (cta) block.push(cta);
    return block;
  }

  // Compose trust bar block (logo divider + trustpilot bar)
  function getTrustBarBlock() {
    const block = [];
    // Find logo divider image that is visually left of the trustpilot bar
    const logoImg = element.querySelector('.c-image__img-responsive');
    if (logoImg) block.push(logoImg);
    const trustpilot = getTrustpilot();
    if (trustpilot) block.push(trustpilot);
    return block.length ? block : null;
  }

  // Build table rows
  const headerRow = ['Hero (hero12)'];
  const image = getHeroImage();
  const imageRow = [image ? image : ''];
  // Compose the content row: text block, then trust bar block (grouped as array)
  const textBlock = getTextBlock();
  const trustBarBlock = getTrustBarBlock();
  const contentRow = [
    [ ...textBlock, ...(trustBarBlock ? [trustBarBlock] : []) ]
  ];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
