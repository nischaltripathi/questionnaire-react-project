import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ReportingDecisionsData } from '../types/scorecard';
import { 
  HelpCircle, 
  Star, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock, 
  DollarSign,
  Users,
  Package,
  Target,
  Lightbulb,
  Database,
  PieChart,
  Activity,
  ShieldCheck,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportingDecisionsProps {
  data: ReportingDecisionsData;
  onUpdate: (data: Partial<ReportingDecisionsData>) => void;
}

const trackingMethods = [
  { 
    name: 'Manual Spreadsheets', 
    icon: FileText, 
    example: 'Excel files updated manually' 
  },
  { 
    name: 'Reports from core systems (e.g. CRM, ERP)', 
    icon: BarChart3, 
    example: 'Built-in reporting from existing tools' 
  },
  { 
    name: 'Business intelligence tools (e.g. Power BI, Tableau)', 
    icon: TrendingUp, 
    example: 'Dedicated BI dashboards and analytics' 
  },
  { 
    name: 'Dashboards in project or finance tools', 
    icon: Target, 
    example: 'Integrated dashboards within workflows' 
  },
  { 
    name: 'Custom reporting tools', 
    icon: Database, 
    example: 'Purpose-built internal reporting systems' 
  },
  { 
    name: 'We don\'t currently track KPIs', 
    icon: HelpCircle, 
    example: 'No formal performance tracking in place' 
  }
];

const criticalReports = [
  { name: 'Sales Performance', icon: DollarSign, example: 'Revenue, conversion rates, pipeline' },
  { name: 'Customer Retention / Churn', icon: Users, example: 'Repeat customers, lifetime value' },
  { name: 'Marketing ROI', icon: TrendingUp, example: 'Campaign effectiveness, lead costs' },
  { name: 'Inventory Levels', icon: Package, example: 'Stock levels, turnover rates' },
  { name: 'Profitability & Margins', icon: PieChart, example: 'Gross margins, profit by product' },
  { name: 'Operational Efficiency', icon: Activity, example: 'Process times, productivity metrics' },
  { name: 'Cashflow / Forecasting', icon: BarChart3, example: 'Cash position, future projections' }
];

const frequencies = [
  { name: 'Not at all', icon: HelpCircle, example: 'No regular reporting schedule' },
  { name: 'Daily', icon: Clock, example: 'Real-time or daily updates' },
  { name: 'Weekly', icon: Calendar, example: 'Weekly summary reports' },
  { name: 'Monthly', icon: Calendar, example: 'Monthly business reviews' },
  { name: 'Quarterly', icon: Calendar, example: 'Quarterly board reports' },
  { name: 'Yearly', icon: Calendar, example: 'Annual performance reviews' }
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

const ReportingDecisions: React.FC<ReportingDecisionsProps> = ({ data, onUpdate }) => {
  const handleTrackingChange = (method: string, checked: boolean) => {
    const current = data.trackingMethods || [];
    const updated = checked
      ? [...current, method]
      : current.filter(m => m !== method);
    onUpdate({ trackingMethods: updated });
  };

  const handleReportsChange = (report: string, checked: boolean) => {
    const current = data.criticalReports || [];
    const updated = checked
      ? [...current, report]
      : current.filter(r => r !== report);
    onUpdate({ criticalReports: updated });
  };

  const handleFrequencyChange = (frequency: string, checked: boolean) => {
    const current = data.reportFrequency || [];
    const updated = checked
      ? [...current, frequency]
      : current.filter(f => f !== frequency);
    onUpdate({ reportFrequency: updated });
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
            Tell us about your current reporting practices and data confidence levels.
          </p>
        </motion.div>

        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Performance Tracking Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader 
              title="Performance Tracking" 
              description="How you currently monitor and measure business performance"
            />
            
            <div className="space-y-6">
              {/* Question 21 */}
              <div className="space-y-4 p-6 bg-card rounded-lg border border-border/50 hover:border-border transition-colors">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Label className="text-base font-semibold block leading-relaxed">
                        21. How do you currently track business performance and KPIs?
                        <RequiredIndicator />
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Your tracking methods reveal system maturity and data accessibility. Multiple fragmented methods often indicate complexity.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {trackingMethods.map((method) => {
                        const IconComponent = method.icon;
                        return (
                          <div key={method.name} className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                            data.trackingMethods?.includes(method.name) 
                              ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                              : 'border-border/50 hover:border-border'
                          }`}>
                            <Checkbox
                              id={method.name}
                              checked={data.trackingMethods?.includes(method.name) || false}
                              onCheckedChange={(checked) => handleTrackingChange(method.name, checked as boolean)}
                              className="mt-0.5"
                            />
                            <IconComponent className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <Label htmlFor={method.name} className="text-sm font-medium cursor-pointer block mb-1">
                                {method.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">{method.example}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 22 */}
              <div className="space-y-4 p-6 bg-card rounded-lg border border-border/50 hover:border-border transition-colors">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Label className="text-base font-semibold block leading-relaxed">
                        22. Which reports or KPIs are most critical for decision-making?
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Identify your most important metrics. These drive your business decisions and should be easily accessible and accurate.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {criticalReports.map((report) => {
                        const IconComponent = report.icon;
                        return (
                          <div key={report.name} className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                            data.criticalReports?.includes(report.name) 
                              ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                              : 'border-border/50 hover:border-border'
                          }`}>
                            <Checkbox
                              id={report.name}
                              checked={data.criticalReports?.includes(report.name) || false}
                              onCheckedChange={(checked) => handleReportsChange(report.name, checked as boolean)}
                              className="mt-0.5"
                            />
                            <IconComponent className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <Label htmlFor={report.name} className="text-sm font-medium cursor-pointer block mb-1">
                                {report.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">{report.example}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 23 */}
              <div className="space-y-4 p-6 bg-card rounded-lg border border-border/50 hover:border-border transition-colors">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Label className="text-base font-semibold block leading-relaxed">
                        23. How frequently do you generate reports or dashboards?
                        <RequiredIndicator />
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Reporting frequency indicates system automation maturity. Infrequent reporting often means manual processes and delayed decision-making.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {frequencies.map((frequency) => {
                        const IconComponent = frequency.icon;
                        return (
                          <div key={frequency.name} className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                            data.reportFrequency?.includes(frequency.name) 
                              ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                              : 'border-border/50 hover:border-border'
                          }`}>
                            <Checkbox
                              id={frequency.name}
                              checked={data.reportFrequency?.includes(frequency.name) || false}
                              onCheckedChange={(checked) => handleFrequencyChange(frequency.name, checked as boolean)}
                              className="mt-0.5"
                            />
                            <IconComponent className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <div className="flex-1">
                              <Label htmlFor={frequency.name} className="text-sm font-medium cursor-pointer block mb-1">
                                {frequency.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">{frequency.example}</p>
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

          {/* Data Quality & Confidence Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader 
              title="Data Quality & Confidence" 
              description="How much you trust your current data for making decisions"
            />
            
            <div className="space-y-6">
              {/* Question 24 */}
              <div className="space-y-4 p-6 bg-card rounded-lg border border-border/50 hover:border-border transition-colors">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Label className="text-base font-semibold block leading-relaxed">
                        24. How confident are you in your current data accuracy?
                        <RequiredIndicator />
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Data confidence directly impacts decision quality. Low confidence indicates system integration issues, manual errors, or data validation gaps.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <RadioGroup 
                      value={data.dataConfidence?.toString() || ''} 
                      onValueChange={(value) => onUpdate({ dataConfidence: parseInt(value) })}
                    >
                      <div className="space-y-3">
                        <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                          data.dataConfidence === 1 
                            ? 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800/50' 
                            : 'border-border/50 hover:border-border'
                        }`}>
                          <RadioGroupItem value="1" id="confidence-1" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="confidence-1" className="cursor-pointer font-medium block mb-1">
                              1 - Data is unreliable or unusable
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Frequent errors, inconsistencies, or missing data make decisions difficult
                            </p>
                          </div>
                        </div>
                        <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                          data.dataConfidence === 2 
                            ? 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800/50' 
                            : 'border-border/50 hover:border-border'
                        }`}>
                          <RadioGroupItem value="2" id="confidence-2" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="confidence-2" className="cursor-pointer font-medium block mb-1">
                              2 - Works but not always trusted
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Data exists but requires manual verification before making decisions
                            </p>
                          </div>
                        </div>
                        <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                          data.dataConfidence === 3 
                            ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800/50' 
                            : 'border-border/50 hover:border-border'
                        }`}>
                          <RadioGroupItem value="3" id="confidence-3" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="confidence-3" className="cursor-pointer font-medium block mb-1">
                              3 - Moderately confident
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Generally reliable with occasional discrepancies that need checking
                            </p>
                          </div>
                        </div>
                        <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                          data.dataConfidence === 4 
                            ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/50' 
                            : 'border-border/50 hover:border-border'
                        }`}>
                          <RadioGroupItem value="4" id="confidence-4" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="confidence-4" className="cursor-pointer font-medium block mb-1">
                              4 - Highly confident
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Accurate and consistent data that supports most business decisions
                            </p>
                          </div>
                        </div>
                        <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                          data.dataConfidence === 5 
                            ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800/50' 
                            : 'border-border/50 hover:border-border'
                        }`}>
                          <RadioGroupItem value="5" id="confidence-5" className="mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor="confidence-5" className="cursor-pointer font-medium block mb-1">
                              5 - Complete confidence
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Real-time, validated data that enables instant decision-making
                            </p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Improvement Vision Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader 
              title="Improvement Vision" 
              description="Your path to achieving perfect data confidence and reporting"
            />
            
            <div className="space-y-6">
              {/* Question 25 */}
              <div className="space-y-4 p-6 bg-card rounded-lg border border-border/50 hover:border-border transition-colors">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Label htmlFor="improvementNeeds" className="text-base font-semibold">
                        25. What would need to change to achieve perfect data confidence?
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Identify specific gaps in your current data systems. This helps prioritize improvements for better decision-making.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    <Textarea
                      id="improvementNeeds"
                      placeholder="e.g., Better system integration, automated data validation, real-time sync between systems, elimination of manual data entry..."
                      value={data.improvementNeeds || ''}
                      onChange={(e) => onUpdate({ improvementNeeds: e.target.value })}
                      className="min-h-[100px] resize-none touch-target"
                      maxLength={1000}
                    />
                    <div className="text-xs text-muted-foreground text-right mt-2">
                      {(data.improvementNeeds || '').length}/1000 characters
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

export default ReportingDecisions;