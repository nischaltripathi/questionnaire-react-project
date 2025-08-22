import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, Target, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroMetricsProps {
  totalLeads: number;
  activeLeads: number;
  conversionRate: string;
  averageAge: number;
}

const HeroMetrics: React.FC<HeroMetricsProps> = ({
  totalLeads,
  activeLeads,
  conversionRate,
  averageAge,
}) => {
  const metrics = [
    {
      icon: Users,
      label: 'Total Leads',
      value: totalLeads.toLocaleString(),
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: TrendingUp,
      label: 'Active Leads',
      value: activeLeads.toLocaleString(),
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      iconColor: 'text-green-600',
    },
    {
      icon: Target,
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: Clock,
      label: 'Avg. Lead Age',
      value: `${averageAge}d`,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4 }}
          className="group"
        >
          <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${metric.bgGradient} hover:shadow-lg transition-all duration-300`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {metric.label}
                  </p>
                  <p className={`text-3xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
                    {metric.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-white/80 ${metric.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default HeroMetrics;