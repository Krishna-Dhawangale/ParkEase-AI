import { mockTwinBuilderProject, type TwinBuilderProject, type TwinCanvasObject } from './data';

export const DIGITAL_TWIN_STORAGE_KEY = 'parkease-ai.digital-twin-builder.v1';

export type DigitalTwinLiveState = {
  project: TwinBuilderProject;
  activeFloorId: string;
  viewportRotation: number;
  updatedAt: string;
};

const cloneProject = (project: TwinBuilderProject): TwinBuilderProject => JSON.parse(JSON.stringify(project));

const isTwinCanvasObject = (value: unknown): value is TwinCanvasObject => Boolean(value && typeof value === 'object' && 'id' in value && 'type' in value && 'layer' in value);

const normalizeObjects = (objects: unknown): TwinCanvasObject[] => Array.isArray(objects) ? objects.filter(isTwinCanvasObject).map((item) => ({ ...item })) : [];

const normalizeProject = (project: TwinBuilderProject): TwinBuilderProject => ({
  ...cloneProject(project),
  floors: project.floors.map((floor) => ({
    ...floor,
    objects: normalizeObjects(floor.objects),
  })),
});

export const readDigitalTwinLiveState = (): DigitalTwinLiveState => {
  if (typeof window === 'undefined') {
    return {
      project: normalizeProject(mockTwinBuilderProject),
      activeFloorId: mockTwinBuilderProject.activeFloorId,
      viewportRotation: 0,
      updatedAt: 'mock',
    };
  }

  try {
    const raw = window.localStorage.getItem(DIGITAL_TWIN_STORAGE_KEY);
    if (!raw) {
      return {
        project: normalizeProject(mockTwinBuilderProject),
        activeFloorId: mockTwinBuilderProject.activeFloorId,
        viewportRotation: 0,
        updatedAt: 'mock',
      };
    }

    const parsed = JSON.parse(raw) as Partial<{ project: TwinBuilderProject; activeFloorId: string; viewportRotation: number; snapshots: Array<{ savedAt?: string }> }>;
    if (!parsed.project?.floors?.length) {
      return {
        project: normalizeProject(mockTwinBuilderProject),
        activeFloorId: mockTwinBuilderProject.activeFloorId,
        viewportRotation: 0,
        updatedAt: 'mock',
      };
    }

    const project = normalizeProject(parsed.project);
    const activeFloorId = parsed.activeFloorId ?? project.activeFloorId ?? project.floors[0].id;
    const viewportRotation = Number.isFinite(parsed.viewportRotation ?? 0) ? Number(parsed.viewportRotation ?? 0) : 0;
    const updatedAt = parsed.snapshots?.[0]?.savedAt ?? project.lastSaved ?? new Date().toISOString();

    return { project, activeFloorId, viewportRotation, updatedAt };
  } catch {
    return {
      project: normalizeProject(mockTwinBuilderProject),
      activeFloorId: mockTwinBuilderProject.activeFloorId,
      viewportRotation: 0,
      updatedAt: 'mock',
    };
  }
};
