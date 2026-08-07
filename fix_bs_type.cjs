const fs = require('fs');
const dtPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtPath, 'utf8');

dtContent = dtContent.replace(/type BuilderSnapshot = \{[\s\S]*?\};\r?\n/, '');

fs.writeFileSync(dtPath, dtContent, 'utf8');
console.log('Fixed BuilderSnapshot type');
