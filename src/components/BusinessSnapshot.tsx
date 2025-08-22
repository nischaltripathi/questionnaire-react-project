import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { BusinessSnapshotData } from '../types/scorecard';
import { 
  Briefcase, Heart, Hammer, ShoppingCart, Factory, GraduationCap, 
  Utensils, Laptop, Users, UserCheck, Building2, Database, Calculator,
  Headphones, UserCog, Package, Megaphone, FolderKanban, BarChart3,
  Clock, DollarSign, Target, Truck, MessageSquare, Shield, 
  HelpCircle, Star, Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BusinessSnapshotProps {
  data: BusinessSnapshotData;
  onUpdate: (data: Partial<BusinessSnapshotData>) => void;
}

const BusinessSnapshot: React.FC<BusinessSnapshotProps> = ({ data, onUpdate }) => {
  const handleIndustryChange = (value: string) => {
    onUpdate({ industry: [value] });
  };

  const handleSystemsChange = (system: string, checked: boolean) => {
    const currentSystems = data.systemAreas || [];
    const updatedSystems = checked
      ? [...currentSystems, system]
      : currentSystems.filter(s => s !== system);
    onUpdate({ systemAreas: updatedSystems });
  };

  const handleBusinessAreasChange = (area: string, checked: boolean) => {
    const currentAreas = data.businessAreas || [];
    const updatedAreas = checked
      ? [...currentAreas, area]
      : currentAreas.filter(a => a !== area);
    onUpdate({ businessAreas: updatedAreas });
  };

  const industryOptions = [
    { key: 'Professional Services', label: 'Professional Services', example: 'Consulting, legal services' },
    { key: 'Health & Community Services', label: 'Health & Community Services', example: 'Healthcare, aged care' },
    { key: 'Construction / Trades', label: 'Construction / Trades', example: 'Building, electrical work' },
    { key: 'Retail / Ecommerce', label: 'Retail / Ecommerce', example: 'Online stores, physical retail' },
    { key: 'Manufacturing / Logistics', label: 'Manufacturing / Logistics', example: 'Production, warehousing' },
    { key: 'Education / Training', label: 'Education / Training', example: 'Schools, training providers' },
    { key: 'Hospitality / Tourism', label: 'Hospitality / Tourism', example: 'Hotels, restaurants' },
    { key: 'Technology / SaaS', label: 'Technology / SaaS', example: 'Software development, IT services' }
  ];

  const teamSizeOptions = [
    { key: 'Small Team (1-5)', label: 'Small Team (1-5)', example: 'Startup or micro business' },
    { key: 'Growing Team (6-20)', label: 'Growing Team (6-20)', example: 'Expanding small business' },
    { key: 'Medium Team (21-50)', label: 'Medium Team (21-50)', example: 'Established mid-size business' },
    { key: 'Large Team (50+)', label: 'Large Team (50+)', example: 'Enterprise or large organization' }
  ];

  const systemOptions = [
    { key: 'CRM (Customer Relationship Management)', label: 'CRM (Customer Relationship Management)', example: 'Salesforce, HubSpot' },
    { key: 'ERP (Enterprise Resource Planning)', label: 'ERP (Enterprise Resource Planning)', example: 'SAP, NetSuite' },
    { key: 'Finance / Accounting', label: 'Finance / Accounting', example: 'Xero, QuickBooks' },
    { key: 'Helpdesk / Customer Support', label: 'Helpdesk / Customer Support', example: 'Zendesk, Freshdesk' },
    { key: 'HR / Payroll Systems', label: 'HR / Payroll Systems', example: 'BambooHR, Workday' },
    { key: 'Inventory / Stock Management', label: 'Inventory / Stock Management', example: 'TradeGecko, Cin7' },
    { key: 'Marketing Tools / Automation', label: 'Marketing Tools / Automation', example: 'Mailchimp, ActiveCampaign' },
    { key: 'Project Management', label: 'Project Management', example: 'Asana, Monday.com' },
    { key: 'Sales / Reporting Dashboard', label: 'Sales / Reporting Dashboard', example: 'Tableau, Power BI' },
    { key: 'Time Tracking / Rostering', label: 'Time Tracking / Rostering', example: 'Toggl, Deputy' }
  ];

  const businessAreaOptions = [
    { key: 'Sales', label: 'Sales', example: 'Lead generation, deal closing' },
    { key: 'Marketing', label: 'Marketing', example: 'Campaigns, content creation' },
    { key: 'Finance / Accounting', label: 'Finance / Accounting', example: 'Invoicing, financial reporting' },
    { key: 'Operations / Fulfilment', label: 'Operations / Fulfilment', example: 'Order processing, delivery' },
    { key: 'Customer Service / Support', label: 'Customer Service / Support', example: 'Help desk, issue resolution' },
    { key: 'HR / Workforce Management', label: 'HR / Workforce Management', example: 'Recruitment, payroll' },
    { key: 'Inventory / Stock Control', label: 'Inventory / Stock Control', example: 'Stock tracking, purchasing' },
    { key: 'Project Delivery', label: 'Project Delivery', example: 'Client projects, timelines' },
    { key: 'Reporting / Insights', label: 'Reporting / Insights', example: 'Business intelligence, analytics' },
    { key: 'Compliance / Risk', label: 'Compliance / Risk', example: 'Regulatory compliance, risk assessment' }
  ];

  const industryIcons = {
    'Professional Services': Briefcase,
    'Health & Community Services': Heart,
    'Construction / Trades': Hammer,
    'Retail / Ecommerce': ShoppingCart,
    'Manufacturing / Logistics': Factory,
    'Education / Training': GraduationCap,
    'Hospitality / Tourism': Utensils,
    'Technology / SaaS': Laptop
  };

  const teamSizeIcons = {
    'Small Team (1-5)': Users,
    'Growing Team (6-20)': UserCheck,
    'Medium Team (21-50)': Building2,
    'Large Team (50+)': Building2
  };

  const systemIcons = {
    'CRM (Customer Relationship Management)': Users,
    'ERP (Enterprise Resource Planning)': Database,
    'Finance / Accounting': Calculator,
    'Helpdesk / Customer Support': Headphones,
    'HR / Payroll Systems': UserCog,
    'Inventory / Stock Management': Package,
    'Marketing Tools / Automation': Megaphone,
    'Project Management': FolderKanban,
    'Sales / Reporting Dashboard': BarChart3,
    'Time Tracking / Rostering': Clock
  };

  const businessAreaIcons = {
    'Sales': DollarSign,
    'Marketing': Target,
    'Finance / Accounting': Calculator,
    'Operations / Fulfilment': Truck,
    'Customer Service / Support': MessageSquare,
    'HR / Workforce Management': UserCog,
    'Inventory / Stock Control': Package,
    'Project Delivery': FolderKanban,
    'Reporting / Insights': BarChart3,
    'Compliance / Risk': Shield
  };

  const RequiredIndicator = () => (
    <Star className="w-3 h-3 text-red-500 fill-red-500 ml-1 inline" />
  );

  const InformationalBadge = () => (
    <Badge variant="outline" className="text-xs text-muted-foreground/70 border-muted-foreground/20 bg-transparent">
      <Info className="w-3 h-3 mr-1" />
      Context only
    </Badge>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
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

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Onboarding Introduction */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tell us about your business and systems for personalized insights.
          </p>
        </motion.div>

        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* About Your Business Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader title="About Your Business" />
            
            <div className="space-y-8">
              {/* Question 1: Industry */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Label className="text-base font-semibold">
                    1. What industry is your business in?
                  </Label>
                  <InformationalBadge />
                </div>
                <RadioGroup value={data.industry?.[0] || ''} onValueChange={handleIndustryChange}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {industryOptions.map((industry) => {
                      const IconComponent = industryIcons[industry.key as keyof typeof industryIcons];
                      return (
                        <div key={industry.key} className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                          data.industry?.[0] === industry.key 
                            ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                            : 'border-border/50 hover:border-border'
                        }`}>
                          <RadioGroupItem value={industry.key} id={industry.key} className="mt-0.5" />
                          <IconComponent className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor={industry.key} className="cursor-pointer font-medium text-sm block mb-1">
                              {industry.label}
                            </Label>
                            <p className="text-xs text-muted-foreground">{industry.example}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>

              {/* Question 2: Top 3 clients */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Label htmlFor="topClients" className="text-base font-semibold">
                    2. Who are your top 3 clients or customer types?
                  </Label>
                  <InformationalBadge />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>List your top clients or main customer types.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <Textarea
                  id="topClients"
                  placeholder="e.g., ABC Corporation, local restaurants, small business owners..."
                  value={data.topClients || ''}
                  onChange={(e) => onUpdate({ topClients: e.target.value })}
                  className="min-h-[100px] resize-none touch-target"
                  maxLength={1000}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {(data.topClients || '').length}/1000 characters
                </div>
              </div>

              {/* Question 3: Team size */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">
                    3. How many full-time employees do you have?
                    <RequiredIndicator />
                  </Label>
                </div>
                <RadioGroup value={data.teamSize || ''} onValueChange={(value) => onUpdate({ teamSize: value })}>
                  <div className="space-y-3">
                    {teamSizeOptions.map((size) => {
                      const IconComponent = teamSizeIcons[size.key as keyof typeof teamSizeIcons];
                      return (
                        <div key={size.key} className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                          data.teamSize === size.key 
                            ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                            : 'border-border/50 hover:border-border'
                        }`}>
                          <RadioGroupItem value={size.key} id={size.key} className="mt-0.5" />
                          <IconComponent className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <Label htmlFor={size.key} className="cursor-pointer font-medium block mb-1">
                              {size.label}
                            </Label>
                            <p className="text-xs text-muted-foreground">{size.example}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </motion.section>

          {/* Your Systems Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader title="Your Systems" />
            
            <div className="space-y-8">
              {/* Question 4: Digital systems */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">
                    4. Which digital systems/tools are currently used across your operations?
                    <RequiredIndicator />
                  </Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {systemOptions.map((system) => {
                    const IconComponent = systemIcons[system.key as keyof typeof systemIcons];
                    return (
                      <div key={system.key} className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                        data.systemAreas?.includes(system.key) 
                          ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                          : 'border-border/50 hover:border-border'
                      }`}>
                        <Checkbox
                          id={system.key}
                          checked={data.systemAreas?.includes(system.key) || false}
                          onCheckedChange={(checked) => handleSystemsChange(system.key, checked as boolean)}
                          className="mt-0.5"
                        />
                        <IconComponent className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor={system.key} className="text-sm font-medium cursor-pointer block mb-1">
                            {system.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">{system.example}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Question 5: Number of systems */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="systemsCount" className="text-base font-semibold">
                    5. How many total systems/tools does your business use regularly?
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Include all software, apps, and digital tools used regularly.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <Input
                  id="systemsCount"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter total number of systems"
                  value={data.systemsCount || ''}
                  onChange={(e) => onUpdate({ systemsCount: parseInt(e.target.value) || 0 })}
                  className="max-w-xs text-lg touch-target"
                />
              </div>
            </div>
          </motion.section>

          {/* Priority Areas Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader title="Priority Areas" />
            
            <div className="space-y-8">
              {/* Question 6: Business areas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-semibold">
                    6. Which areas of your business rely most heavily on digital systems?
                  </Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {businessAreaOptions.map((area) => {
                    const IconComponent = businessAreaIcons[area.key as keyof typeof businessAreaIcons];
                    return (
                      <div key={area.key} className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors touch-target ${
                        data.businessAreas?.includes(area.key) 
                          ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' 
                          : 'border-border/50 hover:border-border'
                      }`}>
                        <Checkbox
                          id={area.key}
                          checked={data.businessAreas?.includes(area.key) || false}
                          onCheckedChange={(checked) => handleBusinessAreasChange(area.key, checked as boolean)}
                          className="mt-0.5"
                        />
                        <IconComponent className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor={area.key} className="text-sm font-medium cursor-pointer block mb-1">
                            {area.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">{area.example}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Question 7: Top three areas */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="topThreeAreas" className="text-base font-semibold">
                    7. What are your top three business improvement priorities?
                  </Label>
                </div>

                <Textarea
                  id="topThreeAreas"
                  placeholder="e.g., 1. Reduce time spent on manual invoicing by 50%, 2. Improve customer response time from 24hrs to 2hrs, 3. Automate inventory reordering to prevent stockouts..."
                  value={data.topThreeAreas || ''}
                  onChange={(e) => onUpdate({ topThreeAreas: e.target.value })}
                  className="min-h-[120px] resize-none touch-target"
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {(data.topThreeAreas || '').length}/500 characters
                </div>
              </div>
            </div>
          </motion.section>


        </motion.div>
      </div>
    </TooltipProvider>
  );
};

export default BusinessSnapshot;