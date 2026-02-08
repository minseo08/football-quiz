// frontend/app/layout.tsx
'use client';

import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { api } from '../lib/api';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCurrentUser, currentUser } = useGameStore();

  useEffect(() => {
    // 이미 데이터가 있다면 굳이 다시 묻지 않습니다.
    if (currentUser) return;

    // 서버에 세션 정보를 확인합니다.
    api.get('/api/auth/check')
      .then(({ data }) => {
        if (data.authenticated) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {
        console.log('인증되지 않은 유저입니다.');
      });
  }, [setCurrentUser, currentUser]);

  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}