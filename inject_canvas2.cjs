const fs = require('fs');

const tempPath = 'd:/ParkEase AI/temp_dt.tsx';
const destPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';

let tempContent = fs.readFileSync(tempPath, 'utf8');
let destContent = fs.readFileSync(destPath, 'utf8');

// The canvas block starts around `<div ref={boardRef}` and ends before `<aside className="hidden`
// Let's locate it by finding the first `<div` before `ref={boardRef}`
let boardRefIdx = tempContent.indexOf('ref={boardRef}');
if (boardRefIdx === -1) {
  console.log('Error: Could not find ref={boardRef} in temp_dt.tsx');
  process.exit(1);
}

let start = tempContent.lastIndexOf('<div', boardRefIdx);

// The block ends where `<aside className="hidden w-[340px] flex-col gap-3 lg:flex">` begins
let asideStart = tempContent.indexOf('<aside className="hidden w-[340px] flex-col gap-3 lg:flex">');
if (asideStart === -1) {
  console.log('Error: Could not find <aside in temp_dt.tsx');
  process.exit(1);
}

// We just need the content between start and the last closing `</div>` before the `<aside`
let end = tempContent.lastIndexOf('</div>', asideStart);
// Go back one more `</div>` because there are two closing divs at the end of the canvas block:
// </div> </div>
end = tempContent.lastIndexOf('</div>', end - 1);

let canvasContent = tempContent.substring(start, end);

// Now let's inject it into destContent
// destContent has an empty <div> for the canvas:
//           <div 
//             className="flex-1 overflow-auto outline-none"
//             ...
//           >
//             
//           </div>

// Let's replace the whole empty div with our canvas content? Wait, the empty div in destContent HAS the event listeners (onPointerMove, onWheel etc.) which I meticulously preserved!
// Wait! The canvas block in `temp_dt.tsx` *IS* that entire div!
// Let's see: `temp_dt.tsx` has `<div className="flex-1 overflow-auto outline-none"` around line 763.
let mainDivStart = tempContent.lastIndexOf('<div', start - 1);
// Actually, `temp_dt.tsx` has `className="flex-1 overflow-auto outline-none"`
let flex1DivStart = tempContent.indexOf('className="flex-1 overflow-auto outline-none"');
flex1DivStart = tempContent.lastIndexOf('<div', flex1DivStart);

if (flex1DivStart !== -1) {
    let flex1DivEnd = tempContent.lastIndexOf('</div>', asideStart);
    flex1DivEnd = tempContent.lastIndexOf('</div>', flex1DivEnd - 1) + 6; // include </div>
    canvasContent = tempContent.substring(flex1DivStart, flex1DivEnd);
    
    // Now replace the empty div in destContent
    let destFlex1DivStart = destContent.indexOf('className="flex-1 overflow-auto outline-none"');
    destFlex1DivStart = destContent.lastIndexOf('<div', destFlex1DivStart);
    
    let floorNavIdx = destContent.indexOf('<FloorNavigator');
    let destFlex1DivEnd = destContent.lastIndexOf('</div>', floorNavIdx);
    destFlex1DivEnd += 6;
    
    if (destFlex1DivStart !== -1 && destFlex1DivEnd !== -1) {
       const newDestContent = destContent.substring(0, destFlex1DivStart) + canvasContent + '\n          ' + destContent.substring(destFlex1DivEnd);
       fs.writeFileSync(destPath, newDestContent, 'utf8');
       console.log('Successfully injected full canvas block.');
    } else {
       console.log('Error: Could not find target div in destContent');
    }
}

