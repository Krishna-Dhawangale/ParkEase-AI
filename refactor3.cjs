const fs = require('fs');

const path = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// 1. Remove BuilderSnapshot safely
let inBuilderSnapshot = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('type BuilderSnapshot = {')) {
    inBuilderSnapshot = true;
    lines[i] = '';
    continue;
  }
  if (inBuilderSnapshot) {
    if (lines[i].includes('};')) {
      inBuilderSnapshot = false;
    }
    lines[i] = '';
  }
}
content = lines.join('\n');

// 2. Add imports
const imports = `
import { DigitalTwinHeader } from './components/DigitalTwinHeader';
import { EditorToolbar } from './components/EditorToolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { FloorNavigator } from './components/FloorNavigator';
import { SettingsModal } from './components/SettingsModal';
import type { BuilderSnapshot } from './data';
`;
if (!content.includes('import { DigitalTwinHeader }')) {
  content = content.replace("import { DigitalTwinService } from '../../../services/digital-twin.service';", "import { DigitalTwinService } from '../../../services/digital-twin.service';" + imports);
}

// 3. Add SettingsModal state
if (!content.includes('const [isSettingsOpen, setIsSettingsOpen] = useState(false);')) {
  content = content.replace(
    'const [validationOpen, setValidationOpen] = useState(true);',
    'const [validationOpen, setValidationOpen] = useState(true);\n  const [isSettingsOpen, setIsSettingsOpen] = useState(false);'
  );
}

// 4. Replace return block
const boardStart = content.indexOf('<div\n              ref={boardRef}');
const boardEndMatch = content.indexOf('</div>\n          </div>\n\n          <div className="rounded-lg border');
const canvasContent = content.substring(boardStart, boardEndMatch);

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
              if (e.target === e.currentTarget) {
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
              if (e.ctrlKey || e.metaKey || previewMode === '3D' || e.shiftKey) {
                const delta = e.deltaY > 0 ? -0.05 : 0.05;
                setZoom((z) => Math.max(0.2, Math.min(3, z + delta)));
              }
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
        />
      )}

      <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-xl opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ display: toast ? 'block' : 'none' }}>
        {toast}
      </div>
    </div>
  );
};
`;

const updatedLines = content.split('\n');
let returnIndex = -1;
for (let i = 600; i < updatedLines.length; i++) {
  if (updatedLines[i].includes('return (')) {
    if (updatedLines[i+1] && updatedLines[i+1].includes('className="flex h-[calc(100vh-6rem)] min-h-[760px]')) {
      returnIndex = i;
      break;
    }
  }
}

if (returnIndex !== -1) {
  const newLines = updatedLines.slice(0, returnIndex);
  newLines.push(newReturn);
  newLines.push('\nexport default DigitalTwin;');
  fs.writeFileSync(path, newLines.join('\n'), 'utf8');
  console.log('Successfully refactored DigitalTwin.tsx');
} else {
  console.error('Could not find return block boundaries by line.');
}
