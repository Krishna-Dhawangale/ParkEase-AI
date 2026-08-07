const fs = require('fs');

function replaceInFile(path, search, replacement) {
  try {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(search, replacement);
    fs.writeFileSync(path, content, 'utf8');
  } catch (e) {
    console.log('Error replacing in ' + path + ': ' + e.message);
  }
}

// Fix 1: Type imports in components
const componentsDir = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/components/';
['DigitalTwinHeader.tsx', 'FloorNavigator.tsx'].forEach(file => {
  replaceInFile(componentsDir + file, 
    "import { TwinBuilderProject } from '../data';", 
    "import type { TwinBuilderProject } from '../data';");
});

replaceInFile(componentsDir + 'PropertiesPanel.tsx', 
  "import { TwinCanvasObject } from '../data';", 
  "import type { TwinCanvasObject } from '../data';");

replaceInFile(componentsDir + 'SettingsModal.tsx', 
  "import { BuilderSnapshot, TwinBuilderProject } from '../data';", 
  "import type { BuilderSnapshot, TwinBuilderProject } from '../data';");

// Fix 2: 'label' does not exist in TwinCanvasObject
replaceInFile(componentsDir + 'PropertiesPanel.tsx', 
  "value={selected.label || selected.id}", 
  "value={selected.name || selected.id}");
replaceInFile(componentsDir + 'PropertiesPanel.tsx', 
  "updateObject(selected.id, { label: e.target.value })", 
  "updateObject(selected.id, { name: e.target.value })");

// Fix 3: Add BuilderSnapshot to data.ts
const dataTsPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/data.ts';
let dataTsContent = fs.readFileSync(dataTsPath, 'utf8');
if (!dataTsContent.includes('export interface BuilderSnapshot')) {
  dataTsContent = dataTsContent + `
export interface BuilderSnapshot {
  id: string;
  label: string;
  savedAt: string;
  version: number;
  activeFloorId: string;
  project: TwinBuilderProject;
}
`;
  fs.writeFileSync(dataTsPath, dataTsContent, 'utf8');
}

// Remove BuilderSnapshot from DigitalTwin.tsx
const dtTsxPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtTsxPath, 'utf8');
dtContent = dtContent.replace(
  /type BuilderSnapshot = \{[\s\S]*?\};\n/,
  ""
);

// Fix 4: Add imports to DigitalTwin.tsx
if (!dtContent.includes('import { DigitalTwinHeader }')) {
  const imports = `import { DigitalTwinHeader } from './components/DigitalTwinHeader';
import { EditorToolbar } from './components/EditorToolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { FloorNavigator } from './components/FloorNavigator';
import { SettingsModal } from './components/SettingsModal';
import type { BuilderSnapshot } from './data';
`;
  dtContent = dtContent.replace(
    "import { DigitalTwinService } from '../../../services/digital-twin.service';",
    "import { DigitalTwinService } from '../../../services/digital-twin.service';\n" + imports
  );
} else if (!dtContent.includes('import type { BuilderSnapshot }')) {
  dtContent = dtContent.replace(
    "import { SettingsModal } from './components/SettingsModal';",
    "import { SettingsModal } from './components/SettingsModal';\nimport type { BuilderSnapshot } from './data';"
  );
}
fs.writeFileSync(dtTsxPath, dtContent, 'utf8');

console.log('Fixes applied.');
