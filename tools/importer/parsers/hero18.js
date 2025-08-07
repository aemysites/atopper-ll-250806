/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name, exactly as required
  const headerRow = ['Hero (hero18)'];

  // 2nd row: Background image (optional)
  let bgImg = '';
  const bgImgContainer = element.querySelector('.cmp-container__bg-img__container');
  if (bgImgContainer) {
    // Prefer including entire <picture> if present
    const picture = bgImgContainer.querySelector('picture');
    if (picture) {
      bgImg = picture;
    } else {
      const img = bgImgContainer.querySelector('img');
      if (img) {
        bgImg = img;
      }
    }
  }

  // 3rd row: Content: get all .cmp-text blocks (includes headings, paragraphs, subheadings)
  // Only include text that is meant for the hero: skip breadcrumbs/spacers/etc.
  // To ensure order, get all .cmp-text inside element that are NOT inside breadcrumb, and NOT inside .cmp-container__bg-img__container
  const infoCell = [];
  const textBlocks = Array.from(element.querySelectorAll('.cmp-text'));
  textBlocks.forEach(tb => {
    // skip if it is inside a breadcrumb or bg image container
    if (
      tb.closest('.breadcrumb') ||
      tb.closest('.cmp-container__bg-img__container')
    ) return;
    infoCell.push(tb);
  });

  // Compose the rows for the block table
  const rows = [
    headerRow,
    [bgImg || ''],
    [infoCell]
  ];

  // Create the block and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
