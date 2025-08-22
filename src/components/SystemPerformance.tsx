import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { SystemPerformanceData } from '../types/scorecard';
import { HelpCircle, Star, Gauge, Users, Database, TrendingUp, Zap, Heart, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface SystemPerformanceProps {
  data: SystemPerformanceData;
  onUpdate: (data: Partial<SystemPerformanceData>) => void;
}

const questionSections = [
  {
    title: "User Experience & Efficiency",
    description: "How well your systems serve your team's daily needs",
    questions: [
      {
        id: 'q0',
        title: '8. Ease of use across your current systems',
        tooltip: 'How intuitive and user-friendly are your digital tools? Consider training time, user adoption, and daily usability.',
        icon: Users,
        required: true,
        examples: {
          1: 'Systems require extensive training, frequent errors',
          2: 'Complex interfaces, slow user adoption',
          3: 'Moderate learning curve, some usability issues',
          4: 'Generally intuitive, minimal training needed',
          5: 'Extremely user-friendly, instant adoption'
        }
      },
      {
        id: 'q1',
        title: '9. Efficiency of day-to-day workflows',
        tooltip: 'How smoothly do tasks flow from start to finish? Consider bottlenecks, manual handoffs, and process delays.',
        icon: TrendingUp,
        required: true,
        examples: {
          1: 'Constant bottlenecks, many manual steps',
          2: 'Frequent delays, some manual workarounds',
          3: 'Moderate flow, occasional inefficiencies',
          4: 'Smooth processes, minimal friction',
          5: 'Seamless workflows, highly optimized'
        }
      },
      {
        id: 'q6',
        title: '14. Team satisfaction with digital tools',
        tooltip: 'How happy is your team with the current systems? Consider user feedback, frustration levels, and productivity impact.',
        icon: Heart,
        required: true,
        examples: {
          1: 'Team frequently frustrated, low productivity',
          2: 'Regular complaints, resistance to using tools',
          3: 'Mixed feedback, some satisfaction issues',
          4: 'Generally positive, good user adoption',
          5: 'Team loves the tools, high productivity'
        }
      }
    ]
  },
  {
    title: "Data & Integration",
    description: "How well your systems manage and share information",
    questions: [
      {
        id: 'q2',
        title: '10. Confidence in data accuracy',
        tooltip: 'How much do you trust your data for making decisions? Consider data quality, consistency, and reliability.',
        icon: Database,
        required: true,
        examples: {
          1: 'Data often incorrect, multiple versions exist',
          2: 'Frequent inconsistencies, manual verification needed',
          3: 'Generally accurate but some quality issues',
          4: 'High confidence, minor discrepancies only',
          5: 'Complete trust, data is always reliable'
        }
      },
      {
        id: 'q3',
        title: '11. Timeliness of business reporting',
        tooltip: 'How quickly can you access current business insights? Consider report generation speed and data freshness.',
        icon: Gauge,
        required: true,
        examples: {
          1: 'Reports take days/weeks, data is outdated',
          2: 'Slow reporting, data often several days old',
          3: 'Moderate speed, some delays in data updates',
          4: 'Quick reporting, mostly up-to-date data',
          5: 'Real-time reporting, instant data access'
        }
      },
      {
        id: 'q4',
        title: '12. Level of system integration',
        tooltip: 'How well do your systems communicate with each other? Consider data sharing and automated workflows between tools.',
        icon: Zap,
        required: true,
        examples: {
          1: 'No integration, manual data entry everywhere',
          2: 'Limited connections, mostly manual processes',
          3: 'Some integration, still manual work required',
          4: 'Well integrated, minimal manual intervention',
          5: 'Fully integrated, seamless data flow'
        }
      }
    ]
  },
  {
    title: "Automation & Operations",
    description: "How much your systems handle work automatically",
    questions: [
      {
        id: 'q5',
        title: '13. Use of automation in your operations',
        tooltip: 'How much manual work has been replaced by automated processes? Consider repetitive tasks and workflow automation.',
        icon: Zap,
        required: true,
        examples: {
          1: 'Everything done manually, no automation',
          2: 'Very limited automation, mostly manual work',
          3: 'Some automation, but many manual processes',
          4: 'Good automation, few manual tasks remain',
          5: 'Highly automated, minimal manual work'
        }
      }
    ]
  }
];

const scaleOptions = [
  { 
    value: '1', 
    label: 'Very Poor', 
    color: 'text-red-600 dark:text-red-400',
    selectedBg: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800/50'
  },
  { 
    value: '2', 
    label: 'Poor', 
    color: 'text-orange-600 dark:text-orange-400',
    selectedBg: 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800/50'
  },
  { 
    value: '3', 
    label: 'Neutral', 
    color: 'text-yellow-600 dark:text-yellow-400',
    selectedBg: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800/50'
  },
  { 
    value: '4', 
    label: 'Good', 
    color: 'text-green-600 dark:text-green-400',
    selectedBg: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800/50'
  },
  { 
    value: '5', 
    label: 'Excellent', 
    color: 'text-emerald-600 dark:text-emerald-400',
    selectedBg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/50'
  }
];

const RequiredIndicator = () => (
  <Star className="w-3 h-3 text-red-500 fill-red-500 ml-1 inline" />
);

const SectionHeader = ({ title, description }: { title: string; description: string }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-primary mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const SystemPerformance: React.FC<SystemPerformanceProps> = ({ data, onUpdate }) => {
  const handleRatingChange = (questionIndex: string, value: string) => {
    onUpdate({ [questionIndex]: parseInt(value) });
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Introduction */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground max-w-xl mx-auto">
            Rate how well your current systems perform across key operational areas.
          </p>
        </motion.div>

        {/* Rating Guide */}
        <motion.div 
          className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start gap-2 mb-2">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-primary text-sm font-medium mb-1">
                Rating Scale: 1 = Very Poor → 5 = Excellent
              </p>
              <p className="text-primary/80 text-xs">
                Lower ratings indicate areas needing improvement and contribute to higher complexity scores
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {questionSections.map((section, sectionIndex) => (
            <motion.section key={section.title} variants={itemVariants}>
              <SectionHeader title={section.title} description={section.description} />
              
              <div className="space-y-6">
                {section.questions.map((question) => {
                  const IconComponent = question.icon;
                  const currentValue = data[question.id as keyof SystemPerformanceData];
                  
                  return (
                    <div 
                      key={question.id} 
                      className="space-y-4 p-6 bg-card rounded-lg border border-border/50 hover:border-border transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-4">
                            <Label className="text-base font-semibold block leading-relaxed">
                              {question.title}
                              {question.required && <RequiredIndicator />}
                            </Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help flex-shrink-0" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{question.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          
                          <RadioGroup 
                            value={currentValue?.toString() || ''} 
                            onValueChange={(value) => handleRatingChange(question.id, value)}
                          >
                            {/* Mobile: Single column layout with examples */}
                            <div className="flex flex-col sm:hidden space-y-3">
                              {scaleOptions.map((option) => (
                                <div 
                                  key={option.value} 
                                  className={`flex flex-col space-y-2 p-4 rounded-lg border transition-colors touch-target ${ 
                                    currentValue?.toString() === option.value 
                                      ? option.selectedBg
                                      : 'border-border/30 hover:border-border'
                                  }`}
                                >
                                  <div className="flex items-center space-x-4">
                                    <RadioGroupItem 
                                      value={option.value} 
                                      id={`${question.id}-${option.value}`}
                                      className="flex-shrink-0"
                                    />
                                    <Label 
                                      htmlFor={`${question.id}-${option.value}`} 
                                      className={`cursor-pointer font-medium flex-1 ${option.color}`}
                                    >
                                      {option.label}
                                    </Label>
                                  </div>
                                  <p className="text-xs text-muted-foreground ml-8 leading-relaxed">
                                    {question.examples[parseInt(option.value) as keyof typeof question.examples]}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Desktop: Grid layout with examples */}
                            <div className="hidden sm:block space-y-4">
                              <div className="grid grid-cols-5 gap-3">
                                {scaleOptions.map((option) => (
                                  <div 
                                    key={option.value} 
                                    className={`flex flex-col items-center space-y-2 p-4 rounded-lg border transition-colors touch-target ${ 
                                      currentValue?.toString() === option.value 
                                        ? option.selectedBg
                                        : 'border-border/30 hover:border-border'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem 
                                        value={option.value} 
                                        id={`${question.id}-${option.value}-desktop`}
                                        className="flex-shrink-0"
                                      />
                                      <Label 
                                        htmlFor={`${question.id}-${option.value}-desktop`} 
                                        className={`cursor-pointer text-sm font-medium text-center ${option.color}`}
                                      >
                                        {option.label}
                                      </Label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Examples row for desktop */}
                              <div className="grid grid-cols-5 gap-3 mt-2">
                                {scaleOptions.map((option) => (
                                  <div key={`example-${option.value}`} className="text-xs text-muted-foreground text-center p-2">
                                    {question.examples[parseInt(option.value) as keyof typeof question.examples]}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </motion.div>
      </div>
    </TooltipProvider>
  );
};

export default SystemPerformance;