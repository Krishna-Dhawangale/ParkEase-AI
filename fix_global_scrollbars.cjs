const fs = require('fs');

const cssPath = 'd:/ParkEase AI/src/index.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

if (!cssContent.includes('/* Global Dark Scrollbar for Webkit */')) {
  cssContent += `
/* Global Dark Scrollbar for Webkit */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.1);
}
::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}
::-webkit-scrollbar-corner {
  background: transparent;
}
`;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
  console.log('Added global dark scrollbar to index.css');
} else {
  console.log('Global scrollbar already exists.');
}
