const fs = require('fs');

const ppPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/components/PropertiesPanel.tsx';
let ppContent = fs.readFileSync(ppPath, 'utf8');

const lockToggle = `
            <div className="h-px bg-slate-800/50 w-full" />
            <div>
              <h3 className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-3">State</h3>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs text-slate-300 group-hover:text-white transition-colors">Lock Item</span>
                <div className={cn("w-7 h-4 rounded-full transition-colors relative", selected.locked ? 'bg-amber-500' : 'bg-slate-700')}>
                  <div className={cn("absolute top-0.5 bottom-0.5 w-3 rounded-full bg-white transition-transform shadow-sm", selected.locked ? 'translate-x-3.5 right-0.5' : 'left-0.5')} />
                </div>
              </label>
            </div>
`;

if (!ppContent.includes('Lock Item')) {
  // We'll insert it right after the Geometry section, before the "Toggles" section or Delete button.
  // The Geometry section ends with:
  /*
            <div>
              <label className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                <span>Rotation</span>
                <span className="text-brand-400">{selected.rotation}&deg;</span>
              </label>
              <input
                type="range"
                ...
              />
            </div>
          </div>
  */
  
  const searchStr = `          </div>\n\n          {selected.type.includes('slot') && (`;
  if (ppContent.includes(searchStr)) {
    ppContent = ppContent.replace(searchStr, `          </div>\n\n          ${lockToggle.trim()}\n\n          {selected.type.includes('slot') && (`);
  } else {
    // try finding the Delete Object button and inserting before it
    const deleteStr = `<div className="mt-auto pt-4 border-t border-slate-800/50">`;
    if (ppContent.includes(deleteStr)) {
      ppContent = ppContent.replace(deleteStr, `${lockToggle.trim()}\n\n          ${deleteStr}`);
    }
  }
  
  // wait, the onChange handler for the toggle is missing!
  // I need to add onClick/onChange to the label or input!
  ppContent = ppContent.replace(
    `<label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs text-slate-300 group-hover:text-white transition-colors">Lock Item</span>`,
    `<label className="flex items-center justify-between cursor-pointer group" onClick={() => updateObject(selected.id, { locked: !selected.locked })}>
                <span className="text-xs text-slate-300 group-hover:text-white transition-colors">Lock Item</span>`
  );

  fs.writeFileSync(ppPath, ppContent, 'utf8');
  console.log('Added Lock Item toggle to PropertiesPanel.tsx');
} else {
  console.log('Lock toggle already exists.');
}
