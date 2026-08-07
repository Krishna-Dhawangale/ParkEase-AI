import type { TwinBuilderProject, TwinCanvasObject } from '../../../portals/client-admin/digitalTwin/data';
import type { 
  ParkingLayoutJSON, 
  ParkingSlotLayout, 
  RoadLayout, 
  GateLayout, 
  CameraLayout, 
  WalkwayLayout, 
  BuildingLayout, 
  EVChargerLayout 
} from './types';

// Scale factor: 1 canvas pixel = 0.05 3D world units
const SCALE = 0.05;

/**
 * Converts 2D Canvas Coordinates to 3D World Coordinates
 */
function mapCoords(x: number, y: number, canvasWidth: number, canvasHeight: number): [number, number, number] {
  const threeX = (x - canvasWidth / 2) * SCALE;
  const threeZ = (y - canvasHeight / 2) * SCALE;
  return [threeX, 0, threeZ];
}

/**
 * Converts degrees to radians
 */
function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Adapter converting Client Portal Builder JSON to User Portal 3D Layout
 */
export function convertTwinProjectToLayout(project: TwinBuilderProject, activeFloorId?: string): ParkingLayoutJSON {
  const cWidth = project.canvas.width || 1200;
  const cHeight = project.canvas.height || 800;
  
  // Find active floor — prefer the passed-in ID, then project default, then first floor
  const floorId = activeFloorId || project.activeFloorId;
  const floor = project.floors.find(f => f.id === floorId) || project.floors[0];
  const objects = floor?.objects || [];

  const layout: ParkingLayoutJSON = {
    roads: [],
    walkways: [],
    gates: [],
    cameras: [],
    trees: [], // Kept empty permanently
    evChargers: [],
    parkingSlots: [],
    walls: [] // Added to handle custom walls
  };

  objects.forEach((obj: TwinCanvasObject) => {
    // Top-left origin to center origin
    // Note: Canvas (x,y) is top-left of the object. Threejs position is center.
    // So we add width/2 and height/2 to get the object's center before mapping.
    const centerX = obj.x + obj.width / 2;
    const centerY = obj.y + obj.height / 2;
    const pos = mapCoords(centerX, centerY, cWidth, cHeight);
    
    // Y-axis rotation in ThreeJS maps directly to 2D rotation (but inverted due to Z axis pointing towards screen)
    // Actually, ThreeJS Z points out, X points right. 2D Canvas Y points down.
    // So negative rotation? Let's just use -degToRad(obj.rotation) to sync perfectly.
    const rotZ = -degToRad(obj.rotation || 0);

    const sizeW = obj.width * SCALE;
    const sizeD = obj.height * SCALE;

    if (obj.type === 'parking-slot' || obj.type === 'reserved-slot' || obj.type === 'disabled-slot' || obj.type === 'vip-slot') {
      layout.parkingSlots.push({
        id: obj.id,
        type: obj.type === 'disabled-slot' ? 'Accessible' : 'Regular',
        position: pos,
        rotation: [0, rotZ, 0],
        size: [sizeW, 0.1, sizeD]
      });
    }
    else if (obj.type === 'ev-slot') {
      layout.parkingSlots.push({
        id: obj.id,
        type: 'EV',
        position: pos,
        rotation: [0, rotZ, 0],
        size: [sizeW, 0.1, sizeD]
      });
      layout.evChargers.push({
        id: `evc-${obj.id}`,
        position: [pos[0], 0, pos[2] - sizeD/2], // Charger at back of slot
        rotation: [0, rotZ, 0]
      });
    }
    else if (obj.type === 'road') {
      layout.roads.push({
        id: obj.id,
        position: pos,
        rotation: [0, rotZ, 0],
        size: [sizeW, 0.1, sizeD]
      });
    }
    else if (obj.type === 'wall') {
      layout.walls = layout.walls || [];
      layout.walls.push({
        id: obj.id,
        position: pos,
        rotation: [0, rotZ, 0],
        size: [sizeW, 2, sizeD] // Wall height = 2
      });
    }
    else if (obj.type === 'walkway') {
      layout.walkways.push({
        id: obj.id,
        position: pos,
        rotation: [0, rotZ, 0],
        size: [sizeW, 0.1, sizeD]
      });
    }
    else if (obj.type === 'entry-gate' || obj.type === 'exit-gate') {
      layout.gates.push({
        id: obj.id,
        type: obj.type === 'entry-gate' ? 'Entry' : 'Exit',
        position: pos,
        rotation: [0, rotZ, 0]
      });
    }
    else if (obj.type === 'camera') {
      layout.cameras.push({
        id: obj.id,
        position: [pos[0], 3, pos[2]], // Height 3 for camera poles
        rotation: [0, rotZ, 0],
        label: obj.name || 'Camera'
      });
    }
    else if (obj.type === 'barrier') {
      // Barriers map to gates visually
      layout.gates.push({
        id: obj.id,
        type: 'Entry', // Default appearance
        position: pos,
        rotation: [0, rotZ, 0]
      });
    }
    else if (obj.type === 'bike-slot' || obj.type === 'truck-slot') {
      layout.parkingSlots.push({
        id: obj.id,
        type: 'Regular',
        position: pos,
        rotation: [0, rotZ, 0],
        size: [sizeW, 0.1, sizeD]
      });
    }
  });

  return layout;
}
