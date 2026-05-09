'use client';

import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls, Stars, ContactShadows } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { io } from 'socket.io-client';
import Player from './Player';
import RoleSelection from '../UI/RoleSelection';
import Labyrinth from './Labyrinth';
import Chat from '../UI/Chat';
import TeamSelection from '../UI/TeamSelection';
import Minimap from '../UI/Minimap';

const socket = io('http://localhost:3001');

export default function GameCanvas() {
  const [players, setPlayers] = useState({});
  const [monsters, setMonsters] = useState({});
  const [lobbyTimer, setLobbyTimer] = useState<number | null>(null);
  const [gameTask, setGameTask] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    socket.on('updatePlayers', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('updateMonsters', (updatedMonsters) => {
      setMonsters(updatedMonsters);
    });

    socket.on('lobbyTimer', (timer) => {
      setLobbyTimer(timer);
    });

    socket.on('startGame', (data) => {
      setGameTask(data.task);
    });

    return () => {
      socket.off('updatePlayers');
      socket.off('updateMonsters');
      socket.off('lobbyTimer');
      socket.off('startGame');
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black relative" onClick={() => setHasInteracted(true)}>
      {!hasInteracted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 cursor-pointer">
          <div className="text-white text-center animate-pulse">
            <h2 className="text-4xl font-bold mb-4">BLOCKY BATTLE ROYALE</h2>
            <p className="text-xl text-yellow-400">O'yinni boshlash uchun ekranning istalgan joyiga bosing</p>
          </div>
        </div>
      )}
      {!selectedRole && (
        <RoleSelection onSelect={(role) => {
          setSelectedRole(role);
          socket.emit('selectRole', role);
        }} />
      )}
      {isMounted && (
        <>
          <TeamSelection onJoin={(teamId) => {
            socket.emit('joinTeam', teamId);
          }} />
          <Chat socket={socket} />
          <Minimap players={players} monsters={monsters} localId={socket.id} />
        </>
      )}
      
      {/* Top Center Timer */}
      {lobbyTimer !== null && lobbyTimer > 0 && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
          <div className="text-white/50 text-xs tracking-[0.2em] mb-1">O'YIN BOSHLANISHIGA</div>
          <div className="text-6xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-pulse">
            {lobbyTimer}
          </div>
        </div>
      )}
      
      {/* UI Overlay */}
      <div className="absolute top-[170px] left-4 z-10 text-white font-mono bg-black/50 p-3 rounded-lg text-xs">
        <p>O'yinchilar: {Object.keys(players).length}</p>
        {gameTask && <p className="text-green-400 font-bold mt-1">Vazifa: {gameTask}</p>}
      </div>

      <Canvas 
        shadows
        gl={{ antialias: true }}
        camera={{ position: [0, 5, 10], fov: 75 }}
      >
        <Sky sunPosition={[100, 20, 100]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} castShadow />
        <directionalLight
          position={[-10, 20, 10]}
          intensity={2.0}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <Suspense fallback={null}>
          {/* Ground */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#222" />
          </mesh>

          {/* Local Player */}
          <Player socket={socket} role={selectedRole || 'none'} />

          {/* Labyrinth */}
          <Labyrinth />

          {/* Other Players */}
          {Object.values(players).map((p: any) => (
            p.id !== socket.id && (
              <group 
                key={p.id} 
                position={[p.position.x, p.position.y, p.position.z]}
                rotation={p.state?.isLying ? [Math.PI / 2, 0, 0] : [0, 0, 0]}
              >
                {/* Body */}
                <mesh castShadow scale={[1, p.state?.isCrouching ? 0.6 : 1, 1]}>
                  <boxGeometry args={[0.8, 1.2, 0.4]} />
                  <meshStandardMaterial color={getRoleColor(p.role)} />
                </mesh>
                {/* Head */}
                <mesh position={[0, p.state?.isCrouching ? 0.5 : 0.9, 0]} castShadow>
                  <boxGeometry args={[0.5, 0.5, 0.5]} />
                  <meshStandardMaterial color="#ffcc99" />
                </mesh>
                {/* Arms */}
                <mesh position={[0.5, 0.1, p.state?.isPunching ? -0.4 : 0]}>
                  <boxGeometry args={[0.2, 0.8, 0.2]} />
                  <meshStandardMaterial color={getRoleColor(p.role)} />
                </mesh>

                {/* Sword for Warrior */}
                {p.role === 'warrior' && (
                  <group position={[0.5, 0.1, p.state?.isPunching ? -0.8 : -0.4]} rotation={[Math.PI / 2, 0, 0]}>
                    <mesh castShadow>
                      <boxGeometry args={[0.1, 1.2, 0.05]} />
                      <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
                    </mesh>
                    <mesh position={[0, -0.4, 0]}>
                      <boxGeometry args={[0.3, 0.1, 0.1]} />
                      <meshStandardMaterial color="#884400" />
                    </mesh>
                  </group>
                )}
              </group>
            )
          ))}

          {/* Monsters */}
          {Object.values(monsters).map((mob: any) => (
            <mesh key={mob.id} position={[mob.position.x, mob.position.y, mob.position.z]} castShadow>
              <boxGeometry args={[0.8, 1.2, 0.8]} />
              <meshStandardMaterial color="#ff0000" emissive="#550000" />
            </mesh>
          ))}
        </Suspense>

        <PointerLockControls />
        <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2.4} far={4.5} />
      </Canvas>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm flex flex-col items-center gap-1">
        <div>WASD - Yurish | SPACE - Sakrash | Sichqoncha - Aylanish</div>
        <div className="text-yellow-400 font-bold">Q - MAXSUS QOBILIYAT | C - EGILISH | X - YOTISH</div>
      </div>
    </div>
  );
}

function getRoleColor(role: string) {
  switch (role) {
    case 'warrior': return '#ff4444';
    case 'tank': return '#4444ff';
    case 'healer': return '#44ff44';
    case 'mage': return '#aa44ff';
    case 'thief': return '#444444';
    default: return '#ffffff';
  }
}
