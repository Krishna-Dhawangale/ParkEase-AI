const fs = require('fs');

const tempPath = 'd:/ParkEase AI/temp_dt.tsx';
const destPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';

let tempContent = fs.readFileSync(tempPath, 'utf8');
let destContent = fs.readFileSync(destPath, 'utf8');

const boardStartStr = '              <div\n                ref={boardRef}';
const boardEndStr = '              </div>\n            </div>\n\n            <div className="rounded-lg border';

let startIdx = tempContent.indexOf(boardStartStr);
let endIdx = tempContent.indexOf(boardEndStr);

if (startIdx === -1) {
  // Let's try flexible search
  const regex = /<div[\s\n]*ref=\{boardRef\}[\s\S]*?<\/div>\s*<\/div>\s*<div className="rounded-lg border/;
  const match = regex.exec(tempContent);
  if (match) {
    console.log("Found with regex");
    // We need just the canvas part, not the closing divs of the container
    // The canvas part ends after the closing of boardRef div.
  }
}

// Let's extract properly:
// Find `<div ref={boardRef}` or similar
let start = tempContent.indexOf('ref={boardRef}');
// Go back to the `<div`
while (tempContent[start] !== '<') {
  start--;
}

// Now we need to find the matching closing `</div>` for this div.
// Or we can just find the end of the objects mapping.
// The canvas block ends with:
//               </div>
//             </div>
// 
//             <div className="rounded-lg border
let endToken = '              </div>\n            </div>\n\n            <div className="rounded-lg border';
let end = tempContent.indexOf(endToken);
if (end === -1) {
  endToken = '<div className="rounded-lg border border-slate-200';
  end = tempContent.indexOf(endToken);
  // Rewind past the two </div> closing tags
  end = tempContent.lastIndexOf('</div>', end);
  end = tempContent.lastIndexOf('</div>', end - 1);
}

const canvasContent = tempContent.substring(start, end);

// Inject into dest
const destStartToken = `onClick={() => setContextMenu(null)}
          >`;
let destStart = destContent.indexOf(destStartToken);
if (destStart !== -1) {
  destStart += destStartToken.length;
  const destEndToken = `          </div>

          <FloorNavigator`;
  let destEnd = destContent.indexOf(destEndToken);
  
  if (destEnd !== -1) {
    const newDestContent = destContent.substring(0, destStart) + '\n' + canvasContent + '\n' + destContent.substring(destEnd);
    fs.writeFileSync(destPath, newDestContent, 'utf8');
    console.log('Successfully injected canvas content.');
  } else {
    console.log('Could not find destEndToken');
  }
} else {
  console.log('Could not find destStartToken');
}
