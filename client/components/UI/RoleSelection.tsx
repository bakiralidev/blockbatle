'use client';

import { useState } from 'react';
import CharacterPreview from './CharacterPreview';

const roleDetails: any = {
  warrior: {
    name: 'Jangchi',
    icon: '⚔️',
    history: 'Qadimiy qirollikning eng jasur himoyachisi. U o\'z hayotini qilich va qalqon bilan jang maydonlarida o\'tkazgan.',
    skills: ['Kuchli zarba (Punch)', 'Tezkor dash (Q)'],
    stats: { attack: 80, defense: 60, speed: 50 },
    color: '#ff4444'
  },
  tank: {
    name: 'Tank',
    icon: '🛡️',
    history: 'Buzilmas devor deb nom olgan bu qahramon, jamoasini har qanday xavfdan himoya qilish uchun tug\'ilgan.',
    skills: ['Himoya qalqoni (Shield - Q)', 'Yuqori salomatlik'],
    stats: { attack: 40, defense: 100, speed: 30 },
    color: '#4444ff'
  },
  mage: {
    name: 'Sehrgar',
    icon: '🔥',
    history: 'Tabiat elementlarini bo\'ysundiruvchi qadimiy afsungar. Zulmat kuchlariga qarshi olov bilan kurashadi.',
    skills: ['Olovli shar (Fireball - Q)', 'Uzoq masofali hujum'],
    stats: { attack: 100, defense: 30, speed: 40 },
    color: '#aa44ff'
  },
  healer: {
    name: 'Davolovchi',
    icon: '❇️',
    history: 'Yaradorlarni davolovchi muqaddas ruh. Uning qo\'llari hayot baxsh etish xususiyatiga ega.',
    skills: ['Regeneratsiya (Heal - Q)', 'Jamoani qo\'llab-quvvatlash'],
    stats: { attack: 20, defense: 50, speed: 60 },
    color: '#44ff44'
  },
  thief: {
    name: 'O\'g\'ri',
    icon: '👤',
    history: 'Soya kabi tez va ko\'rinmas josus. U har doim kutilmagan tomondan hujum qiladi.',
    skills: ['Ko\'rinmaslik (Invisibility - Q)', 'Tezkor harakat'],
    stats: { attack: 70, defense: 40, speed: 100 },
    color: '#444444'
  },
  archer: {
    name: 'Kamonchi',
    icon: '🏹',
    history: 'O\'rmonlar sulton, uzoq masofadan aniq nishonga uruvchi mohir ovchi.',
    skills: ['Aniq nishon', 'Uzoqdan o\'q otish'],
    stats: { attack: 85, defense: 40, speed: 70 },
    color: '#ffaa44'
  },
  assassin: {
    name: 'Qotil',
    icon: '🔪',
    history: 'Zulmatdan kelib, bitta zarba bilan dushmanini mag\'lub etuvchi sirli jangchi.',
    skills: ['Kritik zarba', 'Soya qadami'],
    stats: { attack: 100, defense: 30, speed: 90 },
    color: '#880000'
  },
  knight: {
    name: 'Ritsar',
    icon: '🐴',
    history: 'Adolat uchun kurashuvchi olijanob jangchi. Uning sharafi hayotidan ustun.',
    skills: ['Muqaddas qilich', 'Otliq hujum'],
    stats: { attack: 75, defense: 80, speed: 60 },
    color: '#dddddd'
  },
  necromancer: {
    name: 'Yovuz Sehrgar',
    icon: '💀',
    history: 'O\'liklarni tiriltiruvchi va ruhlar bilan muloqot qiluvchi qorong\'u kuch vakili.',
    skills: ['Skeletlarni chaqirish', 'Ruhlarni so\'rish'],
    stats: { attack: 90, defense: 40, speed: 40 },
    color: '#222222'
  },
  paladin: {
    name: 'Paladin',
    icon: '✨',
    history: 'Nur va temirning uyg\'unligi. U ham jangchi, ham muqaddas davolovchi.',
    skills: ['Adolat bolg\'asi', 'Nur qalqoni'],
    stats: { attack: 65, defense: 85, speed: 50 },
    color: '#ffffaa'
  }
};

export default function RoleSelection({ onSelect }: { onSelect: (role: string) => void }) {
  const [infoRole, setInfoRole] = useState<string | null>(null);

  const roles = Object.keys(roleDetails);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="max-w-4xl w-full bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Rolingizni tanlang</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {roles.map((roleId) => (
            <div key={roleId} className="group relative">
              <button
                onClick={() => onSelect(roleId)}
                className="w-full aspect-square flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-yellow-500 rounded-xl border border-white/10 transition-all group-hover:scale-105"
              >
                <span className="text-4xl">{roleDetails[roleId].icon}</span>
                <span className="text-white font-bold group-hover:text-black">{roleDetails[roleId].name}</span>
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setInfoRole(roleId);
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold hover:bg-blue-400 z-10"
              >
                i
              </button>
            </div>
          ))}
        </div>

        {/* Info Modal */}
        {infoRole && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" onClick={() => setInfoRole(null)}>
            <div className="max-w-md w-full bg-gray-900 border border-yellow-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
              
              <CharacterPreview roleColor={roleDetails[infoRole].color} />

              <div className="flex items-center gap-4 my-6">
                <div className="text-6xl p-4 bg-white/5 rounded-2xl">{roleDetails[infoRole].icon}</div>
                <div>
                  <h3 className="text-3xl font-bold text-yellow-400">{roleDetails[infoRole].name}</h3>
                  <div className="flex gap-2 mt-2">
                    <div className="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: `${roleDetails[infoRole].stats.attack}%` }}></div>
                    </div>
                    <div className="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${roleDetails[infoRole].stats.defense}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Tarixi</h4>
                  <p className="text-white/80 leading-relaxed italic">"{roleDetails[infoRole].history}"</p>
                </section>

                <section>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Qobiliyatlar</h4>
                  <ul className="grid grid-cols-1 gap-2">
                    {roleDetails[infoRole].skills.map((skill: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-white bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                        <span className="text-yellow-500">◈</span> {skill}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <button 
                onClick={() => setInfoRole(null)}
                className="w-full mt-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-all"
              >
                TUSHUNARLI
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
