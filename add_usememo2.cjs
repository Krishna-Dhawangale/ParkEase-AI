const fs = require('fs');

const dtPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtPath, 'utf8');

const mapStartString = '              {visibleObjects.map((item) => {';
const mapEndString = '                })}\r\n';
const mapEndStringFallback = '                })}\n';

const startIdx = dtContent.indexOf(mapStartString);
if (startIdx === -1) {
  console.log('Could not find start of map block');
  process.exit(1);
}

let endIdx = dtContent.indexOf(mapEndString, startIdx);
if (endIdx === -1) {
  endIdx = dtContent.indexOf(mapEndStringFallback, startIdx);
  if (endIdx === -1) {
    console.log('Could not find end of map block');
    process.exit(1);
  }
}

const innerMap = dtContent.substring(startIdx + mapStartString.length, endIdx);

const finalUseMemo = `  const renderedObjects = useMemo(() => {\n    return visibleObjects.map((item) => {${innerMap}});\n  }, [visibleObjects, selectedIds, lockedLayers, layoutEditMode, contextMenu]);\n`;

const returnIdx = dtContent.indexOf('  return (');
if (returnIdx !== -1) {
  const blockToRemove = dtContent.substring(startIdx, endIdx + (dtContent.substring(endIdx, endIdx + 20).includes('\\r') ? 19 : 18));
  dtContent = dtContent.substring(0, returnIdx) + finalUseMemo + '\n' + dtContent.substring(returnIdx);
  // Wait, I just need to replace the original block with `{renderedObjects}`
  // Let's do it safely
  const preBlock = dtContent.substring(0, dtContent.indexOf(mapStartString));
  const postBlock = dtContent.substring(dtContent.indexOf(mapStartString) + blockToRemove.length);
  // Oh wait, dtContent already changed! Let's do it sequentially:
}

// Safer approach:
let newDtContent = fs.readFileSync(dtPath, 'utf8');
const oldBlock = newDtContent.substring(startIdx, endIdx + (newDtContent.substring(endIdx, endIdx + 20).includes('\r') ? 19 : 18));
newDtContent = newDtContent.replace(oldBlock, '              {renderedObjects}\n');

const retIdx = newDtContent.indexOf('  return (');
newDtContent = newDtContent.substring(0, retIdx) + finalUseMemo + '\n' + newDtContent.substring(retIdx);

fs.writeFileSync(dtPath, newDtContent, 'utf8');
console.log('Successfully injected useMemo');
