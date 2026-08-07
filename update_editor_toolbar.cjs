const fs = require('fs');

const path = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/components/EditorToolbar.tsx';
let content = fs.readFileSync(path, 'utf8');

// Change width
content = content.replace('w-64', 'w-[200px]');
content = content.replace('px-4', 'px-3');
content = content.replace('p-4', 'p-3');

// Change tools map
content = content.replace(
  /"flex items-center gap-3 px-3 py-2\.5 rounded-lg text-sm font-medium transition-all text-left"/g,
  '"flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-all text-left"'
);
content = content.replace(/<span className="flex-1">\{item\.label\}<\/span>/g, '<span className="flex-1 truncate">{item.label}</span>');

// Change components grid
content = content.replace('grid-cols-2 gap-2', 'grid-cols-3 gap-1.5');
content = content.replace(
  /className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900\/50 p-3 hover:border-brand-500 hover:bg-slate-800 transition-colors cursor-grab active:cursor-grabbing group"/g,
  'className="flex flex-col items-center justify-center gap-1 rounded-md border border-slate-800/80 bg-slate-900/50 p-1.5 hover:border-brand-500 hover:bg-slate-800 transition-colors cursor-grab active:cursor-grabbing group"'
);
content = content.replace(/w-8 h-8 rounded shadow-sm/g, 'w-6 h-6 rounded-sm shadow-sm text-[10px]');
content = content.replace(
  /<span className="text-\[10px\] font-semibold text-slate-400 text-center leading-tight">\{item\.label\}<\/span>/g,
  '<span className="text-[9px] font-semibold text-slate-500 text-center leading-[1.1] w-full truncate px-0.5">{item.label}</span>'
);

// Delete button
content = content.replace(
  /"flex items-center gap-3 px-3 py-2\.5 rounded-lg text-sm font-medium transition-all text-left text-slate-400 hover:bg-rose-950\/30 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed"/g,
  '"flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-all text-left text-slate-400 hover:bg-rose-950/30 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed"'
);

// Legend
content = content.replace(
  /<div className="grid grid-cols-2 gap-2 text-xs text-slate-400">/g,
  '<div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400">'
);
content = content.replace(/w-2 h-2/g, 'w-1.5 h-1.5');

fs.writeFileSync(path, content, 'utf8');
console.log('Updated EditorToolbar.tsx');
