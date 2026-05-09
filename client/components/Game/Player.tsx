'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { MAZE_WALLS, CELL_SIZE } from '../../lib/maze';

export default function Player({ socket, role }: { socket: any, role: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  
  // Movement state
  const [keys, setKeys] = useState({ w: false, s: false, a: false, d: false, space: false, c: false, x: false, q: false });
  const [isPunching, setIsPunching] = useState(false);
  const [isHanging, setIsHanging] = useState(false);
  const velocity = useRef(new THREE.Vector3());
  const isGrounded = useRef(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setKeys((prev) => ({ ...prev, [key]: true, space: e.code === 'Space' }));
      if (key === 'q') {
        socket.emit('useSkill');
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: false, space: e.code === 'Space' ? false : prev.space }));
    };

    const handleMouseDown = () => {
      setIsPunching(true);
      socket.emit('action', { type: 'punch' });
      setTimeout(() => setIsPunching(false), 200);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const moveSpeed = 5;
    const jumpForce = 5;
    const gravity = 15;

    // Wall Detection
    const raycaster = new THREE.Raycaster();
    const rayDir = new THREE.Vector3(0, 0, -1).applyEuler(meshRef.current.rotation);
    raycaster.set(meshRef.current.position, rayDir);
    
    // Check if close to a wall (simplified check for demo)
    const isNearWall = meshRef.current.position.x > 38 || meshRef.current.position.x < -38 || 
                       meshRef.current.position.z > 38 || meshRef.current.position.z < -38;

    if (isNearWall && keys.space) {
      setIsHanging(true);
      velocity.current.y = 0;
    } else if (!keys.space) {
      setIsHanging(false);
    }

    // Direction calculation
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, Number(keys.s) - Number(keys.w));
    const sideVector = new THREE.Vector3(Number(keys.a) - Number(keys.d), 0, 0);

    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(moveSpeed).applyEuler(camera.rotation);

    velocity.current.x = direction.x;
    velocity.current.z = direction.z;

    // Gravity and Jumping
    if (isGrounded.current && keys.space && !isHanging) {
      velocity.current.y = jumpForce;
      isGrounded.current = false;
    }

    if (!isGrounded.current && !isHanging) {
      velocity.current.y -= gravity * delta;
    }

    // Apply movement with collision detection
    const nextX = meshRef.current.position.x + velocity.current.x * delta;
    const nextZ = meshRef.current.position.z + velocity.current.z * delta;
    
    if (!checkCollision(nextX, meshRef.current.position.z)) {
      meshRef.current.position.x = nextX;
    }
    if (!checkCollision(meshRef.current.position.x, nextZ)) {
      meshRef.current.position.z = nextZ;
    }
    
    meshRef.current.position.y += velocity.current.y * delta;

    // Ground collision (simple)
    const baseHeight = keys.x ? 0.2 : (keys.c ? 0.6 : 1);
    if (meshRef.current.position.y < baseHeight) {
      meshRef.current.position.y = baseHeight;
      velocity.current.y = 0;
      isGrounded.current = true;
    }

    // Update Camera to follow player
    const cameraOffset = keys.x ? 0.5 : (keys.c ? 1 : 1.5);
    camera.position.copy(meshRef.current.position).add(new THREE.Vector3(0, cameraOffset, 0));

    // Send update to server
    socket.emit('move', {
      position: meshRef.current.position,
      rotation: meshRef.current.rotation,
      state: {
        isCrouching: keys.c,
        isLying: keys.x,
        isPunching,
        isHanging,
        isUsingSkill: keys.q
      }
    });

    if (keys.q) {
      // Trigger local skill effect if needed
    }
  });

  return (
    <group ref={meshRef as any} position={[0, 1, 0]} rotation={keys.x ? [Math.PI / 2, 0, 0] : [0, 0, 0]}>
      {/* Body */}
      <mesh castShadow scale={[1, keys.c ? 0.6 : 1, 1]}>
        <boxGeometry args={[0.8, 1.2, 0.4]} />
        <meshStandardMaterial color={getRoleColor(role)} />
      </mesh>
      {/* Head */}
      <mesh position={[0, keys.c ? 0.5 : 0.9, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#ffcc99" />
      </mesh>
      {/* Arms / Punching Animation */}
      <mesh position={[0.5, 0.1, isPunching ? -0.4 : 0]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color={getRoleColor(role)} />
      </mesh>
      <mesh position={[-0.5, 0.1, 0]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color={getRoleColor(role)} />
      </mesh>

      {/* Sword for Warrior */}
      {role === 'warrior' && (
        <group position={[0.5, 0.1, isPunching ? -0.8 : -0.4]} rotation={[Math.PI / 2, 0, 0]}>
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
  );
}

function getRoleColor(role: string) {
  switch (role) {
    case 'warrior': return '#ff4444';
    case 'tank': return '#4444ff';
    case 'healer': return '#44ff44';
    case 'mage': return '#aa44ff';
    case 'thief': return '#444444';
    default: return '#44ff44';
  }
}

function checkCollision(x: number, z: number) {
  const playerRadius = 0.4;
  for (const wall of MAZE_WALLS) {
    const dx = Math.abs(x - wall.x);
    const dz = Math.abs(z - wall.z);
    if (dx < CELL_SIZE / 2 + playerRadius && dz < CELL_SIZE / 2 + playerRadius) {
      return true;
    }
  }
  return false;
}
