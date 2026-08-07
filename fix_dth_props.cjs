const fs = require('fs');

const dthPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/components/DigitalTwinHeader.tsx';
let dthContent = fs.readFileSync(dthPath, 'utf8');

dthContent = dthContent.replace(
  `  saving = false\n}) => {`,
  `  saving = false,\n  layoutEditMode,\n  setLayoutEditMode\n}) => {`
);

fs.writeFileSync(dthPath, dthContent, 'utf8');
console.log('Fixed destructured props');
