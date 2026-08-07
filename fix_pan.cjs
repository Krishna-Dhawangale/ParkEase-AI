const fs = require('fs');

const dtTsxPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtTsxPath, 'utf8');

const targetStr = `            onPointerDown={(e) => {
              if (e.target === e.currentTarget) {
                if (previewMode === '3D') {`;

const newStr = `            onPointerDown={(e) => {
              // Allow panning if clicking the outer wrapper OR the actual grid board background
              if (e.target === e.currentTarget || (boardRef.current && e.target === boardRef.current)) {
                if (previewMode === '3D') {`;

if (dtContent.includes(targetStr)) {
  dtContent = dtContent.replace(targetStr, newStr);
  fs.writeFileSync(dtTsxPath, dtContent, 'utf8');
  console.log('Fixed panning on canvas background.');
} else {
  // Let's try more flexible replacement
  const altTarget = `if (e.target === e.currentTarget) {
                if (previewMode === '3D') {`;
  const altNew = `if (e.target === e.currentTarget || (boardRef.current && e.target === boardRef.current)) {
                if (previewMode === '3D') {`;
  if (dtContent.includes(altTarget)) {
    dtContent = dtContent.replace(altTarget, altNew);
    fs.writeFileSync(dtTsxPath, dtContent, 'utf8');
    console.log('Fixed panning on canvas background (alt).');
  } else {
    console.log('Could not find target string for panning fix.');
  }
}
