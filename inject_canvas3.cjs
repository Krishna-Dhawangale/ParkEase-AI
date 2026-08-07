const fs = require('fs');

const tempPath = 'd:/ParkEase AI/temp_dt.tsx';
const destPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';

let tempContent = fs.readFileSync(tempPath, 'utf8');
let destContent = fs.readFileSync(destPath, 'utf8');

// The canvas block is inside: `<div className="flex-1 overflow-auto outline-none"`
let flex1DivStart = tempContent.indexOf('className="flex-1 overflow-auto outline-none"');
flex1DivStart = tempContent.lastIndexOf('<div', flex1DivStart);

let asideStart = tempContent.indexOf('<aside className="hidden w-80');

if (flex1DivStart !== -1 && asideStart !== -1) {
    let flex1DivEnd = tempContent.lastIndexOf('</div>', asideStart);
    flex1DivEnd = tempContent.lastIndexOf('</div>', flex1DivEnd - 1);
    // There's one more </div> to close the `flex-1 overflow-auto`
    flex1DivEnd = tempContent.lastIndexOf('</div>', flex1DivEnd - 1) + 6;
    
    // Wait, let's just make sure we capture up to the end of the `</div>` that closes flex-1 div.
    // The `<aside>` is a sibling to the `<div className="flex-1 overflow-auto outline-none">`?
    // Let's check temp_dt.tsx. The structure was:
    // <div className="flex flex-1 gap-4 p-4 lg:p-6">
    //   <aside ... (Toolbar) />
    //   <div className="flex-1 overflow-auto outline-none" ...>
    //     ... (Canvas)
    //   </div>
    //   <aside ... (Properties) />
    // </div>
    // So the `</div>` right before `<aside className="hidden w-80"` is the closing tag for the Canvas div!
    let endOfCanvasDiv = tempContent.lastIndexOf('</div>', asideStart);
    endOfCanvasDiv += 6;
    
    let canvasContent = tempContent.substring(flex1DivStart, endOfCanvasDiv);
    
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
} else {
    console.log('Error: could not find flex1DivStart or asideStart in temp_dt');
}
