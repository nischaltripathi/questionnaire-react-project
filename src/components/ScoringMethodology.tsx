import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Info, Scale, Target, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const ScoringMethodology: React.FC = () => {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scale className="w-5 h-5 text-primary" />
            Enhanced Scoring Methodology
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Smart Weighting */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <h4 className="font-semibold text-sm">Smart Question Weighting</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <div className="font-medium text-blue-700 dark:text-blue-300 mb-1">Higher Weight</div>
                <ul className="text-xs space-y-1 text-blue-600 dark:text-blue-400">
                  <li>• Manual workarounds</li>
                  <li>• System integration quality</li>
                  <li>• Critical fixes needed</li>
                  <li>• Growth support capability</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-950/30">
                <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Lower Weight</div>
                <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Number of frustrations listed</li>
                  <li>• Time-consuming process count</li>
                  <li>• Industry selection</li>
                  <li>• Client details</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Confidence Penalties */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <h4 className="font-semibold text-sm">Data Confidence Penalties</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30">
                <div className="font-medium text-red-700 dark:text-red-300">Unreliable (1-2/5)</div>
                <div className="text-red-600 dark:text-red-400">-3.0 points</div>
              </div>
              <div className="p-2 rounded border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30">
                <div className="font-medium text-yellow-700 dark:text-yellow-300">Partially Trusted (3/5)</div>
                <div className="text-yellow-600 dark:text-yellow-400">-1.5 points</div>
              </div>
              <div className="p-2 rounded border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/30">
                <div className="font-medium text-orange-700 dark:text-orange-300">Inconsistent (3.5/5)</div>
                <div className="text-orange-600 dark:text-orange-400">-0.75 points</div>
              </div>
            </div>
          </div>

          {/* Informational Categories */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-semibold">Informational-Only Questions</div>
                <div className="text-sm">
                  Industry selection and client details provide context for recommendations but don't affect your complexity score. 
                  This ensures scoring focuses on operational complexity rather than business characteristics.
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">Industry</Badge>
                  <Badge variant="secondary" className="text-xs">Top Clients</Badge>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Consistency Validation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <h4 className="font-semibold text-sm">Smart Validation</h4>
            </div>
            <div className="text-sm text-muted-foreground">
              The system detects potentially contradictory responses and provides warnings to help ensure accuracy:
            </div>
            <ul className="text-xs space-y-1 text-muted-foreground ml-4">
              <li>• High performance ratings vs high pain point scores</li>
              <li>• Low data confidence vs frequent reporting</li>
              <li>• Many systems vs excellent performance claims</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScoringMethodology;