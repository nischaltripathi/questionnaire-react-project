import React from 'react';
import { AlertTriangle, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Finding {
  title: string;
  explanation: string;
  impact?: string;
}

interface FindingsGridProps {
  findings: Finding[];
  maxItems?: number;
}

const FindingsGrid: React.FC<FindingsGridProps> = ({ 
  findings, 
  maxItems = 3 
}) => {
  const displayFindings = findings.slice(0, maxItems);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
      {displayFindings.map((finding, index) => (
        <motion.div
          key={index}
          role="listitem"
          className="p-4 rounded-lg border bg-card hover:border-primary/30 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-shrink-0 mt-1">
              <Circle className="w-3 h-3 fill-destructive text-destructive" />
            </div>
            <h4 className="font-semibold text-sm leading-tight">
              {finding.title}
            </h4>
          </div>
          
          <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
            {finding.explanation}
          </p>
          
          {finding.impact && (
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-primary/80 italic">
                {finding.impact}
              </p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default FindingsGrid;