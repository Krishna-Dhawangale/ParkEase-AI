const fs = require('fs');

const dtPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtPath, 'utf8');

// The `renderedObjects` was injected in the wrong place!
// Let's remove it from `getAngleFromCenter`
const badInjectStart = '    const renderedObjects = useMemo(() => {';
const badInjectEnd = '  }, [visibleObjects, selectedIds, lockedLayers, layoutEditMode, contextMenu]);\n';

if (dtContent.includes(badInjectStart)) {
  const startIdx = dtContent.indexOf(badInjectStart);
  const endIdx = dtContent.indexOf(badInjectEnd, startIdx) + badInjectEnd.length;
  const badBlock = dtContent.substring(startIdx, endIdx);
  
  // Remove it from the wrong place
  dtContent = dtContent.replace(badBlock, '');
  
  // Now find the REAL `  return (` for the main component.
  // The main component return looks like:
  //   return (
  //     <div className="flex flex-col h-[calc(100vh-6rem)]
  
  const mainReturnIdx = dtContent.indexOf('  return (\n    <div className="flex flex-col h-[calc(100vh-6rem)]');
  if (mainReturnIdx !== -1) {
    dtContent = dtContent.substring(0, mainReturnIdx) + badBlock + '\n' + dtContent.substring(mainReturnIdx);
    fs.writeFileSync(dtPath, dtContent, 'utf8');
    console.log('Fixed useMemo location!');
  } else {
    // fallback
    const fbReturnIdx = dtContent.indexOf('  return (\r\n    <div className="flex flex-col');
    if (fbReturnIdx !== -1) {
      dtContent = dtContent.substring(0, fbReturnIdx) + badBlock + '\n' + dtContent.substring(fbReturnIdx);
      fs.writeFileSync(dtPath, dtContent, 'utf8');
      console.log('Fixed useMemo location! (fallback)');
    } else {
      console.log('Could not find main return block');
    }
  }
} else {
  console.log('Bad inject start not found');
}
