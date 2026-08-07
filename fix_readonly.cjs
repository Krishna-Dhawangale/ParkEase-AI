const fs = require('fs');

const path = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update DigitalTwin signature
content = content.replace(
  'const DigitalTwin = () => {',
  'const DigitalTwin = ({ readOnly = false }: { readOnly?: boolean }) => {'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed readOnly prop');
