import GameCanvas from '@/components/Game/GameCanvas';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <GameCanvas />
    </main>
  );
}
