const fs = require('fs');
const cssPath = 'd:/ParkEase AI/src/index.css';

let cssContent = fs.readFileSync(cssPath, 'utf8');

if (!cssContent.includes('.custom-scrollbar')) {
  cssContent += `
/* Custom Scrollbar for Floor Navigator */
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.4);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.6);
}
`;
  fs.writeFileSync(cssPath, cssContent, 'utf8');
  console.log('Added custom-scrollbar CSS.');
} else {
  console.log('custom-scrollbar already exists.');
}
