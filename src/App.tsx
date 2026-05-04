import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import { getWeatherData, type WeatherData } from './services/weatherService';

const backgroundMap: Record<string, string> = {
  Clear: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=2574&auto=format&fit=crop', // Sunny/Clear
  Clouds: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2551&auto=format&fit=crop', // Cloudy
  Rain: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2574&auto=format&fit=crop', // Rainy
  Drizzle: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2574&auto=format&fit=crop',
  Thunderstorm: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0ce49?q=80&w=2670&auto=format&fit=crop', // Thunderstorm
  Snow: 'https://images.unsplash.com/photo-1514828260103-1e9bf9a58446?q=80&w=2670&auto=format&fit=crop', // Snow
  Default: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=2000&auto=format&fit=crop'
};

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(city);
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const weatherMain = weatherData?.weather?.[0]?.main || 'Default';
  const bgImage = backgroundMap[weatherMain] || backgroundMap.Default;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-8 overflow-hidden font-sans">
      {/* Arka Plan Görseli - Hava durumuna göre dinamik değişecek */}
      <div className="absolute inset-0 z-0 bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            src={bgImage}
            className="w-full h-full object-cover scale-105"
            alt="background"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px]" />
      </div>

      {/* Ana Cam Panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-6xl h-[85vh] bg-white/10 backdrop-blur-2xl rounded-[48px] border border-white/20 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col p-12 overflow-hidden text-white"
      >
        {/* Üst Bar: Arama ve Başlık */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
            <span className="font-semibold tracking-[0.2em] uppercase text-sm opacity-90">forecast.now</span>
          </div>
          <div className="w-80">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Orta Bölüm: Ana Bilgi */}
        <div className="flex-1 flex flex-col w-full">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-3xl font-light tracking-wider"
              >
                Yükleniyor...
              </motion.div>
            </div>
          ) : weatherData ? (
            <WeatherCard data={weatherData} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-60">
              <span className="text-3xl font-light tracking-wide mb-2">Hava Durumu</span>
              <span className="text-lg font-light tracking-wider">Aramak için bir şehir girin</span>
            </div>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-12 left-12 text-red-300 font-medium text-sm bg-red-900/40 px-4 py-2 rounded-full border border-red-500/30 backdrop-blur-md"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default App;