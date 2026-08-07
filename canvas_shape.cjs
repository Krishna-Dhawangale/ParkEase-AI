const fs = require('fs');

// 1. data.ts
const dataPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/data.ts';
let dataContent = fs.readFileSync(dataPath, 'utf8');

dataContent = dataContent.replace(
  `  canvas: { width: number; height: number; gridSize: number };`,
  `  canvas: { width: number; height: number; gridSize: number; shape?: 'rectangle' | 'circle' | 'diamond' | 'hexagon' | 'custom'; customShapePath?: string; };`
);

fs.writeFileSync(dataPath, dataContent, 'utf8');
console.log('Updated data.ts');

// 2. SettingsModal.tsx
const smPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/components/SettingsModal.tsx';
let smContent = fs.readFileSync(smPath, 'utf8');

smContent = smContent.replace(
  `  project: TwinBuilderProject;\n}`,
  `  project: TwinBuilderProject;\n  updateCanvasSettings?: (updates: Partial<TwinBuilderProject['canvas']>) => void;\n}`
);

smContent = smContent.replace(
  `  project\n}) => {`,
  `  project,\n  updateCanvasSettings\n}) => {`
);

// We'll add the Canvas Settings section below Layers
const layersSection = `              </section>\n\n              {/* Data & Export */}`;
const canvasSection = `              </section>

              {/* Canvas Settings */}
              <section>
                <div className="mb-3 flex items-center gap-2">
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
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Width (px)</label>
                      <input
                        type="number"
                        value={project.canvas.width}
                        onChange={(e) => updateCanvasSettings && updateCanvasSettings({ width: Number(e.target.value) })}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Height (px)</label>
                      <input
                        type="number"
                        value={project.canvas.height}
                        onChange={(e) => updateCanvasSettings && updateCanvasSettings({ height: Number(e.target.value) })}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Data & Export */}`;

smContent = smContent.replace(layersSection, canvasSection);

fs.writeFileSync(smPath, smContent, 'utf8');
console.log('Updated SettingsModal.tsx');

// 3. DigitalTwin.tsx
const dtPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtPath, 'utf8');

// Add updateCanvasSettings function
const saveLayoutStr = `  const saveLayout = () => {`;
const updateCanvasFunc = `  const updateCanvasSettings = (updates: Partial<typeof project.canvas>) => {
    commit((draft) => {
      draft.canvas = { ...draft.canvas, ...updates };
    }, 'Canvas settings updated');
  };

  const saveLayout = () => {`;

if (dtContent.includes(saveLayoutStr) && !dtContent.includes('updateCanvasSettings')) {
  dtContent = dtContent.replace(saveLayoutStr, updateCanvasFunc);
}

// Pass it to SettingsModal
const smPropStr = `          project={project}\n        />`;
const newSmPropStr = `          project={project}\n          updateCanvasSettings={updateCanvasSettings}\n        />`;
dtContent = dtContent.replace(smPropStr, newSmPropStr);

// Apply styles to #twin-board
const twinBoardStr = `                width: project.canvas.width, 
                height: project.canvas.height,
                transformStyle: 'preserve-3d',
                transform: previewMode === '3D' ? 'rotateX(60deg) rotateZ(-30deg)' : 'none',
              }}`;
const newTwinBoardStr = `                width: project.canvas.width, 
                height: project.canvas.height,
                transformStyle: 'preserve-3d',
                transform: previewMode === '3D' ? 'rotateX(60deg) rotateZ(-30deg)' : 'none',
                borderRadius: project.canvas.shape === 'circle' ? '50%' : '0px',
                clipPath: project.canvas.shape === 'diamond' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' :
                          project.canvas.shape === 'hexagon' ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' :
                          project.canvas.shape === 'custom' && project.canvas.customShapePath ? project.canvas.customShapePath : 'none',
              }}`;
dtContent = dtContent.replace(twinBoardStr, newTwinBoardStr);

fs.writeFileSync(dtPath, dtContent, 'utf8');
console.log('Updated DigitalTwin.tsx');
