const fs = require('fs');

const tempPath = 'd:/ParkEase AI/temp_dt.tsx';
const destPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';

let tempLines = fs.readFileSync(tempPath, 'utf8').split('\n');
let destLines = fs.readFileSync(destPath, 'utf8').split('\n');

// The 0-indexed lines: 805 to 1048
const canvasLines = tempLines.slice(805, 1049); // inclusive of 1048

let destStart = -1;
let destEnd = -1;

for (let i = 0; i < destLines.length; i++) {
  if (destLines[i].includes('onClick={() => setContextMenu(null)}')) {
    destStart = i + 1; // points to the `>` 
    break;
  }
}

for (let i = destStart; i < destLines.length; i++) {
  if (destLines[i].includes('<FloorNavigator')) {
    destEnd = i - 2; // the `</div>` before `<FloorNavigator`
    break;
  }
}

if (destStart === -1 || destEnd === -1) {
  console.log('Error finding insertion point.');
  process.exit(1);
}

const newDestLines = destLines.slice(0, destStart + 1);
newDestLines.push(...canvasLines);
newDestLines.push(...destLines.slice(destEnd));

fs.writeFileSync(destPath, newDestLines.join('\n'), 'utf8');
console.log('Canvas injected perfectly.');
