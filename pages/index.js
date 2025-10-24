import React, { useState } from 'react';
import { Calendar, Sparkles, Star, AlertCircle, Zap } from 'lucide-react';

export default function HoyoGachaFortune() {
  const [step, setStep] = useState(1);
  const [birthDate, setBirthDate] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [fortune, setFortune] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const games = [
    { 
      id: 'genshin', 
      name: 'Genshin Impact', 
      color: 'from-purple-600 via-blue-600 to-cyan-500',
      image: '/images/genshin.jpg' // วางไฟล์ genshin.jpg ในโฟลเดอร์ public/images/
    },
    { 
      id: 'starrail', 
      name: 'Honkai: Star Rail', 
      color: 'from-indigo-600 via-purple-600 to-pink-500',
      image: '/images/starrail.png' // วางไฟล์ starrail.jpg ในโฟลเดอร์ public/images/
    },
    { 
      id: 'zzz', 
      name: 'Zenless Zone Zero', 
      color: 'from-blue-600 via-indigo-600 to-purple-600',
      image: '/images/zzz.png' // วางไฟล์ zzz.jpg ในโฟลเดอร์ public/images/
    }
  ];

  const generateFortune = async (gameId) => {
    setLoading(true);
    setError('');
    
    try {
      const selectedGameData = games.find(g => g.id === gameId);

      if (!selectedGameData) {
        throw new Error(`Game with id "${gameId}" not found.`);
      }

      const response = await fetch('/api/generate-fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthDate,
          game: gameId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate fortune');
      }

      const data = await response.json();
      setFortune(data.fortune);
      setStep(3);
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการสร้างตารางโชคลาภ กรุณาลองใหม่อีกครั้ง');
      console.error('Error generating fortune:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDateSubmit = () => {
    if (birthDate) {
      const selectedDate = new Date(birthDate);
      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();
      
      if (age < 0 || age > 120) {
        setError('กรุณาเลือกวันเกิดที่ถูกต้อง');
        return;
      }
      
      setError('');
      setStep(2);
    }
  };

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
    generateFortune(gameId);
  };

  const resetApp = () => {
    setStep(1);
    setBirthDate('');
    setSelectedGame('');
    setFortune(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 3 + 2 + 's'
            }}
          >
            {i % 3 === 0 ? (
              <Star className="w-2 h-2 text-cyan-300/60" fill="currentColor" />
            ) : i % 3 === 1 ? (
              <Sparkles className="w-3 h-3 text-purple-300/50" />
            ) : (
              <div className="w-1 h-1 bg-blue-300/70 rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Nebula effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent pointer-events-none" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {/* Error Display */}
        {error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-red-500/50 z-50 border border-red-400/30">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Step 1: Enter Date */}
        {step === 1 && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <Sparkles className="w-16 h-16 text-cyan-400 animate-pulse drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]" />
              </div>
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent tracking-wider drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                LET&apos;S MOO
              </h1>
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-500 via-pink-400 to-cyan-400 bg-clip-text text-transparent tracking-wider drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                TOGETHER
              </h1>
            </div>
            
            <div className="mt-12 space-y-6">
              <div className="max-w-md mx-auto">
                <label className="block text-cyan-300 text-sm mb-2 font-medium">
                  กรุณาเลือกวันเกิดของคุณ
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-6 py-4 text-xl text-center bg-slate-800/50 backdrop-blur-sm border-2 border-purple-500/50 rounded-2xl text-cyan-100 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all shadow-lg hover:shadow-purple-500/50"
                />
              </div>
              
              <button
                onClick={handleDateSubmit}
                disabled={!birthDate}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-full text-white font-semibold hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/50 hover:shadow-cyan-500/50 transform hover:scale-105"
              >
                ดำเนินการต่อ
              </button>
            </div>

            <p className="text-cyan-300/70 text-sm mt-8 max-w-2xl mx-auto bg-slate-800/30 backdrop-blur-md rounded-2xl p-4 border border-purple-500/30">
              ⚠️ DISCLAIMER: เว็บไซต์นี้ทำเพื่อความบันเทิงเท่านั้น ไม่ใช่การพยากรณ์จริง ไม่รับประกันผลลัพธ์
            </p>
          </div>
        )}

        {/* Step 2: Choose Game */}
        {step === 2 && !loading && (
          <div className="text-center space-y-12">
            <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wider drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
              เลือกเกมของคุณ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => handleGameSelect(game.id)}
                  className="group relative w-60 aspect-square gap-100 max-w-6xl rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-xl shadow-purple-900/50 hover:shadow-2xl hover:shadow-cyan-500/50 border-2 border-purple-500/30 hover:border-cyan-400/50"
                >
                  {/* รูปภาพเกม */}
                  <img 
                    src={game.image} 
                    alt={game.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      // ถ้าโหลดรูปไม่สำเร็จ จะแสดง fallback
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback ถ้ารูปโหลดไม่ได้ */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} hidden items-center justify-center`}>
                    <Zap className="w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                  </div>
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-30 group-hover:opacity-50 transition-opacity mix-blend-overlay`} />
                  {/* Dark gradient at bottom for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent" />
                  {/* Title overlay */}
                  <div className="absolute inset-0 flex items-end justify-center pb-16">
                    <div className="text-center space-y-2 px-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                        {game.name}
                      </h3>
                    </div>
                  </div>
                  {/* HOYOVERSE badge */}
                  <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm py-3 border-t-2 border-cyan-400/30 group-hover:border-cyan-400/60 transition-colors">
                    <p className="text-cyan-300 font-bold tracking-wider">HOYOVERSE</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={resetApp}
              className="mt-8 px-6 py-2 bg-slate-800/50 backdrop-blur-sm border border-purple-500/50 rounded-full text-purple-300 font-medium hover:bg-slate-700/50 hover:border-cyan-400/50 hover:text-cyan-300 transition-all"
            >
              ← กลับไปเปลี่ยนวันเกิด
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center space-y-6">
            <div className="relative">
              <Sparkles className="w-24 h-24 text-cyan-400 mx-auto animate-spin drop-shadow-[0_0_30px_rgba(34,211,238,0.8)]" />
            </div>
            <h3 className="text-3xl font-bold text-cyan-300">
              กำลังคำนวณดวงชะตาของคุณ...
            </h3>
            <p className="text-purple-300">ดาวดวงต่างๆ กำลังเรียงตัว ✨</p>
          </div>
        )}

        {/* Step 3: Fortune Result */}
        {step === 3 && fortune && (
          <div className="max-w-4xl w-full space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                ตารางโชคลาภของคุณ
              </h2>
              <p className="text-cyan-300">สำหรับ {games.find(g => g.id === selectedGame)?.name}</p>
              {fortune.currentBanners && (
                <p className="text-purple-300 text-sm mt-2">
                  🎯 Current Banners: {fortune.currentBanners.join(', ')}
                </p>
              )}
            </div>

            {/* Lucky Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-500/50 shadow-lg shadow-purple-500/30 hover:shadow-cyan-500/50 hover:border-cyan-500/50 transition-all">
                <div className="text-center">
                  <Star className="w-8 h-8 text-cyan-400 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
                  <h4 className="text-cyan-300 text-sm mb-1 font-medium">องค์ประกอบมงคล</h4>
                  <p className="text-2xl font-bold text-white">{fortune.element}</p>
                </div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-500/50 shadow-lg shadow-purple-500/30 hover:shadow-pink-500/50 hover:border-pink-500/50 transition-all">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]" />
                  <h4 className="text-cyan-300 text-sm mb-1 font-medium">เลขนำโชค</h4>
                  <p className="text-2xl font-bold text-white">{fortune.luckyNumber}</p>
                </div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-500/50 shadow-lg shadow-purple-500/30 hover:shadow-blue-500/50 hover:border-blue-500/50 transition-all">
                <div className="text-center">
                  <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)]" />
                  <h4 className="text-cyan-300 text-sm mb-1 font-medium">วันเกิด</h4>
                  <p className="text-lg font-bold text-white">
                    {new Date(birthDate).toLocaleDateString('th-TH')}
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly Prediction */}
            {fortune.weeklyPrediction && (
              <div className="bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-500/50 shadow-lg shadow-purple-500/30">
                <h4 className="text-xl font-bold text-cyan-300 mb-2">โชคลาภประจำสัปดาห์</h4>
                <p className="text-purple-200">{fortune.weeklyPrediction}</p>
              </div>
            )}

            {/* Lucky Days */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-500/50 shadow-lg shadow-purple-500/30">
              <h3 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
                <Star className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]" fill="currentColor" />
                วันและเวลาแนะนำสำหรับกดกาชา
              </h3>
              <div className="space-y-3">
                {fortune.luckyDays.map((day, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border-2 border-purple-500/30 hover:border-cyan-400/50 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="text-cyan-300 font-semibold text-lg mb-1">{day.character}</p>
                        <p className="text-purple-300 text-sm">
                          {new Date(day.date).toLocaleDateString('th-TH', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-blue-300 text-sm mb-2">🕐 {day.time}</p>
                        {day.reason && (
                          <p className="text-purple-200 text-sm italic">💫 {day.reason}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]">{day.luck}%</div>
                        <div className="text-purple-300 text-xs">โชคลาภ</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice */}
            <div className="bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-500/50 shadow-lg shadow-purple-500/30">
              <h4 className="text-xl font-bold text-cyan-300 mb-2">🌟 คำแนะนำจากดวงดาว</h4>
              <p className="text-purple-200">{fortune.advice}</p>
            </div>

            {/* Reset Button */}
            <div className="text-center mt-8">
              <button
                onClick={resetApp}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-full text-white font-semibold hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400 transition-all shadow-lg shadow-purple-500/50 hover:shadow-cyan-500/50 transform hover:scale-105"
              >
                ทำนายใหม่อีกครั้ง
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
