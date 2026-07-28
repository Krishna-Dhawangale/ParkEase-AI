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
import { getDigitalTwinStorageKey } from './sync';
import { useTenantStore } from '../../../store';
import { DigitalTwinService } from '../../../services/digital-twin.service';
import { DigitalTwinHeader } from './components/DigitalTwinHeader';
import { EditorToolbar } from './components/EditorToolbar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { FloorNavigator } from './components/FloorNavigator';
import { SettingsModal } from './components/SettingsModal';
import type { BuilderSnapshot } from './data';


type ToolMode = 'select' | 'move' | 'wall' | 'road' | 'slot' | 'zone' | 'gate' | 'camera' | 'object' | 'text';
type PreviewMode = '2D' | '3D' | 'Simulation';
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

const loadBuilderState = (tenantId?: string): PersistedBuilderState => {
  if (typeof window === 'undefined') {
    return { project: cloneProject(mockTwinBuilderProject), activeFloorId: mockTwinBuilderProject.activeFloorId, viewportRotation: 0, snapshots: [] };
  }

  try {
    const raw = window.localStorage.getItem(getDigitalTwinStorageKey(tenantId));
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

const DigitalTwin = ({ readOnly = false }: { readOnly?: boolean }) => {
  const currentTenant = useTenantStore(s => s.currentTenant);
  const activeTenantId = currentTenant?.id ?? undefined;
  const [initialState] = useState(() => loadBuilderState(activeTenantId));
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
  const [cameraOrbit, setCameraOrbit] = useState({ x: 60, z: -45 });
  const [isPanningCanvas, setIsPanningCanvas] = useState(false);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [canvasDragStart, setCanvasDragStart] = useState<{x: number, y: number, panX: number, panY: number, orbitX: number, orbitZ: number} | null>(null);
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
    const timer = window.setTimeout(async () => {
      try {
        const payload: PersistedBuilderState = {
          project,
          activeFloorId,
          viewportRotation: layoutRotation,
          snapshots: versionHistory,
        };
        if (activeTenantId) {
          await DigitalTwinService.saveProject(activeTenantId, payload);
        } else {
          window.localStorage.setItem(getDigitalTwinStorageKey(activeTenantId), JSON.stringify(payload));
        }
      } catch {
        // Ignore storage write failures and keep the in-memory session usable.
      }
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [activeFloorId, layoutRotation, project, versionHistory, activeTenantId]);

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
    if (isPanningCanvas && canvasDragStart) {
      const dx = event.clientX - canvasDragStart.x;
      const dy = event.clientY - canvasDragStart.y;
      setPan({ x: canvasDragStart.panX + dx, y: canvasDragStart.panY + dy });
      return;
    }
    if (isOrbiting && canvasDragStart) {
      const dx = event.clientX - canvasDragStart.x;
      const dy = event.clientY - canvasDragStart.y;
      setCameraOrbit({
        x: Math.max(0, Math.min(85, canvasDragStart.orbitX - dy * 0.4)),
        z: canvasDragStart.orbitZ + dx * 0.4
      });
      return;
    }
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
    setIsPanningCanvas(false);
    setIsOrbiting(false);
    setCanvasDragStart(null);
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

  const updateCanvasSettings = (updates: Partial<typeof project.canvas>) => {
    commit((draft) => ({ ...draft, canvas: { ...draft.canvas, ...updates } }), 'Canvas settings updated');
  };

  const saveLayout = () => {
    commit((draft) => ({ ...draft, lastSaved: 'Saved just now' }), 'Layout saved');
    showToast('Layout saved successfully!');
  };

  const visibleObjects = activeFloor.objects
    .filter((item) => !hiddenLayers.includes(item.layer) && !item.hidden)
    .sort((a, b) => a.zIndex - b.zIndex);

    const renderedObjects = useMemo(() => {
    return visibleObjects.map((item) => {
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
                      if (!locked && layoutEditMode) {
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
                        <span className="relative rounded-full bg-slate-950/60 px-3 py-1 text-[10px] font-black tracking-[0.35em] text-white shadow-lg ">{item.text ?? item.name}</span>
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
                    {selectedItem && !locked && layoutEditMode && (
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
});
  }, [visibleObjects, selectedIds, lockedLayers, layoutEditMode, contextMenu]);

  return (
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
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
             <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-1 shadow-lg">
                <button onClick={() => setZoom((value) => Math.max(0.35, value - 0.1))} className="p-2 text-slate-400 hover:text-white transition-colors"><Minus className="w-4 h-4" /></button>
                <button onClick={() => setZoom(1)} className="px-2 py-0.5 text-[10px] font-bold text-slate-300 hover:text-white">{Math.round(zoom * 100)}%</button>
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
            <div
              ref={boardRef}
              className={cn(
                'relative mx-auto my-8 transition-transform duration-300 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900',
                previewMode === '3D' && 'scene-3d'
              )}
              style={{
                width: project.canvas.width,
                height: project.canvas.height,
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotateZ(${layoutRotation}deg) ${previewMode === '3D' ? `rotateX(${cameraOrbit.x}deg) rotateZ(${cameraOrbit.z}deg)` : ''}`,
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                backgroundImage: showGrid ? 'linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px)' : undefined,
                backgroundSize: `${project.canvas.gridSize}px ${project.canvas.gridSize}px`,
              }}
            >
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

              {renderedObjects}


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

          <FloorNavigator 
            project={project}
            activeFloorId={activeFloorId}
            setActiveFloorId={setActiveFloorId}
            addFloor={addFloor}
            deleteFloor={deleteFloor}
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
};

export default DigitalTwin;
