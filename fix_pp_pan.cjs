const fs = require('fs');

// 1. Fix PropertiesPanel Delete Button visibility
const ppPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/components/PropertiesPanel.tsx';
let ppContent = fs.readFileSync(ppPath, 'utf8');

// The Delete button block looks like this:
/*
              <button
                onClick={deleteSelected}
                className="w-full py-2.5 rounded-lg border border-rose-900/50 text-rose-500 text-sm font-bold hover:bg-rose-950/30 hover:border-rose-800 transition-colors"
              >
                Delete {selected.type.includes('slot') ? 'Slot' : 'Object'}
              </button>
            </div>
          )}
*/
// We need to move the button outside the conditional block.
// Let's replace the whole block manually with regex or split

const deleteBtnCode = `              <button
                onClick={deleteSelected}
                className="w-full py-2.5 rounded-lg border border-rose-900/50 text-rose-500 text-sm font-bold hover:bg-rose-950/30 hover:border-rose-800 transition-colors mt-6"
              >
                Delete {selected.type.includes('slot') ? 'Slot' : 'Object'}
              </button>`;

if (ppContent.includes('Delete {selected.type.includes(\'slot\') ? \'Slot\' : \'Object\'}')) {
  // Let's just rewrite the bottom part of PropertiesPanel.tsx
  // We'll use a robust replace
  const blockStart = ppContent.indexOf("{selected.type.includes('slot') && (");
  const mainDivEnd = ppContent.indexOf('</div>\n      )}', blockStart);
  
  if (blockStart !== -1 && mainDivEnd !== -1) {
    let newBottom = `
          {selected.type.includes('slot') && (
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">Additional Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-slate-300 flex items-center gap-2">EV Charging</span>
                  <div className={cn("w-8 h-4 rounded-full transition-colors relative", selected.status === 'ev' ? 'bg-emerald-500' : 'bg-slate-700')}>
                    <div className={cn("absolute top-0.5 bottom-0.5 w-3 rounded-full bg-white transition-transform", selected.status === 'ev' ? 'translate-x-4.5 right-0.5' : 'left-0.5')} />
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-slate-300 flex items-center gap-2">Disabled</span>
                  <div className={cn("w-8 h-4 rounded-full transition-colors relative", selected.status === 'disabled' ? 'bg-brand-500' : 'bg-slate-700')}>
                    <div className={cn("absolute top-0.5 bottom-0.5 w-3 rounded-full bg-white transition-transform", selected.status === 'disabled' ? 'translate-x-4.5 right-0.5' : 'left-0.5')} />
                  </div>
                </label>
              </div>
            </div>
          )}
          
          <button
            onClick={deleteSelected}
            className="w-full py-2.5 rounded-lg border border-rose-900/50 text-rose-500 text-sm font-bold hover:bg-rose-950/30 hover:border-rose-800 transition-colors mt-4"
          >
            Delete {selected.type.includes('slot') ? 'Slot' : 'Object'}
          </button>
        </div>
      )}
    </div>
  );
};
`;
    ppContent = ppContent.substring(0, blockStart) + newBottom;
    fs.writeFileSync(ppPath, ppContent, 'utf8');
    console.log('Fixed PropertiesPanel Delete button.');
  }
}

// 2. Fix DigitalTwin Middle-click Panning
const dtTsxPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtTsxPath, 'utf8');

const targetStr = `if (e.target === e.currentTarget || (boardRef.current && e.target === boardRef.current)) {`;
const newStr = `if (e.button === 1 || e.target === e.currentTarget || (boardRef.current && e.target === boardRef.current)) {`;

if (dtContent.includes(targetStr)) {
  dtContent = dtContent.replace(targetStr, newStr);
  fs.writeFileSync(dtTsxPath, dtContent, 'utf8');
  console.log('Fixed middle-click panning in DigitalTwin.');
} else {
  console.log('Could not find panning logic string.');
}

// 3. Fix sidebars wheel scrolling if it's trapped.
// Actually, if wheel doesn't scroll sidebars, let's explicitly add a ref and an imperative wheel event to force scroll on EditorToolbar and PropertiesPanel.
// Or we can just ensure that overscroll-behavior is auto.
const etPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/components/EditorToolbar.tsx';
let etContent = fs.readFileSync(etPath, 'utf8');
if (!etContent.includes('overscroll-contain')) {
  etContent = etContent.replace('overflow-y-auto', 'overflow-y-auto overscroll-contain');
  fs.writeFileSync(etPath, etContent, 'utf8');
  console.log('Added overscroll-contain to EditorToolbar');
}
