import React from 'react';
import { motion } from 'framer-motion';

interface ScoreBulletChartProps {
  score: number;
  thresholds: { low: number; medium: number };
  className?: string;
}

const ScoreBulletChart: React.FC<ScoreBulletChartProps> = ({ 
  score, 
  thresholds, 
  className = "" 
}) => {
  const { low, medium } = thresholds;
  const max = 100;
  
  // Calculate positions as percentages
  const scorePos = (score / max) * 100;
  const lowPos = (low / max) * 100;
  const mediumPos = (medium / max) * 100;
  
  const getTierLabel = () => {
    if (score <= low) return 'Low';
    if (score <= medium) return 'Medium';
    return 'High';
  };

  return (
    <div className={`space-y-2 ${className}`} role="img" aria-label={`Score ${score.toFixed(1)} out of 100, ${getTierLabel()} complexity tier`}>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>0</span>
        <span>Complexity Score</span>
        <span>100</span>
      </div>
      
      <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
        {/* Background bands */}
        <div className="absolute inset-0 flex">
          <div className="bg-primary/20" style={{ width: `${lowPos}%` }} />
          <div className="bg-secondary/20" style={{ width: `${mediumPos - lowPos}%` }} />
          <div className="bg-destructive/20" style={{ width: `${100 - mediumPos}%` }} />
        </div>
        
        {/* Threshold markers */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-border" style={{ left: `${lowPos}%` }} />
        <div className="absolute top-0 bottom-0 w-0.5 bg-border" style={{ left: `${mediumPos}%` }} />
        
        {/* Score marker */}
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-foreground rounded-sm shadow-sm"
          style={{ left: `${scorePos}%` }}
          initial={{ left: '0%' }}
          animate={{ left: `${scorePos}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        
        {/* Score value */}
        <motion.div
          className="absolute -top-8 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs font-semibold"
          style={{ left: `${scorePos}%` }}
          initial={{ left: '0%', opacity: 0 }}
          animate={{ left: `${scorePos}%`, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        >
          {score.toFixed(1)}
        </motion.div>
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Low (0-{low})</span>
        <span>Medium ({low + 1}-{medium})</span>
        <span>High ({medium + 1}-100)</span>
      </div>
    </div>
  );
};

export default ScoreBulletChart;