const fs = require('fs');

const dtPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtPath, 'utf8');

// 1. We need to extract the exact visibleObjects.map(...) block
const mapStartString = '                {visibleObjects.map((item) => {';
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

// Length of the closing string is 19 for CRLF, 18 for LF
const actualEndStr = dtContent.substring(endIdx, endIdx + 20);
const closeLength = actualEndStr.includes('\\r') ? 19 : 18;

const mapBlock = dtContent.substring(startIdx, endIdx + (actualEndStr.includes('\\r') ? 19 : 18));

// We want to replace the JSX map block with `{renderedObjects}`
// And inject the useMemo block right before `return (`

const useMemoBlock = `  const renderedObjects = useMemo(() => {
    return visibleObjects.map((item) => {
${mapBlock.substring(mapStartString.length, mapBlock.length - 20)}
  });
  }, [visibleObjects, selectedIds, lockedLayers, layoutEditMode, contextMenu]);\n\n`;

// Wait, the mapBlock ends with `                })}` plus newline.
// Let's just do it simpler:
const innerMap = mapBlock.substring(mapStartString.length, mapBlock.lastIndexOf('})}'));
const finalUseMemo = `  const renderedObjects = useMemo(() => {\n    return visibleObjects.map((item) => {${innerMap}});\n  }, [visibleObjects, selectedIds, lockedLayers, layoutEditMode, contextMenu]);\n`;

const returnIdx = dtContent.indexOf('  return (');
if (returnIdx !== -1) {
  dtContent = dtContent.substring(0, returnIdx) + finalUseMemo + '\n' + dtContent.substring(returnIdx);
  dtContent = dtContent.replace(mapBlock, '                {renderedObjects}\r\n');
  fs.writeFileSync(dtPath, dtContent, 'utf8');
  console.log('Successfully injected useMemo');
} else {
  console.log('Could not find return statement');
}
