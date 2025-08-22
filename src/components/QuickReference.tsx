import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ComplexityTier, FormData } from '../types/scorecard';
import { 
  TrendingUp, 
  Target, 
  Lightbulb, 
  AlertTriangle, 
  Share2, 
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface BusinessImpactSummaryProps {
  score: number;
  tier: ComplexityTier;
  formData?: FormData;
}

interface ImpactOpportunity {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  nextStep: string;
  impact: string;
  timeframe: string;
  confidence: number;
  priority: 'High' | 'Medium' | 'Low';
}

const getImpactOpportunities = (score: number, tier: ComplexityTier, formData?: FormData): ImpactOpportunity[] => {
  const opportunities: ImpactOpportunity[] = [];

  // Automation opportunity
  if (formData?.painPoints.manualWorkarounds === 'yes') {
    const timeConsumingProcesses = formData.painPoints.timeConsumingProcesses || [];
    const teamSize = formData.businessSnapshot.teamSize || '';
    const teamSizeMultiplier = teamSize.includes('Large') ? '25-35' : teamSize.includes('Medium') ? '15-25' : '8-15';
    
    opportunities.push({
      icon: Zap,
      title: 'Process Automation Opportunity',
      description: `Your team spends significant time on manual workarounds${timeConsumingProcesses.length > 0 ? ` in ${timeConsumingProcesses.slice(0, 2).join(' and ').toLowerCase()}` : ''}.`,
      nextStep: 'Identify top 3 repetitive processes for automation assessment',
      impact: `${teamSizeMultiplier} hours/week freed for strategic work`,
      timeframe: '2-4 weeks',
      confidence: 85,
      priority: 'High'
    });
  }

  // System performance enhancement
  if (formData?.systemPerformance) {
    const performanceScores = Object.values(formData.systemPerformance);
    const avgPerformance = performanceScores.length > 0 
      ? performanceScores.reduce((sum, score) => sum + (score || 0), 0) / performanceScores.length 
      : 0;
    
    if (avgPerformance < 4) {
      opportunities.push({
        icon: TrendingUp,
        title: 'System Performance Enhancement',
        description: `Current systems are performing at ${avgPerformance.toFixed(1)}/5, creating friction for your team.`,
        nextStep: 'Conduct system health audit and prioritize upgrades',
        impact: '40-60% improvement in team satisfaction',
        timeframe: '4-8 weeks',
        confidence: 80,
        priority: 'High'
      });
    }
  }

  // Data confidence improvement
  if (formData?.reportingDecisions.dataConfidence && formData.reportingDecisions.dataConfidence <= 2) {
    opportunities.push({
      icon: Target,
      title: 'Decision-Making Acceleration',
      description: `Low data confidence (${formData.reportingDecisions.dataConfidence}/5) is slowing strategic decisions.`,
      nextStep: 'Implement unified dashboard for key business metrics',
      impact: '2-3x faster decision-making capability',
      timeframe: '3-6 weeks',
      confidence: 75,
      priority: 'High'
    });
  }

  // Scaling readiness
  if (formData?.painPoints.supportGrowth === 'no') {
    const systemsCount = formData.businessSnapshot.systemsCount || 0;
    const impactPercentage = tier === 'High' ? '35-70%' : tier === 'Medium' ? '20-35%' : '15-25%';
    
    opportunities.push({
      icon: Users,
      title: 'Growth Acceleration Readiness',
      description: `Current systems may not support planned growth with ${systemsCount} systems to coordinate.`,
      nextStep: 'Create system integration roadmap for scalable growth',
      impact: `${impactPercentage} faster scaling capability`,
      timeframe: '6-12 weeks',
      confidence: 70,
      priority: 'Medium'
    });
  }

  // Cost optimization for complex systems
  if (formData?.businessSnapshot.systemsCount && formData.businessSnapshot.systemsCount > 8) {
    opportunities.push({
      icon: DollarSign,
      title: 'Integration Cost Optimization',
      description: `Managing ${formData.businessSnapshot.systemsCount} systems creates overhead and inefficiencies.`,
      nextStep: 'Audit system overlap and consolidation opportunities',
      impact: '25-40% reduction in management overhead',
      timeframe: '8-16 weeks',
      confidence: 65,
      priority: 'Medium'
    });
  }

  // Sort by priority and confidence
  return opportunities
    .sort((a, b) => {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      return priorityDiff !== 0 ? priorityDiff : b.confidence - a.confidence;
    })
    .slice(0, 3); // Show top 3 opportunities
};

const BusinessImpactSummary: React.FC<BusinessImpactSummaryProps> = ({ score, tier, formData }) => {
  const [isSharing, setIsSharing] = useState(false);
  const opportunities = getImpactOpportunities(score, tier, formData);

  const handleShareInsights = async () => {
    setIsSharing(true);
    
    const impactSummary = opportunities.length > 0 
      ? `Key opportunities: ${opportunities.slice(0, 2).map(o => o.title.toLowerCase()).join(' and ')}`
      : `${tier.toLowerCase()} complexity systems with optimization potential`;
    
    const shareData = {
      title: 'Business Impact Assessment Results',
      text: `I just discovered ${impactSummary} through a business systems assessment. This tool identified specific next steps to improve efficiency and growth. Check it out!`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success('Insights shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast.success('Insights copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy to clipboard');
      }
    }
    
    setIsSharing(false);
  };

  const getOverallImpact = () => {
    switch (tier) {
      case 'Low': return { range: '10-20%', description: 'efficiency optimization' };
      case 'Medium': return { range: '20-35%', description: 'operational improvement' };
      case 'High': return { range: '35-70%', description: 'transformation potential' };

    }
  };

  const overallImpact = getOverallImpact();

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="organic-card bg-gradient-to-br from-primary/5 via-primary/3 to-accent/5 border-primary/20 leaf-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-organic-sm bg-primary/10 border border-primary/20 animate-gentle-float">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl text-primary">Your Business Impact Summary</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Immediate opportunities to transform your operations
                </p>
              </div>
            </div>
            <Button 
              onClick={handleShareInsights}
              variant="outline"
              size="sm"
              disabled={isSharing}
              className="organic-button touch-target border-primary/30 hover:bg-primary/5 hover:border-primary/40"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {isSharing ? 'Sharing...' : 'Share These Insights'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Overall Impact Banner */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-organic p-4 border border-primary/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold text-lg text-primary">
                  {overallImpact.range} {overallImpact.description}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on your {tier.toLowerCase()} complexity assessment and industry benchmarks
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                  {tier} Complexity
                </Badge>
                <Badge variant="outline" className="border-accent/50 text-accent">
                  Score: {score.toFixed(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Impact Opportunities */}
          {opportunities.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-base flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-accent" />
                Priority Opportunities
              </h4>
              
              <div className="grid gap-4">
                {opportunities.map((opportunity, index) => {
                  const IconComponent = opportunity.icon;
                  return (
                    <motion.div
                      key={index}
                      className="bg-white/60 rounded-organic p-4 border border-primary/10 hover:shadow-organic transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-organic-sm bg-primary/10 flex-shrink-0 mt-0.5">
                          <IconComponent className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h5 className="font-semibold text-sm text-primary">
                              {opportunity.title}
                            </h5>
                            <div className="flex gap-1 flex-shrink-0">
                              <Badge 
                                variant={opportunity.priority === 'High' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {opportunity.priority}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                            {opportunity.description}
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <span className="font-medium text-primary">Impact:</span>
                              <p className="text-muted-foreground">{opportunity.impact}</p>
                            </div>
                            <div>
                              <span className="font-medium text-primary">Timeline:</span>
                              <p className="text-muted-foreground">{opportunity.timeframe}</p>
                            </div>
                            <div>
                              <span className="font-medium text-primary">Next Step:</span>
                              <p className="text-muted-foreground">{opportunity.nextStep}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-primary">Confidence:</span>
                              <span className="text-xs text-muted-foreground">{opportunity.confidence}%</span>
                            </div>
                            <Progress value={opportunity.confidence} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/10">
            <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/30">
              <Users className="w-3 h-3 mr-1" />
              {formData?.businessSnapshot.teamSize || 'Team'} Organization
            </Badge>
            <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/30">
              <Target className="w-3 h-3 mr-1" />
              {formData?.businessSnapshot.systemsCount || 'Multiple'} Systems
            </Badge>
            {formData?.businessSnapshot.industry?.[0] && (
              <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                {formData.businessSnapshot.industry[0]} Industry
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BusinessImpactSummary;