'use client';

import { useState } from 'react';
import { LoginModal } from '../components/LoginModal';
import { RegisterModal } from '../components/RegisterModal';

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const handleSwitchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-white blur-[120px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black blur-[80px] rounded-full" />
      
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-7xl font-black italic mb-4 tracking-tighter uppercase">
          <span className="text-green-600">F</span>
          <span className="text-gray-400 mx-1">OO</span>
          <span className="text-green-600">T</span>
          <span className="text-gray-400 mx-1">:</span>
          <span className="text-green-600">A</span>
          <span className="text-gray-400">G</span>
          <span className="text-green-600">E</span>
        </h1>
        
        <p className="text-gray-500 font-bold mb-12 text-xl tracking-widest">FOOTBALL QUIZ CHALLENGE</p>

        <button 
          onClick={() => setIsLoginOpen(true)}
          className="px-16 py-3 mt-8 bg-transparent rounded-2xl border-2 border-green-600  font-black text-2xl hover:bg-green-600 transition-all hover:scale-105 shadow-2xl shadow-green-900/40 active:scale-95"
        >
          START
        </button>
      </div>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onSuccess={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </main>
  );
}