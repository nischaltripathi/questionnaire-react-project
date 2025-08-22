import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Gauge, ListChecks, AlertTriangle, Lightbulb, Calendar, ChevronRight, CircleDot, Circle, Triangle } from 'lucide-react';
import { ComplexityTier, FormData } from '../types/scorecard';
import { motion, useInView } from 'framer-motion';
import ProspectInfoDialog from './ProspectInfoDialog';
import ScoreBulletChart from './visuals/ScoreBulletChart';
import FindingsGrid from './visuals/FindingsGrid';
import ReviewCTACard from './ReviewCTACard';
import AreasToExplore from './AreasToExplore';
// import { createAssessmentRecord, CreateAssessmentRecordInputType } from 'zite-endpoints-sdk';

interface ResultsProps {
  score: number;
  tier: ComplexityTier;
  breakdown?: any;
  formData?: FormData;
  onRestart: () => void;
  onShare?: () => void;
}

const getTierIcon = (tier: ComplexityTier) => {
  if (tier === 'Low') return Circle;
  if (tier === 'Medium') return Triangle;
  return AlertTriangle;
};

const getSummary = (tier: ComplexityTier) => {
  switch (tier) {
    case 'Low':
      return 'You have a solid base. With a few focused tweaks, you can make things smoother without major changes.';
    case 'Medium':
      return 'Your systems are working, but some parts are creating friction. A few practical fixes will unlock easier, faster workflows.';
    case 'High':
      return 'Your setup has grown complex. A guided clean-up and simple structure will reduce effort and make day-to-day work easier.';
  }
};

type Finding = { title: string; explanation: string; impact?: string };

const buildCriticalFindings = (formData?: FormData): Finding[] => {
  const findings: Finding[] = [];
  if (!formData) {
    return [
      { title: 'Manual steps add friction', explanation: 'Some tasks likely rely on manual work, which slows progress and adds risk.', impact: 'This can reduce errors and save time for your team.' },
      { title: 'Tool sprawl increases effort', explanation: 'Using many tools makes work harder to coordinate.', impact: 'Simplifying can cut context switching and confusion.' },
      { title: 'Unclear data slows decisions', explanation: 'Low confidence in data makes decisions slower and less certain.', impact: 'Improving clarity helps decisions happen faster.' }
    ];
  }

  const systemsCount = formData.businessSnapshot.systemsCount || 0;
  const hasManual = formData.painPoints.manualWorkarounds === 'yes';
  const manualCount = (formData.painPoints.timeConsumingProcesses || []).length;
  const dataConfidence = formData.reportingDecisions.dataConfidence ?? 0;
  const perfScores = Object.values(formData.systemPerformance || {});
  const avgPerf = perfScores.length ? (perfScores.reduce((s, v) => s + (v || 0), 0) / perfScores.length) : 0;

  if (hasManual) {
    findings.push({
      title: 'Manual steps are taking time',
      explanation: `${manualCount > 0 ? `${manualCount} frequent manual task${manualCount > 1 ? 's' : ''} ` : 'Manual work'} adds avoidable effort and risk.`,
      impact: 'Streamlining can reduce errors and save time for your team.'
    });
  }

  if (systemsCount > 6) {
    findings.push({
      title: 'Too many tools to juggle',
      explanation: `Managing ${systemsCount} tools creates extra coordination and context switching.`,
      impact: 'A simpler setup can make everyday work easier.'
    });
  }

  if (dataConfidence <= 3) {
    findings.push({
      title: 'Hard to trust the numbers',
      explanation: 'Low confidence in data slows decisions and creates uncertainty.',
      impact: 'Clearer reporting helps decisions happen faster.'
    });
  }

  if (findings.length < 3 && avgPerf < 3.5) {
    findings.push({
      title: 'Everyday friction adds up',
      explanation: 'Some tools feel clunky in daily use and take extra steps.',
      impact: 'Small fixes can make work feel lighter.'
    });
  }

  while (findings.length < 3) {
    findings.push({
      title: 'Straightforward wins available',
      explanation: 'A few focused changes can improve clarity and reduce busywork.',
      impact: 'This helps create momentum without heavy lifting.'
    });
  }

  return findings.slice(0, 3);
};

const getKeyFactors = (formData?: FormData): string[] => {
  const factors: string[] = [];
  if (!formData) return [
    'Mix of manual steps and tool handoffs',
    'Several systems to keep in sync',
    'Data confidence varies across sources',
  ];

  const { systemsCount } = formData.businessSnapshot;
  const { manualWorkarounds, criticalToFix, supportGrowth } = formData.painPoints;
  const { dataConfidence, reportFrequency } = formData.reportingDecisions;

  if (manualWorkarounds === 'yes') factors.push('Manual workarounds are still needed in places');
  if ((systemsCount || 0) > 6) factors.push('Multiple tools increase coordination effort');
  if ((dataConfidence ?? 0) <= 3) factors.push('Data quality or trust feels inconsistent');
  if (criticalToFix === 'high') factors.push('Some issues feel urgent to address');
  if (supportGrowth === 'no') factors.push("Current systems don't fully support growth");
  if (reportFrequency?.includes('Not at all') || reportFrequency?.includes('Yearly')) factors.push('Reporting cadence is infrequent');

  return (factors.length ? factors : ['A few areas create extra effort day to day']).slice(0, 5);
};

type FocusArea = { title: string; description: string; priority: 'High' | 'Medium' | 'Low' };

const getFocusAreas = (formData?: FormData): FocusArea[] => {
  const areas: FocusArea[] = [];
  if (!formData) return [
    { 
      title: 'Reduce manual steps in key workflows', 
      description: 'Identify 1–2 workflows to streamline first and remove unnecessary handoffs.',
      priority: 'High' 
    },
    { 
      title: 'Improve data clarity for decisions', 
      description: 'Define core metrics and align sources so reporting is consistent and trusted.',
      priority: 'Medium' 
    },
  ];

  const { manualWorkarounds } = formData.painPoints;
  const { systemsCount } = formData.businessSnapshot;
  const { dataConfidence } = formData.reportingDecisions;

  if (manualWorkarounds === 'yes') {
    areas.push({ 
      title: 'Reduce manual steps in key workflows', 
      description: 'Identify 1–2 workflows to streamline first and remove unnecessary handoffs.',
      priority: 'High' 
    });
  }
  if ((systemsCount || 0) > 6) {
    areas.push({ 
      title: 'Simplify or consolidate toolset', 
      description: 'Review overlap between tools and consolidate where practical.',
      priority: 'Medium' 
    });
  }
  if ((dataConfidence ?? 0) <= 3) {
    areas.push({ 
      title: 'Improve data clarity and reporting', 
      description: 'Define core metrics and align sources so reporting is consistent and trusted.',
      priority: 'High' 
    });
  }

  return areas.slice(0, 3);
};



// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const sectionVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const scoreVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    rotateY: -90
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.3
    }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

// Animated section wrapper component
const AnimatedSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ 
  children, 
  delay = 0 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ 
        transitionDelay: `${delay}ms` 
      }}
    >
      {children}
    </motion.section>
  );
};

const Results: React.FC<ResultsProps> = ({ score, tier, formData }) => {
  const [prospectInfoSaved, setProspectInfoSaved] = useState(false);
  const [prospectDialogOpen, setProspectDialogOpen] = useState(true);

  const TierIcon = getTierIcon(tier);
  const findings = buildCriticalFindings(formData);
  const factors = getKeyFactors(formData);
  const focusAreas = getFocusAreas(formData);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSaveProspectInfo = async (name: string, email: string) => {
    try {
      // Ensure formData has the required structure
      const defaultFormData = {
        businessSnapshot: {},
        systemPerformance: {},
        painPoints: {},
        reportingDecisions: {},
        visionPriorities: {}
      };

      const assessmentData: CreateAssessmentRecordInputType = {
        prospectName: name,
        prospectEmail: email,
        complexityScore: score,
        complexityTier: tier,
        formData: formData || defaultFormData
      };

      await createAssessmentRecord(assessmentData);
      setProspectInfoSaved(true);
      setProspectDialogOpen(false);
      toast.success('Your assessment has been saved! Here are your results.');
    } catch (error) {
      console.error('Failed to save assessment:', error);
      toast.error('Failed to save assessment. Please try again.');
      throw error;
    }
  };



  // Don't show results until prospect info is saved
  if (!prospectInfoSaved) {
    return (
      <>
        <div className="min-h-screen nature-gradient natural-texture flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold mb-4">Assessment Complete!</h1>
            <p className="text-muted-foreground">
              Please provide your contact information to view your detailed results.
            </p>
          </div>
        </div>
        
        <ProspectInfoDialog
          open={prospectDialogOpen}
          onOpenChange={(open) => {
            // Prevent closing the dialog - it's required
            if (!open && !prospectInfoSaved) {
              return;
            }
            setProspectDialogOpen(open);
          }}
          onSave={handleSaveProspectInfo}
        />
      </>
    );
  }

  return (
    <motion.div 
      className="min-h-screen nature-gradient natural-texture"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Score & Tier Card */}
        <AnimatedSection>
          <Card className="organic-card leaf-shadow hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
            <CardContent className="p-6 space-y-4">
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Gauge className="w-5 h-5 text-primary" />
                <h2 className="text-xl sm:text-2xl font-semibold">Complexity Tier: {tier}</h2>
                <motion.div 
                  className="ml-auto"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.4, type: "spring" }}
                >
                  <Badge 
                    variant={tier === 'High' ? 'destructive' : tier === 'Medium' ? 'secondary' : 'default'}
                    className="uppercase tracking-wide font-semibold shadow-sm flex items-center gap-1.5"
                  >
                    <TierIcon className="w-3 h-3" />
                    {tier}
                  </Badge>
                </motion.div>
              </motion.div>

              <motion.div 
                className="text-center"
                variants={scoreVariants}
              >
                <span className="inline-block rounded-xl bg-primary/10 ring-1 ring-primary/10 px-5 py-3">
                  <span className="text-5xl sm:text-6xl font-extrabold text-foreground">{score.toFixed(1)}</span>
                </span>
                <p className="text-muted-foreground mt-2">Score out of 100</p>
              </motion.div>

              <Separator className="my-2" />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <ScoreBulletChart 
                  score={score} 
                  thresholds={{ low: 25, medium: 79 }} 
                />
              </motion.div>

              <motion.div 
                className="pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold mb-1">What This Score Means</h3>
                <p className="text-foreground">{getSummary(tier)}</p>
              </motion.div>
            </CardContent>
          </Card>
        </AnimatedSection>

        <Separator className="opacity-60" />

        {/* Top 3 Critical Findings */}
        <AnimatedSection delay={100}>
          <Card className="organic-card leaf-shadow hover:shadow-lg transition-all duration-300 hover:scale-[1.005]">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-primary" />
                <h3 className="text-xl font-semibold">Top 3 Critical Findings</h3>
              </div>
              <FindingsGrid findings={findings} />
            </CardContent>
          </Card>
        </AnimatedSection>

        <Separator className="opacity-60" />

        {/* Key Factors Contributing to Your Result */}
        <AnimatedSection delay={200}>
          <Card className="organic-card leaf-shadow hover:shadow-lg transition-all duration-300 hover:scale-[1.005]">
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-primary" />
                <h3 className="text-xl font-semibold">Key Factors Contributing to Your Result</h3>
              </div>
              <ul className="space-y-2">
                {factors.map((fact, idx) => (
                  <motion.li 
                    key={idx} 
                    className="flex items-start gap-2 text-foreground hover:text-primary transition-colors duration-200"
                    custom={idx}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <ChevronRight className="w-4 h-4 mt-1 text-primary" />
                    <span>{fact}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </AnimatedSection>

        <Separator className="opacity-60" />

        {/* Areas Worth Exploring Further */}
        {focusAreas.length > 0 && (
          <AnimatedSection delay={300}>
            <AreasToExplore items={focusAreas} />
          </AnimatedSection>
        )}

        <Separator className="opacity-60" />

        {/* Ready to Review Your Results? */}
        <AnimatedSection delay={400}>
          <ReviewCTACard
            title="Ready to Review Your Results?"
            body={[
              "Let's review your assessment results together and create a clear action plan for your systems."
            ]}
            button={{
              label: "Book a Session",
              href: "https://calendar.app.google/D4uKyxQVKtTZg4Co8"
            }}
            disclaimer="No obligation — just clarity on where you stand and where to go next."
          />
        </AnimatedSection>
      </div>
    </motion.div>
  );
};

export default Results;