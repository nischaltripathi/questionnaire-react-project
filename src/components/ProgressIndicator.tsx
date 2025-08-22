import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep?: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep = 3 }) => {
  const steps = [
    { id: 1, label: 'Assessment', status: 'completed' },
    { id: 2, label: 'Analysis', status: 'completed' },
    { id: 3, label: 'Results', status: 'current' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8">
      <Card className="bg-muted/30 border-muted">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4 overflow-x-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : step.status === 'current' ? (
                      <div className="w-5 h-5 rounded-full bg-primary border-2 border-primary animate-pulse" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className={`text-sm font-medium ${
                      step.status === 'current' ? 'text-primary' :
                      step.status === 'completed' ? 'text-green-600' :
                      'text-muted-foreground'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground hidden md:block" />
                  )}
                </div>
              ))}
            </div>
            <Badge variant="outline" className="ml-4 flex-shrink-0">
              Step {currentStep} of {steps.length}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProgressIndicator;