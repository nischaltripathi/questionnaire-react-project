import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComplexityRadialProps {
  tierData: Array<{
    tier: string;
    count: number;
    percentage: string;
  }>;
}

const ComplexityRadial: React.FC<ComplexityRadialProps> = ({ tierData }) => {
  const colors = [
    { bg: 'from-blue-400 to-blue-600', stroke: 'stroke-blue-500' },
    { bg: 'from-green-400 to-green-600', stroke: 'stroke-green-500' },
    { bg: 'from-yellow-400 to-yellow-600', stroke: 'stroke-yellow-500' },
    { bg: 'from-red-400 to-red-600', stroke: 'stroke-red-500' },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="w-5 h-5 text-primary" />
          Complexity Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tierData.map((tier, index) => {
          const percentage = parseFloat(tier.percentage);
          const color = colors[index % colors.length];
          
          return (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/20"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className={color.stroke}
                    initial={{ strokeDasharray: "0 175.93" }}
                    animate={{ 
                      strokeDasharray: `${(percentage / 100) * 175.93} 175.93` 
                    }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold">{tier.percentage}%</span>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{tier.tier}</span>
                  <span className="text-lg font-bold">{tier.count}</span>
                </div>
                <div className={`h-1 rounded-full bg-gradient-to-r ${color.bg} mt-1`} 
                     style={{ width: `${percentage}%` }} />
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ComplexityRadial;