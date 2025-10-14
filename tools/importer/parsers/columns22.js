/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns22)'];

  // Left column: text content
  const leftCol = document.createElement('div');
  // Author Name (h1)
  const authorName = element.querySelector('.c-authorheader__author-name');
  if (authorName) leftCol.appendChild(authorName);
  // Subtitle (p)
  const subTitle = element.querySelector('.c-authorheader__sub-title');
  if (subTitle) leftCol.appendChild(subTitle);
  // Bio paragraphs (div > p*)
  const bioDiv = element.querySelector('.c-authorheader__author-bio');
  if (bioDiv) {
    bioDiv.querySelectorAll('p').forEach(p => leftCol.appendChild(p));
  }
  // Social profile (LinkedIn icon)
  const socialDiv = element.querySelector('.c-authorheader__social-profile');
  if (socialDiv) {
    const socialLink = socialDiv.querySelector('a');
    if (socialLink) leftCol.appendChild(socialLink);
  }

  // Right column: author image
  const rightCol = document.createElement('div');
  const imgDiv = element.querySelector('.c-authorheader__container__img');
  if (imgDiv) {
    const authorImg = imgDiv.querySelector('img');
    if (authorImg) rightCol.appendChild(authorImg);
  }

  // Table rows: header, then one row with two columns (left: text, right: image)
  const cells = [
    headerRow,
    [leftCol, rightCol]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(block);
}
