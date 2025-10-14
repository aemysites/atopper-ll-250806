/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate child divs
  const topDivs = element.querySelectorAll(':scope > div');

  // Find the background image: look for <picture> or <img> in the first child divs
  let bgImg = null;
  for (const div of topDivs) {
    const picture = div.querySelector('picture');
    if (picture) {
      // Use the <img> inside <picture> for the actual image
      const img = picture.querySelector('img');
      if (img) {
        bgImg = img;
        break;
      }
    }
  }

  // Find the hero text block
  let heading = null;
  let subheading = null;
  let ctaLink = null;
  let disclaimer = null;
  let detailsLink = null;

  // Search for the hero text area
  const heroTextDiv = element.querySelector('.herotext .c-htxt__container, .herotext .c-htxt');
  if (heroTextDiv) {
    // Heading (usually h1)
    const headingDiv = heroTextDiv.querySelector('.c-htxt__heading');
    if (headingDiv) {
      const h1 = headingDiv.querySelector('h1');
      if (h1) heading = h1;
    }
    // Subheading (paragraph)
    const subheadingDiv = heroTextDiv.querySelector('.c-htxt__heading-medium');
    if (subheadingDiv) {
      const p = subheadingDiv.querySelector('p');
      if (p) subheading = p;
    }
  }

  // Find CTA button and disclaimer text
  // The CTA and disclaimer are in a different column (right side of hero text)
  const ctaButtonDiv = element.querySelector('.c-btn__container');
  if (ctaButtonDiv) {
    const a = ctaButtonDiv.querySelector('a');
    if (a) ctaLink = a;
  }
  // Disclaimer text
  const disclaimerDiv = element.querySelector('.cmp-text');
  if (disclaimerDiv) {
    const p = disclaimerDiv.querySelector('p');
    if (p) disclaimer = p;
    // Also look for details link inside disclaimer
    const detailsA = disclaimerDiv.querySelector('a');
    if (detailsA) detailsLink = detailsA;
  }

  // Compose the content cell for row 3
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (ctaLink) contentCell.push(ctaLink);
  if (disclaimer) contentCell.push(disclaimer);
  // If detailsLink is not already inside disclaimer, add it
  if (detailsLink && (!disclaimer || !disclaimer.contains(detailsLink))) {
    contentCell.push(detailsLink);
  }

  // Build the table rows
  const headerRow = ['Hero (hero39)'];
  const imageRow = [bgImg ? bgImg : ''];
  const contentRow = [contentCell];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
