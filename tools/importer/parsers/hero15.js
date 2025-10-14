/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the background image
  function getHeroImage() {
    const bgImgContainer = element.querySelector('.cmp-container__bg-img__container, .cmp-container__bg-img--fullwidth');
    if (bgImgContainer) {
      const img = bgImgContainer.querySelector('img');
      if (img) return img;
    }
    return null;
  }

  // Helper to find the breadcrumb text
  function getBreadcrumbText() {
    const breadcrumb = element.querySelector('.cmp-breadcrumb');
    if (breadcrumb) {
      const items = Array.from(breadcrumb.querySelectorAll('.cmp-breadcrumb__item'));
      return items.map(item => {
        const name = item.querySelector('[itemprop="name"]');
        return name ? name.textContent.trim() : '';
      }).filter(Boolean).join(' > ');
    }
    return '';
  }

  // Helper to find the main heading (h1)
  function getHeading() {
    const h1 = element.querySelector('.cmp-text h1, h1');
    return h1 || null;
  }

  // Helper to find the subheading (paragraph)
  function getSubheading() {
    const texts = Array.from(element.querySelectorAll('.cmp-text p'));
    if (texts.length > 0) {
      return texts[0];
    }
    return null;
  }

  // Helper to find CTA (button or link)
  function getCTA() {
    const breadcrumb = element.querySelector('.cmp-breadcrumb');
    const breadcrumbLinks = breadcrumb ? Array.from(breadcrumb.querySelectorAll('a')) : [];
    const allLinks = Array.from(element.querySelectorAll('a'));
    const ctaLink = allLinks.find((a) => !breadcrumbLinks.includes(a));
    return ctaLink || null;
  }

  // Compose the table rows
  const headerRow = ['Hero (hero15)'];

  // Row 2: Background image (optional)
  const bgImg = getHeroImage();
  const row2 = [bgImg ? bgImg : ''];

  // Row 3: Breadcrumb, Heading, Subheading, CTA (if present)
  const breadcrumbText = getBreadcrumbText();
  const heading = getHeading();
  const subheading = getSubheading();
  const cta = getCTA();
  const row3Content = [];
  if (breadcrumbText) row3Content.push(breadcrumbText);
  if (heading) row3Content.push(heading);
  if (subheading) row3Content.push(subheading);
  if (cta) row3Content.push(cta);
  const row3 = [row3Content.length ? row3Content : ''];

  // Create the table
  const cells = [headerRow, row2, row3];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
