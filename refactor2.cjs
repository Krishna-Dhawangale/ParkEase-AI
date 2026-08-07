const fs = require('fs');

const path = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add SettingsModal import if not present
if (!content.includes('import { SettingsModal }')) {
  content = content.replace(
    "import { FloorNavigator } from './components/FloorNavigator';",
    "import { FloorNavigator } from './components/FloorNavigator';\nimport { SettingsModal } from './components/SettingsModal';"
  );
}

// Add state for settings modal
if (!content.includes('const [isSettingsOpen, setIsSettingsOpen] = useState(false);')) {
  content = content.replace(
    'const [validationOpen, setValidationOpen] = useState(true);',
    'const [validationOpen, setValidationOpen] = useState(true);\n  const [isSettingsOpen, setIsSettingsOpen] = useState(false);'
  );
}

// Update the return block to pass the correct props to Header and render the Modal
// First, update showSettingsMenu in DigitalTwinHeader
content = content.replace(
  'showSettingsMenu={undefined} // TODO', 
  'showSettingsMenu={() => setIsSettingsOpen(true)}'
);
// In the current refactored code, we didn't add showSettingsMenu={undefined}, we just didn't pass it.
// Let's replace `setPreviewMode={setPreviewMode}` with `setPreviewMode={setPreviewMode}\n        showSettingsMenu={() => setIsSettingsOpen(true)}` inside DigitalTwinHeader props.
content = content.replace(
  'setPreviewMode={setPreviewMode}\n      />',
  'setPreviewMode={setPreviewMode}\n        showSettingsMenu={() => setIsSettingsOpen(true)}\n      />'
);

// Add the modal component before the toast
const modalContent = `
      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => setIsSettingsOpen(false)}
          versionHistory={versionHistory}
          restoreSnapshot={restoreSnapshot}
          layerNames={layerNames}
          hiddenLayers={hiddenLayers}
          setHiddenLayers={setHiddenLayers}
          lockedLayers={lockedLayers}
          setLockedLayers={setLockedLayers}
          validation={validation}
          generateParkingLayout={generateParkingLayout}
          triggerImport={() => fileInputRef.current?.click()}
          exportJson={exportJson}
          project={project}
        />
      )}
`;
content = content.replace(
  '<div className="fixed bottom-4 right-4 z-50 rounded-xl bg-emerald-600',
  modalContent + '\n      <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-emerald-600'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully added SettingsModal');
