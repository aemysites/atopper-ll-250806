/* global WebImporter */
export default function parse(element, { document }) {
  // Find the slider that contains the testimonial cards
  const slider = element.querySelector('.slider.carousel .glide__slides');
  const cards = [];
  if (slider) {
    // Extract each card container
    const cardContainers = slider.querySelectorAll(':scope > .c-slider__container');
    cardContainers.forEach((cardContainer) => {
      // Each card's main content is the .c-rev__card inside .c-slider__container
      const cardContent = cardContainer.querySelector('.c-rev__card');
      if (cardContent) {
        // Reference the existing element directly
        cards.push([cardContent]);
      }
    });
  }

  // Only proceed if we found cards to export
  if (cards.length) {
    const headerRow = ['Cards'];
    const table = [headerRow, ...cards];
    const block = WebImporter.DOMUtils.createTable(table, document);
    element.replaceWith(block);
  }
}
