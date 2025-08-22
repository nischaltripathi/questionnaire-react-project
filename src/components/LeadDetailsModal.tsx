import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  User, Mail, Phone, Building, Calendar, Clock, 
  Target, BarChart3, AlertTriangle, TrendingUp, 
  MessageSquare, CheckCircle, XCircle, Star,
  Users, Package, Database, Settings, Zap
} from 'lucide-react';
// import { updateLeadStatus, UpdateLeadStatusInputType } from 'zite-endpoints-sdk';
import { toast } from 'sonner';

interface LeadDetailsModalProps {
  leadId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({
  leadId,
  open,
  onOpenChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState<GetLeadDetailsOutputType | null>(null);

  useEffect(() => {
    if (leadId && open) {
      loadLeadDetails();
    }
  }, [leadId, open]);

  const loadLeadDetails = async () => {
    if (!leadId) return;
    
    try {
      setLoading(true);
      const result = await getLeadDetails({ leadId });
      setLeadData(result);
    } catch (error) {
      toast.error('Failed to load lead details');
      console.error('Error loading lead details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'New': return 'secondary';
      case 'Contacted': return 'default';
      case 'Qualified': return 'default';
      case 'Proposal Sent': return 'default';
      case 'Closed Won': return 'default';
      case 'Closed Lost': return 'destructive';
      default: return 'secondary';
    }
  };

  const getAgeColor = (days: number) => {
    if (days >= 7) return 'text-red-600';
    if (days >= 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4) return { variant: 'default' as const, color: 'text-green-600' };
    if (rating >= 3) return { variant: 'secondary' as const, color: 'text-yellow-600' };
    if (rating >= 2) return { variant: 'secondary' as const, color: 'text-orange-600' };
    return { variant: 'destructive' as const, color: 'text-red-600' };
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 4) return { variant: 'default' as const, label: 'High Confidence' };
    if (confidence >= 3) return { variant: 'secondary' as const, label: 'Moderate Confidence' };
    if (confidence >= 2) return { variant: 'secondary' as const, label: 'Low Confidence' };
    return { variant: 'destructive' as const, label: 'Very Low Confidence' };
  };

  if (!leadData && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Lead Assessment Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : leadData ? (
          <ScrollArea className="max-h-[80vh]">
            <div className="space-y-6">
              {/* Lead Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Lead Information</span>
                    <Badge variant={getStatusBadgeVariant(leadData.lead.status)}>
                      {leadData.lead.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{leadData.lead.prospectName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{leadData.lead.prospectEmail}</span>
                    </div>
                    {leadData.lead.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{leadData.lead.phone}</span>
                      </div>
                    )}
                    {leadData.lead.company && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span>{leadData.lead.company}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Completed: {leadData.lead.completionDate && !isNaN(new Date(leadData.lead.completionDate).getTime()) 
                        ? new Date(leadData.lead.completionDate).toLocaleDateString()
                        : 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${getAgeColor(leadData.lead.daysSinceCompletion)}`} />
                      <span className={getAgeColor(leadData.lead.daysSinceCompletion)}>
                        {leadData.lead.daysSinceCompletion} days old
                      </span>
                    </div>
                  </div>
                  
                  {leadData.lead.notes && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Notes</h4>
                      <p className="text-sm">{leadData.lead.notes}</p>
                    </div>
                  )}
                  
                  {leadData.lead.followUpDate && (
                    <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                      <h4 className="font-medium mb-2 text-primary">Follow-up Scheduled</h4>
                      <p className="text-sm text-primary/80">
                        {leadData.lead.followUpDate && !isNaN(new Date(leadData.lead.followUpDate).getTime())
                          ? new Date(leadData.lead.followUpDate).toLocaleDateString()
                          : 'Invalid date'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Complexity Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Complexity Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold">{leadData.lead.complexityScore.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">Complexity Score</p>
                    </div>
                    <Badge variant={leadData.lead.complexityTier === 'High' ? 'destructive' : 'default'}>
                      {leadData.lead.complexityTier}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Industry:</span>
                      <span className="ml-2">{leadData.lead.industry}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Team Size:</span>
                      <span className="ml-2">{leadData.lead.teamSize}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assessment Details */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="pain-points">Pain Points</TabsTrigger>
                  <TabsTrigger value="vision">Vision</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Business Snapshot
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Industry</h4>
                        <div className="flex flex-wrap gap-2">
                          {leadData.assessmentData.businessSnapshot.industry?.map((industry, index) => (
                            <Badge key={index} variant="secondary">{industry}</Badge>
                          )) || <span className="text-muted-foreground text-sm">Not specified</span>}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Team Size</h4>
                        <p className="text-sm">{leadData.assessmentData.businessSnapshot.teamSize || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm mb-2">System Areas</h4>
                        <div className="flex flex-wrap gap-2">
                          {leadData.assessmentData.businessSnapshot.systemAreas?.map((area, index) => (
                            <Badge key={index} variant="outline">{area}</Badge>
                          )) || <span className="text-muted-foreground text-sm">Not specified</span>}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Business Areas</h4>
                        <div className="flex flex-wrap gap-2">
                          {leadData.assessmentData.businessSnapshot.businessAreas?.map((area, index) => (
                            <Badge key={index} variant="outline">{area}</Badge>
                          )) || <span className="text-muted-foreground text-sm">Not specified</span>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        System Performance Ratings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { key: 'systemIntegration', label: 'System Integration', icon: Database },
                        { key: 'processAutomation', label: 'Process Automation', icon: Zap },
                        { key: 'teamProductivity', label: 'Team Productivity', icon: Users },
                        { key: 'dataAccuracy', label: 'Data Accuracy', icon: Target },
                        { key: 'reportingSpeed', label: 'Reporting Speed', icon: BarChart3 },
                        { key: 'userExperience', label: 'User Experience', icon: Star },
                        { key: 'systemReliability', label: 'System Reliability', icon: CheckCircle }
                      ].map((item) => {
                        const rating = leadData.assessmentData.systemPerformance[item.key as keyof typeof leadData.assessmentData.systemPerformance];
                        const ratingInfo = rating ? getRatingBadge(rating) : null;
                        const IconComponent = item.icon;
                        
                        return (
                          <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{item.label}</span>
                            </div>
                            {rating ? (
                              <Badge variant={ratingInfo!.variant} className={ratingInfo!.color}>
                                {rating}/5
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">Not rated</span>
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pain-points" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Pain Points & Challenges
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-sm mb-3">Time-Consuming Processes</h4>
                        <div className="space-y-2">
                          {leadData.assessmentData.painPoints.timeConsumingProcesses?.map((process, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span>{process}</span>
                            </div>
                          )) || <span className="text-muted-foreground text-sm">None specified</span>}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-semibold text-sm mb-3">Biggest Frustrations</h4>
                        <div className="space-y-2">
                          {leadData.assessmentData.painPoints.biggestFrustrations?.map((frustration, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <XCircle className="w-3 h-3 text-muted-foreground" />
                              <span>{frustration}</span>
                            </div>
                          )) || <span className="text-muted-foreground text-sm">None specified</span>}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Manual Workarounds</h4>
                          <Badge variant={leadData.assessmentData.painPoints.manualWorkarounds === 'yes' ? 'destructive' : 'default'}>
                            {leadData.assessmentData.painPoints.manualWorkarounds === 'yes' ? 'Yes' : 
                             leadData.assessmentData.painPoints.manualWorkarounds === 'no' ? 'No' : 'Not specified'}
                          </Badge>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Critical to Fix</h4>
                          <Badge variant={
                            leadData.assessmentData.painPoints.criticalToFix === 'high' ? 'destructive' :
                            leadData.assessmentData.painPoints.criticalToFix === 'medium' ? 'secondary' : 'default'
                          }>
                            {leadData.assessmentData.painPoints.criticalToFix || 'Not specified'}
                          </Badge>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Supports Growth</h4>
                          <Badge variant={leadData.assessmentData.painPoints.supportGrowth === 'no' ? 'destructive' : 'default'}>
                            {leadData.assessmentData.painPoints.supportGrowth === 'yes' ? 'Yes' : 
                             leadData.assessmentData.painPoints.supportGrowth === 'no' ? 'No' : 'Not specified'}
                          </Badge>
                        </div>
                      </div>
                      
                      {leadData.assessmentData.painPoints.growthChallenges && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Growth Challenges</h4>
                            <p className="text-sm text-muted-foreground">{leadData.assessmentData.painPoints.growthChallenges}</p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="vision" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Vision & Priorities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-sm mb-3">Desired Outcomes</h4>
                        <div className="space-y-2">
                          {leadData.assessmentData.visionPriorities.desiredOutcomes?.map((outcome, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Target className="w-3 h-3 text-muted-foreground" />
                              <span>{outcome}</span>
                            </div>
                          )) || <span className="text-muted-foreground text-sm">None specified</span>}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-semibold text-sm mb-3">Business Impact Areas</h4>
                        <div className="space-y-2">
                          {leadData.assessmentData.visionPriorities.businessImpact?.map((impact, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <TrendingUp className="w-3 h-3 text-muted-foreground" />
                              <span>{impact}</span>
                            </div>
                          )) || <span className="text-muted-foreground text-sm">None specified</span>}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-3">Reporting & Data</h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-xs text-muted-foreground">Tracking Methods:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {leadData.assessmentData.reportingDecisions.trackingMethods?.map((method, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">{method}</Badge>
                                )) || <span className="text-muted-foreground text-xs">None specified</span>}
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-xs text-muted-foreground">Data Confidence:</span>
                              {leadData.assessmentData.reportingDecisions.dataConfidence ? (
                                <div className="mt-1">
                                  <Badge variant={getConfidenceBadge(leadData.assessmentData.reportingDecisions.dataConfidence).variant}>
                                    {leadData.assessmentData.reportingDecisions.dataConfidence}/5 - {getConfidenceBadge(leadData.assessmentData.reportingDecisions.dataConfidence).label}
                                  </Badge>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs ml-2">Not specified</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-3">Critical Reports</h4>
                          <div className="space-y-1">
                            {leadData.assessmentData.reportingDecisions.criticalReports?.slice(0, 3).map((report, index) => (
                              <div key={index} className="text-xs">{report}</div>
                            )) || <span className="text-muted-foreground text-xs">None specified</span>}
                            {leadData.assessmentData.reportingDecisions.criticalReports && leadData.assessmentData.reportingDecisions.criticalReports.length > 3 && (
                              <div className="text-xs text-muted-foreground">+{leadData.assessmentData.reportingDecisions.criticalReports.length - 3} more</div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {leadData.assessmentData.reportingDecisions.improvementNeeds && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Improvement Needs</h4>
                            <p className="text-sm text-muted-foreground">{leadData.assessmentData.reportingDecisions.improvementNeeds}</p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsModal;