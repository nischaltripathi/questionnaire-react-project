import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeadAgeProgressProps {
  ageDistribution: {
    fresh: number;
    warm: number;
    stale: number;
  };
  totalLeads: number;
}

const LeadAgeProgress: React.FC<LeadAgeProgressProps> = ({ 
  ageDistribution, 
  totalLeads 
}) => {
  const ageGroups = [
    {
      label: 'Fresh (0-2 days)',
      count: ageDistribution.fresh,
      color: 'bg-green-500',
      gradient: 'from-green-400 to-green-600',
    },
    {
      label: 'Warm (3-6 days)',
      count: ageDistribution.warm,
      color: 'bg-yellow-500',
      gradient: 'from-yellow-400 to-yellow-600',
    },
    {
      label: 'Stale (7+ days)',
      count: ageDistribution.stale,
      color: 'bg-red-500',
      gradient: 'from-red-400 to-red-600',
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-primary" />
          Lead Age Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {ageGroups.map((group, index) => {
          const percentage = totalLeads > 0 ? (group.count / totalLeads) * 100 : 0;
          
          return (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{group.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{group.count}</span>
                  <span className="text-sm text-muted-foreground">
                    ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="relative">
                <Progress 
                  value={percentage} 
                  className="h-3 bg-muted"
                />
                <div 
                  className={`absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r ${group.gradient} transition-all duration-700 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default LeadAgeProgress;