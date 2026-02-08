'use client';

import { useState } from 'react';
import { useEffect } from 'react'; // 추가
import { useRouter } from 'next/navigation';
import { useGameStore } from '../../store/useGameStore';
import { api } from '../../lib/api';
import { GlobalHeader } from '../../components/GlobalHeader';

export default function MyPage() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useGameStore();
  
  const [newNickname, setNewNickname] = useState(currentUser?.nickname || "");

  const solved = currentUser?.totalSolved || 0;
  const correct = currentUser?.totalCorrect || 0;
  const accuracy = solved > 0 ? Math.round((correct / solved) * 100) : 0;

  const handleUpdateNickname = async () => {
    try {
      const { data } = await api.post('/api/users/update-nickname', { nickname: newNickname });
      if (data.success) {
        setCurrentUser(data.user); 
        alert('닉네임 변경 완료!');
      }
    } catch (err) {
      alert('이미 사용 중인 닉네임이거나 서버 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const fetchLatestUserData = async () => {
      try {
        const { data } = await api.get('/api/users/me');
        if (data.success) {
          setCurrentUser(data.user);
        }
      } catch (err) {
        console.error("최신 유저 정보를 가져오는데 실패했습니다.", err);
      }
    };

    fetchLatestUserData();
  }, [setCurrentUser]);
  
  return (
    <main className="min-h-screen bg-gray-950 text-white pt-24 p-8">
      <GlobalHeader />
      <div className="max-w-2xl mt-4 mx-auto">
        <button onClick={() => router.back()} className="text-gray-400 mb-8 text-gray-500 hover:text-white">← 돌아가기</button>
        
        <h2 className="text-4xl font-black text-green-500 mb-10 italic">MY PAGE</h2>

        <div className="bg-gray-900 p-8 mb-18 rounded-[2.5rem] border border-gray-800 mb-8 shadow-2xl">
          <label className="text-s font-black text-gray-500 uppercase tracking-widest block mb-6 text-center">나의 기록</label>
          
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="bg-black/50 p-6 w-70 rounded-3xl border border-gray-800">
              <span className="block text-gray-400 text-sm mb-1 font-bold text-center">총 풀이 문제</span>
              <span className="text-2xl font-black block text-center">{solved}개</span>
            </div>
            <div className="bg-black/50 p-6 w-70 rounded-3xl border border-gray-800">
              <span className="block text-gray-400 text-sm mb-1 font-bold text-center">평균 정답률</span>
              <span className="text-2xl font-black text-green-500 block text-center">{accuracy}%</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 p-8 rounded-[2.5rem] border border-gray-800 space-y-8">
          <div>
            <label className="text-s font-black text-gray-500 uppercase tracking-widest block mb-4">닉네임 변경</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                className="flex-1 bg-black border border-gray-800 p-4 rounded-xl focus:border-green-500 outline-none font-bold"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
              />
              <button 
                onClick={handleUpdateNickname}
                className="bg-transparent mt-0.5 px-6 w-20 h-13 rounded-xl border-2 border-blue-800 text-blue-500 hover:bg-blue-800 hover:text-white transition font-bold"
              >
                변경
              </button>
            </div>
          </div>

          <div>
            {/* <label className="text-s font-black text-gray-500 uppercase tracking-widest block mb-4">계정 관리</label> */}
            {/* <button className="w-full p-4 bg-red-900/20 border border-red-900/30 text-red-500 rounded-xl font-bold hover:bg-red-900/30 transition text-center">
              로그아웃 (Logout)
            </button> */}
          </div>
        </div>
      </div>
    </main>
  );
}