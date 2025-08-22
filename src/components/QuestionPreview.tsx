import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Clock, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Section {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface QuestionPreviewProps {
  currentSection: number;
  sections: Section[];
  sectionTimes: number[];
}

const QuestionPreview: React.FC<QuestionPreviewProps> = ({ 
  currentSection, 
  sections, 
  sectionTimes 
}) => {
  const nextSection = currentSection + 1;
  const hasNextSection = nextSection < sections.length;

  if (!hasNextSection) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8"
      >
        <Card className="border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-accent font-semibold">
              <HelpCircle className="w-5 h-5" />
              <span>Final Section - Results Coming Up!</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Complete this section to see your personalized system complexity assessment
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const nextSectionData = sections[nextSection];
  const IconComponent = nextSectionData.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <Card className="border-muted/50 bg-muted/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Coming Up Next
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              ~{sectionTimes[nextSection]} min
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              {IconComponent ? (
                <IconComponent className="w-4 h-4 text-primary" />
              ) : (
                <span className="text-sm font-semibold text-primary">
                  {nextSection + 1}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">
                {nextSectionData.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {getPreviewDescription(nextSection)}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const getPreviewDescription = (sectionIndex: number): string => {
  switch (sectionIndex) {
    case 1:
      return "Rate how well your current systems perform across 7 key areas";
    case 2:
      return "Identify pain points and frustrations with your current setup";
    case 3:
      return "Assess your reporting capabilities and decision-making processes";
    case 4:
      return "Define your vision and priorities for system improvements";
    default:
      return "Continue with the assessment";
  }
};

export default QuestionPreview;