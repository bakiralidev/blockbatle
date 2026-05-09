'use client';

import { useState, useEffect, useRef } from 'react';

export default function Chat({ socket }: { socket: any }) {
  const [messages, setMessages] = useState<{ id: string; text: string; sender: string }[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('chatMessage', (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off('chatMessage');
  }, [socket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('chatMessage', input);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-20 left-4 w-64 h-48 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex flex-col p-2 z-50">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 mb-2 text-xs scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className="text-white">
            <span className="text-yellow-400 font-bold">[{msg.sender.slice(0, 4)}]: </span>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Jamoaga yozish..."
          className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white outline-none focus:border-yellow-500"
        />
        <button type="submit" className="bg-yellow-500 text-black text-[10px] font-bold px-2 rounded">OK</button>
      </form>
    </div>
  );
}
