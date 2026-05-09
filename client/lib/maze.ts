export const MAZE_SIZE = 20;
export const CELL_SIZE = 4;

// Simple seeded random to avoid hydration mismatch
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateMaze() {
  const walls = [];
  for (let x = 0; x < MAZE_SIZE; x++) {
    for (let z = 0; z < MAZE_SIZE; z++) {
      const isCenter = Math.abs(x - MAZE_SIZE / 2) <= 1 && Math.abs(z - MAZE_SIZE / 2) <= 1;
      // Use coordinates as seed
      const seed = x * 100 + z;
      if (!isCenter && (x % 4 === 0 || z % 4 === 0) && seededRandom(seed) > 0.4) {
        walls.push({ x: x * CELL_SIZE - (MAZE_SIZE * CELL_SIZE) / 2, z: z * CELL_SIZE - (MAZE_SIZE * CELL_SIZE) / 2 });
      }
    }
  }
  // Boundary walls
  const half = (MAZE_SIZE * CELL_SIZE) / 2;
  for (let i = 0; i <= MAZE_SIZE; i++) {
    const pos = i * CELL_SIZE - half;
    walls.push({ x: pos, z: -half });
    walls.push({ x: pos, z: half });
    walls.push({ x: -half, z: pos });
    walls.push({ x: half, z: pos });
  }
  return walls;
}

export const MAZE_WALLS = generateMaze();
