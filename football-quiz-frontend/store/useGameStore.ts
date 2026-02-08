// frontend/store/useGameStore.ts
import { create } from 'zustand';

interface GameState {
  // 인증 및 유저 정보
  currentUser: any | null;
  setCurrentUser: (user: any) => void;

  // 로비 및 방 상태
  lobbyData: { users: any[]; rooms: any[] };
  setLobbyData: (data: any) => void;
  currentRoom: any | null;
  setCurrentRoom: (room: any) => void;
  roomNotice: string | null; // 알림 메시지 저장소
  setRoomNotice: (msg: string | null) => void;

  // 퀴즈 진행 상태
  filteredQuizzes: any[];
  currentStep: number;
  score: number;
  timeLeft: number;
  timeLimit: number;
  setQuizState: (data: Partial<GameState>) => void;

  // 결과 데이터
  gameResults: any | null; // 멀티플레이 결과
  soloResults: { score: number; total: number } | null; // 솔로 결과
  
  // 초기화 함수
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  lobbyData: { users: [], rooms: [] },
  setLobbyData: (data) => set({ lobbyData: data }),
  currentRoom: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),
  roomNotice: null,
  setRoomNotice: (msg) => set({ roomNotice: msg }),


  filteredQuizzes: [],
  currentStep: 0,
  score: 0,
  timeLeft: 10,
  timeLimit: 10,
  setQuizState: (data) => set((state) => ({ ...state, ...data })),

  gameResults: null,
  soloResults: null,

  resetGame: () => set({
    currentStep: 0,
    score: 0,
    gameResults: null,
    soloResults: null,
    filteredQuizzes: []
  }),
}));