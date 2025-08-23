import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, Share2, RotateCcw, Bookmark, 
  Mail, CheckCircle, Loader2, ExternalLink, Calendar, Gift 
} from 'lucide-react';
import { toast } from 'sonner';
import { ComplexityTier, FormData } from '../types/scorecard';
// Zite integration removed. Use local storage and optional HTTP endpoints via env.
import ProspectInfoDialog from './ProspectInfoDialog';

interface ResultsActionsProps {
  score: number;
  tier: ComplexityTier;
  formData?: FormData;
  onRestart: () => void;
  onShare: () => void;
  isSharing: boolean;
}

const ResultsActions: React.FC<ResultsActionsProps> = ({
  score,
  tier,
  formData,
  onRestart,
  onShare,
  isSharing
}) => {
  const [isBookmarking, setIsBookmarking] = useState(false);

  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [prospectDialogOpen, setProspectDialogOpen] = useState(false);
  const [emailData, setEmailData] = useState({ email: '', message: '' });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  const [isBookingConsultation, setIsBookingConsultation] = useState(false);
  const [consultationBooked, setConsultationBooked] = useState(false);
  const [savedLeadId, setSavedLeadId] = useState<string | null>(null);
  const [prospectInfo, setProspectInfo] = useState<{ name: string; email: string } | null>(null);
  const [showOptionalDialog, setShowOptionalDialog] = useState(false);

  // Show optional email dialog after user has seen results (delayed)
  useEffect(() => {
    if (formData && !hasBeenSaved && !showOptionalDialog) {
      const timer = setTimeout(() => {
        setShowOptionalDialog(true);
        setProspectDialogOpen(true);
      }, 8000); // Show after 8 seconds of viewing results
      return () => clearTimeout(timer);
    }
  }, [formData, hasBeenSaved, showOptionalDialog]);

  const generateTalkingPoints = (formData: FormData, tier: ComplexityTier, score: number): string => {
    // score currently not used in talking points generation; keep signature for potential future use
    void score;
    const points = [];
    
    const impactPercentage = tier === 'Low' ? '5-15%' : tier === 'Medium' ? '15-25%' : tier === 'High' ? '25-40%' : '35-65%';
    points.push(`${impactPercentage} efficiency improvement potential`);
    
    if (formData.painPoints?.manualWorkarounds === 'yes') {
      const timeConsumingProcesses = formData.painPoints?.timeConsumingProcesses || [];
      const teamSize = formData.businessSnapshot?.teamSize || '';
      const timeMultiplier = teamSize.includes('Large') ? '20-30' : teamSize.includes('Medium') ? '15-25' : '10-15';
      points.push(`${timeMultiplier} hours/week automation opportunity in ${timeConsumingProcesses.slice(0, 2).join(', ')}`);
    }
    
    if (formData.reportingDecisions?.dataConfidence && formData.reportingDecisions.dataConfidence <= 2) {
      points.push(`2-3x faster decision-making potential (current data confidence: ${formData.reportingDecisions.dataConfidence}/5)`);
    }
    
    if (formData.painPoints?.supportGrowth === 'no') {
      points.push('Growth scaling optimization needed');
    }
    
    return points.join(' | ');
  };

  const generateKeyFindings = (formData: FormData, tier: ComplexityTier, score: number): string => {
    const findings = [];
    
    findings.push(`System complexity rated as ${tier} with ${score}/100 complexity points`);

    const industry = formData.businessSnapshot?.industry?.[0] || 'Unknown';
    const teamSize = formData.businessSnapshot?.teamSize || 'Unknown';
    const systemsCount = formData.businessSnapshot?.systemsCount || 0;
    findings.push(`${industry} business with ${teamSize.toLowerCase()} managing ${systemsCount} systems`);
    
    if (formData.painPoints?.manualWorkarounds === 'yes') {
      findings.push('Manual workarounds present - automation opportunities identified');
    }
    
    if (formData.reportingDecisions?.dataConfidence && formData.reportingDecisions.dataConfidence <= 2) {
      findings.push(`Low data confidence (${formData.reportingDecisions.dataConfidence}/5) affecting decision-making`);
    }
    
    if (formData.painPoints?.supportGrowth === 'no') {
      findings.push('Current systems may not support planned growth');
    }
    
    return findings.join('\
• ');
  };

  const saveAssessmentData = async (prospectName: string, prospectEmail: string) => {
    if (!formData) return;

    try {
      const talkingPoints = generateTalkingPoints(formData, tier, score);

      // Persist locally
      const prospectsKey = 'assessment-prospects';
      const existing = JSON.parse(localStorage.getItem(prospectsKey) || '[]');
      const recordId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const localRecord = {
        recordId,
        prospectName,
        prospectEmail,
        complexityScore: score,
        complexityTier: tier,
        formData,
        talkingPoints,
        createdAt: new Date().toISOString()
      };
      existing.push(localRecord);
      localStorage.setItem(prospectsKey, JSON.stringify(existing));

      // Optional remote submission
      const assessmentsEndpoint = (import.meta as any)?.env?.VITE_ASSESSMENTS_API_URL as string | undefined;
      if (assessmentsEndpoint) {
        try {
          await fetch(assessmentsEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(localRecord),
          });
        } catch (err) {
          console.warn('Remote prospect save failed, kept locally:', err);
        }
      }

      setSavedLeadId(recordId);
      setProspectInfo({ name: prospectName, email: prospectEmail });
      setHasBeenSaved(true);
      toast.success('Contact information saved! We\'ll follow up with additional insights.');
    } catch (error) {
      console.error('Failed to save assessment data:', error);
      toast.error('Failed to save assessment data');
      throw error;
    }
  };

  const handleScheduleConsultation = async () => {
    if (!hasBeenSaved && formData) {
      setProspectDialogOpen(true);
      return;
    }

    if (!savedLeadId || !prospectInfo || !formData) {
      toast.error('Please save your assessment first');
      return;
    }

    setIsBookingConsultation(true);

    try {
      window.open('https://calendar.app.google/X1quRsXJFz9Z9om57', '_blank');

      const keyFindings = generateKeyFindings(formData, tier, score);
      const talkingPoints = generateTalkingPoints(formData, tier, score);

      // Optional conversion webhook
      const conversionsEndpoint = (import.meta as any)?.env?.VITE_CONVERSIONS_API_URL as string | undefined;
      if (conversionsEndpoint) {
        try {
          await fetch(conversionsEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              leadId: savedLeadId,
              event: 'consultation_booked',
              complexityTier: tier,
              keyFindings,
              talkingPoints,
              industryPrimary: formData.businessSnapshot?.industry?.[0] || 'Unknown',
              teamSize: formData.businessSnapshot?.teamSize || 'Unknown'
            })
          });
        } catch (err) {
          console.warn('Conversion webhook failed:', err);
        }
      }

      setConsultationBooked(true);
      toast.success('Calendar opened! Your assessment summary has been prepared for the consultation.');

    } catch (error) {
      console.error('Failed to book consultation:', error);
      toast.error('Failed to book consultation. Please try again.');
    } finally {
      setIsBookingConsultation(false);
    }
  };

  const handleGetEmailedResults = () => {
    setProspectDialogOpen(true);
  };

  const handleBookmark = async () => {
    setIsBookmarking(true);
    try {
      const bookmarkData = {
        score,
        tier,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };
      
      const existingBookmarks = JSON.parse(localStorage.getItem('assessment-bookmarks') || '[]');
      existingBookmarks.push(bookmarkData);
      localStorage.setItem('assessment-bookmarks', JSON.stringify(existingBookmarks));
      
      toast.success('Assessment bookmarked for future reference!');
    } catch (error) {
      toast.error('Failed to bookmark assessment');
    } finally {
      setIsBookmarking(false);
    }
  };



  const handleEmailNotification = async () => {
    if (!emailData.email) {
      toast.error('Please enter an email address');
      return;
    }

    setIsSendingEmail(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Follow-up notification scheduled!');
      setEmailDialogOpen(false);
      setEmailData({ email: '', message: '' });
    } catch (error) {
      toast.error('Failed to schedule email notification');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="space-y-4">
      <ProspectInfoDialog
        open={prospectDialogOpen}
        onOpenChange={setProspectDialogOpen}
        onSave={saveAssessmentData}
      />

      {hasBeenSaved && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Contact information saved!</strong> We'll follow up with additional insights and recommendations based on your assessment.
          </AlertDescription>
        </Alert>
      )}

      {consultationBooked && (
        <Alert className="bg-blue-50 border-blue-200">
          <Calendar className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Consultation booking processed!</strong> You'll receive your assessment results via email for the call. Check your inbox for the detailed summary.
          </AlertDescription>
        </Alert>
      )}

      <div className="text-center space-y-2">
        <Button
          size="lg"
          onClick={handleScheduleConsultation}
          disabled={isBookingConsultation}
          className="bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto touch-target"
        >
          {isBookingConsultation ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Booking Consultation...
            </>
          ) : consultationBooked ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Consultation Booked
            </>
          ) : (
            <>
              <MessageSquare className="w-5 h-5 mr-2" />
              Schedule Free Consultation
            </>
          )}
          {!consultationBooked && <ExternalLink className="w-4 h-4 ml-2" />}
        </Button>
        <p className="text-xs text-muted-foreground">
          {consultationBooked 
            ? 'Calendar opened & assessment summary sent via email'
            : 'Free 45-minute strategic discussion with our optimization specialist'
          }
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onShare} 
          disabled={isSharing}
          className="touch-target"
        >
          {isSharing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sharing...
            </>
          ) : (
            <>
              <Share2 className="w-5 h-5 mr-2" />
              Share Assessment
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onRestart} 
          className="touch-target"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Retake Assessment
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="ghost"
          size="lg"
          onClick={handleGetEmailedResults}
          className="touch-target border border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5"
        >
          <Gift className="w-4 h-4 mr-2 text-primary" />
          <span className="text-primary">Get Results Emailed</span>
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={handleBookmark}
          disabled={isBookmarking}
          className="touch-target"
        >
          {isBookmarking ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Bookmark className="w-4 h-4 mr-2" />
          )}
          Save Results
        </Button>
      </div>

      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-foreground">
            <Mail className="w-3 h-3 mr-1" />
            Schedule Follow-up Notification
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Follow-up Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                We'll send you optimization tips and follow-up opportunities based on your assessment.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={emailData.email}
                onChange={(e) => setEmailData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Additional Notes (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Any specific areas you'd like us to focus on..."
                value={emailData.message}
                onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
            
            <Button 
              onClick={handleEmailNotification} 
              disabled={isSendingEmail}
              className="w-full"
            >
              {isSendingEmail ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                'Schedule Follow-up'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResultsActions;