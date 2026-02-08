'use client';

import { useState } from 'react';
import { api } from '../lib/api';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RegisterModal({ isOpen, onClose, onSuccess }: RegisterModalProps) {
  const [formData, setFormData] = useState({ username: '', password: '', nickname: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/auth/register', formData);
      if (data.success) {
        alert('회원가입이 완료되었습니다! 로그인해주세요.');
        onSuccess();
      }
    } catch (err) {
      alert('이미 존재하는 아이디이거나 닉네임입니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300">
        <h2 className="text-3xl font-black text-blue-500 mb-8 italic">SIGN UP</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-2">Username</label>
            <input 
              type="text" required
              className="w-full bg-black border border-gray-800 p-4 rounded-xl focus:border-blue-500 outline-none font-bold"
              placeholder="사용할 아이디를 입력하세요" onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-2">Nickname</label>
            <input 
              type="text" required
              className="w-full bg-black border border-gray-800 p-4 rounded-xl focus:border-blue-500 outline-none font-bold"
              placeholder="사용할 닉네임을 입력하세요" onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-2">Password</label>
            <input 
              type="password" required
              className="w-full mb-6 bg-black border border-gray-800 p-4 rounded-xl focus:border-blue-500 outline-none font-bold"
              placeholder="사용할 비밀번호를 입력하세요" onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button type="submit" className="w-full mt-2 py-2 bg-transparent border-2 border-blue-600 rounded-xl font-black text-xl hover:bg-blue-500 transition">
            ENTER
          </button>
        </form>
        <button onClick={onClose} className="mt-6 w-full text-gray-600 text-xs font-bold hover:text-red-500 transition uppercase">Cancel</button>
      </div>
    </div>
  );
}