import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Wind, Droplets, Sunrise, Sunset } from 'lucide-react';
import { type WeatherData } from '../services/weatherService';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  if (!data) return null;

  // Placeholder weekly trend data since standard OWM endpoint doesn't provide it
  const trendData = [
    { day: 'Mon', temp: Math.round(data.main.temp - 2) },
    { day: 'Tue', temp: Math.round(data.main.temp + 1) },
    { day: 'Wed', temp: Math.round(data.main.temp + 3) },
    { day: 'Thu', temp: Math.round(data.main.temp - 1) },
    { day: 'Fri', temp: Math.round(data.main.temp) },
    { day: 'Sat', temp: Math.round(data.main.temp + 2) },
    { day: 'Sun', temp: Math.round(data.main.temp + 4) },
  ];

  const formatTime = (unixTime: number) => {
    const date = new Date(unixTime * 1000);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex-1 w-full h-full flex flex-col justify-between pt-4"
    >
      <div className="flex flex-row justify-between items-start w-full">
        {/* Sol Taraf - Ana Derece ve Durum */}
        <div className="flex flex-col mt-4">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[140px] font-extrabold tracking-tighter leading-none drop-shadow-2xl"
          >
            {Math.round(data.main.temp)}°
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 mt-6"
          >
            <h2 className="text-5xl font-light tracking-wide">{data.name}</h2>
            <div className="h-2 w-2 rounded-full bg-white/50" />
            <p className="text-3xl font-light opacity-80 capitalize">
              {data.weather?.[0]?.description}
            </p>
          </motion.div>
        </div>

        {/* Sağ Taraf - Sidebar Stats */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col gap-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] p-8 shadow-2xl w-72"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 opacity-70">
              <Wind size={24} strokeWidth={1.5} />
              <span className="font-light text-sm tracking-wider uppercase">Wind</span>
            </div>
            <span className="font-medium text-xl">{data.wind.speed} m/s</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 opacity-70">
              <Droplets size={24} strokeWidth={1.5} />
              <span className="font-light text-sm tracking-wider uppercase">Humidity</span>
            </div>
            <span className="font-medium text-xl">%{data.main.humidity}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 opacity-70">
              <Sunrise size={24} strokeWidth={1.5} />
              <span className="font-light text-sm tracking-wider uppercase">Sunrise</span>
            </div>
            <span className="font-medium text-xl">{formatTime(data.sys.sunrise)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 opacity-70">
              <Sunset size={24} strokeWidth={1.5} />
              <span className="font-light text-sm tracking-wider uppercase">Sunset</span>
            </div>
            <span className="font-medium text-xl">{formatTime(data.sys.sunset)}</span>
          </div>
        </motion.div>
      </div>

      {/* Alt Taraf - Grafik */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="w-full h-56 mt-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] p-6 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-6 left-8 opacity-70 font-light text-sm tracking-wider uppercase z-10">
          Weekly Trend
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 30, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#ffffff', opacity: 0.7, fontSize: 13 }} 
              dy={10}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)', color: '#fff' }}
              itemStyle={{ color: '#fff', fontWeight: 500 }}
              labelStyle={{ color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke="#ffffff" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default WeatherCard;
