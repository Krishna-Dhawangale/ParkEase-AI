const fs = require('fs');

const dtTsxPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtTsxPath, 'utf8');

// Replace boxShadow block
const oldStr = `                  boxShadow: selectedItem\n                    ? '0 0 0 2px rgba(37, 99, 235, 0.18), 0 22px 40px -24px rgba(15, 23, 42, 0.8), 0 0 42px rgba(59, 130, 246, 0.24)'\n                    : locked\n                      ? '0 12px 32px -24px rgba(15, 23, 42, 0.55)'\n                      : '0 16px 34px -26px rgba(15, 23, 42, 0.75)',\n                };`;
const newStr = `                  boxShadow: selectedItem\n                    ? '0 0 0 2px rgba(37, 99, 235, 0.18), 0 22px 40px -24px rgba(15, 23, 42, 0.8), 0 0 42px rgba(59, 130, 246, 0.24)'\n                    : locked\n                      ? '0 12px 32px -24px rgba(15, 23, 42, 0.55)'\n                      : '0 16px 34px -26px rgba(15, 23, 42, 0.75)',\n                  borderRadius: item.shape === 'circle' ? '50%' : isParkingSlot && !item.shape ? '22px' : '0px',\n                  clipPath: item.shape === 'diamond' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' :\n                            item.shape === 'hexagon' ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' :\n                            item.shape === 'custom' && item.customShapePath ? item.customShapePath : 'none',\n                };`;

// Because of varying line endings (\r\n vs \n), we use a simpler replacement
const idx = dtContent.indexOf("boxShadow: selectedItem");
const endIdx = dtContent.indexOf("};", idx);
if (idx !== -1 && endIdx !== -1) {
  const originalBlock = dtContent.substring(idx, endIdx + 2);
  const newBlock = originalBlock.replace("};", "  borderRadius: item.shape === 'circle' ? '50%' : isParkingSlot && !item.shape ? '22px' : '0px',\n                  clipPath: item.shape === 'diamond' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' :\n                            item.shape === 'hexagon' ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' :\n                            item.shape === 'custom' && item.customShapePath ? item.customShapePath : 'none',\n                };");
  dtContent = dtContent.substring(0, idx) + newBlock + dtContent.substring(endIdx + 2);
  
  // also fix the class
  dtContent = dtContent.replace(/isParkingSlot \? 'rounded-\[22px\] text-slate-700' : 'rounded-xl',/g, "isParkingSlot ? 'text-slate-700' : 'rounded-xl',");

  fs.writeFileSync(dtTsxPath, dtContent, 'utf8');
  console.log('Fixed rendering in DigitalTwin.tsx');
}
