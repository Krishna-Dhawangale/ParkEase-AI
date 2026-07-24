import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import {
  Accessibility,
  ArrowRight,
  Box,
  Camera,
  Car,
  ChevronDown,
  Copy,
  DoorOpen,
  Download,
  Edit3,
  Eye,
  EyeOff,
  Flame,
  Grid3X3,
  Hand,
  Layers,
  Lock,
  Maximize2,
  Minus,
  MousePointer2,
  Move,
  ParkingSquare,
  Plus,
  RotateCcw,
  RotateCw,
  Save,
  Settings,
  ShieldAlert,
  Sparkles,
  Trash2,
  Type,
  Unlock,
  Upload,
  Zap,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import {
  componentPalette,
  mockTwinBuilderProject,
  twinStatusConfig,
  type TwinBuilderProject,
  type TwinCanvasObject,
  type TwinObjectStatus,
  type TwinObjectType,
} from './data';
import { DIGITAL_TWIN_STORAGE_KEY } from './sync';

type ToolMode = 'select' | 'move' | 'wall' | 'road' | 'slot' | 'zone' | 'gate' | 'camera' | 'object' | 'text';
type PreviewMode = '2D' | '3D' | 'Simulation';
type BuilderSnapshot = {
  id: string;
  label: string;
  savedAt: string;
  version: number;
  activeFloorId: string;
  project: TwinBuilderProject;
};
type PersistedBuilderState = {
  project: TwinBuilderProject;
  activeFloorId: string;
  viewportRotation: number;
  snapshots: BuilderSnapshot[];
};
type DragState =
  | { kind: 'move'; id: string; startX: number; startY: number; originX: number; originY: number }
  | { kind: 'resize'; id: string; startX: number; startY: number; originW: number; originH: number }
  | null;
type RotationDragState = {
  startRotation: number;
  startAngle: number;
} | null;

const toolItems: { id: ToolMode; label: string; icon: React.ElementType; shortcut?: string }[] = [
  { id: 'select', label: 'Select', icon: MousePointer2, shortcut: 'V' },
  { id: 'move', label: 'Move', icon: Move, shortcut: 'M' },
  { id: 'wall', label: 'Draw Wall', icon: Box },
  { id: 'road', label: 'Road', icon: Hand },
  { id: 'slot', label: 'Add Slot', icon: ParkingSquare, shortcut: 'S' },
  { id: 'zone', label: 'Add Zone', icon: Grid3X3 },
  { id: 'gate', label: 'Add Gate', icon: DoorOpen },
  { id: 'camera', label: 'Add Camera', icon: Camera },
  { id: 'object', label: 'Add Object', icon: Sparkles },
  { id: 'text', label: 'Add Text', icon: Type, shortcut: 'T' },
];

const iconForType: Partial<Record<TwinObjectType, React.ElementType>> = {
  'parking-slot': ParkingSquare,
  'disabled-slot': Accessibility,
  'ev-slot': Zap,
  'vip-slot': Sparkles,
  'bike-slot': ParkingSquare,
  'entry-gate': DoorOpen,
  'exit-gate': DoorOpen,
  barrier: Minus,
  camera: Camera,
  lift: Box,
  stairs: Layers,
  'fire-extinguisher': Flame,
  text: Type,
  arrow: ArrowRight,
  wall: Box,
  road: Hand,
};

const layerNames = ['Parking Slots', 'Zones', 'Gates', 'Cameras', 'Objects', 'Texts', 'Walls', 'Roads'];

const iconButtonClass = 'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800';
const menuItemClass = 'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800';
const propertyInputClass = 'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white';
const propertyLabelClass = 'block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400';
const snapshotLimit = 12;

const snap = (value: number, size: number) => Math.round(value / size) * size;
const cloneProject = (project: TwinBuilderProject): TwinBuilderProject => JSON.parse(JSON.stringify(project));
const rotateDelta = (deltaX: number, deltaY: number, rotationDegrees: number) => {
  const radians = (-rotationDegrees * Math.PI) / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return {
    x: deltaX * cosine - deltaY * sine,
    y: deltaX * sine + deltaY * cosine,
  };
};

const createSnapshot = (project: TwinBuilderProject, activeFloorId: string, label: string): BuilderSnapshot => ({
  id: `${project.id}-${project.version}-${Date.now()}`,
  label,
  savedAt: new Date().toISOString(),
  version: project.version,
  activeFloorId,
  project: cloneProject(project),
});

const loadBuilderState = (): PersistedBuilderState => {
  if (typeof window === 'undefined') {
    return { project: cloneProject(mockTwinBuilderProject), activeFloorId: mockTwinBuilderProject.activeFloorId, viewportRotation: 0, snapshots: [] };
  }

  try {
    const raw = window.localStorage.getItem(DIGITAL_TWIN_STORAGE_KEY);
    if (!raw) {
      return { project: cloneProject(mockTwinBuilderProject), activeFloorId: mockTwinBuilderProject.activeFloorId, viewportRotation: 0, snapshots: [] };
    }

    const parsed = JSON.parse(raw) as Partial<PersistedBuilderState> & { project?: TwinBuilderProject };
    if (!parsed.project?.floors?.length) {
      return { project: cloneProject(mockTwinBuilderProject), activeFloorId: mockTwinBuilderProject.activeFloorId, viewportRotation: 0, snapshots: [] };
    }

    const project = cloneProject(parsed.project);
    const activeFloorId = parsed.activeFloorId ?? project.activeFloorId ?? project.floors[0].id;
    const viewportRotation = Number.isFinite(parsed.viewportRotation ?? 0) ? Number(parsed.viewportRotation ?? 0) : 0;
    const snapshots = Array.isArray(parsed.snapshots)
      ? parsed.snapshots
          .filter((snapshot): snapshot is BuilderSnapshot => Boolean(snapshot && snapshot.project && snapshot.activeFloorId))
          .slice(0, snapshotLimit)
      : [];

    return { project, activeFloorId, viewportRotation, snapshots };
  } catch {
    return { project: cloneProject(mockTwinBuilderProject), activeFloorId: mockTwinBuilderProject.activeFloorId, viewportRotation: 0, snapshots: [] };
  }
};

const DigitalTwin = () => {
  const [initialState] = useState(() => loadBuilderState());
  const [project, setProject] = useState<TwinBuilderProject>(() => cloneProject(initialState.project));
  const [activeFloorId, setActiveFloorId] = useState(initialState.activeFloorId);
  const [layoutRotation, setLayoutRotation] = useState(initialState.viewportRotation);
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const floor = initialState.project.floors.find((item) => item.id === initialState.activeFloorId) ?? initialState.project.floors[0];
    return floor?.objects[0]?.id ? [floor.objects[0].id] : [];
  });
  const [tool, setTool] = useState<ToolMode>('select');
  const [zoom, setZoom] = useState(0.86);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [layoutEditMode, setLayoutEditMode] = useState(true);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('2D');
  const [hiddenLayers, setHiddenLayers] = useState<string[]>([]);
  const [lockedLayers, setLockedLayers] = useState<string[]>([]);
  const [history, setHistory] = useState<TwinBuilderProject[]>([]);
  const [future, setFuture] = useState<TwinBuilderProject[]>([]);
  const [clipboard, setClipboard] = useState<TwinCanvasObject[]>([]);
  const [dragState, setDragState] = useState<DragState>(null);
  const [rotationDrag, setRotationDrag] = useState<RotationDragState>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; id: string } | null>(null);
  const [toast, setToast] = useState('Autosave ready');
  const [validationOpen, setValidationOpen] = useState(true);
  const [versionHistory, setVersionHistory] = useState<BuilderSnapshot[]>(() => initialState.snapshots);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const activeFloor = project.floors.find((floor) => floor.id === activeFloorId) ?? project.floors[0];
  const selectedObjects = activeFloor.objects.filter((item) => selectedIds.includes(item.id));
  const selected = selectedObjects[0] ?? null;

  const stats = useMemo(() => {
    const slots = activeFloor.objects.filter((item) => item.layer === 'Parking Slots' || item.type.includes('slot'));
    const count = (status: TwinObjectStatus) => slots.filter((item) => item.status === status).length;
    return {
      total: slots.length,
      available: count('available'),
      occupied: count('occupied'),
      reserved: count('reserved'),
      vip: count('vip'),
      ev: count('ev'),
    };
  }, [activeFloor.objects]);

  const validation = useMemo(() => {
    const objects = activeFloor.objects.filter((item) => !item.hidden);
    const warnings = [];
    if (!objects.some((item) => item.type === 'entry-gate')) warnings.push('Entry gate is missing.');
    if (!objects.some((item) => item.type === 'exit-gate')) warnings.push('Exit gate is missing.');
    if (!objects.some((item) => item.type === 'fire-exit')) warnings.push('Emergency exit is not configured.');
    if (objects.filter((item) => item.type === 'camera').length < 3) warnings.push('Camera coverage is below recommended coverage.');
    if (!objects.some((item) => item.status === 'disabled')) warnings.push('Disabled parking allocation is missing.');
    const roads = objects.filter((item) => item.type === 'road');
    if (roads.some((item) => Math.min(item.width, item.height) < 72)) warnings.push('A road segment is narrower than recommended.');
    return warnings;
  }, [activeFloor.objects]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast('Autosaved just now'), 1800);
  };

  const getBoardCenter = () => {
    const board = boardRef.current;
    if (!board) return null;
    const rect = board.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  const getAngleFromCenter = (clientX: number, clientY: number) => {
    const center = getBoardCenter();
    if (!center) return 0;
    return (Math.atan2(clientY - center.y, clientX - center.x) * 180) / Math.PI;
  };

  const getSelectedIdsForFloor = useCallback((floorObjects: TwinCanvasObject[]) => {
    const firstObject = floorObjects.find((item) => item.id);
    return firstObject ? [firstObject.id] : [];
  }, []);

  const commit = useCallback((updater: (draft: TwinBuilderProject) => TwinBuilderProject, message?: string) => {
    setProject((current) => {
      setHistory((items) => [...items.slice(-24), cloneProject(current)]);
      setFuture([]);
      const next = updater(cloneProject(current));
      const committed = { ...next, lastSaved: 'Autosaved just now', version: next.version + 1 };
      if (message) {
        setVersionHistory((items) => [createSnapshot(committed, activeFloorId, message), ...items].slice(0, snapshotLimit));
      }
      return committed;
    });
    if (message) showToast(message);
  }, [activeFloorId]);

  const updateActiveFloor = useCallback((mapper: (floorObjects: TwinCanvasObject[]) => TwinCanvasObject[]) => {
    commit((draft) => ({
      ...draft,
      floors: draft.floors.map((floor) => floor.id === activeFloorId ? { ...floor, objects: mapper(floor.objects) } : floor),
    }));
  }, [activeFloorId, commit]);

  const updateObject = useCallback((id: string, updates: Partial<TwinCanvasObject>, message?: string) => {
    commit((draft) => ({
      ...draft,
      floors: draft.floors.map((floor) => floor.id === activeFloorId ? {
        ...floor,
        objects: floor.objects.map((item) => item.id === id ? { ...item, ...updates } : item),
      } : floor),
    }), message);
  }, [activeFloorId, commit]);

  const addObject = useCallback((type: TwinObjectType, x = 460, y = 260) => {
    const template = componentPalette.find((item) => item.type === type) ?? componentPalette[0];
    const id = `${type}-${Date.now()}`;
    const laneObjects: TwinCanvasObject[] = [];
    if (type === 'entry-gate') {
      laneObjects.push(
        { id: `${id}-lane`, type: 'road', name: 'Generated Entry Lane', layer: 'Roads', x: x - 18, y: y - 96, width: 150, height: 82, rotation: 0, opacity: 1, fill: '#e5e7eb', stroke: '#cbd5e1', text: 'ENTRY LANE', zIndex: 2 },
        { id: `${id}-barrier`, type: 'barrier', name: 'Generated Entry Barrier', layer: 'Gates', x: x - 6, y: y - 46, width: 120, height: 14, rotation: 0, opacity: 1, fill: '#fef3c7', stroke: '#111827', zIndex: 3 },
      );
    }
    if (type === 'exit-gate') {
      laneObjects.push(
        { id: `${id}-lane`, type: 'road', name: 'Generated Exit Lane', layer: 'Roads', x: x - 18, y: y - 96, width: 150, height: 82, rotation: 0, opacity: 1, fill: '#e5e7eb', stroke: '#cbd5e1', text: 'EXIT LANE', zIndex: 2 },
        { id: `${id}-barrier`, type: 'barrier', name: 'Generated Exit Barrier', layer: 'Gates', x: x - 6, y: y - 46, width: 120, height: 14, rotation: 0, opacity: 1, fill: '#fef3c7', stroke: '#111827', zIndex: 3 },
      );
    }
    const next: TwinCanvasObject = {
      id,
      type,
      name: template.label,
      layer: template.layer,
      x: snapToGrid ? snap(x, project.canvas.gridSize) : x,
      y: snapToGrid ? snap(y, project.canvas.gridSize) : y,
      width: template.width,
      height: template.height,
      rotation: 0,
      opacity: 1,
      fill: template.fill,
      stroke: template.stroke,
      status: template.status,
      price: template.status ? 90 : undefined,
      sensorId: template.status ? `SEN-${Math.floor(Math.random() * 9000) + 1000}` : undefined,
      cameraId: type === 'camera' ? `CAM-${Math.floor(Math.random() * 900) + 100}` : undefined,
      text:
        type === 'text'
          ? 'Text label'
          : type === 'vip-slot'
            ? 'VIP'
            : type === 'road'
              ? 'ROAD'
              : type === 'walkway'
                ? 'WALKWAY'
                : type === 'arrow'
                  ? 'ARROW'
                  : template.label.includes('Gate')
                    ? template.label.replace(' Gate', '').toUpperCase()
                    : undefined,
      zIndex: activeFloor.objects.length + 10,
    };
    updateActiveFloor((objects) => [...objects, ...laneObjects, next]);
    setSelectedIds([id]);
    showToast(type === 'entry-gate' || type === 'exit-gate' ? `${template.label} added with generated lane` : `${template.label} added`);
  }, [activeFloor.objects.length, project.canvas.gridSize, snapToGrid, updateActiveFloor]);

  const generateParkingLayout = () => {
    const rows = Number(window.prompt('Rows?', '3') ?? 3);
    const columns = Number(window.prompt('Columns?', '8') ?? 8);
    const vipEvery = 9;
    const generated: TwinCanvasObject[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const index = r * columns + c;
        const status: TwinObjectStatus = index % vipEvery === 0 ? 'vip' : index % 7 === 0 ? 'ev' : index % 5 === 0 ? 'reserved' : 'available';
        const palette = componentPalette.find((item) => item.status === status) ?? componentPalette[0];
        generated.push({
          id: `auto-${Date.now()}-${index}`,
          type: palette.type,
          name: `Generated ${r + 1}-${c + 1}`,
          layer: 'Parking Slots',
          x: 150 + c * 82,
          y: 120 + r * 140,
          width: 64,
          height: 112,
          rotation: 0,
          opacity: 1,
          fill: palette.fill,
          stroke: palette.stroke,
          status,
          price: status === 'vip' ? 180 : 90,
          sensorId: `AUTO-${index}`,
          zIndex: 8,
        });
      }
    }
    commit((draft) => ({
      ...draft,
      floors: draft.floors.map((floor) => floor.id === activeFloorId ? {
        ...floor,
        objects: [...floor.objects.filter((item) => !item.id.startsWith('auto-')), ...generated],
      } : floor),
    }), `Generated ${generated.length} slots`);
  };

  const addFloor = () => {
    const name = window.prompt('Floor name', `Floor ${project.floors.length}`) || `Floor ${project.floors.length}`;
    const id = `floor-${Date.now()}`;
    commit((draft) => ({ ...draft, floors: [...draft.floors, { id, name, level: draft.floors.length, objects: [] }] }), 'Floor added');
    setActiveFloorId(id);
  };

  const renameFloor = () => {
    const nextName = window.prompt('Rename floor', activeFloor.name);
    if (!nextName) return;
    commit((draft) => ({ ...draft, floors: draft.floors.map((floor) => floor.id === activeFloorId ? { ...floor, name: nextName } : floor) }), 'Floor renamed');
  };

  const duplicateFloor = () => {
    const id = `floor-${Date.now()}`;
    commit((draft) => ({
      ...draft,
      activeFloorId: id,
      floors: [...draft.floors, { ...cloneProject({ ...draft, floors: [activeFloor] }).floors[0], id, name: `${activeFloor.name} Copy`, objects: activeFloor.objects.map((item) => ({ ...item, id: `${id}-${item.id}` })) }],
    }), 'Floor duplicated');
    setActiveFloorId(id);
  };

  const deleteFloor = () => {
    if (project.floors.length <= 1) return showToast('At least one floor is required');
    const nextFloorId = project.floors.find((floor) => floor.id !== activeFloorId)?.id ?? project.floors[0].id;
    commit((draft) => ({ ...draft, activeFloorId: nextFloorId, floors: draft.floors.filter((floor) => floor.id !== activeFloorId) }), 'Floor deleted');
    setActiveFloorId(nextFloorId);
  };

  const deleteSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    updateActiveFloor((objects) => objects.filter((item) => !selectedIds.includes(item.id) || item.locked || lockedLayers.includes(item.layer)));
    setSelectedIds([]);
    showToast('Selection deleted');
  }, [lockedLayers, selectedIds, updateActiveFloor]);

  const duplicateSelected = useCallback(() => {
    if (selectedObjects.length === 0) return;
    const clones = selectedObjects.map((item) => ({ ...item, id: `${item.id}-copy-${Date.now()}`, name: `${item.name} Copy`, x: item.x + 28, y: item.y + 28, zIndex: item.zIndex + 1 }));
    updateActiveFloor((objects) => [...objects, ...clones]);
    setSelectedIds(clones.map((item) => item.id));
    showToast('Selection duplicated');
  }, [selectedObjects, updateActiveFloor]);

  const copySelected = useCallback(() => {
    setClipboard(selectedObjects.map((item) => ({ ...item })));
    showToast(`${selectedObjects.length} object copied`);
  }, [selectedObjects]);

  const pasteClipboard = useCallback(() => {
    if (clipboard.length === 0) return;
    const pasted = clipboard.map((item) => ({ ...item, id: `${item.id}-paste-${Date.now()}`, x: item.x + 36, y: item.y + 36, name: `${item.name} Copy`, zIndex: item.zIndex + 2 }));
    updateActiveFloor((objects) => [...objects, ...pasted]);
    setSelectedIds(pasted.map((item) => item.id));
    showToast('Pasted from clipboard');
  }, [clipboard, updateActiveFloor]);

  const undo = useCallback(() => {
    setHistory((items) => {
      if (items.length === 0) return items;
      const previous = items[items.length - 1];
      setFuture((futureItems) => [cloneProject(project), ...futureItems]);
      setProject(previous);
      return items.slice(0, -1);
    });
  }, [project]);

  const redo = useCallback(() => {
    setFuture((items) => {
      if (items.length === 0) return items;
      const next = items[0];
      setHistory((historyItems) => [...historyItems, cloneProject(project)]);
      setProject(next);
      return items.slice(1);
    });
  }, [project]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); undo(); }
      if ((event.ctrlKey || event.metaKey) && (event.key.toLowerCase() === 'y' || (event.shiftKey && event.key.toLowerCase() === 'z'))) { event.preventDefault(); redo(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') { event.preventDefault(); copySelected(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v') { event.preventDefault(); pasteClipboard(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd') { event.preventDefault(); duplicateSelected(); }
      if (event.key === 'Delete' || event.key === 'Backspace') deleteSelected();
      if (event.key === 'Escape') { setSelectedIds([]); setContextMenu(null); }
      if (event.key.toLowerCase() === 'v') setTool('select');
      if (event.key.toLowerCase() === 'm') setTool('move');
      if (event.key.toLowerCase() === 's') setTool('slot');
      if (event.key.toLowerCase() === 't') setTool('text');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [copySelected, deleteSelected, duplicateSelected, pasteClipboard, redo, undo]);

  useEffect(() => {
    const timer = window.setTimeout(() => setToast('Autosaved just now'), 1200);
    return () => window.clearTimeout(timer);
  }, [project]);

  useEffect(() => {
    if (project.floors.some((floor) => floor.id === activeFloorId)) return;
    setActiveFloorId(project.floors[0]?.id ?? '');
  }, [activeFloorId, project.floors]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const payload: PersistedBuilderState = {
          project,
          activeFloorId,
          viewportRotation: layoutRotation,
          snapshots: versionHistory,
        };
        window.localStorage.setItem(DIGITAL_TWIN_STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // Ignore storage write failures and keep the in-memory session usable.
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [activeFloorId, layoutRotation, project, versionHistory]);

  const restoreSnapshot = useCallback((snapshot: BuilderSnapshot) => {
    const restoredProject = cloneProject(snapshot.project);
    const restoredFloor = restoredProject.floors.find((floor) => floor.id === snapshot.activeFloorId) ?? restoredProject.floors[0];
    setProject(restoredProject);
    setActiveFloorId(snapshot.activeFloorId);
    setSelectedIds(getSelectedIdsForFloor(restoredFloor?.objects ?? []));
    setHistory([]);
    setFuture([]);
    showToast(`Restored v${snapshot.version}`);
  }, [getSelectedIdsForFloor]);

  const handlePointerMove = (event: React.PointerEvent) => {
    if (rotationDrag) {
      const nextAngle = getAngleFromCenter(event.clientX, event.clientY);
      const delta = nextAngle - rotationDrag.startAngle;
      setLayoutRotation((rotationDrag.startRotation + delta + 360) % 360);
      return;
    }
    if (!dragState) return;
    const deltaX = (event.clientX - dragState.startX) / zoom;
    const deltaY = (event.clientY - dragState.startY) / zoom;
    const rotatedDelta = layoutRotation === 0 ? { x: deltaX, y: deltaY } : rotateDelta(deltaX, deltaY, layoutRotation);
    if (dragState.kind === 'move') {
      const nextX = dragState.originX + rotatedDelta.x;
      const nextY = dragState.originY + rotatedDelta.y;
      updateObject(dragState.id, {
        x: snapToGrid ? snap(nextX, project.canvas.gridSize) : Math.round(nextX),
        y: snapToGrid ? snap(nextY, project.canvas.gridSize) : Math.round(nextY),
      });
    }
    if (dragState.kind === 'resize') {
      updateObject(dragState.id, {
        width: Math.max(24, Math.round(dragState.originW + rotatedDelta.x)),
        height: Math.max(24, Math.round(dragState.originH + rotatedDelta.y)),
      });
    }
  };

  const handlePointerUp = () => {
    setDragState(null);
    setRotationDrag(null);
  };

  const onCanvasDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/parkease-component') as TwinObjectType;
    if (!type) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const rawX = (event.clientX - rect.left) / zoom;
    const rawY = (event.clientY - rect.top) / zoom;
    const centerX = project.canvas.width / 2;
    const centerY = project.canvas.height / 2;
    const rotatedPoint = layoutRotation === 0 ? { x: rawX, y: rawY } : rotateDelta(rawX - centerX, rawY - centerY, layoutRotation);
    addObject(type, centerX + rotatedPoint.x, centerY + rotatedPoint.y);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ ...project, activeFloorId }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.mallName.replace(/\s+/g, '-')}-digital-twin.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Layout JSON exported');
  };

  const importJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as TwinBuilderProject & { activeFloorId?: string };
        const nextProject = cloneProject(parsed);
        const nextActiveFloorId = parsed.activeFloorId ?? parsed.floors[0].id;
        const nextFloor = nextProject.floors.find((floor) => floor.id === nextActiveFloorId) ?? nextProject.floors[0];
        setProject(nextProject);
        setActiveFloorId(nextActiveFloorId);
        setSelectedIds(getSelectedIdsForFloor(nextFloor?.objects ?? []));
        setVersionHistory([createSnapshot(nextProject, nextActiveFloorId, 'Imported layout')]);
        showToast('Layout JSON imported');
      } catch {
        showToast('Invalid layout JSON');
      }
    };
    reader.readAsText(file);
  };

  const saveLayout = () => {
    commit((draft) => ({ ...draft, lastSaved: 'Saved just now' }), 'Layout saved');
  };

  const visibleObjects = activeFloor.objects
    .filter((item) => !hiddenLayers.includes(item.layer) && !item.hidden)
    .sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="flex h-[calc(100vh-6rem)] min-h-[760px] flex-col gap-3 overflow-hidden text-slate-900 dark:text-white">
      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={importJson} />
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-white/90 pb-3 dark:border-slate-800 dark:bg-slate-950/90 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">Digital Twin Builder</h1>
            <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs font-bold text-slate-500 dark:border-slate-700">v{project.version}</span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{project.mallName} · {project.parkingName} · {project.lastSaved}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={project.mallName} onChange={(event) => setProject((current) => ({ ...current, mallName: event.target.value }))} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold outline-none dark:border-slate-700 dark:bg-slate-900">
            <option>Mall of Delhi</option>
            <option>Airport Terminal Parking</option>
            <option>City Hospital Campus</option>
          </select>
          <select value={activeFloorId} onChange={(event) => setActiveFloorId(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold outline-none dark:border-slate-700 dark:bg-slate-900">
            {project.floors.map((floor) => <option key={floor.id} value={floor.id}>{floor.name}</option>)}
          </select>
          <button
            onClick={() => setLayoutEditMode((value) => !value)}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition',
              layoutEditMode
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
            )}
            title={layoutEditMode ? 'Finish editing layout' : 'Edit layout'}
          >
            <Edit3 className="h-4 w-4" />
            {layoutEditMode ? 'Editing Layout' : 'Edit Layout'}
          </button>
          <button onClick={undo} disabled={history.length === 0} className={iconButtonClass}><RotateCcw className="h-4 w-4" /></button>
          <button onClick={redo} disabled={future.length === 0} className={iconButtonClass}><RotateCw className="h-4 w-4" /></button>
          <button onClick={() => setPreviewMode(previewMode === '2D' ? '3D' : previewMode === '3D' ? 'Simulation' : '2D')} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">{previewMode}</button>
          <button onClick={saveLayout} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"><Save className="h-4 w-4" /> Save Layout</button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-3 overflow-hidden">
        <aside className="hidden w-64 shrink-0 space-y-3 overflow-y-auto lg:block">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold">Parking Project</h2>
              <button onClick={generateParkingLayout} className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">Generate</button>
            </div>
            <div className="space-y-2 text-xs">
              <input value={project.mallName} onChange={(event) => setProject((current) => ({ ...current, mallName: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
              <input value={project.parkingName} onChange={(event) => setProject((current) => ({ ...current, parkingName: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
              <input value={project.location} onChange={(event) => setProject((current) => ({ ...current, location: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold">Version History</h2>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{versionHistory.length} saved</span>
            </div>
            <div className="space-y-2">
              {versionHistory.slice(0, 4).map((snapshot) => (
                <button
                  key={snapshot.id}
                  onClick={() => restoreSnapshot(snapshot)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-left transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-800 dark:hover:border-blue-500 dark:hover:bg-blue-500/10"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Version {snapshot.version}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{snapshot.label}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    {new Date(snapshot.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </button>
              ))}
              {versionHistory.length === 0 && (
                <div className="rounded-xl bg-slate-50 p-3 text-xs font-medium text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  Auto-saved versions will appear here.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold">Floors</h2>
              <button onClick={addFloor} className="text-xs font-bold text-blue-600">+ Add Floor</button>
            </div>
            <div className="space-y-1">
              {project.floors.map((floor) => (
                <button key={floor.id} onClick={() => setActiveFloorId(floor.id)} className={cn('flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-slate-900', activeFloorId === floor.id && 'bg-blue-50 font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300')}>
                  <span className="flex items-center gap-2"><Layers className="h-4 w-4" /> {floor.name}</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button onClick={renameFloor} className="rounded-lg border border-slate-200 py-1.5 text-xs font-bold dark:border-slate-700">Rename</button>
              <button onClick={duplicateFloor} className="rounded-lg border border-slate-200 py-1.5 text-xs font-bold dark:border-slate-700">Copy</button>
              <button onClick={deleteFloor} className="rounded-lg border border-rose-200 py-1.5 text-xs font-bold text-rose-600 dark:border-rose-500/30">Delete</button>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="mb-3 text-sm font-bold">Layers</h2>
            <div className="space-y-1">
              {layerNames.map((layer) => {
                const hidden = hiddenLayers.includes(layer);
                const locked = lockedLayers.includes(layer);
                return (
                  <div key={layer} className="flex items-center justify-between rounded-xl px-2 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-900">
                    <span>{layer}</span>
                    <div className="flex gap-1">
                      <button onClick={() => setHiddenLayers((items) => hidden ? items.filter((item) => item !== layer) : [...items, layer])} className="p-1 text-slate-500">{hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                      <button onClick={() => setLockedLayers((items) => locked ? items.filter((item) => item !== layer) : [...items, layer])} className="p-1 text-slate-500">{locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden">
          <div className="flex items-center justify-between overflow-x-auto rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-1">
              {toolItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => setTool(item.id)} title={item.label} className={cn('flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900', tool === item.id && 'bg-blue-600 text-white hover:bg-blue-600')}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="ml-3 flex items-center gap-1 border-l border-slate-200 pl-3 dark:border-slate-800">
              <button onClick={() => setZoom((value) => Math.max(0.35, value - 0.1))} className={iconButtonClass}><Minus className="h-4 w-4" /></button>
              <button onClick={() => setZoom(0.86)} className="rounded-lg px-2 py-2 text-xs font-bold">{Math.round(zoom * 100)}%</button>
              <button onClick={() => setZoom((value) => Math.min(1.8, value + 0.1))} className={iconButtonClass}><Plus className="h-4 w-4" /></button>
              <button onClick={() => setShowGrid((value) => !value)} className={cn(iconButtonClass, showGrid && 'bg-blue-50 text-blue-600 dark:bg-blue-500/10')}><Grid3X3 className="h-4 w-4" /></button>
              <button onClick={() => setSnapToGrid((value) => !value)} className={cn('rounded-lg px-3 py-2 text-xs font-bold', snapToGrid ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10' : 'text-slate-500')}>Snap</button>
              <button onClick={() => setPan({ x: 0, y: 0 })} className={iconButtonClass}><Maximize2 className="h-4 w-4" /></button>
            </div>
            <div className="ml-3 flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-800">
              <div
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                title="Drag the compass handle on the canvas to rotate"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow">N</span>
                <span>{Math.round(layoutRotation)}°</span>
              </div>
              <button onClick={() => setLayoutRotation(0)} className={iconButtonClass} title="Reset north">Reset</button>
            </div>
          </div>

          <div
            className="relative min-h-0 flex-1 overflow-auto rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,.10),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,.08),transparent_20%),linear-gradient(180deg,#eff6ff_0%,#dbeafe_22%,#e2e8f0_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_40px_120px_-55px_rgba(15,23,42,0.75)] dark:border-slate-800 dark:bg-[radial-gradient(circle_at_20%_20%,rgba(96,165,250,.14),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(52,211,153,.10),transparent_20%),linear-gradient(180deg,#0f172a_0%,#111827_60%,#020617_100%)]"
            style={{ perspective: '1800px', perspectiveOrigin: '50% 20%' }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDragOver={(event) => event.preventDefault()}
            onDrop={onCanvasDrop}
            onClick={() => setContextMenu(null)}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.24)_0%,rgba(255,255,255,.04)_35%,transparent_60%)] opacity-70" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(15,23,42,.22)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_46%,rgba(2,6,23,.55)_100%)]" />
            <div
              ref={boardRef}
              className={cn(
                'relative mx-auto my-8 rounded-[28px] bg-[#d8d8d8] shadow-[0_50px_120px_-40px_rgba(15,23,42,0.8)] transition-transform duration-300',
                previewMode === '3D' && 'scene-3d'
              )}
              style={{
                width: project.canvas.width,
                height: project.canvas.height,
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotateZ(${layoutRotation}deg) ${previewMode === '3D' ? 'rotateX(14deg) rotateZ(-0.4deg) translateY(6px)' : ''}`,
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                backgroundImage: showGrid ? 'linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px)' : undefined,
                backgroundSize: `${project.canvas.gridSize}px ${project.canvas.gridSize}px`,
              }}
            >
              <div className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,.2),rgba(255,255,255,0)_32%,rgba(15,23,42,.08)_100%)]" />
              <div className="absolute inset-2 rounded-[24px] border border-white/70 bg-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)] backdrop-blur-[1px]" />
              <div className="absolute inset-6 rounded-[20px] border border-slate-300/70 bg-[linear-gradient(145deg,rgba(255,255,255,.55),rgba(226,232,240,.28))] shadow-[inset_0_2px_0_rgba(255,255,255,.8),inset_0_-16px_36px_rgba(15,23,42,.14)]" />
              <div className="absolute inset-10 rounded-[18px] border-[16px] border-slate-300/90 shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_24px_60px_-30px_rgba(15,23,42,.75)]" />
              <div className="absolute inset-20 rounded-[14px] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.34),transparent_24%),linear-gradient(135deg,#9ca3af,#5b6472_55%,#3f4856)] shadow-[inset_0_1px_0_rgba(255,255,255,.35),inset_0_-28px_50px_rgba(15,23,42,.28)]" />
              <div className="absolute left-12 right-12 top-8 h-14 rounded-[50%] bg-white/35 blur-2xl" />
              <div className="absolute bottom-4 left-12 right-12 h-24 rounded-[50%] bg-black/15 blur-3xl" />
              <div className="absolute inset-[22px] rounded-[16px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,0))]" />
              <div className="pointer-events-none absolute inset-x-24 top-5 h-1 rounded-full bg-white/80 shadow-[0_0_18px_rgba(255,255,255,.7)]" />
              <div className="pointer-events-none absolute inset-x-20 bottom-6 h-2 rounded-full bg-slate-900/15 blur-md" />
              <button
                type="button"
                aria-label="Drag to rotate layout"
                className="absolute right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-slate-950/85 text-white shadow-[0_16px_30px_-14px_rgba(15,23,42,0.9)] backdrop-blur"
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  const boardCenter = getBoardCenter();
                  if (!boardCenter) return;
                  setRotationDrag({
                    startRotation: layoutRotation,
                    startAngle: getAngleFromCenter(event.clientX, event.clientY),
                  });
                }}
              >
                <RotateCw className="h-4 w-4" />
              </button>
              <div className="pointer-events-none absolute right-5 top-[74px] z-40 rounded-full bg-slate-950/75 px-2 py-1 text-[10px] font-black tracking-[0.28em] text-white shadow-lg">DRAG TO ROTATE</div>

              {visibleObjects.map((item) => {
                const Icon = iconForType[item.type] ?? Box;
                const selectedItem = selectedIds.includes(item.id);
                const locked = item.locked || lockedLayers.includes(item.layer);
                const isParkingSlot = item.layer === 'Parking Slots' || item.type.includes('slot');
                const isRoadLike = item.type === 'road' || item.type === 'walkway';
                const isGate = item.type === 'entry-gate' || item.type === 'exit-gate';
                const isBarrier = item.type === 'barrier';
                const isArrow = item.type === 'arrow';
                const isCamera = item.type === 'camera';
                const isWall = item.type === 'wall';
                const isCore = item.type === 'lift' || item.type === 'stairs' || item.type === 'security-cabin';
                const isText = item.type === 'text';
                const slotTone = item.status ? twinStatusConfig[item.status] : null;
                const style: CSSProperties = {
                  left: item.x,
                  top: item.y,
                  width: item.width,
                  height: item.height,
                  transform: `rotate(${item.rotation}deg) translateZ(${Math.max(0, item.zIndex - 1) * 1.5}px)`,
                  opacity: item.opacity,
                  background: isRoadLike ? item.fill : item.fill === 'transparent' ? 'transparent' : item.fill,
                  borderColor: selectedItem ? '#2563eb' : item.stroke,
                  zIndex: item.zIndex,
                  transformStyle: 'preserve-3d',
                  boxShadow: selectedItem
                    ? '0 0 0 2px rgba(37, 99, 235, 0.18), 0 22px 40px -24px rgba(15, 23, 42, 0.8), 0 0 42px rgba(59, 130, 246, 0.24)'
                    : locked
                      ? '0 12px 32px -24px rgba(15, 23, 42, 0.55)'
                      : '0 16px 34px -26px rgba(15, 23, 42, 0.75)',
                };
                return (
                  <motion.div
                    key={item.id}
                    layout
                    tabIndex={0}
                    role="button"
                    aria-label={item.name}
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      if (locked && !layoutEditMode) return;
                      if (!event.shiftKey) setSelectedIds([item.id]);
                      else setSelectedIds((ids) => ids.includes(item.id) ? ids.filter((id) => id !== item.id) : [...ids, item.id]);
                      if (!locked) {
                        setDragState({ kind: 'move', id: item.id, startX: event.clientX, startY: event.clientY, originX: item.x, originY: item.y });
                      }
                    }}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      setSelectedIds([item.id]);
                      setContextMenu({ x: event.clientX, y: event.clientY, id: item.id });
                    }}
                    className={cn(
                      'absolute flex select-none items-center justify-center border-2 text-center text-xs font-black transition focus:outline-none focus:ring-2 focus:ring-blue-500',
                      isParkingSlot ? 'rounded-[22px] text-slate-700' : 'rounded-xl',
                      isRoadLike && 'overflow-hidden text-slate-100',
                      isGate && 'overflow-hidden text-slate-900',
                      isCamera && 'overflow-visible',
                      isBarrier && 'overflow-visible',
                      isWall && 'overflow-hidden text-slate-700',
                      isCore && 'overflow-hidden text-slate-700',
                      isArrow && 'bg-transparent border-transparent shadow-none',
                      isText && 'border-transparent bg-transparent shadow-none',
                      selectedItem && 'ring-2 ring-blue-500 ring-offset-2',
                      locked ? (layoutEditMode ? 'cursor-pointer opacity-80 hover:shadow-lg' : 'cursor-not-allowed opacity-70') : 'cursor-move hover:shadow-lg'
                    )}
                    style={style}
                  >
                    {isParkingSlot ? (
                      <>
                        <div className="absolute left-1 right-1 -bottom-2 h-4 rounded-full bg-slate-950/30 blur-md" />
                        <div className="absolute left-1/2 -top-3 h-2 w-[70%] -translate-x-1/2 rounded-full bg-white/70 blur-[1px]" />
                        <div className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,.62),rgba(255,255,255,.16))]" />
                        <div className="absolute inset-[6px] rounded-[18px] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,.5),rgba(241,245,249,.12))] shadow-[inset_0_1px_0_rgba(255,255,255,.95),inset_0_-10px_18px_rgba(15,23,42,.08)]" />
                        <div className="absolute inset-x-4 top-2 h-5 rounded-full bg-white/90 shadow-[0_8px_18px_-10px_rgba(15,23,42,.65)]" />
                        <div className="absolute inset-x-[18%] top-7 h-[2px] rounded-full bg-white/85 shadow-[0_0_10px_rgba(255,255,255,.4)]" />
                        <div className="absolute inset-x-4 bottom-9 h-[1px] rounded-full bg-slate-900/15" />
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/75 px-2.5 py-0.5 text-[9px] font-black tracking-[0.22em] text-white shadow-lg">{item.status?.toUpperCase() ?? 'PARK'}</div>
                        <span className="relative z-10 text-[10px] font-black tracking-[0.3em] text-slate-800 drop-shadow-sm">{item.text ?? item.name}</span>
                        {slotTone && <div className="absolute inset-0 rounded-[inherit] ring-1 ring-inset" style={{ boxShadow: `inset 0 0 0 1px ${slotTone.color}55` }} />}
                      </>
                    ) : isRoadLike ? (
                      <>
                        <div className="absolute left-[2px] right-[2px] -bottom-[6px] h-[10px] rounded-[inherit] bg-black/35 blur-md" />
                        <div className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,#2b3442,#171c24_55%,#0f172a)] shadow-[inset_0_1px_0_rgba(255,255,255,.12),inset_0_-10px_22px_rgba(0,0,0,.35)]" />
                        <div className="absolute inset-[5px] rounded-[inherit] border border-white/8 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_4px,transparent_4px,transparent_10px)]" />
                        <div className="absolute inset-x-4 top-1/2 h-2 -translate-y-1/2 rounded-full bg-amber-300/95 shadow-[0_0_16px_rgba(251,191,36,0.45)]" />
                        <div className="absolute inset-y-3 left-1/2 w-1.5 -translate-x-1/2 rounded-full bg-white/95 shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
                        <div className="absolute left-5 top-4 h-[1px] w-10 bg-white/25" />
                        <div className="absolute right-5 bottom-4 h-[1px] w-10 bg-white/20" />
                        <div className="absolute inset-x-4 bottom-3 h-[2px] rounded-full bg-amber-300/75" />
                        <span className="relative rounded-full bg-slate-950/60 px-3 py-1 text-[10px] font-black tracking-[0.35em] text-white shadow-lg backdrop-blur-sm">{item.text ?? item.name}</span>
                      </>
                    ) : isGate ? (
                      <>
                        <div className="absolute left-1/2 top-[72%] h-8 w-[88%] -translate-x-1/2 rounded-full bg-black/25 blur-lg" />
                        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-white/95 via-white/78 to-white/95" />
                        <div className={cn('absolute left-0 top-0 h-full w-4 rounded-l-[inherit]', item.type === 'entry-gate' ? 'bg-emerald-500' : 'bg-rose-500')} />
                        <div className={cn('absolute right-2 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-900 shadow-lg', item.type === 'entry-gate' ? 'w-[62%]' : 'w-[50%]')} />
                        <div className={cn('absolute left-4 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white shadow-lg', item.type === 'entry-gate' ? 'bg-emerald-400' : 'bg-rose-400')} />
                        <div className={cn('absolute top-1 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[9px] font-black tracking-[0.35em] text-white shadow-lg', item.type === 'entry-gate' ? 'bg-emerald-600' : 'bg-rose-600')}>{item.type === 'entry-gate' ? 'ENTRY' : 'EXIT'}</div>
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-900/10" />
                        <div className={cn('absolute bottom-3 left-3 h-8 w-1 origin-left rounded-full shadow-lg', item.type === 'entry-gate' ? 'bg-emerald-400' : 'bg-rose-400')} style={{ transform: item.type === 'entry-gate' ? 'rotate(-16deg)' : 'rotate(16deg)' }} />
                        <span className="relative px-2 text-[10px] font-black tracking-[0.3em] text-slate-700">{item.text ?? item.name}</span>
                      </>
                    ) : isCamera ? (
                      <>
                        <div className="absolute left-1/2 top-[74px] h-10 w-[110px] -translate-x-1/2 rounded-full bg-slate-900/20 blur-xl" />
                        <div className="absolute left-1/2 top-9 h-[120px] w-[2px] -translate-x-1/2 bg-gradient-to-b from-slate-200 via-slate-500 to-slate-900 shadow-[0_0_14px_rgba(15,23,42,.28)]" />
                        <div className="absolute left-1/2 top-1 h-7 w-2 -translate-x-1/2 rounded-full bg-slate-500 shadow-sm" />
                        <div className="absolute left-1/2 top-6 h-6 w-8 -translate-x-1/2 rounded-full bg-slate-700 shadow-[0_10px_20px_-10px_rgba(15,23,42,0.9)]" />
                        <div className="absolute left-1/2 top-[18px] h-[28px] w-[58px] -translate-x-1/2 rounded-[16px] bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500 shadow-[0_16px_24px_-14px_rgba(15,23,42,0.85)]" />
                        <div className="absolute left-1/2 top-[20px] h-[22px] w-[22px] -translate-x-1/2 rounded-full border-[3px] border-slate-950 bg-slate-800 shadow-inner" />
                        <div className="absolute left-1/2 top-[29px] h-[14px] w-[14px] -translate-x-1/2 rounded-full bg-sky-400/90 shadow-[0_0_18px_rgba(56,189,248,0.65)]" />
                        {selectedItem && (
                          <div className="pointer-events-none absolute left-1/2 top-[46%] -z-10 -translate-x-[16%] -translate-y-1/2 h-0 w-0 border-y-[84px] border-y-transparent border-l-[220px] border-l-sky-400/20" />
                        )}
                      </>
                    ) : isBarrier ? (
                      <>
                        <div className="absolute left-1 top-1/2 h-5 w-8 -translate-y-1/2 rounded-md bg-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_10px_18px_-12px_rgba(15,23,42,.85)]" />
                        <div className="absolute left-7 top-1/2 h-3 w-8 -translate-y-1/2 rounded-full bg-slate-700" />
                        <div className="absolute left-[42px] top-1/2 h-3 w-[74px] -translate-y-1/2 origin-left rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.3)]" style={{ transform: 'translateY(-50%) rotate(-12deg)' }} />
                        <div className="absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-slate-900 bg-white shadow-md" />
                      </>
                    ) : isWall ? (
                      <>
                        <div className="absolute left-1/2 top-[105%] h-4 w-[92%] -translate-x-1/2 rounded-full bg-black/25 blur-md" />
                        <div className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,#e5e7eb,#cbd5e1_42%,#94a3b8)]" />
                        <div className="absolute inset-[4px] rounded-[inherit] border border-white/55 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.24)_0px,rgba(255,255,255,.24)_10px,rgba(255,255,255,.05)_10px,rgba(255,255,255,.05)_16px)] shadow-[inset_0_1px_0_rgba(255,255,255,.9),inset_0_-10px_16px_rgba(15,23,42,.1)]" />
                      </>
                    ) : isCore ? (
                      <>
                        <div className="absolute left-1/2 top-[104%] h-6 w-[88%] -translate-x-1/2 rounded-full bg-black/25 blur-md" />
                        <div className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,#f8fafc,#e2e8f0_48%,#cbd5e1)]" />
                        <div className="absolute inset-x-4 top-3 bottom-3 rounded-xl border border-white/65 bg-[repeating-linear-gradient(180deg,rgba(15,23,42,.08)_0px,rgba(15,23,42,.08)_10px,transparent_10px,transparent_22px)] shadow-[inset_0_1px_0_rgba(255,255,255,.95),inset_0_-14px_24px_rgba(15,23,42,.08)]" />
                        <div className="absolute inset-x-6 top-1.5 rounded-full bg-slate-900/10 px-2 py-0.5 text-[9px] font-black tracking-[0.3em] text-slate-700">CORE</div>
                      </>
                    ) : isArrow ? (
                      <ArrowRight className="relative h-10 w-10 text-white drop-shadow-md" />
                    ) : isText ? (
                      <span className="rounded-lg bg-white/85 px-2 py-1 text-[11px] font-bold text-slate-800 shadow-sm backdrop-blur">{item.text ?? 'Text'}</span>
                    ) : item.text ? (
                      <span className="px-1">{item.text}</span>
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                    {previewMode === 'Simulation' && item.status === 'occupied' && <span className="absolute inset-x-3 bottom-2 h-3 rounded-full bg-slate-900" />}
                    {locked && layoutEditMode && (
                      <button
                        type="button"
                        aria-label="Unlock object"
                        onClick={(event) => {
                          event.stopPropagation();
                          updateObject(item.id, { locked: false }, 'Object unlocked');
                        }}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-slate-900 text-white shadow-lg"
                      >
                        <Unlock className="h-3 w-3" />
                      </button>
                    )}
                    {selectedItem && !locked && (
                      <>
                        <button
                          aria-label="Resize"
                          onPointerDown={(event) => {
                            event.stopPropagation();
                            setDragState({ kind: 'resize', id: item.id, startX: event.clientX, startY: event.clientY, originW: item.width, originH: item.height });
                          }}
                          className="absolute -bottom-2 -right-2 h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow"
                        />
                        <button
                          aria-label="Rotate"
                          onClick={(event) => {
                            event.stopPropagation();
                            updateObject(item.id, { rotation: (item.rotation + 15) % 360 }, 'Object rotated');
                          }}
                          className="absolute -top-7 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-md bg-blue-600 text-white shadow"
                        >
                          <RotateCw className="h-3 w-3" />
                        </button>
                      </>
                    )}
                  </motion.div>
                );
              })}

              {contextMenu && (
                <div className="fixed z-[80] w-44 rounded-xl border border-slate-200 bg-white p-1 text-sm shadow-2xl dark:border-slate-700 dark:bg-slate-950" style={{ left: contextMenu.x, top: contextMenu.y }}>
                  <button onClick={duplicateSelected} className={menuItemClass}><Copy className="h-4 w-4" /> Duplicate</button>
                  <button onClick={() => updateObject(contextMenu.id, { locked: !selected?.locked }, 'Lock updated')} className={menuItemClass}>{selected?.locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />} {selected?.locked ? 'Unlock' : 'Lock'}</button>
                  <button onClick={() => updateObject(contextMenu.id, { zIndex: selected ? selected.zIndex + 10 : 10 }, 'Moved forward')} className={menuItemClass}><Layers className="h-4 w-4" /> Bring Front</button>
                  <button onClick={deleteSelected} className={cn(menuItemClass, 'text-rose-600 dark:text-rose-300')}><Trash2 className="h-4 w-4" /> Delete</button>
                </div>
              )}

              <div className="absolute bottom-5 right-5 h-28 w-40 rounded-xl border border-white/60 bg-white/90 p-2 shadow-xl backdrop-blur dark:bg-slate-950/90">
                <div className="relative h-full w-full overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
                  {visibleObjects.slice(0, 40).map((item) => (
                    <button
                      key={`mini-${item.id}`}
                      onClick={() => setSelectedIds([item.id])}
                      className="absolute rounded-sm"
                      style={{ left: `${(item.x / project.canvas.width) * 100}%`, top: `${(item.y / project.canvas.height) * 100}%`, width: `${Math.max(2, (item.width / project.canvas.width) * 100)}%`, height: `${Math.max(2, (item.height / project.canvas.height) * 100)}%`, background: item.stroke }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {(Object.entries(twinStatusConfig) as [TwinObjectStatus, typeof twinStatusConfig.available][]).map(([key, conf]) => (
                <div key={key} className="flex items-center gap-2"><span className="h-3 w-3 rounded" style={{ background: conf.color }} /> {conf.label}</div>
              ))}
            </div>
          </div>
        </main>

        <aside className="hidden w-80 shrink-0 space-y-3 overflow-y-auto xl:block">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold">Properties</h2>
              {selected?.status && <span className="rounded-full px-2 py-1 text-xs font-bold" style={{ background: twinStatusConfig[selected.status].bg, color: twinStatusConfig[selected.status].color }}>{twinStatusConfig[selected.status].label}</span>}
            </div>
            {selected ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/70">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Object</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selected.type}</p>
                    </div>
                    <div className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-500 shadow-sm dark:bg-slate-950 dark:text-slate-400">Floor {activeFloor.level + 1}</div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="rounded-lg bg-white px-2 py-2 dark:bg-slate-950">
                      <div className="font-semibold uppercase tracking-wide">ID</div>
                      <div className="mt-1 break-all text-slate-700 dark:text-slate-200">{selected.id}</div>
                    </div>
                    <div className="rounded-lg bg-white px-2 py-2 dark:bg-slate-950">
                      <div className="font-semibold uppercase tracking-wide">Layer</div>
                      <div className="mt-1 text-slate-700 dark:text-slate-200">{selected.layer}</div>
                    </div>
                  </div>
                </div>
                <input value={selected.name} onChange={(event) => updateObject(selected.id, { name: event.target.value })} className={cn(propertyInputClass, 'font-bold')} />
                <div className="grid grid-cols-2 gap-2">
                  <label className={propertyLabelClass}>X<input type="number" value={selected.x} onChange={(event) => updateObject(selected.id, { x: Number(event.target.value) })} className={propertyInputClass} /></label>
                  <label className={propertyLabelClass}>Y<input type="number" value={selected.y} onChange={(event) => updateObject(selected.id, { y: Number(event.target.value) })} className={propertyInputClass} /></label>
                  <label className={propertyLabelClass}>Width<input type="number" value={selected.width} onChange={(event) => updateObject(selected.id, { width: Number(event.target.value) })} className={propertyInputClass} /></label>
                  <label className={propertyLabelClass}>Height<input type="number" value={selected.height} onChange={(event) => updateObject(selected.id, { height: Number(event.target.value) })} className={propertyInputClass} /></label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className={propertyLabelClass}>Layer<select value={selected.layer} onChange={(event) => updateObject(selected.id, { layer: event.target.value })} className={propertyInputClass}>{layerNames.map((layer) => <option key={layer} value={layer}>{layer}</option>)}</select></label>
                  <label className={propertyLabelClass}>Z Index<input type="number" value={selected.zIndex} onChange={(event) => updateObject(selected.id, { zIndex: Number(event.target.value) })} className={propertyInputClass} /></label>
                </div>
                <label className={propertyLabelClass}>Rotation<input type="range" min="0" max="360" value={selected.rotation} onChange={(event) => updateObject(selected.id, { rotation: Number(event.target.value) })} className="w-full" /></label>
                <label className={propertyLabelClass}>Opacity<input type="range" min="0.25" max="1" step="0.05" value={selected.opacity} onChange={(event) => updateObject(selected.id, { opacity: Number(event.target.value) })} className="w-full" /></label>
                <label className={propertyLabelClass}>Label<input value={selected.text ?? ''} onChange={(event) => updateObject(selected.id, { text: event.target.value })} className={propertyInputClass} placeholder="Optional label" /></label>
                {selected.status && (
                  <label className={propertyLabelClass}>Status
                    <select value={selected.status} onChange={(event) => updateObject(selected.id, { status: event.target.value as TwinObjectStatus })} className={propertyInputClass}>
                      {Object.keys(twinStatusConfig).map((status) => <option key={status} value={status}>{twinStatusConfig[status as TwinObjectStatus].label}</option>)}
                    </select>
                  </label>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <label className={propertyLabelClass}>Fill<input type="color" value={selected.fill === 'transparent' ? '#ffffff' : selected.fill} onChange={(event) => updateObject(selected.id, { fill: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700" /></label>
                  <label className={propertyLabelClass}>Border<input type="color" value={selected.stroke === 'transparent' ? '#ffffff' : selected.stroke} onChange={(event) => updateObject(selected.id, { stroke: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700" /></label>
                </div>
                <label className={propertyLabelClass}>Price / Hour<input type="number" value={selected.price ?? 0} onChange={(event) => updateObject(selected.id, { price: Number(event.target.value) })} className={propertyInputClass} /></label>
                <label className={propertyLabelClass}>Sensor ID<input value={selected.sensorId ?? ''} onChange={(event) => updateObject(selected.id, { sensorId: event.target.value })} className={propertyInputClass} /></label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => updateObject(selected.id, { hidden: !selected.hidden })} className={cn('rounded-xl border px-3 py-2 text-sm font-bold transition', selected.hidden ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200' : 'border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200')}>{selected.hidden ? 'Show' : 'Hide'}</button>
                  <button onClick={() => updateObject(selected.id, { locked: !selected.locked })} className={cn('rounded-xl border px-3 py-2 text-sm font-bold transition', selected.locked ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200' : 'border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200')}>{selected.locked ? 'Unlock' : 'Lock'}</button>
                </div>
                <div className="flex gap-2">
                  <button onClick={duplicateSelected} className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-bold dark:border-slate-700">Duplicate</button>
                  <button onClick={deleteSelected} className="flex-1 rounded-xl bg-rose-600 py-2 text-sm font-bold text-white">Delete</button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500 dark:bg-slate-900">Select any object to edit its properties.</div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex border-b border-slate-200 text-sm font-bold dark:border-slate-800">
              <button className="border-b-2 border-blue-600 px-3 py-2 text-blue-600">Components</button>
              <button className="px-3 py-2 text-slate-500">Zones</button>
              <button className="px-3 py-2 text-slate-500">Objects</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {componentPalette.map((item) => {
                const Icon = iconForType[item.type] ?? Box;
                return (
                  <button
                    key={item.type}
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData('application/parkease-component', item.type)}
                    onClick={() => addObject(item.type)}
                    className="group rounded-xl border border-slate-200 p-3 text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm dark:border-slate-800 dark:hover:border-blue-500"
                  >
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: item.fill, color: item.stroke }}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</p>
                    <p className="text-[10px] text-slate-500">Drag to add</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <button onClick={() => setValidationOpen((value) => !value)} className="mb-3 flex w-full items-center justify-between text-sm font-bold">
              Smart Validation <ChevronDown className={cn('h-4 w-4 transition', validationOpen && 'rotate-180')} />
            </button>
            {validationOpen && (
              <div className="space-y-2">
                {validation.map((warning) => (
                  <div key={warning} className="flex gap-2 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
                    <ShieldAlert className="h-4 w-4 shrink-0" /> {warning}
                  </div>
                ))}
                {validation.length === 0 && <div className="rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">No validation issues detected.</div>}
              </div>
            )}
          </section>
        </aside>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {[
          ['Total Slots', stats.total],
          ['Available', stats.available],
          ['Occupied', stats.occupied],
          ['Reserved', stats.reserved],
          ['VIP Slots', stats.vip],
          ['EV Slots', stats.ev],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-xl dark:bg-white dark:text-slate-950">{toast}</div>

      <div className="fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 md:flex">
        <button onClick={copySelected} className={iconButtonClass}><Copy className="h-4 w-4" /></button>
        <button onClick={pasteClipboard} className={iconButtonClass}><Upload className="h-4 w-4" /></button>
        <button onClick={duplicateSelected} className={iconButtonClass}><Copy className="h-4 w-4" /></button>
        <button onClick={deleteSelected} className={cn(iconButtonClass, 'text-rose-600 dark:text-rose-300')}><Trash2 className="h-4 w-4" /></button>
        <button onClick={() => fileInputRef.current?.click()} className="rounded-lg px-3 py-2 text-xs font-bold"><Upload className="mr-1 inline h-4 w-4" /> Import JSON</button>
        <button onClick={exportJson} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white"><Download className="mr-1 inline h-4 w-4" /> Export JSON</button>
        <button onClick={() => showToast('PNG/PDF export queued from the current canvas')} className="rounded-lg px-3 py-2 text-xs font-bold">Export PNG/PDF</button>
      </div>
    </div>
  );
};

export default DigitalTwin;
