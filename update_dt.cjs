const fs = require('fs');

const dtPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtPath, 'utf8');

// 1. In onCanvasDrop, add shape from palette if available
const dropStr = `        const newObject: TwinCanvasObject = {\n          id: \`\${type}-\${Date.now()}\`,\n          type,\n          name: paletteItem?.label || type,\n          layer: paletteItem?.layer || 'Objects',\n          x,\n          y,\n          width: paletteItem?.width || 100,\n          height: paletteItem?.height || 100,\n          rotation: 0,\n          opacity: 1,\n          fill: paletteItem?.fill || '#fff',\n          stroke: paletteItem?.stroke || '#000',\n          status: paletteItem?.status,\n          zIndex: activeFloor.objects.length + 10,\n          locked: false\n        };`;

const newDropStr = `        const newObject: TwinCanvasObject = {\n          id: \`\${type}-\${Date.now()}\`,\n          type,\n          name: paletteItem?.label || type,\n          layer: paletteItem?.layer || 'Objects',\n          x,\n          y,\n          width: paletteItem?.width || 100,\n          height: paletteItem?.height || 100,\n          shape: paletteItem?.shape,\n          rotation: 0,\n          opacity: 1,\n          fill: paletteItem?.fill || '#fff',\n          stroke: paletteItem?.stroke || '#000',\n          status: paletteItem?.status,\n          zIndex: activeFloor.objects.length + 10,\n          locked: false\n        };`;

dtContent = dtContent.replace(dropStr, newDropStr);

// 2. Add showToast('Layout saved successfully!') to saveLayout
dtContent = dtContent.replace(
  `  const saveLayout = () => {\n    commit((draft) => ({ ...draft, lastSaved: 'Saved just now' }), 'Layout saved');\n  };`,
  `  const saveLayout = () => {\n    commit((draft) => ({ ...draft, lastSaved: 'Saved just now' }), 'Layout saved');\n    showToast('Layout saved successfully!');\n  };`
);

// 3. Pass setLayoutEditMode to DigitalTwinHeader
// Wait, setLayoutEditMode is passed to PropertiesPanel, but let's pass it to DigitalTwinHeader too
dtContent = dtContent.replace(
  `          showSettingsMenu={() => setIsSettingsOpen(true)}\n        />`,
  `          showSettingsMenu={() => setIsSettingsOpen(true)}\n          layoutEditMode={layoutEditMode}\n          setLayoutEditMode={setLayoutEditMode}\n        />`
);

fs.writeFileSync(dtPath, dtContent, 'utf8');
console.log('Updated DigitalTwin.tsx');
