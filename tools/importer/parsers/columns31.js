/* global WebImporter */
export default function parse(element, { document }) {
  // Find the glide__track (contains all product columns)
  const trackDiv = element.querySelector('.glide__track');
  if (!trackDiv) return;
  // Each product column is a direct child with class 'product' and 'glide__slide'
  const productColumns = Array.from(trackDiv.querySelectorAll(':scope > .product.glide__slide'));
  if (productColumns.length === 0) return;

  // Helper to extract all content for a product column
  function extractColumnContent(productCol) {
    const colDiv = document.createElement('div');
    // Title (product-inner)
    const title = productCol.querySelector('.product-inner');
    if (title) colDiv.appendChild(title.cloneNode(true));
    // Tier (product-tier)
    const tier = productCol.querySelector('.product-tier');
    if (tier) colDiv.appendChild(tier.cloneNode(true));
    // Term switch (fieldset)
    const termSwitch = productCol.querySelector('fieldset.term-switch');
    if (termSwitch) colDiv.appendChild(termSwitch.cloneNode(true));
    // Price blocks (annual/monthly, only visible ones)
    const priceBlocks = Array.from(productCol.querySelectorAll('.price-block'));
    priceBlocks.forEach(pb => {
      if (pb.style.display !== 'none' || pb.getAttribute('style') === null) {
        colDiv.appendChild(pb.cloneNode(true));
      }
    });
    // Features (ul and any preceding p)
    const featuresDiv = productCol.querySelector('.features');
    if (featuresDiv) colDiv.appendChild(featuresDiv.cloneNode(true));
    // Accordions (pd-details-banner + pd-details)
    const banners = Array.from(productCol.querySelectorAll('.pd-details-banner button'));
    banners.forEach((btn, i) => {
      const accordionDiv = document.createElement('div');
      accordionDiv.appendChild(btn.cloneNode(true));
      let detailsPanel = btn.parentElement.nextElementSibling;
      if (!detailsPanel || !detailsPanel.classList.contains('pd-details')) {
        detailsPanel = productCol.querySelectorAll('.pd-details')[i];
      }
      if (detailsPanel) {
        accordionDiv.appendChild(detailsPanel.cloneNode(true));
      }
      colDiv.appendChild(accordionDiv);
    });
    return colDiv;
  }

  // Build the columns array for the second row
  const secondRow = productColumns.map(col => extractColumnContent(col));

  // Table header
  const headerRow = ['Columns (columns31)'];

  // Compose the cells array
  const cells = [headerRow, secondRow];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  if (block) {
    element.replaceWith(block);
  }
}
