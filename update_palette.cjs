const fs = require('fs');

const dataPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/data.ts';
let dataContent = fs.readFileSync(dataPath, 'utf8');

// We'll update the componentPalette interface in data.ts
//     type: TwinObjectType;
//     label: string;
//     layer: string;
//     fill: string;
//     stroke: string;
//     status?: TwinObjectStatus;
//     width: number;
//     height: number;
//  }[]
dataContent = dataContent.replace(
  `    height: number;\n  }[] = [`,
  `    height: number;\n    shape?: 'rectangle' | 'circle' | 'diamond' | 'hexagon' | 'custom';\n  }[] = [`
);

// Add some new shapes to the palette
const newItems = `    { type: 'parking-slot', label: 'Circular Slot', layer: 'Parking Slots', fill: '#dcfce7', stroke: '#35b779', status: 'available', width: 90, height: 90, shape: 'circle' },
    { type: 'parking-slot', label: 'Diamond Slot', layer: 'Parking Slots', fill: '#dbeafe', stroke: '#3b82f6', status: 'available', width: 110, height: 110, shape: 'diamond' },
    { type: 'parking-slot', label: 'Hexagon Slot', layer: 'Parking Slots', fill: '#fef3c7', stroke: '#d97706', status: 'available', width: 110, height: 110, shape: 'hexagon' },
    { type: 'entry-gate',`;
dataContent = dataContent.replace(`    { type: 'entry-gate',`, newItems);

fs.writeFileSync(dataPath, dataContent, 'utf8');
console.log('Updated data.ts componentPalette');
