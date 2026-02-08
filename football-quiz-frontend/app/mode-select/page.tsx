'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '../../store/useGameStore';
import { GlobalHeader } from '../../components/GlobalHeader';

export default function ModeSelectPage() {
  const router = useRouter();
  const { currentUser } = useGameStore();
  // const isAdmin = currentUser?.username === 'admin'; 

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-6">
      <GlobalHeader />
      
      <h1 className="text-5xl font-black mb-16 text-green-500 italic tracking-tighter">MODE SELECT</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div 
          onClick={() => router.push('/solo-select')}
          className="group p-10 bg-gray-900 rounded-[2.5rem] border-2 border-gray-800 hover:border-green-500 cursor-pointer transition shadow-2xl flex flex-col items-center text-center"
        >
          <div className="mode-icon mb-6">
            <img src="/single.png" alt="아이콘" width="70" />
          </div>
          <h2 className="text-3xl font-bold mb-3 group-hover:text-green-400">SOLO PLAY</h2>
          <p className="text-gray-500 text-lg">혼자서 즐기는 실력 테스트</p>
        </div>

        <div 
          onClick={() => router.push('/lobby')}
          className="group p-10 bg-gray-900 rounded-[2.5rem] border-2 border-gray-800 hover:border-green-500 cursor-pointer transition shadow-2xl flex flex-col items-center text-center"
        >
          <div className="mode-icon mb-6">
            <img src="/multi.png" alt="아이콘" width="70" />
          </div>
          <h2 className="text-3xl font-bold mb-3 group-hover:text-green-400">MULTI PLAY</h2>
          <p className="text-gray-500 text-lg">실시간 퀴즈 대결</p>
        </div>
      </div>
      {/* {isAdmin && (
        <button 
          onClick={() => router.push('/admin/quiz')}
          className="mt-12 px-8 py-3 bg-gray-800 text-gray-400 rounded-full font-bold hover:bg-white hover:text-black transition"
        >
          관리자 퀴즈 등록
        </button>
      )} */}
    </main>
  );
}