'use client';

import { MAZE_WALLS, CELL_SIZE } from '../../lib/maze';

export default function Labyrinth() {
  return (
    <group>
      {MAZE_WALLS.map((wall, i) => (
        <mesh key={i} position={[wall.x, 2, wall.z]} castShadow receiveShadow>
          <boxGeometry args={[CELL_SIZE, 4, CELL_SIZE]} />
          <meshStandardMaterial color="#22c55e" emissive="#052205" roughness={0.4} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}
