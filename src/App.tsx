import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Sidebar from './components/Sidebar';
import { fetchWeather, type WeatherData } from './services/weatherService';

const backgroundMap: Record<string, string> = {
  Clear: 'https://images.unsplash.com/photo-1464618663641-bbdd760ae84a?q=80&w=2560&auto=format&fit=crop',
  ClearCold: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?q=80&w=2560&auto=format&fit=crop',
  Clouds: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2560&auto=format&fit=crop',
  Rain: 'https://images.unsplash.com/photo-1511634829096-045a111727eb?q=80&w=2560&auto=format&fit=crop',
  Drizzle: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2570&auto=format&fit=crop',
  Thunderstorm: 'https://images.unsplash.com/photo-1551234250-1896803920c8?q=80&w=2560&auto=format&fit=crop',
  Snow: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2560&auto=format&fit=crop',
  Default: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2560&auto=format&fit=crop'
};

const Rain = () => (
  <div className="rain-container">
    {[...Array(50)].map((_, i) => (
      <div 
        key={i} 
        className="rain-drop" 
        style={{ 
          left: `${Math.random() * 100}%`, 
          animationDuration: `${0.5 + Math.random() * 0.5}s`,
          animationDelay: `${Math.random() * 2}s`,
          opacity: Math.random() * 0.5
        }} 
      />
    ))}
  </div>
);

const Snow = () => (
  <div className="snow-container">
    {[...Array(50)].map((_, i) => (
      <div 
        key={i} 
        className="snow-flake" 
        style={{ 
          left: `${Math.random() * 100}%`, 
          animationDuration: `${3 + Math.random() * 5}s`,
          animationDelay: `${Math.random() * 5}s`,
          opacity: Math.random() * 0.5
        }} 
      />
    ))}
  </div>
);

const SunnyGlow = () => <div className="sunny-glow" />;

const CloudsEffect = () => (
  <div className="cloud-container">
    {[...Array(3)].map((_, i) => (
      <div 
        key={i} 
        className="cloud-drift" 
        style={{ 
          top: `${20 + i * 20}%`, 
          width: `${300 + Math.random() * 400}px`,
          height: `${200 + Math.random() * 300}px`,
          animationDuration: `${20 + Math.random() * 40}s`,
          animationDelay: `${-Math.random() * 40}s`
        }} 
      />
    ))}
  </div>
);

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<WeatherData[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
      
      // Update recent searches (avoid duplicates and keep last 2)
      setRecentSearches(prev => {
        const filtered = prev.filter(item => item.name !== data.name);
        return [data, ...filtered].slice(0, 10);
      });

    } catch (err: any) {
      setError(err.message || 'City not found');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const weatherMain = weatherData?.weather?.[0]?.main || 'Default';
  const currentTemp = weatherData?.main?.temp || 20;
  
  let bgKey = weatherMain;
  if (weatherMain === 'Clear' && currentTemp < 10) {
    bgKey = 'ClearCold';
  }
  
  const bgImage = backgroundMap[bgKey] || backgroundMap.Default;

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center p-4 lg:p-8 bg-[#1a1c1e] font-sans">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            src={bgImage}
            className="w-full h-full object-cover scale-105"
            alt="weather-bg"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px]" />
        
        {/* Animated Weather Overlays */}
        {weatherMain === 'Rain' || weatherMain === 'Drizzle' || weatherMain === 'Thunderstorm' ? <Rain /> : null}
        {weatherMain === 'Snow' ? <Snow /> : null}
        {weatherMain === 'Clear' ? <SunnyGlow /> : null}
        {weatherMain === 'Clouds' ? <CloudsEffect /> : null}
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
<div className="flex-1 flex flex-col p-6 xl:p-8 overflow-hidden text-white">
          
          {/* Top Bar */}
          <div className="flex justify-between items-center w-full mb-4">
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">
                {weatherData ? `${weatherData.name}, ${weatherData.sys.country}` : 'Brooklyn, New York, USA'}
              </span>
              <span className="text-sm opacity-40 ml-2">
                ({new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })})
              </span>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="w-72">
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
                  recentSearches={recentSearches.slice(0, 2)}
                  onRecentClick={(cityData) => setWeatherData(cityData)}
                  onSeeAll={() => setShowHistory(true)}
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

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#1a1c1e]/80 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col p-8 text-white"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-light tracking-widest uppercase opacity-80">Search History</h2>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentSearches.map((city, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setWeatherData(city);
                      setShowHistory(false);
                    }}
                    className="bg-white/5 border border-white/10 rounded-[32px] p-5 flex flex-col gap-4 backdrop-blur-xl hover:bg-white/15 transition-all text-left group"
                  >
                    <div className="flex justify-between items-start">
                       <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <div className="w-3 h-3 rounded-full bg-white/60" />
                       </div>
                       <span className="text-3xl font-light">{Math.round(city.main.temp)}°</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-lg font-medium">{city.name}, {city.sys.country}</span>
                       <span className="text-sm opacity-60 uppercase tracking-widest font-light">{city.weather[0].description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;