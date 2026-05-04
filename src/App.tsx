import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Sidebar from './components/Sidebar';
import { fetchWeather, type WeatherData } from './services/weatherService';

const backgroundMap: Record<string, string> = {
  Clear: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=2560&auto=format&fit=crop',
  Clouds: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2551&auto=format&fit=crop',
  Rain: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2574&auto=format&fit=crop',
  Drizzle: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2570&auto=format&fit=crop',
  Thunderstorm: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0ce49?q=80&w=2670&auto=format&fit=crop',
  Snow: 'https://images.unsplash.com/photo-1514828260103-1e9bf9a58446?q=80&w=2670&auto=format&fit=crop',
  Default: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=2560&auto=format&fit=crop'
};

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<WeatherData[]>([]);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
      
      // Update recent searches (avoid duplicates and keep last 2)
      setRecentSearches(prev => {
        const filtered = prev.filter(item => item.name !== data.name);
        return [data, ...filtered].slice(0, 2);
      });

    } catch (err: any) {
      setError(err.message || 'City not found');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const weatherMain = weatherData?.weather?.[0]?.main || 'Default';
  const bgImage = backgroundMap[weatherMain] || backgroundMap.Default;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#1a1c1e] overflow-hidden font-sans">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            src={bgImage}
            className="w-full h-full object-cover"
            alt="weather-bg"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[10px]" />
      </div>

      {/* Main UI Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-[1400px] h-[90vh] bg-black/40 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden flex"
      >
        {/* Left Sidebar */}
        <Sidebar data={weatherData} />

        {/* Right Main Content */}
        <div className="flex-1 flex flex-col p-12 overflow-hidden text-white">
          
          {/* Top Bar */}
          <div className="flex justify-between items-center w-full mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-white/60" />
              <div className="flex flex-col">
                <span className="text-sm font-medium tracking-wide">
                  {weatherData ? `${weatherData.name}, ${weatherData.sys.country}` : 'Select a City'}
                </span>
                <span className="text-[10px] opacity-40 uppercase tracking-widest">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="w-64">
                 <SearchBar onSearch={handleSearch} />
               </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col w-full h-full">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-12 h-12 border-t-2 border-white/50 rounded-full animate-spin" />
                </div>
              ) : weatherData ? (
                <WeatherCard 
                  key="main-card" 
                  data={weatherData} 
                  recentSearches={recentSearches}
                  onRecentClick={(cityData) => setWeatherData(cityData)}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-30 gap-8">
                  <Search className="w-24 h-24 stroke-[0.3]" />
                  <p className="text-3xl font-extralight tracking-[0.3em] uppercase">WeatherWise Intelligence</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-10 right-10 bg-red-500/20 backdrop-blur-xl border border-red-500/20 px-6 py-3 rounded-2xl text-sm font-light"
            >
              {error}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default App;