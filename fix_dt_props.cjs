const fs = require('fs');
const dtPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtPath, 'utf8');

// Fix props
dtContent = dtContent.replace(
  'const DigitalTwin = () => {',
  'const DigitalTwin = ({ readOnly = false }: { readOnly?: boolean }) => {'
);

// Fix BuilderSnapshot
// Remove local export interface BuilderSnapshot { ... } if it is there
const builderIndex = dtContent.indexOf('export interface BuilderSnapshot');
if (builderIndex !== -1) {
  const endIndex = dtContent.indexOf('};', builderIndex);
  dtContent = dtContent.substring(0, builderIndex) + dtContent.substring(endIndex + 2);
}

fs.writeFileSync(dtPath, dtContent, 'utf8');
