const fs = require('fs');

const dtPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtPath, 'utf8');

const mapStartString = '              {visibleObjects.map((item) => {';
const mapEndString = '              })}\r\n';
const mapEndStringFallback = '              })}\n';

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

const newDtContent = dtContent.substring(0, startIdx) + '              {renderedObjects}\n' + dtContent.substring(endIdx + (dtContent.substring(endIdx, endIdx + 20).includes('\r') ? 18 : 17));

const retIdx = newDtContent.indexOf('  return (');
const finalDtContent = newDtContent.substring(0, retIdx) + finalUseMemo + '\n' + newDtContent.substring(retIdx);

fs.writeFileSync(dtPath, finalDtContent, 'utf8');
console.log('Successfully injected useMemo');
