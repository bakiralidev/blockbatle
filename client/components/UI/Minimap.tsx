'use client';

import { MAZE_WALLS, CELL_SIZE, MAZE_SIZE } from '../../lib/maze';

interface MinimapProps {
  players: any;
  monsters: any;
  localId: string;
}

export default function Minimap({ players, monsters, localId }: MinimapProps) {
  const size = 150; // Minimap size in px
  const worldSize = MAZE_SIZE * CELL_SIZE;
  const scale = size / worldSize;
  const offset = size / 2;

  return (
    <div className="fixed top-4 left-4 w-[150px] h-[150px] bg-black/60 backdrop-blur-md rounded-lg border-2 border-white/20 z-50 overflow-hidden shadow-2xl">
      {/* Walls */}
      {MAZE_WALLS.map((wall, i) => (
        <div
          key={`wall-${i}`}
          className="absolute bg-green-900/50"
          style={{
            left: wall.x * scale + offset - (CELL_SIZE * scale) / 2,
            top: wall.z * scale + offset - (CELL_SIZE * scale) / 2,
            width: CELL_SIZE * scale,
            height: CELL_SIZE * scale,
          }}
        />
      ))}

      {/* Monsters */}
      {Object.values(monsters).map((mob: any) => (
        <div
          key={mob.id}
          className="absolute bg-red-500 rounded-full w-1 h-1 animate-pulse"
          style={{
            left: mob.position.x * scale + offset,
            top: mob.position.z * scale + offset,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Players */}
      {Object.values(players).map((p: any) => (
        <div
          key={p.id}
          className={`absolute rounded-full ${p.id === localId ? 'bg-yellow-400 w-2 h-2 z-10' : 'bg-blue-400 w-1.5 h-1.5'}`}
          style={{
            left: p.position.x * scale + offset,
            top: p.position.z * scale + offset,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}
