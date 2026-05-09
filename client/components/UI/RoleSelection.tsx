'use client';

import { Sword, Shield, Heart, Zap, Ghost, Target, FlaskConical, Hammer, Axe, Crown } from 'lucide-react';

const ROLES = [
  { id: 'warrior', name: 'Jangchi', icon: <Sword /> },
  { id: 'tank', name: 'Tank', icon: <Shield /> },
  { id: 'healer', name: 'Davolovchi', icon: <Heart /> },
  { id: 'mage', name: 'Sehrgar', icon: <FlaskConical /> },
  { id: 'thief', name: 'O\'g\'ri', icon: <Ghost /> },
  { id: 'archer', name: 'Kamonchi', icon: <Target /> },
  { id: 'scout', name: 'Razvedkachi', icon: <Zap /> },
  { id: 'builder', name: 'Quruvchi', icon: <Hammer /> },
  { id: 'berserker', name: 'Berserker', icon: <Axe /> },
  { id: 'king', name: 'Qirol', icon: <Crown /> },
];

export default function RoleSelection({ onSelect }: { onSelect: (role: string) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Rolingizni Tanlang</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelect(role.id)}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-800 hover:bg-yellow-500 hover:text-black transition-all group"
            >
              <div className="mb-2 group-hover:scale-110 transition-transform">
                {role.icon}
              </div>
              <span className="font-semibold text-sm">{role.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
