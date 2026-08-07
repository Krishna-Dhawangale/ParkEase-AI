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

const dtTsxPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtTsxPath, 'utf8');

// 1. Fix readOnly signature
dtContent = dtContent.replace(
  'const DigitalTwin = () => {',
  'const DigitalTwin = ({ readOnly = false }: { readOnly?: boolean }) => {'
);

// 2. Add imports if missing
if (!dtContent.includes('import { DigitalTwinHeader }')) {
  const imports = `import { DigitalTwinHeader } from './components/DigitalTwinHeader';
import { EditorToolbar } from './components/EditorToolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { FloorNavigator } from './components/FloorNavigator';
import { SettingsModal } from './components/SettingsModal';
`;
  dtContent = dtContent.replace(
    "import { DigitalTwinService } from '../../../services/digital-twin.service';",
    "import { DigitalTwinService } from '../../../services/digital-twin.service';\n" + imports
  );
}

// 3. Remove BuilderSnapshot safely
// Instead of a dangerous regex, let's just do a string replacement of exactly what it is.
const snapshotType = `type BuilderSnapshot = {
  id: string;
  label: string;
  savedAt: string;
  version: number;
  activeFloorId: string;
  project: TwinBuilderProject;
};`;
dtContent = dtContent.replace(snapshotType, '');

// Also add import for BuilderSnapshot
if (!dtContent.includes('import type { BuilderSnapshot }')) {
  dtContent = dtContent.replace(
    "import { SettingsModal } from './components/SettingsModal';",
    "import { SettingsModal } from './components/SettingsModal';\nimport type { BuilderSnapshot } from './data';"
  );
}

fs.writeFileSync(dtTsxPath, dtContent, 'utf8');
console.log('Fixed DigitalTwin.tsx');
