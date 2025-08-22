import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, Users, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface CriticalFinding {
  title: string;
  insight: string;
  businessImpact: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

interface ExecutiveSummaryProps {
  findings: CriticalFinding[];
  tier: string;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ findings, tier }) => {
  const topFindings = findings.slice(0, 3);
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'High': return <TrendingDown className="w-4 h-4 text-orange-500" />;
      default: return <Target className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20';
      case 'High': return 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20';
      default: return 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Executive Summary - Top 3 Critical Findings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topFindings.map((finding, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${getPriorityColor(finding.priority)} hover:shadow-md transition-all duration-200`}>
                <div className="flex items-start gap-3">
                  {getPriorityIcon(finding.priority)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm">{finding.title}</h4>
                      <Badge variant={finding.priority === 'Critical' ? 'destructive' : 'secondary'} className="text-xs">
                        {finding.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{finding.insight}</p>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      {finding.businessImpact}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExecutiveSummary;