const fs = require('fs');

const dthPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/components/DigitalTwinHeader.tsx';
let dthContent = fs.readFileSync(dthPath, 'utf8');

// 1. Update interface
dthContent = dthContent.replace(
  `  saving?: boolean;\n}`,
  `  saving?: boolean;\n  layoutEditMode?: boolean;\n  setLayoutEditMode?: (mode: boolean) => void;\n}`
);

// 2. Add destructured props
dthContent = dthContent.replace(
  `  saving\n}) => {`,
  `  saving,\n  layoutEditMode,\n  setLayoutEditMode\n}) => {`
);

// 3. Add Lock Layout button next to Save/Publish
// Look for `<button onClick={undo}`
const undoStr = `<button onClick={undo}`;
if (dthContent.includes(undoStr)) {
  const insertBeforeUndo = `            {setLayoutEditMode && (
              <button 
                onClick={() => setLayoutEditMode(!layoutEditMode)} 
                className={cn("px-3 py-1 text-xs font-bold rounded-md transition-colors border", layoutEditMode ? "border-brand-500/50 bg-brand-500/10 text-brand-400" : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700")}
              >
                {layoutEditMode ? 'Lock Layout (View Mode)' : 'Edit Layout'}
              </button>
            )}
            <div className="h-4 w-px bg-slate-800 mx-1" />\n            `;
  dthContent = dthContent.replace(undoStr, insertBeforeUndo + undoStr);
}

fs.writeFileSync(dthPath, dthContent, 'utf8');
console.log('Updated DigitalTwinHeader.tsx');
