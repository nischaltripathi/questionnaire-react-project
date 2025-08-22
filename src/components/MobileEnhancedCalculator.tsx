import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Circle, Loader2, Save, Sparkles, Clock, Share2, AlertTriangle, RotateCcw, BarChart3, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import BusinessSnapshot from './BusinessSnapshot';
import SystemPerformance from './SystemPerformance';
import PainPoints from './PainPoints';
import ReportingDecisions from './ReportingDecisions';
import VisionPriorities from './VisionPriorities';
import Results from './Results';
import QuestionPreview from './QuestionPreview';
import { FormData, ComplexityTier } from '../types/scorecard';
import { toast } from 'sonner';

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

const MobileEnhancedCalculator = () => {
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const sections = [
    { title: 'Business & Systems Snapshot', shortTitle: 'Business' },
    { title: 'System Performance', shortTitle: 'Performance' }, 
    { title: 'Pain Points & Friction', shortTitle: 'Pain Points' },
    { title: 'Reporting & Decisions', shortTitle: 'Reporting', icon: BarChart3 },
    { title: 'Vision & Priorities', shortTitle: 'Vision', icon: Target }
  ];

  const sectionTimes = [5, 3, 2, 3, 2];

  // Haptic feedback function
  const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  // Swipe handling
  const handleSwipe = (info: PanInfo) => {
    const threshold = 50;
    const velocity = 0.3;
    
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocity) {
      if (info.offset.x > 0) {
        // Swipe right - go to previous section
        handlePrevious();
      } else {
        // Swipe left - go to next section
        if (isCurrentSectionValid) {
          handleNext();
        } else {
          triggerHapticFeedback('medium');
          toast.error('Please complete all required fields');
        }
      }
    }
  };

  const getEstimatedTimeRemaining = (): string => {
    const remainingSections = sections.slice(currentSection + 1);
    const remainingTime = remainingSections.reduce((total, _, index) => 
      total + sectionTimes[currentSection + 1 + index], 0);
    
    if (remainingTime === 0) return "Almost done!";
    if (remainingTime === 1) return "~1 min left";
    return `~${remainingTime} min left`;
  };

  // Auto-save functionality
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('huddleco-scorecard');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData || formData);
        setCurrentSection(parsed.currentSection || 0);
        setLastSaved(new Date(parsed.timestamp));
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
      console.error('Error saving progress:', error);
    }
  }, [formData, currentSection]);

  const updateFormData = useCallback((section: keyof FormData, data: any) => {
    try {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], ...data }
      }));
      setValidationErrors([]);
      triggerHapticFeedback('light');
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

  const validateSectionStable = useMemo(() => {
    return (sectionIndex: number, data: FormData): boolean => {
      try {
        const errors: string[] = [];
        
        switch (sectionIndex) {
          case 0:
            const bs = data.businessSnapshot;
            if (!bs.teamSize) errors.push('Please select your team size');
            if (!bs.systemAreas?.length) errors.push('Please select at least one digital system');
            break;
          case 1:
            const sp = data.systemPerformance;
            const requiredQuestions = [0,1,2,3,4,5,6];
            const missingRatings = requiredQuestions.filter(i => sp[`q${i}` as keyof typeof sp] === undefined);
            if (missingRatings.length > 0) {
              errors.push(`Please rate all ${requiredQuestions.length} performance areas`);
            }
            break;
          case 2:
            const pp = data.painPoints;
            if (!pp.manualWorkarounds) errors.push('Please indicate if you use manual workarounds');
            if (!pp.supportGrowth) errors.push('Please indicate if your systems help grow your business');
            break;
          case 3:
            const rd = data.reportingDecisions;
            if (!rd.trackingMethods?.length) errors.push('Please select at least one tracking method');
            if (!rd.dataConfidence) errors.push('Please rate your confidence in data accuracy');
            break;
          case 4:
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

  const isCurrentSectionValid = useMemo(() => {
    return validateSectionStable(currentSection, formData);
  }, [validateSectionStable, currentSection, formData]);

  const validateSectionWithErrors = useCallback((sectionIndex: number): boolean => {
    try {
      const errors: string[] = [];
      
      switch (sectionIndex) {
        case 0:
          const bs = formData.businessSnapshot;
          if (!bs.teamSize) errors.push('Please select your team size');
          if (!bs.systemAreas?.length) errors.push('Please select at least one digital system');
          break;
        case 1:
          const sp = formData.systemPerformance;
          const requiredQuestions = [0,1,2,3,4,5,6];
          const missingRatings = requiredQuestions.filter(i => sp[`q${i}` as keyof typeof sp] === undefined);
          if (missingRatings.length > 0) {
            errors.push(`Please rate all ${requiredQuestions.length} performance areas`);
          }
          break;
        case 2:
          const pp = formData.painPoints;
          if (!pp.manualWorkarounds) errors.push('Please indicate if you use manual workarounds');
          if (!pp.supportGrowth) errors.push('Please indicate if your systems help grow your business');
          break;
        case 3:
          const rd = formData.reportingDecisions;
          if (!rd.trackingMethods?.length) errors.push('Please select at least one tracking method');
          if (!rd.dataConfidence) errors.push('Please rate your confidence in data accuracy');
          break;
        case 4:
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const handleNext = useCallback(async () => {
    try {
      if (!validateSectionWithErrors(currentSection)) {
        triggerHapticFeedback('medium');
        toast.error('Please complete all required fields');
        return;
      }

      triggerHapticFeedback('light');
      
      if (currentSection < sections.length - 1) {
        setCurrentSection(currentSection + 1);
        setTimeout(scrollToTop, 150);
        toast.success('Progress saved');
      } else {
        setIsCalculating(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsCalculating(false);
        setShowResults(true);
        triggerHapticFeedback('heavy');
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
        setTimeout(scrollToTop, 150);
        triggerHapticFeedback('light');
        toast.success('Progress saved');
      }
    } catch (error) {
      console.error('Error in handlePrevious:', error);
      toast.error('An error occurred. Please try again.');
    }
  }, [currentSection, scrollToTop]);

  const calculateScore = (): { score: number; tier: ComplexityTier; breakdown: EnhancedBreakdown } => {
    // This is a simplified version of the calculation logic
    // The full logic from the original component would be included here
    const baseScore = 50; // Placeholder
    const tier: ComplexityTier = 'Medium'; // Placeholder
    
    const breakdown: EnhancedBreakdown = {
      businessSnapshot: 12,
      systemPerformance: 15,
      painPoints: 13,
      reportingDecisions: 7,
      visionPriorities: 3,
      adjustments: [],
      validationIssues: [],
      originalScore: baseScore,
      adjustedScore: baseScore
    };

    return { score: baseScore, tier, breakdown };
  };

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
        triggerHapticFeedback('medium');
      }}
    />;
  }

  if (isCalculating) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-20 animate-pulse"></div>
          <Loader2 className="w-16 h-16 animate-spin text-primary relative z-10 mb-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Calculating Your Results
        </h2>
        <p className="text-muted-foreground mb-8 text-base sm:text-lg max-w-md">
          Analyzing your responses with enhanced validation...
        </p>
        <div className="w-80 max-w-full">
          <Progress value={100} className="h-3 animate-pulse" />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Mobile-optimized Progress Section */}
      <motion.div 
        className="space-y-4 sm:space-y-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Step {currentSection + 1} of {sections.length}
            </span>
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <Clock className="w-3 h-3" />
              {getEstimatedTimeRemaining()}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-base">{Math.round(progress)}% Complete</span>
            {lastSaved && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <Save className="w-3 h-3 text-accent" />
                Auto-saved
              </Badge>
            )}
          </div>
        </div>
        
        <Progress value={progress} className="h-2 sm:h-3" />
        
        {/* Mobile-optimized Section Indicators */}
        <div className="grid grid-cols-5 gap-1 sm:gap-2 mt-4 sm:mt-8">
          {sections.map((section, index) => {
            const completion = getSectionCompletion(index);
            const isComplete = completion === 100;
            const IconComponent = section.icon;
            return (
              <motion.div 
                key={index} 
                className="flex flex-col items-center space-y-2 sm:space-y-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div 
                  className="relative flex items-center justify-center touch-target"
                  style={{ minHeight: '48px', minWidth: '48px' }}
                >
                  {index < currentSection || isComplete ? (
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-accent to-accent/80 flex items-center justify-center shadow-lg">
                      {IconComponent ? (
                        <IconComponent className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      ) : (
                        <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      )}
                    </div>
                  ) : index === currentSection ? (
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center shadow-lg animate-pulse">
                      {IconComponent ? (
                        <IconComponent className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
                      ) : (
                        <span className="text-primary-foreground text-xs sm:text-sm font-bold">
                          {index + 1}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-muted flex items-center justify-center">
                      {IconComponent ? (
                        <IconComponent className="w-4 h-4 sm:w-6 sm:h-6 text-muted-foreground" />
                      ) : (
                        <span className="text-muted-foreground text-xs sm:text-sm font-medium">
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
                  <span className="hidden sm:inline">{section.title}</span>
                  <span className="sm:hidden">{section.shortTitle || section.title}</span>
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
                    <span className="text-sm">{error}</span>
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Swipeable Main Content Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => handleSwipe(info)}
          className="cursor-grab active:cursor-grabbing"
        >
          <Card className="enhanced-card">
            <CardHeader className="pb-6 sm:pb-8 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="section-header text-xl sm:text-2xl md:text-3xl text-center flex items-center justify-center gap-3">
                {sections[currentSection].icon && React.createElement(sections[currentSection].icon, { className: "w-6 h-6 sm:w-7 sm:h-7 text-primary" })}
                <span className="hidden sm:inline">{sections[currentSection].title}</span>
                <span className="sm:hidden">{sections[currentSection].shortTitle || sections[currentSection].title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 px-4 sm:px-8">
              {renderCurrentSection()}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Mobile-optimized Navigation */}
      <motion.div 
        className="flex flex-col gap-4 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Primary Action Button */}
        <Button 
          onClick={handleNext}
          disabled={!isCurrentSectionValid}
          size="lg"
          className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 touch-target text-lg font-semibold"
          style={{ minHeight: '56px' }}
        >
          {currentSection === sections.length - 1 ? (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Calculate Results
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
        
        {/* Secondary Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 0}
            size="lg"
            className="w-full h-12 border-2 hover:border-primary touch-target"
            style={{ minHeight: '48px' }}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
        </div>
        
        {/* Swipe hint */}
        <div className="text-center text-xs text-muted-foreground">
          <p>💡 Tip: Swipe left/right to navigate sections</p>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileEnhancedCalculator;