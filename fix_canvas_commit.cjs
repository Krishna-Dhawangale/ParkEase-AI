const fs = require('fs');

const dtPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtPath, 'utf8');

dtContent = dtContent.replace(
  `  const updateCanvasSettings = (updates: Partial<typeof project.canvas>) => {
    commit((draft) => {
      draft.canvas = { ...draft.canvas, ...updates };
    }, 'Canvas settings updated');
  };`,
  `  const updateCanvasSettings = (updates: Partial<typeof project.canvas>) => {
    commit((draft) => ({ ...draft, canvas: { ...draft.canvas, ...updates } }), 'Canvas settings updated');
  };`
);

fs.writeFileSync(dtPath, dtContent, 'utf8');
console.log('Fixed updateCanvasSettings in DigitalTwin.tsx');
