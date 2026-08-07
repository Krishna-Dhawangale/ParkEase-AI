const fs = require('fs');

const cssPath = 'd:/ParkEase AI/src/index.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

if (!cssContent.includes('::-webkit-scrollbar {')) {
  cssContent += `
/* Global Dark Scrollbar for Webkit */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
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

const etPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/components/EditorToolbar.tsx';
let etContent = fs.readFileSync(etPath, 'utf8');
etContent = etContent.replace('overflow-y-auto', 'overflow-y-auto overflow-x-hidden custom-scrollbar');
fs.writeFileSync(etPath, etContent, 'utf8');
console.log('Fixed EditorToolbar overflow.');

const ppPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/components/PropertiesPanel.tsx';
let ppContent = fs.readFileSync(ppPath, 'utf8');
ppContent = ppContent.replace('overflow-y-auto', 'overflow-y-auto overflow-x-hidden custom-scrollbar');
fs.writeFileSync(ppPath, ppContent, 'utf8');
console.log('Fixed PropertiesPanel overflow.');
