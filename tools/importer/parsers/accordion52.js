/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion header row as per spec
  const headerRow = ['Accordion (accordion52)'];

  // Helper: normalize content (remove empty divs, comments, whitespace-only text)
  function normalizeCellContent(nodes) {
    return Array.from(nodes).filter(node => {
      if (node.nodeType === Node.COMMENT_NODE) return false;
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV' && node.innerHTML.trim() === '') return false;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') return false;
      return true;
    });
  }

  // Get the primary content root
  const contentRoot = element.querySelector('.c-article__blog-bottom-content-text');
  if (!contentRoot) return;

  // Find all h2/h3 in contentRoot to treat as accordion headings
  const children = Array.from(contentRoot.children);
  const ACCORDION_TITLE_TAGS = ['H2', 'H3'];

  // Sections: each with a title element and all content nodes until next h2/h3
  let sections = [];
  let current = null;
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (ACCORDION_TITLE_TAGS.includes(node.tagName)) {
      if (current) {
        sections.push(current);
      }
      current = { title: node, content: [] };
    } else if (current) {
      current.content.push(node);
    }
  }
  if (current) {
    sections.push(current);
  }

  // Build rows for each accordion section
  const rows = [headerRow];

  for (const section of sections) {
    // Gather all elements for the accordion content cell
    let sectionContentNodes = [];
    for (let node of section.content) {
      // If it's a container responsivegrid, include direct children of its main content block
      if (node.classList && node.classList.contains('container') && node.classList.contains('responsivegrid')) {
        // Usually has a direct .cmp-container or .aem-Grid or .blogimagemodal or .text inside
        const contentBlocks = Array.from(node.querySelectorAll(':scope > div, :scope > .cmp-container, :scope > .cmp-container__body, :scope > .blogimagemodal, :scope > .text, :scope > .reference'));
        if (contentBlocks.length > 0) {
          sectionContentNodes.push(...contentBlocks);
        } else {
          sectionContentNodes.push(node);
        }
      } else {
        sectionContentNodes.push(node);
      }
    }
    sectionContentNodes = normalizeCellContent(sectionContentNodes);
    let cellContent;
    if (sectionContentNodes.length === 0) {
      cellContent = document.createTextNode('');
    } else if (sectionContentNodes.length === 1) {
      cellContent = sectionContentNodes[0];
    } else {
      cellContent = sectionContentNodes;
    }
    rows.push([section.title, cellContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
