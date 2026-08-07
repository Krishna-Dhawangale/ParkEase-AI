const fs = require('fs');
const dtPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtPath, 'utf8');

// 1. Fix BuilderSnapshot double import
dtContent = dtContent.replace(/export interface BuilderSnapshot[\s\S]*?\};\r?\n/, '');

// 2. Add updateCanvasSettings
const updateFunc = `  const updateCanvasSettings = (updates: Partial<typeof project.canvas>) => {
    commit((draft) => ({ ...draft, canvas: { ...draft.canvas, ...updates } }), 'Canvas settings updated');
  };

  const saveLayout = () => {
    commit((draft) => ({ ...draft, lastSaved: 'Saved just now' }), 'Layout saved');
    showToast('Layout saved successfully!');
  };`;

dtContent = dtContent.replace(/  const saveLayout = \(\) => \{\r?\n    commit\(\(draft\) => \(\{ \.\.\.draft, lastSaved: 'Saved just now' \}\), 'Layout saved'\);\r?\n  \};/, updateFunc);

fs.writeFileSync(dtPath, dtContent, 'utf8');
console.log('Final fix applied');
