const fs = require('fs');

const path = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/components/PropertiesPanel.tsx';
let content = fs.readFileSync(path, 'utf8');

// Change width
content = content.replace('w-64', 'w-[220px]');
content = content.replace('p-4 text-slate-300', 'p-3 text-slate-300');

// Change field paddings and text sizes
content = content.replace(/<div className="space-y-4">/g, '<div className="space-y-3">');
content = content.replace(/<div className="space-y-5">/g, '<div className="space-y-4">');
content = content.replace(/<label className="text-xs font-bold text-slate-500 uppercase tracking-widest">/g, '<label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">');
content = content.replace(/text-xs font-bold text-slate-500/g, 'text-[10px] font-bold text-slate-500');

// Inputs
content = content.replace(/px-3 py-2 text-sm/g, 'px-2 py-1.5 text-xs');
content = content.replace(/h-9/g, 'h-7');

// Toggles
content = content.replace(/w-10 h-5/g, 'w-8 h-4');
content = content.replace(/w-4 h-4/g, 'w-3 h-3');
content = content.replace(/translate-x-5/g, 'translate-x-4');

// Delete button
content = content.replace(/py-2\.5 text-sm/g, 'py-1.5 text-xs');
content = content.replace(/px-4 py-2 text-sm/g, 'px-3 py-1.5 text-xs');

fs.writeFileSync(path, content, 'utf8');
console.log('Updated PropertiesPanel.tsx');
