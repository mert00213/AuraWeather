import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { type WeatherData } from '../services/weatherService';
import { generateInsights, type Insight } from '../services/insightService';

interface DailyInsightProps {
  data: WeatherData | null;
}

const categoryColors: Record<string, { bg: string; border: string; glow: string }> = {
  warning: {
    bg: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.20)',
    glow: 'rgba(239, 68, 68, 0.15)',
  },
  clothing: {
    bg: 'rgba(99, 102, 241, 0.08)',
    border: 'rgba(99, 102, 241, 0.20)',
    glow: 'rgba(99, 102, 241, 0.15)',
  },
  activity: {
    bg: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.20)',
    glow: 'rgba(16, 185, 129, 0.15)',
  },
  tip: {
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.20)',
    glow: 'rgba(245, 158, 11, 0.15)',
  },
};

const DailyInsight: React.FC<DailyInsightProps> = ({ data }) => {
  const insights = useMemo(() => {
    if (!data) return [];
    return generateInsights(data);
  }, [data]);

  if (!data || insights.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5 mt-auto pt-4">
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
        <span className="text-[10px] uppercase tracking-[0.3em] opacity-60 font-bold text-white">
          Daily Insight
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent ml-1" />
      </div>

      {/* Insight Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={data.name}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="flex flex-col gap-2"
        >
          {insights.map((insight, idx) => (
            <InsightCard key={`${data.name}-${idx}`} insight={insight} index={idx} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const InsightCard: React.FC<{ insight: Insight; index: number }> = ({ insight, index }) => {
  const colors = categoryColors[insight.category] || categoryColors.tip;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ background: colors.glow }}
      />

      <div
        className="relative flex items-start gap-3 px-3.5 py-3 rounded-2xl backdrop-blur-md transition-all duration-300 group-hover:scale-[1.02] cursor-default"
        style={{
          background: colors.bg,
          border: `1px solid ${colors.border}`,
        }}
      >
        {/* Icon */}
        <span className="text-base mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          {insight.icon}
        </span>

        {/* Text */}
        <p className="text-[11px] leading-[1.5] text-white/80 font-medium group-hover:text-white/95 transition-colors duration-300">
          {insight.text}
        </p>
      </div>
    </motion.div>
  );
};

export default DailyInsight;
