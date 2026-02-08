import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { socket } from '../lib/socket';
import { useGameStore } from '../store/useGameStore';
import { useQuiz } from './useQuiz';

interface LobbyData {
  users: { id: string; name: string }[];
  rooms: { id: string; name: string; players: any[] }[];
}

interface RoomData {
  id: string;
  name: string;
  host: string;
  players: any[];
  timeLimit: number;
  quizType: string;
}

export const useGameSocket = () => {
  const router = useRouter();
  const { setLobbyData, setCurrentRoom, setQuizState, setRoomNotice } = useGameStore();
  const { allQuizzes } = useQuiz();

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on('lobby_update', (data: LobbyData) => {
      console.log('로비 데이터 수신:', data);
      setLobbyData(data);
    });

    socket.on('room_joined', (room: RoomData) => {
      setCurrentRoom(room);
      router.push(`/room/${room.id}`);
    });

    socket.on('room_update', (room: RoomData) => {
      setCurrentRoom(room);
    });

    socket.on('room_deleted', () => {
      setRoomNotice('방장이 방을 삭제했습니다.');
      setCurrentRoom(null);
      router.push('/lobby');
    });

    socket.on('left_room', () => {
      setCurrentRoom(null);
      router.push('/lobby');
    });

    socket.on('game_started', ({ quizzes, timeLimit }) => {
      console.log('서버로부터 받은 퀴즈 수:', quizzes.length);

      if (!quizzes || quizzes.length === 0) {
        alert("퀴즈 데이터를 받지 못했습니다.");
        return;
      }

      setQuizState({
        filteredQuizzes: quizzes,
        timeLimit: timeLimit,
        timeLeft: timeLimit,
        currentStep: 0,
        score: 0,
      });
      router.push('/game');
    });

    socket.on('game_results', (results) => {
      setQuizState({ gameResults: results });
      router.push('/game-results');
    });

    socket.on('error', (data) => {
      alert(data.message);
    });


    return () => {
      socket.off('lobby_update');
      socket.off('room_joined');
      socket.off('room_update');
      socket.off('room_deleted');
      socket.off('left_room');
      socket.off('game_started');
      socket.off('error');
    };
  }, [router, setLobbyData, setCurrentRoom, setQuizState, allQuizzes]);

  const joinLobby = () => socket.emit('join_lobby');
  const createRoom = (roomName: string, timeLimit: number) => socket.emit('create_room', { roomName, timeLimit });
  const joinRoom = (roomId: string) => socket.emit('join_room', { roomId });
  
  const toggleReady = (roomId: string) => socket.emit('toggle_ready', { roomId });
  const selectQuizType = (roomId: string, quizType: string) => socket.emit('select_quiz_type', { roomId, quizType });
  const leaveRoom = () => socket.emit('leave_room');
  const startGame = (roomId: string) => socket.emit('start_game', { roomId });

  return { joinLobby, createRoom, joinRoom, toggleReady, selectQuizType, leaveRoom, startGame };
};