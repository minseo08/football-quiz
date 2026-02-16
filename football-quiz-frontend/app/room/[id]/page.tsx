'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useGameStore } from '../../../store/useGameStore';
import { useGameSocket } from '../../../hooks/useGameSocket';
import { useQuiz } from '../../../hooks/useQuiz';
import { socket } from '../../../lib/socket';

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id;
  const { currentRoom } = useGameStore();
  const { toggleReady, selectQuizType, leaveRoom } = useGameSocket();

  const { fetchQuizzes } = useQuiz();

  useEffect(() => {
    return () => {
      const isMovingToGame = window.location.pathname.includes('/game');
      const isStillInRoom = window.location.pathname.includes(`/room/${roomId}`);

      if (currentRoom?.id === roomId && !isStillInRoom && !isMovingToGame) {
        console.log(`진짜 방 이탈(로비행 등): leaveRoom 실행`);
        leaveRoom();
      }
    };
  }, [leaveRoom, currentRoom?.id, roomId]);

  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <p>방 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  const isHost = currentRoom.host === socket.id;
  const myPlayer = currentRoom.players.find((p: any) => p.id === socket.id);

  const handleStartGame = async () => {
    if (!isHost) return;

    if (!currentRoom.quizType) {
      alert("퀴즈 카테고리를 선택해주세요!");
      return;
    }

    const allReady = currentRoom.players
      .filter((p: any) => p.id !== currentRoom.host)
      .every((p: any) => p.isReady);

    if (!allReady) {
      alert("모든 플레이어가 준비되어야 합니다!");
      return;
    }

    try {
      await fetchQuizzes();
      const latestQuizzes = useQuiz.getState().allQuizzes;

      const filtered = latestQuizzes.filter(
        (q: any) => q.type?.toLowerCase().trim() === currentRoom.quizType.toLowerCase().trim()
      );

      if (filtered.length === 0) {
        alert(`카테고리에 등록된 퀴즈가 없습니다. (현재 전체 퀴즈: ${latestQuizzes.length}개)`);
        return;
      }
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);

      socket.emit('start_game', {
        roomId: currentRoom.id,
        quizzes: shuffled,
        timeLimit: currentRoom.timeLimit || 10
      });

      } catch (err) {
        console.error("게임 시작 중 오류 발생:", err);
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const time = parseInt(e.target.value);
    socket.emit('select_time_limit', { roomId: currentRoom.id, timeLimit: time });
  };

  const handleQuizCountChange = (count: number) => {
    if (!isHost) return;
    socket.emit('select_quiz_count', { roomId: currentRoom.id, quizCount: count });
  };
  return (
    <main className="flex min-h-screen bg-gray-950 text-white p-10">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-12 border-b border-gray-800 pb-8">
          <div>
            <h1 className="text-5xl font-black text-green-500 italic uppercase tracking-tighter mb-4">Waiting Room</h1>
            <p className="text-xl text-gray-500 font-medium">{currentRoom.name}</p>
          </div>
          <button 
            onClick={() => leaveRoom()}
            className="px-8 py-3 bg-red-950/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition font-black border border-red-900/60"
          >
            나가기
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 h-fit">
            {currentRoom.players.map((player: any) => (
              <div key={player.id} className="bg-gray-900 p-8 rounded-[2rem] border border-gray-800 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-5">
                  <div className="mode-icon mt-4 mb-6">
                    {player.id === currentRoom.host ? <img src="/boss.png" alt="아이콘" width="50" /> : <img src="/noboss.png" alt="아이콘" width="40" />}
                  </div>
                  <div>
                    <p className="text-xl font-bold">{player.name}</p>
                    <p className="text-xs font-black text-gray-600 uppercase tracking-widest mt-1">
                      {player.id === currentRoom.host ? 'Room Host' : 'Challenger'}
                    </p>
                  </div>
                </div>
                <div>
                  {player.id === currentRoom.host ? (
                    <span className="text-yellow-500 font-black text-sm italic tracking-widest">HOST</span>
                  ) : (
                    <span className={`font-black text-sm tracking-widest ${player.isReady ? 'text-green-500' : 'text-gray-700'}`}>
                      {player.isReady ? 'READY' : 'WAITING'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 p-10 rounded-[2.5rem] border border-gray-800 h-fit shadow-2xl">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="mode-icon shrink-0">
                <img src="/config.png" alt="아이콘" width="30" />
              </div>
              <h3 className="text-[20px] font-black text-blue-500 uppercase mt-3 mb-3 text-center">Quiz Config</h3>
            </div>
            <div className="space-y-8">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-3 uppercase text-center">Quiz Category</label>
                <select 
                  disabled={!isHost}
                  value={currentRoom.quizType || ''}
                  onChange={(e) => selectQuizType(currentRoom.id, e.target.value)}
                  className="w-full bg-black p-4 rounded-2xl border border-gray-800 text-base font-bold focus:border-green-500 outline-none disabled:opacity-50 transition text-center"
                >
                  <option value="" disabled>카테고리 선택</option>
                  <option value="logo">팀 로고 맞히기</option>
                  <option value="player">선수 맞히기</option>
                  <option value="stadium">경기장 맞히기</option>
                  <option value="nationality">선수 국적 맞히기</option>
                  <option value="career">커리어로 선수 맞히기</option>
                  <option value="squad_nation">국적 스쿼드로 팀 맞히기</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-3 uppercase text-center">Total Quiz</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((count) => (
                    <button
                      key={count}
                      disabled={!isHost}
                      onClick={() => handleQuizCountChange(count)}
                      className={`py-3 rounded-xl font-bold text-sm transition-all ${
                        (currentRoom.quizCount || 10) === count 
                          ? 'bg-blue-700 text-white border-2 border-blue-900 shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                          : 'bg-black border border-gray-800 text-blue-500 hover:border-blue-500'
                      }`}
                    >
                      {count}개
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-3 uppercase text-center">Time Limit (Per Quiz)</label>
                <select 
                  disabled={!isHost}
                  value={currentRoom.timeLimit || 10}
                  onChange={handleTimeChange}
                  className="w-full bg-black p-4 rounded-2xl border border-gray-800 font-bold focus:border-green-500 outline-none disabled:opacity-50 text-center"
                >
                  <option value={3}>3초</option>
                  <option value={5}>5초</option>
                  <option value={7}>7초</option>
                  <option value={10}>10초</option>
                </select>
              </div>
              {!isHost ? (
                <button 
                  onClick={() => toggleReady(currentRoom.id)}
                  className={`w-full mt-2 py-3 rounded-2xl font-black text-xl transition-all active:scale-95 ${
                    myPlayer?.isReady ? 'bg-gray-800 text-red-500 hover:bg-red-500 hover:text-white border-2 border-red-500/30' : 'bg-gray-800 text-green-500 hover:bg-green-500 hover:text-black border-2 border-green-500/30 shadow-lg shadow-green-900/20'
                  }`}
                >
                  {myPlayer?.isReady ? '준비 취소' : '준비 완료'}
                </button>
              ) : (
                <button 
                  onClick={handleStartGame}
                  className="bg-gray-800 border-2 border-green-600 text-green-500 hover:bg-green-500 hover:text-black w-full py-3 mt-3 rounded-2xl font-black text-xl hover:bg-green-500 transition-all active:scale-95 shadow-lg shadow-green-900/40"
                >
                  퀴즈 시작
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}