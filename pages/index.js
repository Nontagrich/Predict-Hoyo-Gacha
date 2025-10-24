import React, { useState } from 'react';
import { Calendar, Sparkles, Star, AlertCircle, Heart } from 'lucide-react';

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
      color: 'from-pink-300 to-rose-400'
    },
    { 
      id: 'starrail', 
      name: 'Honkai: Star Rail', 
      color: 'from-pink-400 to-fuchsia-400'
    },
    { 
      id: 'zzz', 
      name: 'Zenless Zone Zero', 
      color: 'from-rose-400 to-pink-500'
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white relative overflow-hidden">
      {/* Animated hearts and sparkles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
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
            {i % 2 === 0 ? (
              <Heart className="w-4 h-4 text-pink-300/40" fill="currentColor" />
            ) : (
              <Sparkles className="w-3 h-3 text-rose-300/40" />
            )}
          </div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {/* Error Display */}
        {error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-rose-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg z-50">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Step 1: Enter Date */}
        {step === 1 && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <Sparkles className="w-16 h-16 text-pink-400 animate-pulse" />
              </div>
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent tracking-wider">
                LET&apos;S MOO
              </h1>
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent tracking-wider">
                TOGETHER
              </h1>
            </div>
            
            <div className="mt-12 space-y-6">
              <div className="max-w-md mx-auto">
                <label className="block text-pink-700 text-sm mb-2 font-medium">
                  กรุณาเลือกวันเกิดของคุณ
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-6 py-4 text-xl text-center bg-white border-2 border-pink-200 rounded-2xl text-pink-900 focus:outline-none focus:border-pink-400 transition-all shadow-lg hover:shadow-xl"
                />
              </div>
              
              <button
                onClick={handleDateSubmit}
                disabled={!birthDate}
                className="px-8 py-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full text-white font-semibold hover:from-pink-500 hover:to-rose-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ดำเนินการต่อ
              </button>
            </div>

            <p className="text-pink-600/70 text-sm mt-8 max-w-2xl mx-auto bg-white/50 backdrop-blur-sm rounded-2xl p-4">
              ⚠️ DISCLAIMER: เว็บไซต์นี้ทำเพื่อความบันเทิงเท่านั้น ไม่ใช่การพยากรณ์จริง ไม่รับประกันผลลัพธ์
            </p>
          </div>
        )}

        {/* Step 2: Choose Game */}
        {step === 2 && !loading && (
          <div className="text-center space-y-12">
            <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent tracking-wider">
              เลือกเกมของคุณ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => handleGameSelect(game.id)}
                  className="group relative aspect-square rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl bg-white"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4 p-6">
                      <Sparkles className="w-16 h-16 mx-auto text-white" />
                      <h3 className="text-2xl font-bold text-white">
                        {game.name}
                      </h3>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm py-3">
                    <p className="text-pink-600 font-bold">HOYOVERSE</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center space-y-6">
            <div className="relative">
              <Sparkles className="w-24 h-24 text-pink-400 mx-auto animate-spin" />
            </div>
            <h3 className="text-3xl font-bold text-pink-600">
              กำลังคำนวณดวงชะตาของคุณ...
            </h3>
            <p className="text-pink-500">ดาวดวงต่างๆ กำลังเรียงตัว ✨</p>
          </div>
        )}

        {/* Step 3: Fortune Result */}
        {step === 3 && fortune && (
          <div className="max-w-4xl w-full space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-2">
                ตารางโชคลาภของคุณ
              </h2>
              <p className="text-pink-600">สำหรับ {games.find(g => g.id === selectedGame)?.name}</p>
              {fortune.currentBanners && (
                <p className="text-pink-500 text-sm mt-2">
                  🎯 Current Banners: {fortune.currentBanners.join(', ')}
                </p>
              )}
            </div>

            {/* Lucky Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-6 border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all">
                <div className="text-center">
                  <Star className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                  <h4 className="text-pink-600 text-sm mb-1 font-medium">องค์ประกอบมงคล</h4>
                  <p className="text-2xl font-bold text-pink-700">{fortune.element}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                  <h4 className="text-pink-600 text-sm mb-1 font-medium">เลขนำโชค</h4>
                  <p className="text-2xl font-bold text-pink-700">{fortune.luckyNumber}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all">
                <div className="text-center">
                  <Calendar className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                  <h4 className="text-pink-600 text-sm mb-1 font-medium">วันเกิด</h4>
                  <p className="text-lg font-bold text-pink-700">
                    {new Date(birthDate).toLocaleDateString('th-TH')}
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly Prediction */}
            {fortune.weeklyPrediction && (
              <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-6 border-2 border-pink-200 shadow-lg">
                <h4 className="text-xl font-bold text-pink-700 mb-2">โชคลาภประจำสัปดาห์</h4>
                <p className="text-pink-600">{fortune.weeklyPrediction}</p>
              </div>
            )}

            {/* Lucky Days */}
            <div className="bg-white rounded-2xl p-6 border-2 border-pink-200 shadow-lg">
              <h3 className="text-2xl font-bold text-pink-700 mb-4 flex items-center gap-2">
                <Star className="text-pink-400" fill="currentColor" />
                วันและเวลาแนะนำสำหรับกดกาชา
              </h3>
              <div className="space-y-3">
                {fortune.luckyDays.map((day, idx) => (
                  <div
                    key={idx}
                    className="bg-pink-50 rounded-xl p-4 border-2 border-pink-100 hover:border-pink-300 hover:bg-pink-100 transition-all"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="text-pink-700 font-semibold text-lg mb-1">{day.character}</p>
                        <p className="text-pink-600 text-sm">
                          {new Date(day.date).toLocaleDateString('th-TH', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-pink-600 text-sm mb-2">🕐 {day.time}</p>
                        {day.reason && (
                          <p className="text-pink-500 text-sm italic">💫 {day.reason}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-pink-500">{day.luck}%</div>
                        <div className="text-pink-400 text-xs">โชคลาภ</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice */}
            <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-2xl p-6 border-2 border-pink-200 shadow-lg">
              <h4 className="text-xl font-bold text-pink-700 mb-2">🌟 คำแนะนำจากดวงดาว</h4>
              <p className="text-pink-600">{fortune.advice}</p>
            </div>

            {/* Reset Button */}
            <div className="text-center mt-8">
              <button
                onClick={resetApp}
                className="px-8 py-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full text-white font-semibold hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
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
