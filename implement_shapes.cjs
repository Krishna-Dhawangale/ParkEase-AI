const fs = require('fs');

// 1. Update data.ts
const dataPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/data.ts';
let dataContent = fs.readFileSync(dataPath, 'utf8');

if (!dataContent.includes('shape?: string;')) {
  dataContent = dataContent.replace(
    'text?: string;',
    `text?: string;\n  shape?: 'rectangle' | 'circle' | 'diamond' | 'hexagon' | 'custom';\n  customShapePath?: string;`
  );
  fs.writeFileSync(dataPath, dataContent, 'utf8');
  console.log('Updated data.ts');
}

// 2. Update PropertiesPanel.tsx
const ppPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/components/PropertiesPanel.tsx';
let ppContent = fs.readFileSync(ppPath, 'utf8');

if (!ppContent.includes('Shape')) {
  const shapeHtml = `
              {selected.type.includes('slot') && (
                <>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Status</label>
                    <select
                      value={selected.status}
                      onChange={(e) => updateObject(selected.id, { status: e.target.value as any })}
                      disabled={readOnly}
                      className="w-full rounded border border-slate-700/60 bg-slate-900/50 px-2 py-1.5 text-xs text-white outline-none focus:border-brand-500 focus:bg-slate-900 transition-colors disabled:opacity-50 shadow-inner appearance-none"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="reserved">Reserved</option>
                      <option value="disabled">Disabled</option>
                      <option value="ev">EV Charging</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Shape</label>
                    <select
                      value={selected.shape || 'rectangle'}
                      onChange={(e) => updateObject(selected.id, { shape: e.target.value as any })}
                      disabled={readOnly}
                      className="w-full rounded border border-slate-700/60 bg-slate-900/50 px-2 py-1.5 text-xs text-white outline-none focus:border-brand-500 focus:bg-slate-900 transition-colors disabled:opacity-50 shadow-inner appearance-none"
                    >
                      <option value="rectangle">Rectangle (Default)</option>
                      <option value="circle">Circle / Oval</option>
                      <option value="diamond">Diamond</option>
                      <option value="hexagon">Hexagon</option>
                      <option value="custom">Custom Shape</option>
                    </select>
                  </div>
                  {selected.shape === 'custom' && (
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Custom Path (CSS clip-path)</label>
                      <input
                        type="text"
                        placeholder="e.g. polygon(50% 0, 100% 100%, 0 100%)"
                        value={selected.customShapePath || ''}
                        onChange={(e) => updateObject(selected.id, { customShapePath: e.target.value })}
                        disabled={readOnly}
                        className="w-full rounded border border-slate-700/60 bg-slate-900/50 px-2 py-1.5 text-xs text-white outline-none focus:border-brand-500 focus:bg-slate-900 transition-colors disabled:opacity-50 shadow-inner font-mono text-[10px]"
                      />
                    </div>
                  )}
                </>
              )}
  `;

  // We need to replace the status block. Let's find it.
  const startIdx = ppContent.indexOf("{selected.type.includes('slot') && (");
  const endIdx = ppContent.indexOf(')}', ppContent.indexOf('<select', startIdx) + 400) + 2;
  
  if (startIdx !== -1) {
    // A bit risky, let's just do a specific replace.
    const toReplaceStr = `{selected.type.includes('slot') && (
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Status</label>
                  <select
                    value={selected.status}
                    onChange={(e) => updateObject(selected.id, { status: e.target.value as any })}
                    disabled={readOnly}
                    className="w-full rounded border border-slate-700/60 bg-slate-900/50 px-2 py-1.5 text-xs text-white outline-none focus:border-brand-500 focus:bg-slate-900 transition-colors disabled:opacity-50 shadow-inner appearance-none"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="disabled">Disabled</option>
                    <option value="ev">EV Charging</option>
                  </select>
                </div>
              )}`;
    
    ppContent = ppContent.replace(toReplaceStr, shapeHtml.trim());
    fs.writeFileSync(ppPath, ppContent, 'utf8');
    console.log('Updated PropertiesPanel.tsx');
  }
}

// 3. Update DigitalTwin.tsx
const dtTsxPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtTsxPath, 'utf8');

// Fix wheel zoom
const wheelStr = `if (e.ctrlKey || e.metaKey || previewMode === '3D' || e.shiftKey) {`;
if (dtContent.includes(wheelStr)) {
  dtContent = dtContent.replace(wheelStr, `// ALWAYS allow zoom on wheel\nif (true) {`);
  console.log('Fixed wheel zoom');
}

// Add shape styling
// We need to find `boxShadow: selectedItem` and add `borderRadius` and `clipPath`
const styleStr = `                  boxShadow: selectedItem
                    ? '0 0 0 2px rgba(37, 99, 235, 0.18), 0 22px 40px -24px rgba(15, 23, 42, 0.8), 0 0 42px rgba(59, 130, 246, 0.24)'
                    : locked
                      ? '0 12px 32px -24px rgba(15, 23, 42, 0.55)'
                      : '0 16px 34px -26px rgba(15, 23, 42, 0.75)',
                };`;

if (dtContent.includes(styleStr)) {
  const newStyleStr = `                  boxShadow: selectedItem
                    ? '0 0 0 2px rgba(37, 99, 235, 0.18), 0 22px 40px -24px rgba(15, 23, 42, 0.8), 0 0 42px rgba(59, 130, 246, 0.24)'
                    : locked
                      ? '0 12px 32px -24px rgba(15, 23, 42, 0.55)'
                      : '0 16px 34px -26px rgba(15, 23, 42, 0.75)',
                  borderRadius: item.shape === 'circle' ? '50%' : isParkingSlot && !item.shape ? '22px' : '0px',
                  clipPath: item.shape === 'diamond' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' :
                            item.shape === 'hexagon' ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' :
                            item.shape === 'custom' && item.customShapePath ? item.customShapePath : 'none',
                };`;
  dtContent = dtContent.replace(styleStr, newStyleStr);
  
  // also we must fix the conditional class that applies rounded-[22px]
  // `isParkingSlot ? 'rounded-[22px] text-slate-700' : 'rounded-xl',`
  const classStr = `isParkingSlot ? 'rounded-[22px] text-slate-700' : 'rounded-xl',`;
  const newClassStr = `isParkingSlot ? 'text-slate-700' : 'rounded-xl',`;
  dtContent = dtContent.replace(classStr, newClassStr);
  
  fs.writeFileSync(dtTsxPath, dtContent, 'utf8');
  console.log('Fixed rendering in DigitalTwin');
}
