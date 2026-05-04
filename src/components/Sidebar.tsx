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
  
  const getPinPos = () => {
    if (!data?.coord) return { top: '45%', left: '45%' };
    const latPercent = ((90 - data.coord.lat) / 180) * 100;
    const lonPercent = ((data.coord.lon + 180) / 360) * 100;
    return {
      top: `${Math.max(20, Math.min(80, latPercent))}%`,
      left: `${Math.max(20, Math.min(80, lonPercent))}%`
    };
  };

  const pinPos = getPinPos();

  return (
    <div className="w-[380px] h-full bg-white/[0.03] border-r border-white/5 flex flex-col p-10 backdrop-blur-xl">
      
      {/* Brand */}
      <div className="flex flex-col mb-16">
        <h2 className="text-3xl font-semibold tracking-tighter text-white">WeatherWise</h2>
        <div className="w-12 h-[2px] bg-white/20 mt-1 rounded-full overflow-hidden">
          <motion.div 
            animate={{ x: [-50, 50] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-white/60"
          />
        </div>
      </div>

      {/* Status Card */}
      <div className="flex flex-col gap-4 mb-14">
        <span className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-medium">Status</span>
        <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 flex flex-col relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">↑ 23.8%</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">?</div>
          </div>

          <div className="h-24 w-full mb-4">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={miniChartData}>
                 <defs>
                   <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.4} />
                     <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
                   </linearGradient>
                 </defs>
                 <Area 
                   type="monotone" 
                   dataKey="val" 
                   stroke="#fbbf24" 
                   strokeWidth={2} 
                   fill="url(#miniGrad)" 
                 />
               </AreaChart>
             </ResponsiveContainer>
             
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl">
               Dangerous
             </div>
          </div>

          <button className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
            See More details <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Select Area Section - Carousel Look */}
      <div className="flex-1 flex flex-col gap-6 relative">
        <div className="flex justify-between items-center z-10">
           <span className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-medium">Select Area</span>
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
           <div className="relative w-64 h-64 bg-black/20 rounded-full overflow-hidden shadow-2xl">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                className="w-full h-full"
              >
                <img 
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop" 
                  className="w-full h-full object-cover opacity-60 brightness-110"
                  alt="globe"
                />
              </motion.div>

              {/* Ghost Pins (Decorative) */}
              <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-white/40 rounded-full" />
              <div className="absolute top-1/3 left-1/2 w-1.5 h-1.5 bg-white/20 rounded-full" />
              <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white/30 rounded-full" />

              {/* Active Dynamic Pin */}
              <motion.div 
                key={data?.name}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ top: pinPos.top, left: pinPos.left }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              >
                <div className="absolute w-6 h-6 bg-white/20 rounded-full animate-ping" />
                <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_20px_white]" />
              </motion.div>
           </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-full py-4 px-8 text-center text-xs font-light tracking-widest backdrop-blur-md">
           {data ? `${data.name}, ${data.sys.country}` : 'Brooklyn, New York, USA'}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
