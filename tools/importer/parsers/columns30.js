/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate children divs
  const topChildren = Array.from(element.querySelectorAll(':scope > div'));

  // 1. Featured Article (left top)
  let featuredArticle = null;
  let featuredSidebar = null;
  // Find the featured article and sidebar
  for (const div of topChildren) {
    // Look for the main grid (contains the featured article and sidebar)
    const grid = div.querySelector('.aem-Grid.aem-Grid--12');
    if (grid) {
      const gridChildren = Array.from(grid.children);
      // Featured article block (left)
      const spotlight = gridChildren.find(child => child.querySelector('.c-articlespotlight'));
      if (spotlight) {
        featuredArticle = spotlight.querySelector('.c-articlespotlight');
      }
      // Sidebar block (right)
      const sidebar = gridChildren.find(child => child.querySelector('.c-ref__container'));
      if (sidebar) {
        featuredSidebar = sidebar.querySelector('.c-ref__container');
      }
      break;
    }
  }

  // 2. Article Cards (below featured)
  let articlesList = [];
  let relatedArticlesHeading = null;
  for (const div of topChildren) {
    // Find the list block
    const listBlock = div.querySelector('.cmp-list');
    if (listBlock) {
      // Heading
      relatedArticlesHeading = div.querySelector('.cmp-list__heading');
      // Each article card
      const containers = Array.from(listBlock.querySelectorAll('.cmp-list__container'));
      articlesList = containers.map(container => {
        // Compose a card element for each article
        // We'll use the image and the content block together
        const imageContainer = container.querySelector('.cmp-list__container__image-container');
        const contentContainer = container.querySelector('.cmp-list__container__content');
        const cardDiv = document.createElement('div');
        if (imageContainer) cardDiv.appendChild(imageContainer);
        if (contentContainer) cardDiv.appendChild(contentContainer);
        return cardDiv;
      });
      break;
    }
  }

  // 3. Bottom Section: Free Tools & Trials (left) and Email Signup (right)
  let freeTools = null;
  let emailSignup = null;
  for (const div of topChildren) {
    // Look for the grid containing both sections
    const grid = div.querySelector('.aem-Grid.aem-Grid--12');
    if (grid) {
      const blogList = grid.querySelector('.c-bloginternallist');
      if (blogList) {
        freeTools = blogList;
      }
      // Email signup is nested deeper
      const emailRef = grid.querySelector('.c-emailcapt');
      if (emailRef) {
        emailSignup = emailRef;
      }
    }
  }

  // Defensive fallback for email signup: If not found, try to find any form with .c-emailcapt__form
  if (!emailSignup) {
    const form = element.querySelector('.c-emailcapt__form');
    if (form) {
      emailSignup = form.closest('.c-emailcapt');
    }
  }

  // Build the table rows
  const headerRow = ['Columns (columns30)'];

  // First content row: Featured article (left), sidebar (right)
  const firstContentRow = [
    featuredArticle || document.createElement('div'),
    featuredSidebar || document.createElement('div'),
  ];

  // Second content row: Articles grid (left), Related articles heading (right)
  // We'll group all article cards into a single column for left, and heading for right
  const articlesColumn = document.createElement('div');
  articlesList.forEach(card => articlesColumn.appendChild(card));
  const secondContentRow = [
    articlesColumn,
    relatedArticlesHeading || document.createElement('div'),
  ];

  // Third content row: Free Tools (left), Email Signup (right)
  const thirdContentRow = [
    freeTools || document.createElement('div'),
    emailSignup || document.createElement('div'),
  ];

  // Compose the table
  const cells = [
    headerRow,
    firstContentRow,
    secondContentRow,
    thirdContentRow,
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
