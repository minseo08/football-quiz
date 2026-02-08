'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '../../store/useGameStore';
import { useGameSocket } from '../../hooks/useGameSocket';
import { GlobalHeader } from '../../components/GlobalHeader';
import { socket } from '../../lib/socket';

export default function GameResultsPage() {
  const router = useRouter();
  const { gameResults, currentUser, currentRoom } = useGameStore();

  useGameSocket();
  const handleBackToRoom = () => {
    if (!currentRoom) {
      alert("방 정보를 찾을 수 없습니다. 로비로 이동합니다.");
      router.push('/lobby');
      return;
    }
    socket.emit('back_to_room', { roomId: currentRoom.id });
  };

  if (!gameResults) return null;

  return (
    <main className="min-h-screen bg-gray-950 text-white pt-24 p-8">
      <GlobalHeader />
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-black italic text-green-500 mt-6 mb-2">QUIZ RESULTS</h1>
        <p className="text-gray-500 font-bold mb-16">총 {gameResults.totalQuestions}문제 중 누가 최고일까요?</p>

        <div className="flex justify-center items-end gap-4 mb-20 h-64">
          {gameResults.players.slice(0, 3).map((player: any) => (
            <div key={player.playerId} className="flex flex-col items-center flex-1">
                  
                  <div className="mode-icon mt-4 mb-6">
                    <img 
                      src={
                        player.rank === 1 ? "/gold.png" : 
                        player.rank === 2 ? "/silver.png" : 
                        "/bronze.png"
                      } 
                      alt={`${player.rank}등 메달`} 
                      width="50" 
                    />
                  </div>

                  <div className="font-bold text-lg mb-2">
                    {player.name} {player.name === currentUser?.nickname && "(나)"}
                  </div>
                  <div className={`w-full rounded-t-2xl flex items-center justify-center font-black text-4xl
                    ${player.rank === 1 ? 'h-40 bg-yellow-500 text-yellow-900' : 
                      player.rank === 2 ? 'h-32 bg-gray-400 text-gray-800' : 
                      'h-24 bg-orange-700 text-orange-200'}`}>
                    {player.rank}
                  </div>
                </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 mb-12">
          {gameResults.players.map((player: any) => (
            <div key={player.playerId} className={`flex items-center justify-between p-6 border-b border-gray-800 last:border-0 ${player.name === currentUser?.nickname ? 'bg-green-900/20' : ''}`}>
              <div className="flex items-center gap-6">
                <span className="text-2xl font-black italic text-gray-700 w-10">#{player.rank}</span>
                <span className="text-xl font-bold">{player.name}</span>
              </div>
              <span className="text-xl font-black text-green-500">{player.score}문제</span>
            </div>
          ))}
        </div>

        <button 
          onClick={handleBackToRoom}
          className="px-15 py-3 bg-transparent border-2 border-blue-600 mt-7 text-blue-500 hover:text-white text-2xl rounded-2xl hover:bg-blue-400 transition transform active:scale-95 shadow-xl"
        >
          확인
        </button>
      </div>
    </main>
  );
}