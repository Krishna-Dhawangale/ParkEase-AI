const fs = require('fs');

const tempPath = 'd:/ParkEase AI/temp_dt.tsx';
const destPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';

let tempLines = fs.readFileSync(tempPath, 'utf8').split('\n');
let destLines = fs.readFileSync(destPath, 'utf8').split('\n');

// 1. Find the canvas block in tempLines
let canvasStart = -1;
let canvasEnd = -1;

for (let i = 0; i < tempLines.length; i++) {
  if (tempLines[i].includes('ref={boardRef}')) {
    canvasStart = i - 1; // get the `<div` above it
    break;
  }
}

for (let i = canvasStart; i < tempLines.length; i++) {
  if (tempLines[i].includes('<aside className="hidden w-80 shrink-0')) {
    // The previous lines are `</div>` 
    // We want to stop at the first `</div>` that closes the boardRef div
    canvasEnd = i - 2; // -1 is an empty line, -2 is `</div>`
    break;
  }
}

if (canvasStart === -1 || canvasEnd === -1) {
  console.log('Error finding canvas in temp: start=' + canvasStart + ', end=' + canvasEnd);
  process.exit(1);
}

const canvasLines = tempLines.slice(canvasStart, canvasEnd + 1);

// 2. Find where to inject in destLines
let destStart = -1;
let destEnd = -1;

for (let i = 0; i < destLines.length; i++) {
  if (destLines[i].includes('onClick={() => setContextMenu(null)}')) {
    destStart = i + 1; // We inject AFTER the closing `>` of the outer div
    break;
  }
}

for (let i = destStart; i < destLines.length; i++) {
  if (destLines[i].includes('<FloorNavigator')) {
    destEnd = i - 2; // -1 is empty, -2 is `</div>`
    break;
  }
}

if (destStart === -1 || destEnd === -1) {
  console.log('Error finding injection point in dest: start=' + destStart + ', end=' + destEnd);
  process.exit(1);
}

// 3. Reconstruct destLines
const newDestLines = destLines.slice(0, destStart + 1);
newDestLines.push(...canvasLines);
newDestLines.push(...destLines.slice(destEnd));

fs.writeFileSync(destPath, newDestLines.join('\n'), 'utf8');
console.log('Successfully injected canvas via lines! Lines extracted: ' + canvasLines.length);
