import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Sidebar from './components/Sidebar';
import { fetchWeather, type WeatherData } from './services/weatherService';

// Local premium background images
import bgClear from './assets/backgrounds/clear.png';
import bgSunset from './assets/backgrounds/sunset.png';
import bgPartlyCloudy from './assets/backgrounds/partly_cloudy.png';
import bgOvercast from './assets/backgrounds/overcast.png';
import bgRainy from './assets/backgrounds/rainy.png';
import bgStormy from './assets/backgrounds/stormy.png';
import bgSnowy from './assets/backgrounds/snowy.png';
import bgFoggy from './assets/backgrounds/foggy.png';
import bgNight from './assets/backgrounds/night.png';

const backgroundMap: Record<string, string> = {
  Clear: bgClear,
  ClearNight: bgNight,
  Sunset: bgSunset,
  Clouds: bgPartlyCloudy,
  OvercastClouds: bgOvercast,
  Rain: bgRainy,
  Drizzle: bgRainy,
  Thunderstorm: bgStormy,
  Snow: bgSnowy,
  Mist: bgFoggy,
  Haze: bgFoggy,
  Fog: bgFoggy,
  Smoke: bgFoggy,
  Dust: bgFoggy,
  Default: bgClear,
};

// Pre-generate random values to prevent re-randomization on re-renders
const useRandomValues = (count: number) => {
  return React.useMemo(() => 
    Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      duration: Math.random(),
      delay: Math.random(),
      opacity: Math.random(),
      size: Math.random(),
    })), [count]
  );
};

const RainEffect = () => {
  const fgDrops = useRandomValues(40);
  const midDrops = useRandomValues(60);
  const bgDrops = useRandomValues(35);
  const splashes = useRandomValues(15);

  return (
    <div className="rain-container">
      {/* Foreground rain — thick, fast, bright */}
      {fgDrops.map((v, i) => (
        <div key={`fg-${i}`} className="rain-drop-fg" style={{
          left: `${v.left}%`,
          animationDuration: `${0.4 + v.duration * 0.3}s`,
          animationDelay: `${v.delay * 1.5}s`,
          opacity: 0.5 + v.opacity * 0.5,
        }} />
      ))}
      {/* Mid-layer rain */}
      {midDrops.map((v, i) => (
        <div key={`mid-${i}`} className="rain-drop-mid" style={{
          left: `${v.left}%`,
          animationDuration: `${0.5 + v.duration * 0.4}s`,
          animationDelay: `${v.delay * 2}s`,
          opacity: 0.3 + v.opacity * 0.4,
        }} />
      ))}
      {/* Background rain — distant */}
      {bgDrops.map((v, i) => (
        <div key={`bg-${i}`} className="rain-drop-bg" style={{
          left: `${v.left}%`,
          animationDuration: `${0.7 + v.duration * 0.5}s`,
          animationDelay: `${v.delay * 2.5}s`,
          opacity: 0.15 + v.opacity * 0.2,
        }} />
      ))}
      {/* Splash at bottom */}
      {splashes.map((v, i) => (
        <div key={`splash-${i}`} className="rain-splash" style={{
          left: `${v.left}%`,
          animationDuration: `${0.6 + v.duration * 0.4}s`,
          animationDelay: `${v.delay * 2}s`,
        }} />
      ))}
      {/* Mist overlay */}
      <div className="rain-mist" />
    </div>
  );
};

const SnowEffect = () => {
  const fgFlakes = useRandomValues(25);
  const midFlakes = useRandomValues(40);
  const bgFlakes = useRandomValues(30);

  return (
    <div className="snow-container">
      {/* Foreground snow — large and slow */}
      {fgFlakes.map((v, i) => (
        <div key={`fg-${i}`} className="snow-flake-fg" style={{
          left: `${v.left}%`,
          animationDuration: `${6 + v.duration * 6}s, ${3 + v.size * 4}s`,
          animationDelay: `${v.delay * 8}s, ${v.delay * 3}s`,
          width: `${5 + v.size * 3}px`,
          height: `${5 + v.size * 3}px`,
        }} />
      ))}
      {/* Mid-layer snow */}
      {midFlakes.map((v, i) => (
        <div key={`mid-${i}`} className="snow-flake-mid" style={{
          left: `${v.left}%`,
          animationDuration: `${5 + v.duration * 5}s, ${4 + v.size * 3}s`,
          animationDelay: `${v.delay * 10}s, ${v.delay * 5}s`,
        }} />
      ))}
      {/* Background snow — tiny and blurred */}
      {bgFlakes.map((v, i) => (
        <div key={`bg-${i}`} className="snow-flake-bg" style={{
          left: `${v.left}%`,
          animationDuration: `${4 + v.duration * 4}s, ${5 + v.size * 4}s`,
          animationDelay: `${v.delay * 7}s, ${v.delay * 4}s`,
        }} />
      ))}
      {/* Ground shimmer */}
      <div className="snow-ground" />
    </div>
  );
};

const ThunderstormEffect = () => {
  const fgDrops = useRandomValues(50);
  const midDrops = useRandomValues(40);

  return (
    <>
      {/* Rain layer */}
      <div className="rain-container">
        {fgDrops.map((v, i) => (
          <div key={`fg-${i}`} className="rain-drop-fg" style={{
            left: `${v.left}%`,
            animationDuration: `${0.35 + v.duration * 0.25}s`,
            animationDelay: `${v.delay * 1.2}s`,
            opacity: 0.5 + v.opacity * 0.5,
          }} />
        ))}
        {midDrops.map((v, i) => (
          <div key={`mid-${i}`} className="rain-drop-mid" style={{
            left: `${v.left}%`,
            animationDuration: `${0.4 + v.duration * 0.3}s`,
            animationDelay: `${v.delay * 1.8}s`,
            opacity: 0.3 + v.opacity * 0.4,
          }} />
        ))}
        <div className="rain-mist" />
      </div>
      {/* Lightning flashes */}
      <div className="lightning-container">
        <div className="lightning-flash" />
        <div className="lightning-flash-2" />
        <div className="lightning-bolt" style={{ left: '35%' }} />
        <div className="lightning-bolt" style={{ left: '65%', animationDelay: '3.5s' }} />
      </div>
    </>
  );
};

const SunnyGlow = () => (
  <>
    <div className="sunny-glow" />
    <div className="sun-rays" />
  </>
);

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

const FogEffect = () => (
  <div className="fog-container">
    <div className="fog-layer" style={{ animationDuration: '25s', top: '10%' }} />
    <div className="fog-layer-2" style={{ animationDuration: '35s', top: '40%' }} />
    <div className="fog-layer" style={{ animationDuration: '30s', top: '65%', opacity: 0.7 }} />
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
      
      // Update recent searches (avoid duplicates and keep last 10)
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
  const cloudiness = weatherData?.clouds?.all || 0;
  
  // Intelligent background selection with time-of-day awareness
  const getBackgroundKey = (): string => {
    if (!weatherData) return 'Default';
    
    const now = Math.floor(Date.now() / 1000);
    const sunrise = weatherData.sys.sunrise;
    const sunset = weatherData.sys.sunset;
    const isNight = now < sunrise || now > sunset;
    const isSunsetHour = now > (sunset - 3600) && now <= sunset;
    
    if (weatherMain === 'Clear') {
      if (isNight) return 'ClearNight';
      if (isSunsetHour) return 'Sunset';
      return 'Clear';
    }
    
    if (weatherMain === 'Clouds') {
      return cloudiness > 70 ? 'OvercastClouds' : 'Clouds';
    }
    
    return weatherMain;
  };
  
  const bgKey = getBackgroundKey();
  const bgImage = backgroundMap[bgKey] || backgroundMap.Default;

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center p-4 lg:p-8 bg-[#1a1c1e] font-sans">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img
              src={bgImage}
              className="w-full h-full object-cover scale-105"
              alt="weather-bg"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
        
        {/* Animated Weather Overlays */}
        {weatherMain === 'Rain' || weatherMain === 'Drizzle' ? <RainEffect /> : null}
        {weatherMain === 'Thunderstorm' ? <ThunderstormEffect /> : null}
        {weatherMain === 'Snow' ? <SnowEffect /> : null}
        {weatherMain === 'Clear' ? <SunnyGlow /> : null}
        {weatherMain === 'Clouds' ? <CloudsEffect /> : null}
        {weatherMain === 'Mist' || weatherMain === 'Haze' || weatherMain === 'Fog' || weatherMain === 'Smoke' ? <FogEffect /> : null}
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