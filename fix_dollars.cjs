const fs = require('fs');

const dtPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtPath, 'utf8');

if (dtContent.includes('$${')) {
  dtContent = dtContent.replace(/\$\$\{/g, '${');
  fs.writeFileSync(dtPath, dtContent, 'utf8');
  console.log('Fixed $$ in DigitalTwin.tsx');
} else {
  console.log('No $$ found in DigitalTwin.tsx');
}
