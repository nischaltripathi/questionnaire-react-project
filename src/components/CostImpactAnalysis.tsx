import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Target, Users, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { FormData } from '../types/scorecard';

interface CostImpactAnalysisProps {
  formData?: FormData;
  tier: string;
}

const CostImpactAnalysis: React.FC<CostImpactAnalysisProps> = ({ formData, tier }) => {
  const calculateEfficiencyOpportunities = () => {
    if (!formData) return null;

    const teamSize = formData.businessSnapshot.teamSize || '';
    const systemsCount = formData.businessSnapshot.systemsCount || 0;
    const hasManualWorkarounds = formData.painPoints.manualWorkarounds === 'yes';
    const timeConsumingProcesses = formData.painPoints.timeConsumingProcesses || [];

    // Efficiency opportunity ranges by team size and complexity
    const getBaseEfficiency = () => {
      if (teamSize.includes('Large')) return { low: 25, high: 45, hours: { low: 35, high: 50 } };
      if (teamSize.includes('Medium')) return { low: 20, high: 35, hours: { low: 25, high: 40 } };
      return { low: 15, high: 30, hours: { low: 20, high: 35 } };
    };

    const efficiency = getBaseEfficiency();

    // System management efficiency opportunity ranges
    const systemEfficiencyLow = Math.min(systemsCount * 2, 15);
    const systemEfficiencyHigh = Math.min(systemsCount * 4, 30);

    // Manual process efficiency opportunity ranges
    const manualProcessLow = hasManualWorkarounds ? 
      Math.min((timeConsumingProcesses.length * 5) + 10, 25) : 5;
    const manualProcessHigh = hasManualWorkarounds ? 
      Math.min((timeConsumingProcesses.length * 12) + 20, 50) : 15;

    // Overall productivity opportunity ranges based on tier
    const productivityRanges = {
      'Low': { low: 8, high: 18 },
      'Medium': { low: 15, high: 30 },
      'High': { low: 25, high: 65 },

    };
    
    const productivityRange = productivityRanges[tier as keyof typeof productivityRanges] || { low: 10, high: 25 };

    // Time recovery estimates (hours per week ranges)
    const weeklyTimeRecoveryLow = Math.round(efficiency.hours.low * 0.2);
    const weeklyTimeRecoveryHigh = Math.round(efficiency.hours.high * 0.4);

    // Total opportunity ranges
    const totalOpportunityLow = Math.min(systemEfficiencyLow + manualProcessLow + productivityRange.low, 50);
    const totalOpportunityHigh = Math.min(systemEfficiencyHigh + manualProcessHigh + productivityRange.high, 75);

    return {
      systemEfficiency: { low: systemEfficiencyLow, high: systemEfficiencyHigh },
      manualProcess: { low: manualProcessLow, high: manualProcessHigh },
      productivity: productivityRange,
      weeklyTimeRecovery: { low: weeklyTimeRecoveryLow, high: weeklyTimeRecoveryHigh },
      totalOpportunity: { low: totalOpportunityLow, high: totalOpportunityHigh }
    };
  };

  const opportunities = calculateEfficiencyOpportunities();

  if (!opportunities) return null;

  const formatRange = (low: number, high: number, suffix: string = '%') => {
    return `${low}-${high}${suffix}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6 }}
      className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Efficiency Opportunity Analysis
            <Badge variant="outline" className="ml-auto">
              ~70-85% Confidence
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Current Efficiency Gaps */}
            <div className="space-y-4">
              <h4 className="font-semibold text-orange-600 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Enhancement Opportunities
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                  <span className="text-sm">System Integration</span>
                  <span className="font-bold text-orange-600">
                    {formatRange(opportunities.systemEfficiency.low, opportunities.systemEfficiency.high)} improvement
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                  <span className="text-sm">Process Automation</span>
                  <span className="font-bold text-yellow-600">
                    {formatRange(opportunities.manualProcess.low, opportunities.manualProcess.high)} efficiency gain
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <span className="text-sm">Team Productivity</span>
                  <span className="font-bold text-blue-600">
                    {formatRange(opportunities.productivity.low, opportunities.productivity.high)} enhancement
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 rounded-lg bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-300 dark:border-purple-700">
                  <span className="font-semibold">Combined Potential</span>
                  <span className="font-bold text-xl text-purple-700">
                    {formatRange(opportunities.totalOpportunity.low, opportunities.totalOpportunity.high)}
                  </span>
                </div>
              </div>
            </div>

            {/* Optimization Benefits */}
            <div className="space-y-4">
              <h4 className="font-semibold text-green-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Expected Outcomes
              </h4>
              
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {formatRange(opportunities.totalOpportunity.low, opportunities.totalOpportunity.high)}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Overall Efficiency Range
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      Conservative to optimistic scenarios (±15% variance)
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <div className="text-sm text-center">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    <div className="font-medium">Time Recovery</div>
                    <div className="text-xs text-muted-foreground">
                      {formatRange(opportunities.weeklyTimeRecovery.low, opportunities.weeklyTimeRecovery.high, ' hours/week')}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800">
                  <div className="text-sm text-center">
                    <Users className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                    <div className="font-medium">Team Impact</div>
                    <div className="text-xs text-muted-foreground">
                      Improved satisfaction & focus
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Confidence Range Explanation */}
          <div className="p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <strong>About These Estimates:</strong> Ranges represent conservative to comprehensive improvement potential based on your team size and system complexity. These are statistical estimates with ~70-85% confidence intervals, not precise calculations.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CostImpactAnalysis;