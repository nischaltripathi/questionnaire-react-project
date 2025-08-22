import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PainPointsData } from '../types/scorecard';
import { 
  HelpCircle, Star, Clock, AlertTriangle, TrendingUp, ArrowDown, CheckCircle,
  Database, Settings, Zap, Users, FileText, Search, RefreshCw, MessageSquare,
  Link, Key, Smartphone, BarChart3, Palette, Gauge, Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PainPointsProps {
  data: PainPointsData;
  onUpdate: (data: Partial<PainPointsData>) => void;
}

const timeConsumingProcesses = [
  { key: 'Data entry and updating records', label: 'Data entry and updating records', icon: Database, example: 'Manual customer info updates' },
  { key: 'Generating reports manually', label: 'Generating reports manually', icon: FileText, example: 'Weekly sales reports in Excel' },
  { key: 'Coordinating between different systems', label: 'Coordinating between different systems', icon: RefreshCw, example: 'Moving data between CRM and accounting' },
  { key: 'Following up on tasks or projects', label: 'Following up on tasks or projects', icon: MessageSquare, example: 'Checking project status updates' },
  { key: 'Searching for information across systems', label: 'Searching for information across systems', icon: Search, example: 'Finding customer history across tools' },
  { key: 'Reconciling data between systems', label: 'Reconciling data between systems', icon: RefreshCw, example: 'Matching inventory counts' },
  { key: 'Manual approval processes', label: 'Manual approval processes', icon: CheckCircle, example: 'Email-based expense approvals' },
  { key: 'Creating and sending routine communications', label: 'Creating and sending routine communications', icon: MessageSquare, example: 'Invoice reminders and follow-ups' }
];

const biggestFrustrations = [
  { key: 'Systems don\'t talk to each other', label: 'Systems don\'t talk to each other', icon: Link, example: 'Double data entry required' },
  { key: 'Too many logins and passwords', label: 'Too many logins and passwords', icon: Key, example: 'Different credentials for each tool' },
  { key: 'Slow performance or frequent crashes', label: 'Slow performance or frequent crashes', icon: AlertTriangle, example: 'System timeouts during busy periods' },
  { key: 'Difficult to find information quickly', label: 'Difficult to find information quickly', icon: Search, example: 'Poor search functionality' },
  { key: 'Limited mobile access', label: 'Limited mobile access', icon: Smartphone, example: 'Can\'t work effectively on phone/tablet' },
  { key: 'Inflexible reporting options', label: 'Inflexible reporting options', icon: BarChart3, example: 'Can\'t customize reports as needed' },
  { key: 'Poor user interface design', label: 'Poor user interface design', icon: Palette, example: 'Confusing navigation and layout' },
  { key: 'Lack of automation features', label: 'Lack of automation features', icon: Zap, example: 'Everything requires manual intervention' }
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

const conditionalVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.3
    }
  }
};

const PainPoints: React.FC<PainPointsProps> = ({ data, onUpdate }) => {
  const handleProcessChange = (process: string, checked: boolean) => {
    const current = data.timeConsumingProcesses || [];
    const updated = checked
      ? [...current, process]
      : current.filter(p => p !== process);
    onUpdate({ timeConsumingProcesses: updated });
  };

  const handleFrustrationChange = (frustration: string, checked: boolean) => {
    const current = data.biggestFrustrations || [];
    const updated = checked
      ? [...current, frustration]
      : current.filter(f => f !== frustration);
    onUpdate({ biggestFrustrations: updated });
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
            Help us understand the challenges and friction points in your current systems.
          </p>
        </motion.div>

        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Time-Consuming Processes Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader 
              title="Time-Consuming Processes" 
              description="Identify activities that take up significant time for your team"
            />
            
            <div className="space-y-6">
              {/* Question 15 */}
              <div className="space-y-4 p-6 bg-card rounded-lg border border-border/50 hover:border-border transition-colors">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Label className="text-base font-semibold block leading-relaxed">
                        15. Which processes consume the most time for your team?
                        <RequiredIndicator />
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Time-consuming processes indicate automation opportunities. Multiple selections suggest system fragmentation.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {timeConsumingProcesses.map((process) => {
                        const IconComponent = process.icon;
                        return (
                          <div key={process.key} className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                            data.timeConsumingProcesses?.includes(process.key) 
                              ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                              : 'border-border/50 hover:border-border'
                          }`}>
                            <Checkbox
                              id={process.key}
                              checked={data.timeConsumingProcesses?.includes(process.key) || false}
                              onCheckedChange={(checked) => handleProcessChange(process.key, checked as boolean)}
                              className="mt-0.5"
                            />
                            <IconComponent className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <Label htmlFor={process.key} className="text-sm font-medium cursor-pointer block mb-1">
                                {process.label}
                              </Label>
                              <p className="text-xs text-muted-foreground">{process.example}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 16 */}
              <div className="space-y-4 p-6 bg-card rounded-lg border border-border/50 hover:border-border transition-colors">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Label className="text-base font-semibold block leading-relaxed">
                        16. What are your biggest frustrations with current systems?
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>System frustrations reveal pain points that impact productivity and user satisfaction.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {biggestFrustrations.map((frustration) => {
                        const IconComponent = frustration.icon;
                        return (
                          <div key={frustration.key} className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                            data.biggestFrustrations?.includes(frustration.key) 
                              ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                              : 'border-border/50 hover:border-border'
                          }`}>
                            <Checkbox
                              id={frustration.key}
                              checked={data.biggestFrustrations?.includes(frustration.key) || false}
                              onCheckedChange={(checked) => handleFrustrationChange(frustration.key, checked as boolean)}
                              className="mt-0.5"
                            />
                            <IconComponent className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <Label htmlFor={frustration.key} className="text-sm font-medium cursor-pointer block mb-1">
                                {frustration.label}
                              </Label>
                              <p className="text-xs text-muted-foreground">{frustration.example}</p>
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

          {/* Manual Workarounds Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader 
              title="Manual Workarounds" 
              description="Understanding gaps in your current system capabilities"
            />
            
            <div className="space-y-6">
              {/* Question 17 */}
              <div className="space-y-4 p-6 bg-card rounded-lg border border-border/50 hover:border-border transition-colors">
                <div className="flex items-start gap-3">
                  <Settings className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Label className="text-base font-semibold block leading-relaxed">
                        17. Do you use manual workarounds because your systems don't do what you need?
                        <RequiredIndicator />
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Manual workarounds indicate system gaps and automation opportunities. They often add complexity and reduce efficiency.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <RadioGroup 
                      value={data.manualWorkarounds || ''} 
                      onValueChange={(value) => onUpdate({ manualWorkarounds: value as 'yes' | 'no' })}
                    >
                      <div className="space-y-3">
                        <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                          data.manualWorkarounds === 'yes' 
                            ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                            : 'border-border/50 hover:border-border'
                        }`}>
                          <RadioGroupItem value="yes" id="workarounds-yes" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="workarounds-yes" className="cursor-pointer font-medium block mb-1">
                              Yes, we have several manual processes to fill gaps
                            </Label>
                            <p className="text-xs text-muted-foreground">Systems don't handle all our needs automatically</p>
                          </div>
                        </div>
                        <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                          data.manualWorkarounds === 'no' 
                            ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                            : 'border-border/50 hover:border-border'
                        }`}>
                          <RadioGroupItem value="no" id="workarounds-no" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="workarounds-no" className="cursor-pointer font-medium block mb-1">
                              No, our systems handle most of what we need
                            </Label>
                            <p className="text-xs text-muted-foreground">Systems are well-suited to our processes</p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>

                    {data.manualWorkarounds === 'yes' && (
                      <motion.div 
                        className="space-y-6 border-t border-border/30 pt-6 mt-6"
                        variants={conditionalVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-sm text-primary">
                            <ArrowDown className="w-4 h-4" />
                            <span className="font-medium">Since you use manual workarounds, we'd like to understand them better:</span>
                          </div>
                        </div>

                        {/* Question 18 */}
                        <div className="flex items-center gap-2 mb-4">
                          <Label className="text-base font-semibold">
                            18. How critical is it to fix these manual processes?
                            <RequiredIndicator />
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>Priority level helps determine the urgency and potential ROI of system improvements.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        <RadioGroup 
                          value={data.criticalToFix || ''} 
                          onValueChange={(value) => onUpdate({ criticalToFix: value as 'low' | 'medium' | 'high' })}
                        >
                          <div className="space-y-3">
                            <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                              data.criticalToFix === 'low' 
                                ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                                : 'border-border/50 hover:border-border'
                            }`}>
                              <RadioGroupItem value="low" id="critical-low" className="mt-0.5" />
                              <div className="flex-1">
                                <Label htmlFor="critical-low" className="cursor-pointer font-medium block mb-1">
                                  Low priority - they work fine for now
                                </Label>
                                <p className="text-xs text-muted-foreground">Current processes are manageable</p>
                              </div>
                            </div>
                            <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                              data.criticalToFix === 'medium' 
                                ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                                : 'border-border/50 hover:border-border'
                            }`}>
                              <RadioGroupItem value="medium" id="critical-medium" className="mt-0.5" />
                              <div className="flex-1">
                                <Label htmlFor="critical-medium" className="cursor-pointer font-medium block mb-1">
                                  Medium priority - would be nice to improve
                                </Label>
                                <p className="text-xs text-muted-foreground">Some inefficiencies but not urgent</p>
                              </div>
                            </div>
                            <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                              data.criticalToFix === 'high' 
                                ? 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800/50' 
                                : 'border-border/50 hover:border-border'
                            }`}>
                              <RadioGroupItem value="high" id="critical-high" className="mt-0.5" />
                              <div className="flex-1">
                                <Label htmlFor="critical-high" className="cursor-pointer font-medium block mb-1">
                                  High priority - they're causing significant problems
                                </Label>
                                <p className="text-xs text-muted-foreground">Major pain points affecting productivity</p>
                              </div>
                            </div>
                          </div>
                        </RadioGroup>
                      </motion.div>
                    )}

                    {data.manualWorkarounds === 'no' && (
                      <motion.div 
                        className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6"
                        variants={conditionalVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Great! Having systems that meet your needs reduces complexity.</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Growth & Scalability Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader 
              title="Growth & Scalability" 
              description="How well your systems support future business growth"
            />
            
            <div className="space-y-6">
              {/* Question 19 */}
              <div className="space-y-4 p-6 bg-card rounded-lg border border-border/50 hover:border-border transition-colors">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Label className="text-base font-semibold block leading-relaxed">
                        19. Do your current systems support your growth plans?
                        <RequiredIndicator />
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Growth support capability indicates system scalability and future complexity challenges.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <RadioGroup 
                      value={data.supportGrowth || ''} 
                      onValueChange={(value) => onUpdate({ supportGrowth: value as 'yes' | 'no' })}
                    >
                      <div className="space-y-3">
                        <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                          data.supportGrowth === 'yes' 
                            ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                            : 'border-border/50 hover:border-border'
                        }`}>
                          <RadioGroupItem value="yes" id="growth-yes" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="growth-yes" className="cursor-pointer font-medium block mb-1">
                              Yes, they can handle our planned growth
                            </Label>
                            <p className="text-xs text-muted-foreground">Systems are scalable and flexible</p>
                          </div>
                        </div>
                        <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                          data.supportGrowth === 'no' 
                            ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                            : 'border-border/50 hover:border-border'
                        }`}>
                          <RadioGroupItem value="no" id="growth-no" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="growth-no" className="cursor-pointer font-medium block mb-1">
                              No, we'll likely need changes to scale
                            </Label>
                            <p className="text-xs text-muted-foreground">Current systems have limitations</p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Question 20 */}
              <div className="space-y-4 p-6 bg-card rounded-lg border border-border/50 hover:border-border transition-colors">
                <div className="flex items-start gap-3">
                  <Gauge className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Label htmlFor="growthChallenges" className="text-base font-semibold">
                        20. What challenges do you foresee as you grow?
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Growth challenges help identify future system requirements and complexity factors.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    <Textarea
                      id="growthChallenges"
                      placeholder="e.g., Need better reporting, more automation, integration between systems, mobile access, scalable processes..."
                      value={data.growthChallenges || ''}
                      onChange={(e) => onUpdate({ growthChallenges: e.target.value })}
                      className="min-h-[100px] resize-none touch-target"
                      maxLength={500}
                    />
                    <div className="text-xs text-muted-foreground text-right mt-2">
                      {(data.growthChallenges || '').length}/500 characters
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

export default PainPoints;