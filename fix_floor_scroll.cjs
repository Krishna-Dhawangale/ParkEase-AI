const fs = require('fs');

const path = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/components/FloorNavigator.tsx';
let content = fs.readFileSync(path, 'utf8');

// We need to add an onWheel handler to the outer div
const onWheelHandler = `
    <div 
      className="absolute bottom-6 left-6 z-10 flex items-center gap-3 overflow-x-auto overflow-y-hidden max-w-[calc(100vw-380px)] pb-2 custom-scrollbar"
      onWheel={(e) => {
        e.stopPropagation();
        e.currentTarget.scrollLeft += e.deltaY;
      }}
    >`;

content = content.replace(
  '<div className="absolute bottom-6 left-6 z-10 flex items-center gap-3 overflow-x-auto overflow-y-hidden max-w-[calc(100vw-380px)] pb-2 custom-scrollbar">',
  onWheelHandler
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed FloorNavigator wheel scroll.');
