// frontend: hooks/useQuiz.ts
import { create } from 'zustand';
import { api } from '../lib/api';

interface QuizState {
  allQuizzes: any[];
  fetchQuizzes: () => Promise<void>;
}

export const useQuiz = create<QuizState>((set) => ({
  allQuizzes: [],
  fetchQuizzes: async () => {
    try {
      const { data } = await api.get('/api/quizzes');
      if (data.success) {
        set({ allQuizzes: data.quizzes });
      }
    } catch (err) {
      console.error('퀴즈 로드 실패:', err);
    }
  },
}));