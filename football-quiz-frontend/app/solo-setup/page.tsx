'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '../../store/useGameStore';

export default function SoloSetupPage() {
  const router = useRouter();
  const { setQuizState } = useGameStore();

  const handleTimeSelect = (seconds: number) => {
    setQuizState({ 
      timeLimit: seconds, 
      timeLeft: seconds,
      currentStep: 0,
      score: 0 
    });
    router.push('/solo-play');
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <h2 className="text-4xl font-black text-green-500 mb-2 italic">TIME SETTING</h2>
      <p className="text-gray-500 mb-12 font-bold uppercase tracking-widest text-sm">문제당 시간을 선택하세요</p>
      <div className="absolute top-8 right-30">
        <button 
          onClick={() => {
              router.push('/solo-select');
          }}
          className="px-6 py-2 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-bold"
        >
          뒤로 가기
        </button>
      </div>
      <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
        {[3, 5, 7, 10].map((time) => (
        <button
          key={time}
          onClick={() => handleTimeSelect(time)}
          className="bg-gray-900 py-8 border-2 border-blue-800 rounded-[2.5rem] hover:border-green-500 transition-all flex flex-col items-center justify-center group shadow-lg active:scale-95"
        >
          <span className="text-3xl font-black group-hover:text-green-400">{time}초</span>
        </button>
        ))}
      </div>
    </main>
  );
}