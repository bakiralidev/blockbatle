'use client';

import { useState } from 'react';

export default function TeamSelection({ onJoin }: { onJoin: (teamId: string) => void }) {
  const teams = Array.from({ length: 25 }, (_, i) => `Team ${i + 1}`);

  return (
    <div className="fixed top-20 right-4 w-48 max-h-[60vh] bg-black/60 backdrop-blur-md rounded-lg border border-white/10 p-4 overflow-y-auto z-50">
      <h3 className="text-white font-bold mb-4 text-center">Jamoalar</h3>
      <div className="grid grid-cols-1 gap-2">
        {teams.map((teamId) => (
          <button
            key={teamId}
            onClick={() => onJoin(teamId)}
            className="bg-white/10 hover:bg-yellow-500 hover:text-black text-white text-xs py-2 rounded transition-all"
          >
            {teamId} ga qo'shilish
          </button>
        ))}
      </div>
    </div>
  );
}
