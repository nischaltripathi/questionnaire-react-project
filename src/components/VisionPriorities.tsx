import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { VisionPrioritiesData } from '../types/scorecard';
import { 
  HelpCircle, 
  Star, 
  Zap, 
  Users, 
  MessageSquare, 
  Clock, 
  Workflow, 
  Database, 
  BarChart3, 
  DollarSign, 
  TrendingUp,
  Target,
  Lightbulb,
  CheckCircle,
  Award,
  Gauge,
  Shield,
  AlertCircle,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface VisionPrioritiesProps {
  data: VisionPrioritiesData;
  onUpdate: (data: Partial<VisionPrioritiesData>) => void;
}

const desiredOutcomes = [
  { 
    name: 'Automated processes', 
    icon: Zap, 
    example: 'Eliminate manual data entry and repetitive tasks' 
  },
  { 
    name: 'Better customer experience', 
    icon: Users, 
    example: 'Faster response times and smoother interactions' 
  },
  { 
    name: 'Better team collaboration', 
    icon: MessageSquare, 
    example: 'Shared dashboards and seamless communication' 
  },
  { 
    name: 'Faster decision-making', 
    icon: Clock, 
    example: 'Real-time data access and instant insights' 
  },
  { 
    name: 'Improved internal workflows', 
    icon: Workflow, 
    example: 'Streamlined processes and clear handoffs' 
  },
  { 
    name: 'More reliable data', 
    icon: Database, 
    example: 'Consistent, accurate information across systems' 
  },
  { 
    name: 'Real-time dashboards & insights', 
    icon: BarChart3, 
    example: 'Live KPI tracking and performance monitoring' 
  },
  { 
    name: 'Reduced software costs', 
    icon: DollarSign, 
    example: 'Consolidate tools and eliminate redundancies' 
  },
  { 
    name: 'Scalability for growth', 
    icon: TrendingUp, 
    example: 'Systems that grow with your business needs' 
  }
];

const businessImpacts = [
  { name: 'Increased revenue', icon: DollarSign, example: 'Higher sales conversion and customer retention' },
  { name: 'Reduced operating costs', icon: Gauge, example: 'Lower overhead and operational expenses' },
  { name: 'Time saved on manual tasks', icon: Clock, example: 'Hours returned to strategic work' },
  { name: 'Faster decision-making', icon: Lightbulb, example: 'Quicker responses to market changes' },
  { name: 'Improved team productivity', icon: Users, example: 'More output with same resources' },
  { name: 'Higher customer satisfaction', icon: Award, example: 'Better service delivery and experience' },
  { name: 'Fewer errors or rework', icon: CheckCircle, example: 'Reduced mistakes and quality issues' },
  { name: 'Better compliance or audit outcomes', icon: Shield, example: 'Easier regulatory adherence' },
  { name: 'Increased capacity for growth', icon: TrendingUp, example: 'Ability to scale without proportional costs' }
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

const VisionPriorities: React.FC<VisionPrioritiesProps> = ({ data, onUpdate }) => {
  const handleOutcomesChange = (outcome: string, checked: boolean) => {
    const current = data.desiredOutcomes || [];
    const updated = checked
      ? [...current, outcome]
      : current.filter(o => o !== outcome);
    onUpdate({ desiredOutcomes: updated });
  };

  const handleImpactChange = (impact: string, checked: boolean) => {
    const current = data.businessImpact || [];
    const updated = checked
      ? [...current, impact]
      : current.filter(i => i !== impact);
    onUpdate({ businessImpact: updated });
  };

  const selectedOutcomesCount = data.desiredOutcomes?.length || 0;
  const exceedsLimit = selectedOutcomesCount > 3;

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
            Help us understand your strategic goals and vision for success.
          </p>
        </motion.div>

        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Strategic Goals Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader 
              title="Strategic Goals" 
              description="Your top priorities for system improvement and optimization"
            />
            
            <div className="space-y-6">
              {/* Question 26 */}
              <div className="space-y-4 p-6 bg-card rounded-lg border border-border/50 hover:border-border transition-colors">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Label className="text-base font-semibold block leading-relaxed">
                        26. Which outcomes do you want your systems to support? (Choose up to 3)
                        <RequiredIndicator />
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Your top priorities shape the complexity assessment. More ambitious goals typically require more sophisticated system solutions.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Selection Counter */}
                    <div className="mb-4">
                      <Badge variant={exceedsLimit ? "destructive" : selectedOutcomesCount === 3 ? "default" : "secondary"}>
                        {selectedOutcomesCount}/3 selected
                      </Badge>
                      {exceedsLimit && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                          <AlertCircle className="w-4 h-4" />
                          <span>Please select up to 3 outcomes only</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {desiredOutcomes.map((outcome) => {
                        const IconComponent = outcome.icon;
                        return (
                          <div key={outcome.name} className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                            data.desiredOutcomes?.includes(outcome.name) 
                              ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                              : 'border-border/50 hover:border-border'
                          }`}>
                            <Checkbox
                              id={outcome.name}
                              checked={data.desiredOutcomes?.includes(outcome.name) || false}
                              onCheckedChange={(checked) => handleOutcomesChange(outcome.name, checked as boolean)}
                              className="mt-0.5"
                            />
                            <IconComponent className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <Label htmlFor={outcome.name} className="text-sm font-medium cursor-pointer block mb-1">
                                {outcome.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">{outcome.example}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Business Impact Assessment Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader 
              title="Business Impact Assessment" 
              description="How success would transform your business operations"
            />
            
            <div className="space-y-6">
              {/* Question 27 */}
              <div className="space-y-4 p-6 bg-card rounded-lg border border-border/50 hover:border-border transition-colors">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Label className="text-base font-semibold block leading-relaxed">
                        27. How would success impact your business?
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Multiple impact areas indicate broader system requirements and higher complexity. Focus on your most important business outcomes.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {businessImpacts.map((impact) => {
                        const IconComponent = impact.icon;
                        return (
                          <div key={impact.name} className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                            data.businessImpact?.includes(impact.name) 
                              ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                              : 'border-border/50 hover:border-border'
                          }`}>
                            <Checkbox
                              id={impact.name}
                              checked={data.businessImpact?.includes(impact.name) || false}
                              onCheckedChange={(checked) => handleImpactChange(impact.name, checked as boolean)}
                              className="mt-0.5"
                            />
                            <IconComponent className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <Label htmlFor={impact.name} className="text-sm font-medium cursor-pointer block mb-1">
                                {impact.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">{impact.example}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Success Vision Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader 
              title="Success Vision" 
              description="Define your ideal end state for system optimization"
            />
            
            <div className="space-y-6">
              {/* Question 28 */}
              <div className="space-y-4 p-6 bg-card rounded-lg border border-border/50 hover:border-border transition-colors">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Label htmlFor="successDefinition" className="text-base font-semibold">
                        28. What would 'success' look like?
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Be specific about your ideal end state. This helps generate personalized recommendations aligned with your vision.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    <Textarea
                      id="successDefinition"
                      placeholder="e.g., All processes automated, real-time dashboards for key metrics, team spends 80% less time on manual tasks, decisions made with complete data confidence..."
                      value={data.successDefinition || ''}
                      onChange={(e) => onUpdate({ successDefinition: e.target.value })}
                      className="min-h-[120px] resize-none touch-target"
                      maxLength={750}
                    />
                    <div className="text-xs text-muted-foreground text-right mt-2">
                      {(data.successDefinition || '').length}/750 characters
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </TooltipProvider>
  );
};

export default VisionPriorities;