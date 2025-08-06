/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards49)'];
  const rows = [headerRow];

  // Select all card wrappers
  const wrappers = element.querySelectorAll(':scope > .c-articlelist__wrapper');
  wrappers.forEach(wrapper => {
    // Get image
    const imgContainer = wrapper.querySelector('.c-articlelist__image-container');
    let img = imgContainer ? imgContainer.querySelector('img') : null;

    // Get text content: title (from link), and description (if present)
    const textContainer = wrapper.querySelector('.c-articlelist__text-container');
    let cellContent = [];
    if (textContainer) {
      const link = textContainer.querySelector('a');
      if (link) {
        // Title as heading (strong) inside link
        const title = document.createElement('strong');
        title.textContent = link.textContent;
        const titleLink = document.createElement('a');
        titleLink.href = link.href;
        titleLink.appendChild(title);
        cellContent.push(titleLink);
      }
      // Check for a description paragraph or text node (future-proofing)
      // If there are more nodes after the link, treat them as description
      let foundLink = false;
      Array.from(textContainer.childNodes).forEach(node => {
        if (node.nodeType === 1 && node === link) {
          foundLink = true;
        } else if (foundLink && node.textContent && node.textContent.trim() !== '') {
          // If it's an element node (e.g., <p>) or text node
          if (node.nodeType === 3) { // text node
            const desc = document.createElement('p');
            desc.textContent = node.textContent.trim();
            cellContent.push(desc);
          } else {
            cellContent.push(node.cloneNode(true));
          }
        }
      });
    }
    // If no content found, use empty string
    if (cellContent.length === 0) cellContent = [''];
    rows.push([img, cellContent]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
