'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '../../store/useGameStore';

export default function SoloResultPage() {
  const router = useRouter();
  const { soloResults } = useGameStore();

  if (!soloResults) return null;

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-black italic text-green-500 mb-6">COMPLETED!</h1>
      <p className="text-gray-500 font-bold mb-16">당신의 기록을 확인하세요</p>

      <div className="bg-gray-900 py-10 p-16 rounded-[3rem] border border-gray-800 text-center shadow-2xl mb-12">
        <div className="text-5xl font-black mb-4">
          <span className="text-green-500">{soloResults.score}</span>
          <span className="text-gray-700 mx-4">/</span>
          <span className="text-gray-500">{soloResults.total}</span>
        </div>
        <p className="text-2xl mt-6 font-bold text-gray-400">
          {soloResults.score === soloResults.total ? "훌륭해요!" : "고생하셨습니다!"}
        </p>
      </div>

      <button 
        onClick={() => router.push('/mode-select')}
        className="px-15 py-2 bg-transparent font-bold border-2 border-green-600 mt-7 text-green-500 hover:text-black text-2xl rounded-2xl hover:bg-green-600 transition transform active:scale-95 shadow-xl"
      >
        확인
      </button>
    </main>
  );
}