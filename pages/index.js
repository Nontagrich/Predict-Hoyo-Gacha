import React, { useState } from 'react';
import { Calendar, Sparkles, Star, AlertCircle } from 'lucide-react';

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
      color: 'from-blue-400 to-purple-500',
      currentBanners: ['Flins', 'Yelan']
    },
    { 
      id: 'starrail', 
      name: 'Honkai: Star Rail', 
      color: 'from-yellow-400 to-pink-500',
      currentBanners: ['Dan Heng Permansor Terrae Form', 'Anaxa']
    },
    { 
      id: 'zzz', 
      name: 'Zenless Zone Zero', 
      color: 'from-orange-400 to-red-500',
      currentBanners: ['Lucia', 'Vivian']
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

      const date = new Date(birthDate);
      const thaiDate = date.toLocaleDateString('th-TH', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      // Create prompt for Gemini
      const promptText = [
        `You are an expert fortune teller specializing in gacha luck prediction for ${selectedGameData.name}.`,
        ``,
        `User Information:`,
        `- Birth Date: ${thaiDate}`,
        `- Selected Game: ${selectedGameData.name}`,
        `- Current Banner Characters: ${selectedGameData.currentBanners.join(', ')}`,
        ``,
        `Please create a fortune table for gacha pulls in JSON format:`,
        ``,
        `{`,
        `  "luckyDays": [`,
        `    {`,
        `      "date": "Recommended date (YYYY-MM-DD)",`,
        `      "time": "Time range (HH:MM-HH:MM)",`,
        `      "character": "MUST be one of: ${selectedGameData.currentBanners.join(', ')}",`,
        `      "luck": Luck level 1-100,`,
        `      "reason": "Brief Thai reason why this is suitable"`,
        `    }`,
        `  ],`,
        `  "element": "Lucky element (Hydro/Pyro/Cryo/Electro/Anemo/Geo/Dendro or Physical/Quantum/Imaginary/Wind/Fire/Ice/Lightning or Physical/Electric/Fire/Ice/Ether)",`,
        `  "luckyNumber": Lucky number 1-90,`,
        `  "advice": "Thai advice from the stars (1-2 sentences)",`,
        `  "weeklyPrediction": "Overall Thai luck prediction for this week"`,
        `}`,
        ``,
        `IMPORTANT: Each "character" field MUST contain ONLY ONE character name from this list: ${selectedGameData.currentBanners.join(', ')}`,
        `Create 4-5 recommended dates within the next 2 weeks. Dates must be real dates after today (October 15, 2025) and times must be reasonable.`,
        `Distribute the characters across different lucky days.`,
        ``,
        `Respond ONLY with valid JSON, no additional explanation. All Thai text should use proper UTF-8 encoding.`
      ].join('\n');
      
      const prompt = promptText;

      // Call Gemini API
      const response = await fetch('/api/generate-fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          birthDate,
          game: gameId,
          currentBanners: selectedGameData.currentBanners
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate fortune');
      }

      const data = await response.json();
      setFortune(data.fortune);
      setStep(3);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการสร้างตารางโชคลาภ กรุณาลองใหม่อีกครั้ง');
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 3 + 2 + 's'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {/* Error Display */}
        {error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg z-50">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Step 1: Enter Date */}
        {step === 1 && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-bold text-white tracking-wider">
                {/* --- 📝 FIX: Replaced ' with &apos; to fix ESLint error --- */}
                LET&apos;S MOO
              </h1>
              <h1 className="text-6xl md:text-8xl font-bold text-white tracking-wider">
                TOGETHER
              </h1>
            </div>
            
            <div className="mt-12 space-y-6">
              <div className="max-w-md mx-auto">
                <label className="block text-white/80 text-sm mb-2">
                  กรุณาเลือกวันเกิดของคุณ
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-6 py-4 text-xl text-center bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-lg text-white focus:outline-none focus:border-white/60 transition-all"
                />
              </div>
              
              <button
                onClick={handleDateSubmit}
                disabled={!birthDate}
                className="px-8 py-3 bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-lg text-white font-semibold hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ดำเนินการต่อ
              </button>
            </div>

            <p className="text-white/70 text-sm mt-8 max-w-2xl mx-auto">
              ⚠️ DISCLAIMER: เว็บไซต์นี้ทำเพื่อความบันเทิงเท่านั้น ไม่ใช่การพยากรณ์จริง ไม่รับประกันผลลัพธ์
            </p>
          </div>
        )}

        {/* Step 2: Choose Game */}
        {step === 2 && !loading && (
          <div className="text-center space-y-12">
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-wider">
              เลือกเกมของคุณ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => handleGameSelect(game.id)}
                  className="group relative aspect-square rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300"
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
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm py-3">
                    <p className="text-white font-semibold">HOYOVERSE</p>
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
              <Sparkles className="w-24 h-24 text-white mx-auto animate-spin" />
            </div>
            <h3 className="text-3xl font-bold text-white">
              กำลังคำนวณดวงชะตาของคุณ...
            </h3>
            <p className="text-white/70">ดาวดวงต่างๆ กำลังเรียงตัว ✨</p>
          </div>
        )}

        {/* Step 3: Fortune Result */}
        {step === 3 && fortune && (
          <div className="max-w-4xl w-full space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold text-white mb-2">
                ตารางโชคลาภของคุณ
              </h2>
              <p className="text-white/70">สำหรับ {games.find(g => g.id === selectedGame)?.name}</p>
            </div>

            {/* Lucky Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-center">
                  <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <h4 className="text-white/70 text-sm mb-1">องค์ประกอบมงคล</h4>
                  <p className="text-2xl font-bold text-white">{fortune.element}</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                  <h4 className="text-white/70 text-sm mb-1">เลขนำโชค</h4>
                  <p className="text-2xl font-bold text-white">{fortune.luckyNumber}</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-center">
                  <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h4 className="text-white/70 text-sm mb-1">วันเกิด</h4>
                  <p className="text-lg font-bold text-white">
                    {new Date(birthDate).toLocaleDateString('th-TH')}
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly Prediction */}
            {fortune.weeklyPrediction && (
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-2">โชคลาภประจำสัปดาห์</h4>
                <p className="text-white/80">{fortune.weeklyPrediction}</p>
              </div>
            )}

            {/* Lucky Days */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Star className="text-yellow-400" />
                วันและเวลาแนะนำสำหรับกดกาชา
              </h3>
              <div className="space-y-3">
                {fortune.luckyDays.map((day, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="text-white font-semibold text-lg mb-1">{day.character}</p>
                        <p className="text-white/60 text-sm">
                          {new Date(day.date).toLocaleDateString('th-TH', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-white/60 text-sm mb-2">🕐 {day.time}</p>
                        {day.reason && (
                          <p className="text-white/70 text-sm italic">💫 {day.reason}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-yellow-400">{day.luck}%</div>
                        <div className="text-white/60 text-xs">โชคลาภ</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h4 className="text-xl font-bold text-white mb-2">🌟 คำแนะนำจากดวงดาว</h4>
              <p className="text-white/80">{fortune.advice}</p>
            </div>

            {/* Reset Button */}
            <div className="text-center mt-8">
              <button
                onClick={resetApp}
                className="px-8 py-3 bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-lg text-white font-semibold hover:bg-white/30 transition-all"
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
