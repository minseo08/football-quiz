'use client';

import { useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useGameSocket } from '../../hooks/useGameSocket';
import { useRouter } from 'next/navigation';
import { GlobalHeader } from '../../components/GlobalHeader';
import { socket } from '../../lib/socket';

export default function LobbyPage() {
  const { lobbyData, currentUser, roomNotice, setRoomNotice } = useGameStore();
  const { joinLobby, createRoom, joinRoom } = useGameSocket();
  const router = useRouter();

  useEffect(() => {
    joinLobby();
    return () => {
      socket.emit('leave_lobby');
    };
  }, []);

  useEffect(() => {
    if (roomNotice) {
      alert(roomNotice);
      setRoomNotice(null);
    }
  }, [roomNotice]);

  return (
    <main className="flex min-h-screen bg-black text-white p-8 pt-24">
      <GlobalHeader />

      <div className="flex-1 max-w-5xl mx-auto">
        <button 
          onClick={() => router.push('/mode-select')}
          className="mb-6 text-gray-500 hover:text-white mt-5 transition font-bold flex items-center gap-2"
        >
          <span>←</span> 모드 선택으로
        </button>

        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-black text-green-500 italic">MULTI MODE</h2>
          <button 
            onClick={() => createRoom(`${currentUser?.nickname}님의 방`, 5)}
            className="bg-transparent border-2 border-green-600 text-green-500 px-6 py-3 rounded-2xl font-black hover:bg-green-600 hover:text-white transition-all shadow-xl shadow-green-900/10 active:scale-95"
          >
            + CREATE ROOM
          </button>
        </div>

        <div className="grid gap-4">
          {lobbyData.rooms.map((room) => (
          <div 
            key={room.id} 
            className="bg-gray-900 p-8 md:w-[70%] rounded-3xl flex justify-between items-center border border-gray-800 w-full max-w-2xl mx-auto"
          >
            <div>
              <h3 className="text-2xl font-bold mb-1">{room.name}</h3>
              <p className="text-gray-500 mt-3 font-medium text-sm uppercase tracking-wider">
                대기 인원: {room.players.length} / 8
              </p>
            </div>
            
            <button 
              onClick={() => joinRoom(room.id)}
              className="bg-transparent border-2 border-yellow-500 text-yellow-500 px-8 py-3 rounded-xl font-black hover:bg-yellow-500 hover:text-black transition-all active:scale-95"
            >
              입장
            </button>
          </div>
          ))}
          {lobbyData.rooms.length === 0 && (
            <div className="text-center py-32 bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-800 flex flex-col items-center justify-center">
                <div className="mode-icon mb-6">
                <img src="/noroom.png" alt="아이콘" width="70" />
                </div>
              <p className="text-gray-600 text-xl font-bold">진행 중인 방이 없습니다. 첫 번째 방을 만들어보세요!</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-72 ml-10 bg-gray-900 mt-10 p-8 rounded-3xl h-fit border border-gray-800 shadow-2xl">
        <h3 className="text-gray-500 font-black mb-6 uppercase text-[16px] text-center">
          Online Users ({lobbyData.users.length})
        </h3>
        <ul className="space-y-4">
          {lobbyData.users.map((user) => (
            <li key={user.id} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-base font-bold text-gray-200">
                {user.name} {user.id === socket.id && <span className="text-green-800 text-[15px] ml-1">(나)</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}