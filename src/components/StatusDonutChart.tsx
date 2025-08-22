import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatusDonutChartProps {
  statusData: Array<{
    status: string;
    count: number;
    percentage: string;
  }>;
}

const StatusDonutChart: React.FC<StatusDonutChartProps> = ({ statusData }) => {
  const COLORS = [
    '#3b82f6', // Blue
    '#10b981', // Green  
    '#f59e0b', // Yellow
    '#8b5cf6', // Purple
    '#ef4444', // Red
    '#6b7280', // Gray
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.status}</p>
          <p className="text-sm text-muted-foreground">
            {data.count} leads ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5 text-primary" />
          Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="count"
                animationBegin={200}
                animationDuration={800}
              >
                {statusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          {statusData.map((item, index) => (
            <motion.div
              key={item.status}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs font-medium truncate">
                {item.status}
              </span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusDonutChart;