const fs = require('fs');
const ppPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/components/PropertiesPanel.tsx';
let ppContent = fs.readFileSync(ppPath, 'utf8');

ppContent = ppContent.replace(/disabled=\{readOnly\}/g, 'disabled={readOnly || selected.locked}');

ppContent = ppContent.replace(
  `<label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs text-slate-300 group-hover:text-white transition-colors">EV Charging</span>`,
  `<label className="flex items-center justify-between cursor-pointer group" onClick={() => { if (!readOnly && !selected.locked) updateObject(selected.id, { status: selected.status === 'ev' ? 'available' : 'ev' }) }}>
                    <span className="text-xs text-slate-300 group-hover:text-white transition-colors">EV Charging</span>`
);

ppContent = ppContent.replace(
  `<label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs text-slate-300 group-hover:text-white transition-colors">Disabled</span>`,
  `<label className="flex items-center justify-between cursor-pointer group" onClick={() => { if (!readOnly && !selected.locked) updateObject(selected.id, { status: selected.status === 'disabled' ? 'available' : 'disabled' }) }}>
                    <span className="text-xs text-slate-300 group-hover:text-white transition-colors">Disabled</span>`
);

// We should also disable the Delete button if locked
ppContent = ppContent.replace(
  `onClick={deleteSelected}`,
  `onClick={deleteSelected} disabled={readOnly || selected.locked}`
);
ppContent = ppContent.replace(
  `className="flex w-full items-center justify-center gap-2 py-2 rounded border border-rose-900/50 text-rose-500 text-xs font-bold hover:bg-rose-950/40 hover:border-rose-800 hover:text-rose-400 transition-all group"`,
  `className="flex w-full items-center justify-center gap-2 py-2 rounded border border-rose-900/50 text-rose-500 text-xs font-bold hover:bg-rose-950/40 hover:border-rose-800 hover:text-rose-400 transition-all group disabled:opacity-50 disabled:pointer-events-none"`
);

fs.writeFileSync(ppPath, ppContent, 'utf8');
console.log('Fixed toggles and lock constraints');
