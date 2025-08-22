import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, AlertTriangle, Clock, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { FormData, ComplexityTier } from '../types/scorecard';

interface SystemHealthOverviewProps {
  formData?: FormData;
  tier: ComplexityTier;
  score: number;
}

const SystemHealthOverview: React.FC<SystemHealthOverviewProps> = ({ formData, tier, score }) => {
  // Calculate assessment completeness for confidence scoring
  const getAssessmentCompleteness = () => {
    if (!formData?.systemPerformance) return 0;
    const responses = Object.values(formData.systemPerformance).filter(v => v !== undefined);
    return (responses.length / 5) * 100; // Assuming 5 total questions
  };

  const completeness = getAssessmentCompleteness();
  const getConfidenceLevel = () => {
    if (completeness >= 80) return 'High';
    if (completeness >= 60) return 'Medium';
    return 'Low';
  };

  // Get top 3 areas to explore based on assessment data
  const getAreasToExplore = () => {
    if (!formData?.systemPerformance) return [];
    
    const areas = [
      { 
        name: 'Data Quality & Reporting', 
        score: formData.systemPerformance.q2 || 3,
        finding: 'May benefit from data accuracy improvements',
        timeframe: '3-6 months',
        confidence: getConfidenceLevel()
      },
      { 
        name: 'Process Automation', 
        score: formData.systemPerformance.q5 || 3,
        finding: 'Manual processes identified for potential automation',
        timeframe: '2-4 months',
        confidence: getConfidenceLevel()
      },
      { 
        name: 'System Integration', 
        score: formData.systemPerformance.q4 || 3,
        finding: 'Workflow connections could be streamlined',
        timeframe: '4-8 months',
        confidence: getConfidenceLevel()
      }
    ];

    return areas
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map((area, index) => ({
        ...area,
        rank: index + 1,
        percentage: (area.score / 5) * 100,
        priority: area.score <= 2 ? 'Primary' : area.score <= 3 ? 'Secondary' : 'Lower'
      }));
  };

  const areas = getAreasToExplore();
  const primaryFinding = areas[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-4 xs:space-y-6"
    >
      {/* Critical Finding - Above the Fold */}
      <Card className="border-l-4 border-l-primary bg-primary/5">
        <CardHeader className="pb-3 xs:pb-4">
          <div className="flex items-start gap-3 xs:gap-4">
            <TrendingUp className="w-5 h-5 xs:w-6 xs:h-6 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg xs:text-xl font-semibold mb-2">
                Primary Area to Explore
              </CardTitle>
              {primaryFinding && (
                <div className="space-y-2">
                  <h3 className="text-base xs:text-lg font-medium text-foreground">
                    {primaryFinding.name}
                  </h3>
                  <p className="text-sm xs:text-base text-muted-foreground">
                    {primaryFinding.finding}
                  </p>
                  <div className="flex flex-wrap gap-2 xs:gap-3 mt-3">
                    <Badge variant="outline" className="text-xs">
                      {primaryFinding.confidence} Confidence
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {primaryFinding.timeframe}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Supporting Details */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4 xs:pb-6">
          <CardTitle className="text-base xs:text-lg font-medium">
            Discussion Topics for Consultation
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Areas identified for deeper exploration during our conversation
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4 xs:space-y-6">
          {areas.map((area, index) => (
            <motion.div
              key={area.name}
              className="p-4 xs:p-5 rounded-lg border border-border/50 bg-muted/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Topic #{area.rank}
                    </span>
                    <Badge 
                      variant={area.priority === 'Primary' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {area.priority}
                    </Badge>
                  </div>
                  <h4 className="text-sm xs:text-base font-medium text-foreground mb-1">
                    {area.name}
                  </h4>
                  <p className="text-xs xs:text-sm text-muted-foreground">
                    {area.finding}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs text-muted-foreground mb-1">
                    Current: {area.score}/5
                  </div>
                  <div className="text-xs font-medium">
                    {area.timeframe}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Progress 
                  value={area.percentage} 
                  className="h-2 xs:h-3 bg-muted" 
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Assessment Score</span>
                  <span>{area.confidence} Confidence</span>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Disclaimer and Next Steps */}
      <Alert className="border-amber-200 bg-amber-50/50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-xs xs:text-sm text-amber-800">
          <strong>Important:</strong> These are preliminary insights based on initial assessment data 
          ({completeness.toFixed(0)}% complete). Results serve as discussion starting points and require 
          deeper analysis during consultation to develop specific recommendations.
        </AlertDescription>
      </Alert>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs xs:text-sm">
          <strong>Next Step:</strong> Schedule a consultation to explore these areas in detail, 
          validate findings with your specific context, and develop actionable improvement strategies.
        </AlertDescription>
      </Alert>
    </motion.section>
  );
};

export default SystemHealthOverview;