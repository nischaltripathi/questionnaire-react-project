import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Info, TrendingDown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScoringAdjustment {
  type: 'penalty' | 'bonus' | 'warning';
  category: string;
  description: string;
  impact: number;
  reason: string;
}

interface ValidationIssue {
  type: 'warning' | 'error';
  title: string;
  description: string;
  conflictingResponses?: string[];
}

interface ScoringAdjustmentsProps {
  adjustments: ScoringAdjustment[];
  validationIssues: ValidationIssue[];
  originalScore: number;
  adjustedScore: number;
}

const ScoringAdjustments: React.FC<ScoringAdjustmentsProps> = ({
  adjustments,
  validationIssues,
  originalScore,
  adjustedScore
}) => {
  if (adjustments.length === 0 && validationIssues.length === 0) {
    return null;
  }

  const totalAdjustment = adjustedScore - originalScore;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Validation Issues */}
      {validationIssues.length > 0 && (
        <div className="space-y-3">
          {validationIssues.map((issue, index) => (
            <Alert
              key={index}
              variant={issue.type === 'error' ? 'destructive' : 'default'}
              className="border-l-4"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-semibold">{issue.title}</div>
                  <div className="text-sm">{issue.description}</div>
                  {issue.conflictingResponses && (
                    <div className="text-xs text-muted-foreground">
                      <strong>Conflicting responses:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {issue.conflictingResponses.map((response, idx) => (
                          <li key={idx}>{response}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Scoring Adjustments */}
      {adjustments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="w-5 h-5 text-primary" />
              Scoring Adjustments Applied
              <Badge variant="outline" className="ml-auto">
                {totalAdjustment > 0 ? '+' : ''}{totalAdjustment.toFixed(1)} points
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Score Summary */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Original Score:</span>
                  <Badge variant="secondary">{originalScore.toFixed(1)}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Adjusted Score:</span>
                  <Badge variant="default">{adjustedScore.toFixed(1)}</Badge>
                </div>
              </div>

              {/* Individual Adjustments */}
              <div className="space-y-2">
                {adjustments.map((adjustment, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card/50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {adjustment.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      ) : adjustment.impact < 0 ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{adjustment.category}</span>
                        <Badge
                          variant={adjustment.impact < 0 ? 'destructive' : 'default'}
                          className="text-xs"
                        >
                          {adjustment.impact > 0 ? '+' : ''}{adjustment.impact.toFixed(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {adjustment.description}
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        {adjustment.reason}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default ScoringAdjustments;