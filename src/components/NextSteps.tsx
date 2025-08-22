import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, FileText, Zap, Clock, CheckCircle, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const NextSteps: React.FC = () => {
  const steps = [
    {
      icon: Calendar,
      title: 'Schedule Your Consultation',
      description: 'Book a 45-minute strategic discussion with our optimization specialist.',
      timeframe: 'Today',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30'
    },
    {
      icon: Users,
      title: 'Collaborative Assessment Review',
      description: 'Walk through your results together and identify priority opportunities.',
      timeframe: 'During consultation',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/30'
    },
    {
      icon: FileText,
      title: 'Determine New Complexity Level',
      description: 'Validate your complexity level with a Sales Agent and receive a tailored roadmap with clear next steps.',
      timeframe: '2–3 business days',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30'
    },
    {
      icon: Settings,
      title: 'Technical Investigation with our Senior System Architect',
      description: 'Map your systems, surface risks, and confirm scope—before any implementation begins.',
      timeframe: 'One-off paid engagement',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30'
    },
    {
      icon: Zap,
      title: 'Guided Implementation (Optional)',
      description: 'Includes setup, QA, and milestone check-ins to ensure smooth delivery and real results.',
      timeframe: 'Available after investigation',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.7 }}
      className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            What Happens Next
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-lg ${step.bgColor} border border-opacity-20`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8 + index * 0.1 }}>
                  
                  <div className={`p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm`}>
                    <IconComponent className={`w-5 h-5 ${step.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{step.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {step.timeframe}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      index === 0 ? 'border-primary bg-primary' : 'border-muted-foreground'
                    } flex items-center justify-center`}>
                      {index === 0 && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium mb-1">No Obligation Consultation</p>
                <p className="text-xs text-muted-foreground">
                  Free consultation with no commitment required.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NextSteps;