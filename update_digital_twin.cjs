const fs = require('fs');

const path = 'd:/ParkEase AI/src/portals/client-admin/digitalTwin/DigitalTwin.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add deleteFloor logic
const addFloorFunc = `  const addFloor = () => {
    const name = window.prompt('Floor name', \`Floor \${project.floors.length}\`) || \`Floor \${project.floors.length}\`;
    const id = \`floor-\${Date.now()}\`;
    commit((draft) => ({ ...draft, floors: [...draft.floors, { id, name, level: draft.floors.length, objects: [] }] }), 'Floor added');
    setActiveFloorId(id);
    showToast('Floor added');
  };`;

const addAndDeleteFloorFuncs = `  const addFloor = () => {
    const name = window.prompt('Floor name', \`Floor \${project.floors.length}\`) || \`Floor \${project.floors.length}\`;
    const id = \`floor-\${Date.now()}\`;
    commit((draft) => ({ ...draft, floors: [...draft.floors, { id, name, level: draft.floors.length, objects: [] }] }), 'Floor added');
    setActiveFloorId(id);
    showToast('Floor added');
  };

  const deleteFloor = (id: string) => {
    commit((draft) => {
      const idx = draft.floors.findIndex(f => f.id === id);
      if (idx !== -1 && draft.floors.length > 1) {
        draft.floors.splice(idx, 1);
      }
    }, 'Floor deleted');
    if (activeFloorId === id) {
      const newActive = project.floors.find(f => f.id !== id);
      if (newActive) setActiveFloorId(newActive.id);
    }
    showToast('Floor deleted');
  };`;

content = content.replace(addFloorFunc, addAndDeleteFloorFuncs);

// 2. Pass deleteFloor to FloorNavigator
const oldFloorNav = `<FloorNavigator 
            project={project}
            activeFloorId={activeFloorId}
            setActiveFloorId={setActiveFloorId}
            addFloor={addFloor}
            layoutEditMode={layoutEditMode && !readOnly}
            readOnly={readOnly}
          />`;
const newFloorNav = `<FloorNavigator 
            project={project}
            activeFloorId={activeFloorId}
            setActiveFloorId={setActiveFloorId}
            addFloor={addFloor}
            deleteFloor={deleteFloor}
            layoutEditMode={layoutEditMode && !readOnly}
            readOnly={readOnly}
          />`;
content = content.replace(oldFloorNav, newFloorNav);
// Sometimes whitespace doesn't match perfectly, so let's do a more robust replace for FloorNavigator
if (!content.includes(newFloorNav)) {
  content = content.replace(
    /addFloor=\{addFloor\}/g,
    'addFloor={addFloor}\n            deleteFloor={deleteFloor}'
  );
}

// 3. Tighten floating zoom controls
content = content.replace(
  /className="absolute top-4 left-4 z-10 flex flex-col gap-2"/g,
  'className="absolute top-3 left-3 z-10 flex flex-col gap-1.5"'
);
content = content.replace(
  /className="px-3 py-1 text-xs font-bold text-slate-300 hover:text-white"/g,
  'className="px-2 py-0.5 text-[10px] font-bold text-slate-300 hover:text-white"'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Updated DigitalTwin.tsx');
