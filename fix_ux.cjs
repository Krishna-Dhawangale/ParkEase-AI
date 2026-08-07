const fs = require('fs');

const fnPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/components/FloorNavigator.tsx';
let fnContent = fs.readFileSync(fnPath, 'utf8');

fnContent = fnContent.replace(
  'className="absolute bottom-6 left-6 z-10 flex items-center gap-3"',
  'className="absolute bottom-6 left-6 z-10 flex items-center gap-3 overflow-x-auto overflow-y-hidden max-w-[calc(100vw-380px)] pb-2 custom-scrollbar"'
);

// We need to ensure children don't shrink
fnContent = fnContent.replace(
  'w-32 h-[88px]',
  'w-32 h-[88px] shrink-0'
);
fnContent = fnContent.replace(
  'w-32 h-[88px]',
  'w-32 h-[88px] shrink-0'
);
// Replace all instances of `w-32 h-[88px]`
fnContent = fnContent.replace(/w-32 h-\[88px\]/g, 'w-32 h-[88px] shrink-0');

fs.writeFileSync(fnPath, fnContent, 'utf8');
console.log('Fixed FloorNavigator scroll.');

const dtTsxPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtTsxPath, 'utf8');

const targetClassStr = `'relative mx-auto my-8 transition-transform duration-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'`;
const newClassStr = `'relative mx-auto my-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900',
                (!isPanningCanvas && !isOrbiting) && 'transition-transform duration-300'`;

if (dtContent.includes(targetClassStr)) {
  dtContent = dtContent.replace(targetClassStr, newClassStr);
  fs.writeFileSync(dtTsxPath, dtContent, 'utf8');
  console.log('Fixed panning lag.');
} else {
  console.log('Could not find target class in DigitalTwin.');
}

