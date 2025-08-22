import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Circle, Loader2, Save, Sparkles, Clock, Share2, AlertTriangle, RotateCcw, BarChart3, Target, Building2, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BusinessSnapshot from './BusinessSnapshot';
import SystemPerformance from './SystemPerformance';
import PainPoints from './PainPoints';
import ReportingDecisions from './ReportingDecisions';
import VisionPriorities from './VisionPriorities';
import Results from './Results';
import QuestionPreview from './QuestionPreview';
import ScoringAdjustments from './ScoringAdjustments';
import { FormData, ComplexityTier } from '../types/scorecard';
import { toast } from 'sonner';
import { useUrlParams } from '../hooks/useUrlParams';
import { assessmentStorage } from '../services/assessmentStorage';

interface ScoringAdjustment {
  type: 'penalty' | 'bonus' | 'warning';
  category: string;
  description: string;
  impact: number;
  reason: string;
}

interface ValidationIssue {
  type: 'warning' | 'error';
  title: string;
  description: string;
  conflictingResponses?: string[];
}

interface EnhancedBreakdown {
  businessSnapshot: number;
  systemPerformance: number;
  painPoints: number;
  reportingDecisions: number;
  visionPriorities: number;
  adjustments: ScoringAdjustment[];
  validationIssues: ValidationIssue[];
  originalScore: number;
  adjustedScore: number;
}

const ScorecardCalculator = () => {
  const urlParams = useUrlParams();
  const [currentSection, setCurrentSection] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    businessSnapshot: {},
    systemPerformance: {},
    painPoints: {},
    reportingDecisions: {},
    visionPriorities: {}
  });
  const [showResults, setShowResults] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [startTime] = useState<Date>(new Date());
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Display tracking info if URL params are present
  useEffect(() => {
    if (urlParams.userId || urlParams.trackingId) {
      console.log('Assessment tracking active:', {
        userId: urlParams.userId,
        trackingId: urlParams.trackingId,
        source: urlParams.source,
        campaign: urlParams.campaign
      });
    }
  }, [urlParams]);

  const sections = [
    { title: 'Business & Systems', icon: Building2 },
    { title: 'System Performance', icon: Gauge }, 
    { title: 'Pain Points & Friction', icon: AlertTriangle },
    { title: 'Reporting & Decisions', icon: BarChart3 },
    { title: 'Vision & Priorities', icon: Target }
  ];

  // Estimated time per section (in minutes)
  const sectionTimes = [5, 3, 2, 3, 2];
  
  const getEstimatedTimeRemaining = (): string => {
    const remainingSections = sections.slice(currentSection + 1);
    const remainingTime = remainingSections.reduce((total, _, index) => 
      total + sectionTimes[currentSection + 1 + index], 0);
    
    if (remainingTime === 0) return "Almost done!";
    if (remainingTime === 1) return "~1 minute remaining";
    return `~${remainingTime} minutes remaining`;
  };

  // Auto-save functionality with error handling
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('huddleco-scorecard');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData || formData);
        setCurrentSection(parsed.currentSection || 0);
        setLastSaved(new Date(parsed.timestamp));
        console.log('Successfully loaded saved progress');
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
      toast.error('Failed to load saved progress');
    }
  }, []);

  useEffect(() => {
    try {
      const saveData = {
        formData,
        currentSection,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('huddleco-scorecard', JSON.stringify(saveData));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
    }
  }, [formData, currentSection]);

  const updateFormData = useCallback((section: keyof FormData, data: any) => {
    try {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], ...data }
      }));
      // Clear validation errors when user makes changes
      setValidationErrors([]);
    } catch (error) {
      console.error('Error updating form data:', error);
      toast.error('Failed to update form data');
    }
  }, []);

  const getSectionCompletion = (sectionIndex: number): number => {
    const sectionKeys = Object.keys(formData) as (keyof FormData)[];
    const sectionData = formData[sectionKeys[sectionIndex]];
    
    if (!sectionData) return 0;
    
    const values = Object.values(sectionData);
    const filledValues = values.filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim().length > 0;
      if (typeof value === 'number') return value > 0;
      return value !== null && value !== undefined;
    });
    
    const totalFields = Math.max(values.length, 1);
    return Math.round((filledValues.length / totalFields) * 100);
  };

  // Enhanced validation function to detect inconsistencies
  const validateConsistency = (data: FormData): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];

    // Check for performance vs pain point conflicts
    const performanceRatings = Object.values(data.systemPerformance || {});
    const avgPerformance = performanceRatings.length > 0 
      ? performanceRatings.reduce((sum, rating) => sum + (rating || 0), 0) / performanceRatings.length 
      : 0;

    const hasHighPainPoints = data.painPoints.manualWorkarounds === 'yes' || 
                              data.painPoints.criticalToFix === 'high' ||
                              data.painPoints.supportGrowth === 'no';

    if (avgPerformance >= 4 && hasHighPainPoints) {
      issues.push({
        type: 'warning',
        title: 'Potential Response Inconsistency',
        description: 'You rated system performance highly but indicated significant pain points. Please review your responses to ensure accuracy.',
        conflictingResponses: [
          `Average system performance: ${avgPerformance.toFixed(1)}/5 (Excellent/Good)`,
          `Pain points: ${data.painPoints.manualWorkarounds === 'yes' ? 'Manual workarounds needed' : ''}${data.painPoints.criticalToFix === 'high' ? ', Critical fixes needed' : ''}${data.painPoints.supportGrowth === 'no' ? ', Systems don\'t support growth' : ''}`
        ]
      });
    }

    // Check for data confidence vs reporting frequency conflicts
    const dataConfidence = data.reportingDecisions.dataConfidence || 0;
    const hasFrequentReporting = data.reportingDecisions.reportFrequency?.includes('Daily') || 
                                 data.reportingDecisions.reportFrequency?.includes('Weekly');

    if (dataConfidence <= 2 && hasFrequentReporting) {
      issues.push({
        type: 'warning',
        title: 'Data Confidence vs Reporting Frequency',
        description: 'You report frequently but have low confidence in data accuracy. This may indicate data quality issues that could affect decision-making.',
        conflictingResponses: [
          `Data confidence: ${dataConfidence}/5 (Low)`,
          `Reporting frequency: ${data.reportingDecisions.reportFrequency?.join(', ')}`
        ]
      });
    }

    // Check for system count vs performance conflicts
    const systemsCount = data.businessSnapshot.systemsCount || 0;
    if (systemsCount > 10 && avgPerformance >= 4) {
      issues.push({
        type: 'warning',
        title: 'System Complexity vs Performance',
        description: 'Managing many systems while maintaining high performance is challenging. Consider if all systems are truly performing optimally.',
        conflictingResponses: [
          `Number of systems: ${systemsCount}`,
          `Average performance rating: ${avgPerformance.toFixed(1)}/5`
        ]
      });
    }

    return issues;
  };

  const calculateScore = (): { score: number; tier: ComplexityTier; breakdown: EnhancedBreakdown } => {
    const baseBreakdown = {
      businessSnapshot: 0,
      systemPerformance: 0,
      painPoints: 0,
      reportingDecisions: 0,
      visionPriorities: 0
    };

    const adjustments: ScoringAdjustment[] = [];
    const validationIssues = validateConsistency(formData);

    // Business Snapshot scoring (Weight: 25%) - Max 25 points
    // NOTE: Industry and client details are now informational only
    const { teamSize, systemsCount, systemAreas, businessAreas } = formData.businessSnapshot;
    let businessScore = 0;
    
    // Team size complexity (informational context but still affects complexity)
    if (teamSize === 'Small Team (1-5)') businessScore += 3;
    else if (teamSize === 'Growing Team (6-20)') businessScore += 6;
    else if (teamSize === 'Medium Team (21-50)') businessScore += 9;
    else if (teamSize === 'Large Team (50+)') businessScore += 12;
    
    // System count complexity
    if (systemsCount) {
      if (systemsCount <= 3) businessScore += 2;
      else if (systemsCount <= 7) businessScore += 5;
      else if (systemsCount <= 15) businessScore += 8;
      else businessScore += 11;
    }
    
    // System areas complexity (more areas = more integration challenges)
    if (systemAreas?.length) {
      businessScore += Math.min(systemAreas.length * 0.5, 2);
    }
    
    baseBreakdown.businessSnapshot = Math.min(businessScore, 25);

    // System Performance scoring (Weight: 30%) - Max 30 points
    // Lower performance ratings = higher complexity scores
    const systemPerformanceRatings = Object.values(formData.systemPerformance);
    let performanceScore = 0;
    
    if (systemPerformanceRatings.length > 0) {
      const validRatings = systemPerformanceRatings.filter(rating => rating !== undefined) as number[];
      if (validRatings.length > 0) {
        const averagePerformance = validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;
        // Convert 1-5 scale to complexity: 5 (excellent) = 0 complexity, 1 (poor) = 30 complexity
        performanceScore = (6 - averagePerformance) * 6; // Scale to 0-30
      }
    }
    
    baseBreakdown.systemPerformance = Math.min(Math.round(performanceScore), 30);

    // Pain Points scoring (Weight: 25%) - Max 25 points
    // Enhanced weighting: Manual workarounds and system integration get higher weight
    const { manualWorkarounds, criticalToFix, supportGrowth, timeConsumingProcesses, biggestFrustrations } = formData.painPoints;
    let painScore = 0;
    
    // Manual workarounds - HIGH WEIGHT (major complexity indicator)
    if (manualWorkarounds === 'yes') {
      painScore += 10; // Increased from 8
      adjustments.push({
        type: 'penalty',
        category: 'Manual Workarounds',
        description: 'Manual workarounds indicate system gaps that increase operational complexity',
        impact: 2,
        reason: 'Enhanced weighting for manual processes as they significantly impact efficiency'
      });
    }
    
    // Criticality of fixes - HIGH WEIGHT
    if (criticalToFix === 'high') {
      painScore += 8; // Increased from 6
      adjustments.push({
        type: 'penalty',
        category: 'Critical Fixes Needed',
        description: 'Critical system fixes indicate urgent complexity issues',
        impact: 2,
        reason: 'Enhanced weighting for critical fixes as they represent immediate operational risk'
      });
    } else if (criticalToFix === 'medium') {
      painScore += 4; // Increased from 3
    } else if (criticalToFix === 'low') {
      painScore += 1;
    }
    
    // Systems not supporting growth - HIGH WEIGHT
    if (supportGrowth === 'no') {
      painScore += 7; // Increased from 6
      adjustments.push({
        type: 'penalty',
        category: 'Growth Constraints',
        description: 'Systems that don\'t support growth create scaling complexity',
        impact: 1,
        reason: 'Enhanced weighting for growth limitations as they affect strategic capability'
      });
    }
    
    // Time-consuming processes - REDUCED WEIGHT
    if (timeConsumingProcesses?.length) {
      painScore += Math.min(timeConsumingProcesses.length * 0.5, 2); // Reduced from 1
    }
    
    // Frustrations - REDUCED WEIGHT (less indicative than actual system issues)
    if (biggestFrustrations?.length) {
      painScore += Math.min(biggestFrustrations.length * 0.25, 1); // Reduced from 0.5
    }
    
    baseBreakdown.painPoints = Math.min(painScore, 25);

    // Reporting & Decisions scoring (Weight: 15%) - Max 15 points
    // Enhanced with data confidence penalties
    const { reportFrequency, dataConfidence, trackingMethods } = formData.reportingDecisions;
    let reportingScore = 0;
    
    // Reporting frequency (less frequent = more complexity)
    if (reportFrequency?.includes('Not at all')) reportingScore += 6;
    else if (reportFrequency?.includes('Yearly')) reportingScore += 5;
    else if (reportFrequency?.includes('Quarterly')) reportingScore += 4;
    else if (reportFrequency?.includes('Monthly')) reportingScore += 2;
    else if (reportFrequency?.includes('Weekly')) reportingScore += 1;
    // Daily reporting = 0 additional complexity
    
    // Data confidence with enhanced penalties
    if (dataConfidence) {
      const baseConfidenceScore = (6 - dataConfidence) * 1.5; // Scale 1-5 to 0-7.5
      reportingScore += baseConfidenceScore;

      // Apply specific data confidence penalties as requested
      if (dataConfidence <= 2) { // Unreliable data
        const penalty = 3;
        reportingScore += penalty;
        adjustments.push({
          type: 'penalty',
          category: 'Data Confidence Penalty',
          description: 'Unreliable data significantly impacts decision-making capability',
          impact: penalty,
          reason: 'Data confidence rated 1-2/5 indicates unreliable data requiring immediate attention'
        });
      } else if (dataConfidence <= 3) { // Partially trusted data
        const penalty = 1.5;
        reportingScore += penalty;
        adjustments.push({
          type: 'penalty',
          category: 'Data Confidence Penalty',
          description: 'Partially trusted data creates decision-making uncertainty',
          impact: penalty,
          reason: 'Data confidence rated 3/5 indicates partially trusted data affecting strategic decisions'
        });
      } else if (dataConfidence <= 3.5) { // Inconsistent data
        const penalty = 0.75;
        reportingScore += penalty;
        adjustments.push({
          type: 'penalty',
          category: 'Data Confidence Penalty',
          description: 'Inconsistent data quality creates operational complexity',
          impact: penalty,
          reason: 'Data confidence between 3-3.5/5 indicates inconsistent data quality'
        });
      }
    }
    
    // Multiple tracking methods can indicate fragmentation
    if (trackingMethods?.length && trackingMethods.length > 3) {
      reportingScore += 1.5;
    }
    
    baseBreakdown.reportingDecisions = Math.min(Math.round(reportingScore), 15);

    // Vision & Priorities scoring (Weight: 5%) - Max 5 points  
    const { desiredOutcomes, businessImpact } = formData.visionPriorities;
    let visionScore = 0;
    
    // More desired outcomes can indicate more complex needs
    if (desiredOutcomes?.length) {
      visionScore += Math.min(desiredOutcomes.length * 0.5, 3);
    }
    
    // Multiple business impact areas suggest complexity
    if (businessImpact?.length) {
      visionScore += Math.min(businessImpact.length * 0.3, 2);
    }
    
    baseBreakdown.visionPriorities = Math.min(visionScore, 5);

    // Calculate original and adjusted scores
    const originalScore = Object.values(baseBreakdown).reduce((sum, score) => sum + score, 0);
    const adjustmentTotal = adjustments.reduce((sum, adj) => sum + adj.impact, 0);
    const adjustedScore = originalScore + adjustmentTotal;

    // Sanity check for contradictory results
    const sanityCheckRatings = Object.values(formData.systemPerformance || {});
    const avgPerformance = sanityCheckRatings.length > 0 
      ? sanityCheckRatings.reduce((sum, rating) => sum + (rating || 0), 0) / sanityCheckRatings.length 
      : 0;

    if (avgPerformance >= 4.5 && baseBreakdown.painPoints >= 15) {
      adjustments.push({
        type: 'warning',
        category: 'Contradictory Results Detected',
        description: 'High performance ratings conflict with high pain point scores',
        impact: 0,
        reason: 'This combination suggests either system performance is overrated or pain points are overstated'
      });
    }

    // Determine tier based on adjusted score
    let tier: ComplexityTier;
    const finalScore = Math.max(0, adjustedScore); // Ensure score doesn't go negative
    if (finalScore <= 25) tier = 'Low';           // 0-25: Simple systems
    else if (finalScore <= 79) tier = 'Medium';   // 26-79: Moderate complexity
    else tier = 'High';                           // 80-100: Complex systems

    const enhancedBreakdown: EnhancedBreakdown = {
      ...baseBreakdown,
      adjustments,
      validationIssues,
      originalScore,
      adjustedScore: finalScore
    };

    return { 
      score: Math.round(finalScore * 10) / 10, 
      tier, 
      breakdown: enhancedBreakdown 
    };
  };

  // Stable validation function that doesn't cause re-renders
  const validateSectionStable = useMemo(() => {
    return (sectionIndex: number, data: FormData): boolean => {
      try {
        const errors: string[] = [];
        
        switch (sectionIndex) {
          case 0: // Business Snapshot - industry and client details are now informational
            const bs = data.businessSnapshot;
            if (!bs.teamSize) errors.push('Please select your team size');
            if (!bs.systemAreas?.length) errors.push('Please select at least one digital system');
            // Note: industry and topClients are now informational only
            break;
          case 1: // System Performance
            const sp = data.systemPerformance;
            const requiredQuestions = [0,1,2,3,4,5,6];
            const missingRatings = requiredQuestions.filter(i => sp[`q${i}` as keyof typeof sp] === undefined);
            if (missingRatings.length > 0) {
              errors.push(`Please rate all ${requiredQuestions.length} performance areas`);
            }
            break;
          case 2: // Pain Points
            const pp = data.painPoints;
            if (!pp.manualWorkarounds) errors.push('Please indicate if you use manual workarounds');
            if (!pp.supportGrowth) errors.push('Please indicate if your systems help grow your business');
            break;
          case 3: // Reporting Decisions
            const rd = data.reportingDecisions;
            if (!rd.trackingMethods?.length) errors.push('Please select at least one tracking method');
            if (!rd.dataConfidence) errors.push('Please rate your confidence in data accuracy');
            break;
          case 4: // Vision Priorities
            const vp = data.visionPriorities;
            if (!vp.desiredOutcomes?.length) errors.push('Please select at least one desired outcome');
            break;
        }
        
        return errors.length === 0;
      } catch (error) {
        console.error('Error in validateSectionStable:', error);
        return false;
      }
    };
  }, []);

  // Current section validation (for button state)
  const isCurrentSectionValid = useMemo(() => {
    return validateSectionStable(currentSection, formData);
  }, [validateSectionStable, currentSection, formData]);

  // Validation with error setting for form submission
  const validateSectionWithErrors = useCallback((sectionIndex: number): boolean => {
    try {
      const errors: string[] = [];
      
      switch (sectionIndex) {
        case 0: // Business Snapshot
          const bs = formData.businessSnapshot;
          if (!bs.teamSize) errors.push('Please select your team size');
          if (!bs.systemAreas?.length) errors.push('Please select at least one digital system');
          break;
        case 1: // System Performance
          const sp = formData.systemPerformance;
          const requiredQuestions = [0,1,2,3,4,5,6];
          const missingRatings = requiredQuestions.filter(i => sp[`q${i}` as keyof typeof sp] === undefined);
          if (missingRatings.length > 0) {
            errors.push(`Please rate all ${requiredQuestions.length} performance areas`);
          }
          break;
        case 2: // Pain Points
          const pp = formData.painPoints;
          if (!pp.manualWorkarounds) errors.push('Please indicate if you use manual workarounds');
          if (!pp.supportGrowth) errors.push('Please indicate if your systems help grow your business');
          break;
        case 3: // Reporting Decisions
          const rd = formData.reportingDecisions;
          if (!rd.trackingMethods?.length) errors.push('Please select at least one tracking method');
          if (!rd.dataConfidence) errors.push('Please rate your confidence in data accuracy');
          break;
        case 4: // Vision Priorities
          const vp = formData.visionPriorities;
          if (!vp.desiredOutcomes?.length) errors.push('Please select at least one desired outcome');
          break;
      }
      
      setValidationErrors(errors);
      return errors.length === 0;
    } catch (error) {
      console.error('Error in validateSectionWithErrors:', error);
      setValidationErrors(['An error occurred during validation. Please try again.']);
      return false;
    }
  }, [formData]);

  const scrollToTop = useCallback(() => {
    // Smooth scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const handleNext = useCallback(async () => {
    try {
      if (!validateSectionWithErrors(currentSection)) {
        toast.error('Please complete all required fields before continuing');
        return;
      }

      if (currentSection < sections.length - 1) {
        setCurrentSection(currentSection + 1);
        // Scroll to top after a brief delay to allow the transition animation to start
        setTimeout(scrollToTop, 150);
        toast.success('Progress saved');
      } else {
        setIsCalculating(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsCalculating(false);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
      toast.error('An error occurred. Please try again.');
      setIsCalculating(false);
    }
  }, [currentSection, validateSectionWithErrors, sections.length, scrollToTop]);

  const handlePrevious = useCallback(() => {
    try {
      if (currentSection > 0) {
        setCurrentSection(currentSection - 1);
        setValidationErrors([]);
        // Scroll to top after a brief delay to allow the transition animation to start
        setTimeout(scrollToTop, 150);
        toast.success('Progress saved');
      }
    } catch (error) {
      console.error('Error in handlePrevious:', error);
      toast.error('An error occurred. Please try again.');
    }
  }, [currentSection, scrollToTop]);

  // Keyboard navigation with stable validation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      try {
        if (event.ctrlKey || event.metaKey) {
          switch (event.key) {
            case 'ArrowRight':
              event.preventDefault();
              if (validateSectionStable(currentSection, formData)) {
                handleNext();
              } else {
                toast.error('Please complete all required fields before continuing');
              }
              break;
            case 'ArrowLeft':
              event.preventDefault();
              handlePrevious();
              break;
          }
        }
      } catch (error) {
        console.error('Error in keyboard navigation:', error);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, formData, handleNext, handlePrevious, validateSectionStable]);

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <BusinessSnapshot
            data={formData.businessSnapshot}
            onUpdate={(data: any) => updateFormData('businessSnapshot', data)}
          />
        );
      case 1:
        return (
          <SystemPerformance
            data={formData.systemPerformance}
            onUpdate={(data: any) => updateFormData('systemPerformance', data)}
          />
        );
      case 2:
        return (
          <PainPoints
            data={formData.painPoints}
            onUpdate={(data: any) => updateFormData('painPoints', data)}
          />
        );
      case 3:
        return (
          <ReportingDecisions
            data={formData.reportingDecisions}
            onUpdate={(data: any) => updateFormData('reportingDecisions', data)}
          />
        );
      case 4:
        return (
          <VisionPriorities
            data={formData.visionPriorities}
            onUpdate={(data: any) => updateFormData('visionPriorities', data)}
          />
        );
      default:
        return null;
    }
  };

  const progress = ((currentSection + 1) / sections.length) * 100;

  if (showResults) {
    const { score, tier, breakdown } = calculateScore();
    return <Results 
      score={score} 
      tier={tier} 
      breakdown={breakdown}
      formData={formData}
      onRestart={() => {
        setCurrentSection(0);
        setShowResults(false);
        setFormData({
          businessSnapshot: {},
          systemPerformance: {},
          painPoints: {},
          reportingDecisions: {},
          visionPriorities: {}
        });
        localStorage.removeItem('huddleco-scorecard');
      }}
    />;
  }

  if (isCalculating) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-20 animate-pulse"></div>
          <Loader2 className="w-16 h-16 animate-spin text-primary relative z-10 mb-8" />
        </div>
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Calculating Your Results
        </h2>
        <p className="text-muted-foreground mb-8 text-lg max-w-md">
          Analyzing your responses with enhanced validation and smart scoring adjustments...
        </p>
        <div className="w-80 max-w-full">
          <Progress value={100} className="h-3 animate-pulse" />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Enhanced Progress Section */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Section {currentSection + 1} of {sections.length}
          </span>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getEstimatedTimeRemaining()}
            </Badge>
            {lastSaved && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <Save className="w-3 h-3 text-accent" />
                <span className="hidden sm:inline">Saved {lastSaved.toLocaleTimeString()}</span>
                <span className="sm:hidden">Saved</span>
              </Badge>
            )}
            <span className="font-medium">{Math.round(progress)}% Complete</span>
          </div>
        </div>
        <Progress value={progress} className="h-3" />
        
        {/* Mobile-optimized Section Indicators */}
        <div className="grid grid-cols-5 gap-2 sm:gap-4 mt-8">
          {sections.map((section, index) => {
            const completion = getSectionCompletion(index);
            const isComplete = completion === 100;
            const IconComponent = section.icon;
            return (
              <motion.div 
                key={index} 
                className="flex flex-col items-center space-y-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative flex items-center justify-center">
                  {index < currentSection || isComplete ? (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-organic-sm bg-gradient-to-r from-accent to-accent/80 flex items-center justify-center leaf-shadow">
                      {IconComponent ? (
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      ) : (
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      )}
                    </div>
                  ) : index === currentSection ? (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-organic-sm bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center leaf-shadow animate-organic-pulse">
                      {IconComponent ? (
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                      ) : (
                        <span className="text-primary-foreground text-sm font-bold">
                          {index + 1}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-organic-sm border-2 border-muted flex items-center justify-center">
                      {IconComponent ? (
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                      ) : (
                        <span className="text-muted-foreground text-sm font-medium">
                          {index + 1}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <span className={`text-xs text-center leading-tight font-medium px-1 ${
                  index === currentSection 
                    ? 'text-primary' 
                    : index < currentSection || isComplete
                    ? 'text-accent' 
                    : 'text-muted-foreground'
                }`}>
                  {section.title}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {validationErrors.map((error, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span>•</span>
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Main Content Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="organic-card leaf-shadow">
            <CardHeader className="pb-8 bg-gradient-to-r from-primary/5 to-accent/5 rounded-t-organic">
              <CardTitle className="section-header text-2xl sm:text-3xl text-center flex items-center justify-center gap-3">
                {sections[currentSection].icon && React.createElement(sections[currentSection].icon, { className: "w-7 h-7 text-primary" })}
                {sections[currentSection].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 px-4 sm:px-8">
              {renderCurrentSection()}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Question Preview */}
      <QuestionPreview 
        currentSection={currentSection}
        sections={sections}
        sectionTimes={sectionTimes}
      />

      {/* Enhanced Navigation */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 0}
            size="lg"
            className="organic-button w-full sm:w-auto min-w-[140px] h-12 border-2 hover:border-primary touch-target"
          >
            Previous
          </Button>
        </div>
        
        <Button 
          onClick={handleNext}
          disabled={!isCurrentSectionValid}
          size="lg"
          className="w-full sm:w-auto min-w-[140px] h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 touch-target"
        >
          {currentSection === sections.length - 1 ? (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Calculate Results
            </>
          ) : (
            'Next'
          )}
        </Button>
      </motion.div>

      {/* Keyboard shortcuts hint */}
      <div className="text-center text-xs text-muted-foreground">
        <p>💡 Tip: Use Ctrl+← → to navigate</p>
      </div>
    </div>
  );
};

export default ScorecardCalculator;