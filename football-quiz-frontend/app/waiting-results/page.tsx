'use client';

export default function WaitingResults() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white">
      <div className="text-8xl mb-8 animate-bounce">🏆</div>
      <h2 className="text-4xl font-black italic text-green-500 mb-4 uppercase tracking-tighter">Calculating Results...</h2>
      <p className="text-gray-500 font-bold animate-pulse text-lg">
        다른 플레이어들의 응답을 수집하고 있습니다. 잠시만 기다려주세요!
      </p>
      
      <div className="flex gap-2 mt-8">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-[bounce_1s_infinite_100ms]"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-[bounce_1s_infinite_300ms]"></div>
      </div>
    </div>
  );
}