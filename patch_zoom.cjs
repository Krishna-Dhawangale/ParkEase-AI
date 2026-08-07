const fs = require('fs');

const dtTsxPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtTsxPath, 'utf8');

// The zoom controls block starts with: `<div className="absolute top-4 left-4 z-10 flex flex-col gap-2">`
// Let's replace the content of that block.
const zoomBlockStart = dtContent.indexOf('<div className="absolute top-4 left-4 z-10 flex flex-col gap-2">');
if (zoomBlockStart !== -1) {
  const zoomBlockEnd = dtContent.indexOf('</div>\n          </div>', zoomBlockStart);
  
  if (zoomBlockEnd !== -1) {
    const newZoomBlock = `<div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
             <div className="flex items-center gap-4">
               {/* Horizontal zoom pill */}
               <div className="flex items-center gap-1 bg-[#101726]/95 border border-slate-800/80 rounded-lg p-1.5 shadow-xl backdrop-blur">
                  <button onClick={() => setPan({ x: 0, y: 0 })} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                    <Maximize2 className="w-3.5 h-3.5" />
                    Fit to View
                  </button>
                  <div className="w-px h-5 bg-slate-700/50 mx-1" />
                  <button onClick={() => setZoom((value) => Math.max(0.35, value - 0.1))} className="p-1.5 text-slate-400 hover:text-white transition-colors"><Minus className="w-4 h-4" /></button>
                  <button onClick={() => setZoom(1)} className="px-3 py-1 text-xs font-bold text-white min-w-[3.5rem] text-center">{Math.round(zoom * 100)}%</button>
                  <button onClick={() => setZoom((value) => Math.min(1.8, value + 0.1))} className="p-1.5 text-slate-400 hover:text-white transition-colors"><Plus className="w-4 h-4" /></button>
               </div>
             </div>
             
             {!readOnly && layoutEditMode && (
               <div className="flex items-center gap-1 bg-[#101726]/95 border border-slate-800/80 rounded-lg p-1.5 shadow-xl backdrop-blur w-fit mt-1">
                  <button onClick={() => setShowGrid((v) => !v)} className={cn("p-1.5 rounded-md transition-colors", showGrid ? "bg-brand-600/20 text-brand-400" : "text-slate-400 hover:text-white")} title="Toggle Grid"><Grid3X3 className="w-4 h-4" /></button>
                  <button onClick={() => setSnapToGrid((v) => !v)} className={cn("p-1.5 rounded-md transition-colors text-[10px] font-bold tracking-wider", snapToGrid ? "bg-brand-600/20 text-brand-400" : "text-slate-400 hover:text-white")} title="Toggle Snap">SNAP</button>
               </div>
             )}`;
    
    // The previous code had `<div className="absolute top-4 left-4 z-10 flex flex-col gap-2">` which we replace up to its closing tags.
    // Let's replace the whole block up to `             )}` inside the zoom controls.
    const zoomControlsEnd = dtContent.indexOf(')}', zoomBlockStart);
    if (zoomControlsEnd !== -1) {
       dtContent = dtContent.substring(0, zoomBlockStart) + newZoomBlock + dtContent.substring(zoomControlsEnd + 2);
    }
  }
}

// Since FloorNavigator is now absolute positioned, we don't need to change its wrapper in DigitalTwin.tsx unless it was causing layout issues.
// But actually `FloorNavigator` is currently outside the `overflow-auto outline-none` canvas.
// `          <FloorNavigator` is fine where it is. It will just float over the canvas because its parent is `relative`.

fs.writeFileSync(dtTsxPath, dtContent, 'utf8');
console.log('Zoom controls updated.');
