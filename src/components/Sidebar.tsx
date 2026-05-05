import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Navigation } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { type WeatherData } from '../services/weatherService';

interface SidebarProps {
  data: WeatherData | null;
}

const miniChartData = [
  { val: 10 }, { val: 12 }, { val: 25 }, { val: 18 }, { val: 30 }, { val: 45 }, { val: 35 }
];

const Sidebar: React.FC<SidebarProps> = ({ data }) => {
  
  const getMapPosition = () => {
    if (!data?.coord) return { bgPosX: 0, pinTop: 50 };
    const { lat, lon } = data.coord;
    const mapX = ((lon + 180) / 360) * 512;
    return {
      bgPosX: 128 - mapX,
      pinTop: ((90 - lat) / 180) * 100,
    };
  };

  const { bgPosX, pinTop } = getMapPosition();

  return (
    <div className="w-[320px] h-full bg-white/[0.03] border-r border-white/5 flex flex-col p-5 backdrop-blur-xl text-white overflow-hidden">
      
      {/* Brand */}
      <div className="flex flex-col mb-5 relative">
        <h2 className="text-2xl font-semibold tracking-tighter text-white">WeatherWise</h2>
        <svg className="absolute -bottom-4 left-0 w-24 h-4 opacity-30" viewBox="0 0 100 20">
          <path d="M0,10 Q50,0 100,10" fill="none" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Status Card */}
      <div className="flex flex-col gap-3 mb-4">
        <span className="text-[11px] uppercase tracking-[0.3em] opacity-60 font-bold">Status</span>
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-4 flex flex-col relative overflow-hidden group backdrop-blur-2xl">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold opacity-80">↑ 23.8%</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] opacity-60">?</div>
          </div>

          <div className="h-20 w-full mb-3 relative">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={miniChartData}>
                 <defs>
                   <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.6} />
                     <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
                   </linearGradient>
                 </defs>
                 <Area 
                   type="basis" 
                   dataKey="val" 
                   stroke="#fbbf24" 
                   strokeWidth={3} 
                   fill="url(#miniGrad)" 
                 />
               </AreaChart>
             </ResponsiveContainer>
             
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black text-[11px] font-bold px-4 py-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
               Dangerous
             </div>
          </div>

          <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
            See More details <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Select Area Section - Carousel Look */}
      <div className="flex-1 flex flex-col gap-3 relative">
        <div className="flex justify-between items-center z-10">
           <span className="text-[10px] uppercase tracking-[0.3em] opacity-60 font-medium">Select Area</span>
           <div className="flex items-center gap-3">
             <Navigation className="w-4 h-4 rotate-[15deg] fill-white opacity-80" />
             <div className="flex gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-white" />
               <div className="w-1.5 h-1.5 rounded-full border border-white/40" />
               <div className="w-1.5 h-1.5 rounded-full border border-white/40" />
             </div>
           </div>
        </div>

        <div className="relative flex-1 flex items-center justify-center overflow-visible">
           
           {/* Side Globes (Carousel effect) */}
           <div className="absolute -left-40 w-52 h-52 bg-white/5 rounded-full blur-[1px] opacity-10 border border-white/10" />
           <div className="absolute -right-40 w-52 h-52 bg-white/5 rounded-full blur-[1px] opacity-10 border border-white/10" />

           {/* Central Glow */}
           <div className="absolute w-56 h-56 bg-orange-500/10 rounded-full blur-[80px]" />
           <div className="absolute w-32 h-32 bg-orange-600/20 rounded-full blur-[40px] mt-20" />
           
           {/* Main Globe */}
           <div className="relative w-40 h-40 bg-black/40 rounded-full overflow-hidden shadow-2xl">
              <motion.div 
                animate={{ backgroundPositionX: bgPosX }}
                transition={{ type: "spring", damping: 30, stiffness: 50 }}
                className="absolute inset-0 w-full h-full opacity-60"
                style={{ 
                  backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')`,
                  backgroundSize: '512px 256px',
                  backgroundRepeat: 'repeat-x',
                  filter: 'invert(1) brightness(1.5)'
                }}
              />

              {/* Ghost Pins (Decorative) */}
              <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-white/40 rounded-full" />
              <div className="absolute top-1/3 left-[60%] w-1.5 h-1.5 bg-white/20 rounded-full" />
              <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white/30 rounded-full" />

              {/* Active Dynamic Pin */}
              <motion.div 
                key={data?.name}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ top: `${pinTop}%`, left: '50%' }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              >
                <div className="absolute w-6 h-6 bg-white/20 rounded-full animate-ping" />
                <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_20px_white]" />
              </motion.div>
           </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-full py-2 px-4 text-center text-xs font-light tracking-widest backdrop-blur-md">
           {data ? `${data.name}, ${data.sys.country}` : 'Brooklyn, New York, USA'}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
