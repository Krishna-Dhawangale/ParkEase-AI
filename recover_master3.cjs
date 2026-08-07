const fs = require('fs');

let tempDtContent = fs.readFileSync('d:/ParkEase AI/temp_dt.tsx', 'utf8').replace(/\r\n/g, '\n');

const boardStart = tempDtContent.indexOf('<div\n              ref={boardRef}');
const boardEndMatchStr = '              </div>\n            </div>\n  \n            <div className="rounded-lg border';
const boardEndMatch = tempDtContent.indexOf(boardEndMatchStr);

console.log('boardStart:', boardStart);
console.log('boardEndMatch:', boardEndMatch);

if (boardEndMatch === -1 || boardStart === -1) {
  console.error("Could not find boundaries in temp_dt.tsx");
  process.exit(1);
}

let canvasContent = tempDtContent.substring(boardStart, boardEndMatch);

canvasContent = canvasContent.replace(
  'const isDraggingNode = !!dragState || isPanningCanvas || isOrbiting || !!rotationDrag;',
  'const isDraggingNode = !!dragState || isPanningCanvas || isOrbiting || !!rotationDrag || (selectedIds.length > 0 && !!layoutEditMode && !readOnly);'
);

canvasContent = canvasContent.replace(
  `                backgroundSize: \`\${project.canvas.gridSize}px \${project.canvas.gridSize}px\`,
                }}`,
  `                backgroundSize: \`\${project.canvas.gridSize}px \${project.canvas.gridSize}px\`,
                  borderRadius: project.canvas.shape === 'circle' ? '50%' : '0px',
                  clipPath: project.canvas.shape === 'diamond' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' :
                            project.canvas.shape === 'hexagon' ? 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' :
                            project.canvas.shape === 'custom' && project.canvas.customShapePath ? project.canvas.customShapePath : 'none',
                }}`
);

canvasContent = canvasContent.replace(
  `                    boxShadow: selectedItem\n                      ? '0 0 0 2px rgba(37, 99, 235, 0.18), 0 22px 40px -24px rgba(15, 23, 42, 0.8), 0 0 42px rgba(59, 130, 246, 0.24)'\n                      : locked\n                        ? '0 12px 32px -24px rgba(15, 23, 42, 0.55)'\n                        : '0 16px 34px -26px rgba(15, 23, 42, 0.75)',`,
  `                    boxShadow: selectedItem\n                      ? '0 0 0 2px rgba(37, 99, 235, 0.18), 0 22px 40px -24px rgba(15, 23, 42, 0.8), 0 0 42px rgba(59, 130, 246, 0.24)'\n                      : (locked && !layoutEditMode)\n                        ? '0 12px 32px -24px rgba(15, 23, 42, 0.55)'\n                        : '0 16px 34px -26px rgba(15, 23, 42, 0.75)',`
);


const dtPath = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let dtContent = fs.readFileSync(dtPath, 'utf8').replace(/\r\n/g, '\n');

const newReturn = `  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] min-h-[760px] bg-slate-950 overflow-hidden text-slate-200 font-sans">
      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={importJson} />
      
      <DigitalTwinHeader 
        project={project}
        mallName={currentTenant?.name || project.mallName}
        readOnly={readOnly}
        activeFloorId={activeFloorId}
        setActiveFloorId={setActiveFloorId}
        undo={undo}
        redo={redo}
        canUndo={history.length > 0}
        canRedo={future.length > 0}
        saveLayout={saveLayout}
        publishLayout={() => { saveLayout(); showToast('Digital Twin Published successfully! Your facility is now LIVE.'); }}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        showSettingsMenu={() => setIsSettingsOpen(true)}
        layoutEditMode={layoutEditMode && !readOnly}
        setLayoutEditMode={setLayoutEditMode}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <EditorToolbar 
          tool={tool}
          setTool={setTool}
          deleteSelected={deleteSelected}
          hasSelection={selectedIds.length > 0}
          layoutEditMode={layoutEditMode && !readOnly}
        />
        
        <div className="flex flex-col flex-1 relative bg-slate-950 overflow-hidden">
          {/* Zoom controls float */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
             <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-1 shadow-lg">
                <button onClick={() => setZoom((value) => Math.max(0.35, value - 0.1))} className="p-2 text-slate-400 hover:text-white transition-colors"><Minus className="w-4 h-4" /></button>
                <button onClick={() => setZoom(1)} className="px-3 py-1 text-xs font-bold text-slate-300 hover:text-white">{Math.round(zoom * 100)}%</button>
                <button onClick={() => setZoom((value) => Math.min(1.8, value + 0.1))} className="p-2 text-slate-400 hover:text-white transition-colors"><Plus className="w-4 h-4" /></button>
             </div>
             
             {!readOnly && layoutEditMode && (
               <div className="flex flex-col gap-1 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-1 shadow-lg">
                  <button onClick={() => setShowGrid((v) => !v)} className={cn("p-2 rounded-md transition-colors", showGrid ? "bg-brand-600/20 text-brand-400" : "text-slate-400 hover:text-white")} title="Toggle Grid"><Grid3X3 className="w-4 h-4" /></button>
                  <button onClick={() => setSnapToGrid((v) => !v)} className={cn("p-2 rounded-md transition-colors text-xs font-bold", snapToGrid ? "bg-brand-600/20 text-brand-400" : "text-slate-400 hover:text-white")} title="Toggle Snap">SNAP</button>
                  <button onClick={() => setPan({ x: 0, y: 0 })} className="p-2 text-slate-400 hover:text-white transition-colors" title="Center View"><Maximize2 className="w-4 h-4" /></button>
               </div>
             )}
          </div>

          <div 
            className="flex-1 overflow-auto outline-none"
            style={{ perspective: '1800px', perspectiveOrigin: '50% 20%' }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerDown={(e) => {
              if (e.button === 1 || e.target === e.currentTarget || (boardRef.current && e.target === boardRef.current)) {
                if (previewMode === '3D') {
                  setIsOrbiting(true);
                } else {
                  setIsPanningCanvas(true);
                }
                setCanvasDragStart({
                  x: e.clientX, y: e.clientY,
                  panX: pan.x, panY: pan.y,
                  orbitX: cameraOrbit.x, orbitZ: cameraOrbit.z
                });
                e.currentTarget.setPointerCapture(e.pointerId);
              }
            }}
            onWheel={(e) => {
              const delta = e.deltaY > 0 ? -0.05 : 0.05;
              setZoom((z) => Math.max(0.2, Math.min(3, z + delta)));
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={onCanvasDrop}
            onClick={() => setContextMenu(null)}
          >
            ${canvasContent.replace(/\$/g, '$$$$')}
          </div>

          <FloorNavigator 
            project={project}
            activeFloorId={activeFloorId}
            setActiveFloorId={setActiveFloorId}
            addFloor={addFloor}
            layoutEditMode={layoutEditMode && !readOnly}
            readOnly={readOnly}
          />
        </div>

        <PropertiesPanel 
          selected={selected}
          updateObject={updateObject}
          deleteSelected={deleteSelected}
          layoutEditMode={layoutEditMode && !readOnly}
          readOnly={readOnly}
        />
      </div>

      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => setIsSettingsOpen(false)}
          versionHistory={versionHistory}
          restoreSnapshot={restoreSnapshot}
          layerNames={layerNames}
          hiddenLayers={hiddenLayers}
          setHiddenLayers={setHiddenLayers}
          lockedLayers={lockedLayers}
          setLockedLayers={setLockedLayers}
          validation={validation}
          generateParkingLayout={generateParkingLayout}
          triggerImport={() => fileInputRef.current?.click()}
          exportJson={exportJson}
          project={project}
          updateCanvasSettings={updateCanvasSettings}
        />
      )}

      <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-xl opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ display: toast ? 'block' : 'none' }}>
        {toast}
      </div>
    </div>
  );
};`;

const updatedLines = dtContent.split('\n');
let returnIndex = -1;
for (let i = 0; i < updatedLines.length; i++) {
  if (updatedLines[i].includes('return (')) {
    if (updatedLines[i+1] && (updatedLines[i+1].includes('className="flex flex-col h-[calc(100vh-6rem)]') || updatedLines[i+1].includes('className="flex h-[calc(100vh-6rem)]'))) {
      returnIndex = i;
      break;
    }
  }
}

if (returnIndex !== -1) {
  const newLines = updatedLines.slice(0, returnIndex);
  let fixedHead = newLines.join('\n');
  
  const dropStr = `        const newObject: TwinCanvasObject = {\n          id: \`\${type}-\${Date.now()}\`,\n          type,\n          name: paletteItem?.label || type,\n          layer: paletteItem?.layer || 'Objects',\n          x,\n          y,\n          width: paletteItem?.width || 100,\n          height: paletteItem?.height || 100,\n          rotation: 0,\n          opacity: 1,\n          fill: paletteItem?.fill || '#fff',\n          stroke: paletteItem?.stroke || '#000',\n          status: paletteItem?.status,\n          zIndex: activeFloor.objects.length + 10,\n          locked: false\n        };`;

  const newDropStr = `        const newObject: TwinCanvasObject = {\n          id: \`\${type}-\${Date.now()}\`,\n          type,\n          name: paletteItem?.label || type,\n          layer: paletteItem?.layer || 'Objects',\n          x,\n          y,\n          width: paletteItem?.width || 100,\n          height: paletteItem?.height || 100,\n          shape: paletteItem?.shape,\n          rotation: 0,\n          opacity: 1,\n          fill: paletteItem?.fill || '#fff',\n          stroke: paletteItem?.stroke || '#000',\n          status: paletteItem?.status,\n          zIndex: activeFloor.objects.length + 10,\n          locked: false\n        };`;
  fixedHead = fixedHead.replace(dropStr, newDropStr);

  const saveLayoutStr = `  const saveLayout = () => {\n    commit((draft) => ({ ...draft, lastSaved: 'Saved just now' }), 'Layout saved');\n  };`;
  const updateCanvasFunc = `  const updateCanvasSettings = (updates: Partial<typeof project.canvas>) => {\n    commit((draft) => ({ ...draft, canvas: { ...draft.canvas, ...updates } }), 'Canvas settings updated');\n  };\n\n  const saveLayout = () => {\n    commit((draft) => ({ ...draft, lastSaved: 'Saved just now' }), 'Layout saved');\n    showToast('Layout saved successfully!');\n  };`;
  
  if (!fixedHead.includes('updateCanvasSettings')) {
    fixedHead = fixedHead.replace(saveLayoutStr, updateCanvasFunc);
  }

  const imports = `
import { DigitalTwinHeader } from './components/DigitalTwinHeader';
import { EditorToolbar } from './components/EditorToolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { FloorNavigator } from './components/FloorNavigator';
import { SettingsModal } from './components/SettingsModal';
`;
  if (!fixedHead.includes('import { DigitalTwinHeader }')) {
    fixedHead = fixedHead.replace("import { DigitalTwinService } from '../../../services/digital-twin.service';", "import { DigitalTwinService } from '../../../services/digital-twin.service';" + imports);
  }

  const bsMatch = fixedHead.indexOf('export interface BuilderSnapshot');
  if (bsMatch !== -1) {
    const endBs = fixedHead.indexOf('};', bsMatch) + 2;
    fixedHead = fixedHead.substring(0, bsMatch) + fixedHead.substring(endBs);
  }
  fixedHead = fixedHead.replace(/type BuilderSnapshot = \{[\s\S]*?\};\n/, '');

  fs.writeFileSync(dtPath, fixedHead + '\n' + newReturn + '\n\nexport default DigitalTwin;\n', 'utf8');
  console.log('Successfully recovered DigitalTwin.tsx');
} else {
  console.error('Could not find return block boundaries by line.');
}
