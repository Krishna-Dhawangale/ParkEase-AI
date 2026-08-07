const fs = require('fs');

const smPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/components/SettingsModal.tsx';
let smContent = fs.readFileSync(smPath, 'utf8');

const regexToRemove = /\s*<div className="mb-3 flex items-center gap-2">[\s\S]*?<h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Canvas Layout<\/h3>[\s\S]*?<\/div>\s*<div className="rounded-xl border border-slate-800 bg-slate-950\/50 p-4 space-y-4">[\s\S]*?<label className="block text-xs font-semibold text-slate-400 mb-1">Canvas Shape<\/label>[\s\S]*?<\/div>\s*\}\)\}\r?\n\s*<\/div>\r?\n\s*<\/div>/;

// Wait, the regex might be brittle. Let's just use string replacement on the exact block.
const blockToReplace = `                  <div className="mb-3 flex items-center gap-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Canvas Layout</h3>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Canvas Shape</label>
                      <select
                        value={project.canvas.shape || 'rectangle'}
                        onChange={(e) => updateCanvasSettings && updateCanvasSettings({ shape: e.target.value as any })}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none"
                      >
                        <option value="rectangle">Rectangle (Standard)</option>
                        <option value="circle">Circular</option>
                        <option value="diamond">Diamond</option>
                        <option value="hexagon">Hexagon</option>
                        <option value="custom">Custom Polygon</option>
                      </select>
                    </div>
                    {project.canvas.shape === 'custom' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">CSS clip-path Polygon</label>
                        <input
                          type="text"
                          placeholder="e.g. polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"
                          value={project.canvas.customShapePath || ''}
                          onChange={(e) => updateCanvasSettings && updateCanvasSettings({ customShapePath: e.target.value })}
                          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white font-mono outline-none"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Accepts any valid CSS clip-path polygon value.</p>
                      </div>
                    )}
                  </div>`;

if (smContent.includes(blockToReplace)) {
  smContent = smContent.replace(blockToReplace, '');
  fs.writeFileSync(smPath, smContent, 'utf8');
  console.log('Removed Canvas Shape from SettingsModal');
} else {
  // Let's use regex to find the start and remove it up to the end of the block
  const startIdx = smContent.indexOf('<h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Canvas Layout</h3>');
  if (startIdx !== -1) {
    const endIdx = smContent.indexOf('</p>\r\n                      </div>\r\n                    )}\r\n                  </div>', startIdx);
    if (endIdx !== -1) {
      // Find the start of the <div className="mb-3..."
      const blockStart = smContent.lastIndexOf('<div className="mb-3 flex items-center gap-2">', startIdx);
      const endBlock = endIdx + 89; // Length of the closing string
      smContent = smContent.substring(0, blockStart) + smContent.substring(endBlock);
      fs.writeFileSync(smPath, smContent, 'utf8');
      console.log('Removed Canvas Shape via index fallback');
    } else {
      console.log('Could not find end of Canvas Shape block');
    }
  } else {
    console.log('Canvas Shape not found in SettingsModal');
  }
}

const dtPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtPath, 'utf8');

const styleToReplace = `                  borderRadius: project.canvas.shape === 'circle' ? '50%' : '0px',
                  clipPath: project.canvas.shape === 'diamond' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' :
                            project.canvas.shape === 'hexagon' ? 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' :
                            project.canvas.shape === 'custom' && project.canvas.customShapePath ? project.canvas.customShapePath : 'none',`;

if (dtContent.includes(styleToReplace)) {
  dtContent = dtContent.replace(styleToReplace, '');
  fs.writeFileSync(dtPath, dtContent, 'utf8');
  console.log('Removed Canvas Shape styling from DigitalTwin');
} else {
  // Fallback for line ending differences
  const normalizedDt = dtContent.replace(/\\r\\n/g, '\\n');
  const normalizedStyle = styleToReplace.replace(/\\r\\n/g, '\\n');
  if (normalizedDt.includes(normalizedStyle)) {
     dtContent = dtContent.replace(new RegExp(styleToReplace.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&').replace(/\\r?\\n/g, '\\\\r?\\\\n')), '');
     fs.writeFileSync(dtPath, dtContent, 'utf8');
     console.log('Removed Canvas Shape styling with regex fallback');
  } else {
     console.log('Canvas shape styling not found in DigitalTwin');
  }
}
