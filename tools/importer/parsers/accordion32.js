/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the block header as in the example
  const headerRow = ['Accordion (accordion32)'];

  // Try to use the table of contents to get section anchors/titles
  let tocLinks = Array.from(element.querySelectorAll('.c-article__table-of-content-bottom-text a[href^="#"]'));
  let anchorIds = tocLinks.map(link => link.getAttribute('href').slice(1));

  // Prepare anchors array: each is an element whose id matches a toc link
  let anchors = anchorIds.map((id, i) => {
    let anchor = element.querySelector(`[id="${id}"]`);
    // For the offer block/last block, try to find the headline if no id
    if (!anchor && i === anchorIds.length - 1) {
      anchor = element.querySelector('.c-blogcom__headline');
    }
    return anchor;
  });

  // If no TOC links, fallback to all h2s in the block
  if (tocLinks.length === 0) {
    anchors = Array.from(element.querySelectorAll('h2'));
    tocLinks = anchors.map(anchor => {
      const a = document.createElement('a');
      a.textContent = anchor.textContent.trim();
      return a;
    });
  }

  // Helper to get all elements between start and stop (noninclusive of stop)
  function getSectionContent(startEl, stopEl) {
    if (!startEl) return [];
    const els = [];
    let curr = startEl;
    // Always include the anchor itself
    els.push(curr);
    curr = curr.nextElementSibling;
    while (curr && curr !== stopEl) {
      els.push(curr);
      curr = curr.nextElementSibling;
    }
    // Remove empty <div> blocks if present
    return els.filter(el => el && (el.textContent.trim().length > 0 || el.querySelector?.('*')));
  }

  // Build the accordion rows
  const rows = [];
  for (let i = 0; i < tocLinks.length; i++) {
    const anchor = anchors[i];
    const nextAnchor = anchors[i + 1];
    // Title is always the TOC link text or anchor's text
    const title = tocLinks[i] ? tocLinks[i].textContent.trim() : (anchor ? anchor.textContent.trim() : '');
    if (!title || !anchor) continue;
    // Get all elements for this accordion panel
    let sectionEls = getSectionContent(anchor, nextAnchor);
    // Remove the heading from content if redundant (title already present)
    if (sectionEls.length && sectionEls[0].tagName && sectionEls[0].tagName.match(/^H\d$/i)) {
      sectionEls = sectionEls.slice(1);
    }
    // If all content is filtered away, fallback to at least the heading
    if (!sectionEls.length) {
      sectionEls = [anchor];
    }
    // If only one element, provide directly, else as array
    rows.push([
      title,
      sectionEls.length === 1 ? sectionEls[0] : sectionEls
    ]);
  }

  // Only proceed if there is at least one accordion panel
  if (!rows.length) return;

  // Compose the final block
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
