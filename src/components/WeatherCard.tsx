import React from 'react';
import { AreaChart, Area, XAxis, ResponsiveContainer } from 'recharts';
import { type WeatherData } from '../services/weatherService';

interface WeatherCardProps {
  data: WeatherData;
  recentSearches: WeatherData[];
  onRecentClick: (data: WeatherData) => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, recentSearches, onRecentClick }) => {
  if (!data) return null;

  const trendData = data.trend || [];

  return (
    <div className="flex flex-col w-full h-full justify-between">
      
      {/* Middle Section: Temp & Hero Text */}
      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Temp & High/Low */}
        <div className="col-span-5 flex flex-col gap-6">
           <div className="flex items-start gap-6">
              <span className="text-8xl font-extralight tracking-tighter leading-none">{Math.round(data.main.temp)}°</span>
              <div className="flex flex-col gap-2 mt-2">
                 <div className="bg-white/10 px-3 py-1.5 rounded-full flex gap-3 text-xs font-light tracking-wider">
                    <span className="opacity-40">H</span> <span>{Math.round(data.main.temp_max)}°</span>
                 </div>
                 <div className="bg-white/10 px-3 py-1.5 rounded-full flex gap-3 text-xs font-light tracking-wider">
                    <span className="opacity-40">L</span> <span>{Math.round(data.main.temp_min)}°</span>
                 </div>
              </div>
           </div>

           <div className="flex flex-col">
              <h1 className="text-6xl font-light tracking-tight leading-[1.1] opacity-90 max-w-xl">
                 {data.weather[0].main === 'Clear' ? 'Glorious' : 'Stormy'} <br />
                 <span className="text-white/40 text-5xl">with {data.weather[0].description}</span>
              </h1>
           </div>
        </div>

        {/* Right Side: Recently Searched */}
        <div className="col-span-7 flex flex-col items-end">
           <div className="flex flex-col gap-6 w-full max-w-[400px]">
              <div className="flex justify-between items-center px-2">
                 <span className="text-[10px] uppercase tracking-[0.3em] opacity-40">Recently Searched</span>
                 <button className="text-[10px] uppercase tracking-[0.3em] opacity-40 hover:opacity-100 flex items-center gap-2">
                    See All <span>›</span>
                 </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 {recentSearches.length > 0 ? (
                   recentSearches.map((city, idx) => (
                    <button 
                      key={idx}
                      onClick={() => onRecentClick(city)}
                      className="bg-white/5 border border-white/10 rounded-[28px] p-6 flex flex-col gap-6 backdrop-blur-xl hover:bg-white/10 transition-all text-left"
                    >
                       <div className="flex justify-between items-center">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                             <div className="w-2 h-2 rounded-full bg-white/40" />
                          </div>
                          <span className="text-2xl font-light">{Math.round(city.main.temp)}°</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-sm font-medium truncate">{city.name}, {city.sys.country}</span>
                          <span className="text-[10px] opacity-40 truncate">{city.weather[0].description}</span>
                       </div>
                    </button>
                   ))
                 ) : (
                   <div className="col-span-2 bg-white/5 border border-white/5 border-dashed rounded-[28px] p-10 flex items-center justify-center text-[10px] uppercase tracking-widest opacity-30">
                     No History Yet
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Section: Wavy Weekly Forecast */}
      <div className="w-full min-h-[300px] mt-auto relative pt-10">
         <div className="absolute top-0 left-0 w-full h-full z-0">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 80, right: 60, left: 60, bottom: 40 }}>
                 <defs>
                    <linearGradient id="wavyGrad" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="#fff" stopOpacity={0.1} />
                       <stop offset="100%" stopColor="#fff" stopOpacity={0} />
                    </linearGradient>
                 </defs>
                 
                 <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    interval={0}
                    tick={({ x, y, payload }) => (
                       <g transform={`translate(${x},${y})`}>
                          <text x={0} y={-140} dy={0} textAnchor="middle" fill="#fff" className="text-sm font-light opacity-60">
                             {payload.value}
                          </text>
                       </g>
                    )}
                 />
                 
                 <Area 
                    type="monotone" 
                    dataKey="temp" 
                    stroke="#fff" 
                    strokeWidth={1.5} 
                    fill="url(#wavyGrad)" 
                    dot={({ cx, cy, payload }) => (
                       <g>
                          <text x={cx || 0} y={(cy || 0) + 45} textAnchor="middle" fill="#fff" className="text-4xl font-extralight tracking-tighter">
                             {Math.round(payload.temp)}°
                          </text>
                          {payload.day === 'Wed' && (
                             <g>
                                <circle cx={cx || 0} cy={cy || 0} r={6} fill="#fff" className="shadow-2xl" />
                                <line x1={cx || 0} y1={cy || 0} x2={cx || 0} y2={(cy || 0) + 30} stroke="#fff" strokeDasharray="2 2" opacity={0.4} />
                             </g>
                          )}
                       </g>
                    )}
                 />
              </AreaChart>
           </ResponsiveContainer>
         </div>
      </div>

    </div>
  );
};

export default WeatherCard;
