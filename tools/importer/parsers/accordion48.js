/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all direct children (filter out script/style)
  function getDirectChildren(parent) {
    return Array.from(parent.children).filter(child => child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE');
  }

  // Find the '14 common types of Cash App scams' H2
  let children = getDirectChildren(element);
  let startIdx = -1, endIdx = children.length;
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (c.tagName === 'H2' && c.textContent.trim().toLowerCase().startsWith('14 common types of cash app scams')) {
      startIdx = i;
      break;
    }
  }
  if (startIdx === -1) return; // Not found, nothing to do
  
  for (let i = startIdx + 1; i < children.length; i++) {
    const c = children[i];
    if (c.tagName === 'H2' && c.textContent.trim().toLowerCase().includes('how to report cash app scams')) {
      endIdx = i;
      break;
    }
  }

  // All accordion content is between startIdx+1 and endIdx
  let accNodes = [];
  for (let i = startIdx + 1; i < endIdx; i++) {
    accNodes.push(children[i]);
  }

  // Extract accordion items as [title, content]
  let rows = [];
  let curTitle = null;
  let curContent = [];
  function flush() {
    if (curTitle) {
      // Remove empty divs at start/end of content
      while (curContent.length && curContent[0].tagName === 'DIV' && curContent[0].textContent.trim() === '' && getDirectChildren(curContent[0]).length === 0) curContent.shift();
      while (curContent.length && curContent[curContent.length-1].tagName === 'DIV' && curContent[curContent.length-1].textContent.trim() === '' && getDirectChildren(curContent[curContent.length-1]).length === 0) curContent.pop();
      if (curContent.length === 1) rows.push([curTitle, curContent[0]]);
      else if (curContent.length > 1) rows.push([curTitle, curContent.slice()]);
      else rows.push([curTitle, document.createTextNode('')]);
    }
  }
  for (let i = 0; i < accNodes.length; i++) {
    const node = accNodes[i];
    if (node.tagName === 'H3') {
      flush();
      curTitle = node;
      curContent = [];
    } else {
      // Sometimes content is wrapped in a div that also includes the h3
      let h3inside = node.querySelector && node.querySelector(':scope > h3');
      if (h3inside) {
        flush();
        curTitle = h3inside;
        // Remove h3 from the node for content
        let contentNodes = Array.from(node.childNodes).filter(n => !(n.nodeType === 1 && n.tagName === 'H3'));
        // Remove empty text nodes/divs
        contentNodes = contentNodes.filter(n => {
          if (n.nodeType === 3) return n.textContent.trim() !== '';
          if (n.nodeType === 1 && n.tagName === 'DIV') return n.textContent.trim() !== '' || getDirectChildren(n).length > 0;
          return true;
        });
        if (contentNodes.length === 1) curContent = [contentNodes[0]];
        else curContent = contentNodes;
      } else {
        // Not a title, part of content
        if (!(node.tagName === 'DIV' && node.textContent.trim() === '' && getDirectChildren(node).length === 0)) {
          curContent.push(node);
        }
      }
    }
  }
  flush();

  // Build the cells: header row, then one per accordion item
  const cells = [ [ 'Accordion (accordion48)' ] ];
  for (const row of rows) {
    if (!row[0]) continue;
    // row[0] is the h3 element (accordion title), row[1] is the content (element or array)
    let left = row[0];
    let right = row[1];
    cells.push([left, right]);
  }

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
