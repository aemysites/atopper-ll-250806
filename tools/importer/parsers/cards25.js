/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the cards parent container
  const slides = element.querySelectorAll('.glide__slides > .c-slider__container');
  if (!slides.length) return;

  // 2. Prepare the header row
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // 3. For each card, extract image/icon and text content (deduplicate name/date, include badge)
  slides.forEach((slide) => {
    const card = slide.querySelector('.c-rev__card');
    if (!card) return;

    // --- IMAGE/ICON CELL ---
    const starsImg = card.querySelector('.c-rev__card-header img');
    const imgCell = starsImg ? starsImg : '';

    // --- TEXT CONTENT CELL ---
    const textCellContent = [];
    // Title
    const title = card.querySelector('.c-rev__card-title');
    if (title) textCellContent.push(title);
    // Verified badge (label container)
    const verified = card.querySelector('.c-rev__label-container');
    if (verified) textCellContent.push(verified);
    // Review text (main quote)
    const quote = card.querySelector('.c-rev__card-quote');
    if (quote) textCellContent.push(quote);
    // Verified purchaser badge (from member-details)
    const verifiedBadge = card.querySelector('.c-rev__verified-badge');
    if (verifiedBadge) textCellContent.push(verifiedBadge);
    // Reviewer name (prefer card-member-name, fallback to member-name)
    let reviewerName = card.querySelector('.c-rev__card-member-name');
    if (!reviewerName) reviewerName = card.querySelector('.c-rev__member-name');
    if (reviewerName) textCellContent.push(reviewerName);
    // Reviewer date (prefer member-since, fallback to membership-length)
    let reviewerDate = card.querySelector('.c-rev__member-since');
    if (!reviewerDate) reviewerDate = card.querySelector('.c-rev__membership-length');
    if (reviewerDate) textCellContent.push(reviewerDate);

    rows.push([
      imgCell,
      textCellContent,
    ]);
  });

  // 4. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
