/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header as required
  const rows = [['Accordion (accordion55)']];

  // The valid accordion section titles per the prompt (no ToC, no extras)
  const validAccordionTitles = [
    '1. Customer support',
    '2. 2FA requests',
    '3. Gift cards',
    '4. Stolen credit cards',
    '5. Security breaches',
    '6. Unsecured Wi-Fi',
    '7. Fraudulent businesses',
    '8. Overpayment',
    'Apple Pay scam warning signs',
    'Steps to take if you fall victim to an Apple Pay scam',
    'Tips to help prevent Apple Pay scams',
    'Protect yourself from mobile payment scams',
    'FAQs about Apple Pay scams'
  ];

  // Get all h2 elements in order, but only those that are a valid accordion section by exact text
  const allH2s = Array.from(element.querySelectorAll('h2'));
  // Prevent including <h2 class="c-article__table-of-content-bottom-title"> This article contains </h2> etc.
  const h2s = allH2s.filter(h2 => validAccordionTitles.includes(h2.textContent.trim()));

  for (let i = 0; i < h2s.length; i++) {
    const titleEl = h2s[i];
    let contentNodes = [];
    let node = titleEl.nextSibling;
    // Stop at the next valid accordion h2, not at any h2
    const nextH2 = h2s[i + 1];
    while (node && node !== nextH2) {
      // Only add elements or meaningful text
      if (node.nodeType === 1) {
        // Don't include script/style/meta/link
        const tag = node.tagName.toLowerCase();
        if (["script", "style", "link", "meta"].indexOf(tag) === -1) {
          contentNodes.push(node);
        }
      } else if (node.nodeType === 3) {
        if (node.textContent.trim() !== '') {
          const span = document.createElement('span');
          span.textContent = node.textContent;
          contentNodes.push(span);
        }
      }
      node = node.nextSibling;
    }
    // Remove leading/trailing whitespace-only elements
    while (contentNodes.length && contentNodes[0].textContent.trim() === '') contentNodes.shift();
    while (contentNodes.length && contentNodes[contentNodes.length - 1]?.textContent.trim() === '') contentNodes.pop();
    let contentCell = '';
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else if (contentNodes.length > 1) {
      contentCell = contentNodes;
    }
    rows.push([titleEl, contentCell]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
