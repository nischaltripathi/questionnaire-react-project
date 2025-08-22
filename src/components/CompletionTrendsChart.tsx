import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompletionTrendsChartProps {
  completionTrends: Array<{
    date: string;
    completions: number;
  }>;
}

const CompletionTrendsChart: React.FC<CompletionTrendsChartProps> = ({ 
  completionTrends 
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-primary">
            {payload[0].value} assessments completed
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
          Assessment Completion Trends (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={completionTrends} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="completions"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#completionGradient)"
                animationDuration={1000}
                animationBegin={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default CompletionTrendsChart;