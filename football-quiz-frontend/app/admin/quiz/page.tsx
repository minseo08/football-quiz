'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { GlobalHeader } from '../../../components/GlobalHeader';
import { useRouter } from 'next/navigation';

const DEFAULT_QUESTIONS: Record<string, string> = {
  logo: '이 팀의 이름은 무엇일까요?',
  player: '이 선수의 이름은 무엇일까요?',
  stadium: '이 경기장의 이름은 무엇일까요?',
  nationality: '이 선수의 국적은 무엇일까요?',
  career: '이와 같은 커리어를 가진 선수의 이름은 무엇일까요?',
  squad_nation: '이와 같은 스쿼드에 해당하는 팀의 이름은 무엇일까요?'
};

export default function AdminQuizPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: 'logo',
    question: DEFAULT_QUESTIONS['logo'],
    imageUrls: '',
    options: ['', '', '', ''],
    answer: ''
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      question: DEFAULT_QUESTIONS[prev.type] || ''
    }));
  }, [formData.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isMultipleChoice = formData.type === 'logo' || formData.type === 'stadium' || formData.type === 'nationality';

    const quizData = {
      type: formData.type,
      question: formData.question,
      imageUrls: formData.imageUrls.split(',').map(url => url.trim()),
      options: isMultipleChoice ? formData.options : [],
      answer: formData.answer.split(',').map(ans => ans.trim())
    };

    try {
      await api.post('/api/quizzes', quizData);
      alert('퀴즈 저장 성공!');
      setFormData({ type: 'logo', question: DEFAULT_QUESTIONS[formData.type], imageUrls: '', options: ['', '', '', ''], answer: '' });
    } catch (error) {
      alert('서버 저장 중 오류가 발생했습니다.');
    }
  };

  const isMultipleChoice = formData.type === 'logo' || formData.type === 'stadium' || formData.type === 'nationality';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <GlobalHeader />
      <div className="pt-24 px-6 max-w-2xl mx-auto">
        <button 
          onClick={() => router.push('/mode-select')}
          className="mt-6 mb-8 text-gray-500 hover:text-white transition font-bold"
        >
          ← 모드 선택으로
        </button>
        <h2 className="text-3xl font-black text-green-500 mb-8 italic">QUIZ ADMIN</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-8 rounded-3xl border border-gray-800">

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">퀴즈 유형</label>
            <select 
              className="w-full p-4 bg-black rounded-xl border border-gray-800 outline-none focus:border-green-500"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="logo">팀 로고 맞히기</option>
              <option value="player">선수 맞히기</option>
              <option value="stadium">경기장 맞히기</option>
              <option value="nationality">선수 국적 맞히기</option>
              <option value="career">커리어로 선수 맞히기</option>
              <option value="squad_nation">국적 스쿼드로 팀 맞히기</option>
            </select>
          </div>

          <input 
            className="w-full p-4 bg-black rounded-xl border border-gray-800 outline-none"
            placeholder="문제 내용"
            value={formData.question}
            onChange={(e) => setFormData({...formData, question: e.target.value})}
            required
          />

          <input 
            className="w-full p-4 bg-black rounded-xl border border-gray-800 outline-none"
            placeholder="이미지 주소 (쉼표로 구분)"
            value={formData.imageUrls}
            onChange={(e) => setFormData({...formData, imageUrls: e.target.value})}
            required
          />

          {isMultipleChoice && (
            <div className="grid grid-cols-2 gap-3">
              {formData.options.map((opt, i) => (
                <input 
                  key={i}
                  className="p-4 bg-black rounded-xl border border-gray-800 outline-none"
                  placeholder={`보기 ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...formData.options];
                    newOpts[i] = e.target.value;
                    setFormData({...formData, options: newOpts});
                  }}
                  required
                />
              ))}
            </div>
          )}

          <input 
            className="w-full p-4 bg-black rounded-xl border border-green-900/50 outline-none"
            placeholder="정답 (여러 개면 쉼표 구분)"
            value={formData.answer}
            onChange={(e) => setFormData({...formData, answer: e.target.value})}
            required
          />

          <button type="submit" className="w-full mt-2 py-3 bg-transparent border-2 border-green-600 rounded-2xl font-black text-xl hover:bg-green-500 transition">
            퀴즈 추가
          </button>
        </form>
      </div>
    </div>
  );
}