import React from 'react';
import { AreaChart, Area, XAxis, ResponsiveContainer } from 'recharts';
import { type WeatherData } from '../services/weatherService';

interface WeatherCardProps {
   data: WeatherData;
   recentSearches: WeatherData[];
   onRecentClick: (data: WeatherData) => void;
   onSeeAll: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, recentSearches, onRecentClick, onSeeAll }) => {
   if (!data) return null;

   const trendData = data.trend || [];

  return (
    <div className="flex flex-col w-full h-full justify-between">
      
      {/* Middle Section: Temp & Hero Text */}
      <div className="grid grid-cols-12 gap-4 items-start mb-3">
        
        {/* Left Side: Temp & High/Low */}
        <div className="col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-4">
               <span className="text-[90px] font-extralight tracking-tighter leading-none">{Math.round(data.main.temp)}°</span>
               <div className="flex flex-col gap-3">
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex gap-4 text-sm font-light">
                     <span className="opacity-40">H</span> <span>{Math.round(data.main.temp_max)}°</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex gap-4 text-sm font-light">
                     <span className="opacity-40">L</span> <span>{Math.round(data.main.temp_min)}°</span>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-1">
               <h1 className="text-4xl font-light tracking-tight leading-[1.1] opacity-90">
                  {data.weather[0].main === 'Clear' ? 'Glorious' : 'Stormy'} <br />
                  <span className="text-white/60 text-3xl">with {data.weather[0].description}</span>
               </h1>
            </div>
        </div>

        {/* Right Side: Recently Searched */}
        <div className="col-span-7 flex flex-col items-end pt-4">
           <div className="flex flex-col gap-3 w-full max-w-[440px]">
              <div className="flex justify-between items-center px-4">
                 <span className="text-[11px] uppercase tracking-[0.3em] opacity-60 font-semibold">Recently Searched</span>
                 <button 
                  onClick={onSeeAll}
                  className="text-[11px] uppercase tracking-[0.3em] opacity-60 hover:opacity-100 transition-opacity"
                 >
                    See All ›
                 </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                 {recentSearches.length > 0 ? (
                   recentSearches.map((city, idx) => (
                    <button 
                      key={idx}
                      onClick={() => onRecentClick(city)}
                      className="bg-white/5 border border-white/10 rounded-[32px] p-4 flex flex-col gap-3 backdrop-blur-xl hover:bg-white/15 transition-all text-left group"
                    >
                       <div className="flex justify-between items-start">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                             <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
                          </div>
                          <span className="text-2xl font-light">{Math.round(city.main.temp)}°</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-sm font-medium truncate">{city.name}, {city.sys.country}</span>
                          <span className="text-xs opacity-60 truncate">{city.weather[0].description}</span>
                       </div>
                    </button>
                   ))
                 ) : (
                   <div className="col-span-2 bg-white/5 border border-white/5 border-dashed rounded-[32px] p-6 flex items-center justify-center text-xs uppercase tracking-widest opacity-30">
                     No History Yet
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Section: Wavy Weekly Forecast */}
      <div className="w-full flex-1 min-h-[150px] mt-2 relative">
         <div className="absolute inset-0 w-full h-full z-0">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                 <defs>
                    <linearGradient id="wavyGrad" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="#fff" stopOpacity={0.15} />
                       <stop offset="100%" stopColor="#fff" stopOpacity={0} />
                    </linearGradient>
                 </defs>
                 
                 <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    orientation="top"
                    tick={{ fill: '#fff', fontSize: 16, fontWeight: 300, opacity: 0.9 }}
                    dy={-10}
                 />
                 
                 <XAxis 
                    xAxisId="bottom"
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    orientation="bottom"
                    tick={({ x, y, index }: any) => (
                       <text x={x} y={y} dy={25} textAnchor="middle" fill="#fff" className="text-3xl font-light opacity-80">
                          {trendData[index]?.temp ? `${Math.round(trendData[index].temp)}°` : ''}
                       </text>
                    )}
                 />

                 <Area 
                    type="basis" 
                    dataKey="temp" 
                    stroke="#fff" 
                    strokeWidth={1.5} 
                    fill="url(#wavyGrad)" 
                    activeDot={{ r: 8, fill: '#fff', className: "shadow-[0_0_15px_rgba(255,255,255,1)]" }}
                    dot={({ cx, cy, index }) => {
                       if (index === 3) {
                         return (
                           <g key={`dot-${index}`}>
                              <circle cx={cx || 0} cy={cy || 0} r={6} fill="#fff" className="shadow-[0_0_20px_rgba(255,255,255,1)] drop-shadow-[0_0_10px_white]" />
                              <line x1={cx || 0} y1={cy || 0} x2={cx || 0} y2={(cy || 0) + 120} stroke="#fff" strokeDasharray="2 2" opacity={0.4} />
                           </g>
                         );
                       }
                       return <circle key={`dot-${index}`} cx={cx || 0} cy={cy || 0} r={4} fill="#fff" opacity={0.3} />;
                    }}
                 />
              </AreaChart>
           </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};

export default WeatherCard;
