/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns: the visible product cards
  const productColumns = Array.from(element.querySelectorAll('.glide__slide.product'));
  if (!productColumns.length) return; // Defensive: abort if not found

  // Helper to collect all block content for a product column
  function getProductCell(col) {
    const cellContent = [];
    // 1. Product name
    const productName = col.querySelector('.product-inner');
    if (productName) cellContent.push(productName);
    // 2. Product tier
    const productTier = col.querySelector('.product-tier');
    if (productTier) cellContent.push(productTier);
    // 3. Plan switcher (fieldset with annual/monthly)
    const planSwitcher = col.querySelector('fieldset.term-switch');
    if (planSwitcher) cellContent.push(planSwitcher);
    // 4. Active price block (annual displayed, monthly hidden by default)
    const priceBlock = col.querySelector('.price-block.annual[style*="display: block"]');
    if (priceBlock) cellContent.push(priceBlock);
    // 5. Features list
    const featuresBlock = col.querySelector('.features');
    if (featuresBlock) cellContent.push(featuresBlock);
    // 6. Expandable benefit detail sections
    // Find the matching .pd-marketing-details for this column
    const detailsContainer = col.querySelector('.pd-marketing-details');
    if (detailsContainer) {
      // Each section: <div class="pd-details-banner ..."><button>...</button></div> + <div class="pd-details ..."></div>
      const banners = detailsContainer.querySelectorAll('.pd-details-banner');
      banners.forEach(banner => {
        const button = banner.querySelector('button');
        // Find the next sibling .pd-details
        let pdDetail = banner.nextElementSibling;
        while (pdDetail && !pdDetail.classList.contains('pd-details')) {
          pdDetail = pdDetail.nextElementSibling;
        }
        if (button && pdDetail) {
          // Compose section: label then content
          const sectionDiv = document.createElement('div');
          const labelDiv = document.createElement('div');
          labelDiv.textContent = button.textContent.trim();
          labelDiv.style.fontWeight = 'bold';
          labelDiv.style.marginTop = '1em';
          sectionDiv.appendChild(labelDiv);
          const featuresList = pdDetail.querySelector('.list-feature-divider');
          if (featuresList) sectionDiv.appendChild(featuresList);
          cellContent.push(sectionDiv);
        }
      });
    }
    return cellContent;
  }

  // Compose cells for all product columns (in order)
  const productCells = productColumns.map(getProductCell);

  // Compose the table rows to match markdown example:
  // First row: header (single column), second row: three columns for products
  const headerRow = ['Columns (columns28)'];
  const productsRow = productCells;
  const tableRows = [headerRow, productsRow];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
