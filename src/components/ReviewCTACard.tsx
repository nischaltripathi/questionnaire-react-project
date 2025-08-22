import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Lock } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

interface ReviewCTACardProps {
  title: string;
  body: string[];
  button: { label: string; href: string };
  disclaimer: string;
}

const ReviewCTACard: React.FC<ReviewCTACardProps> = ({
  title,
  body,
  button,
  disclaimer
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true });
  const [showSticky, setShowSticky] = useState(false);

  // Create checklist by splitting body sentences
  const createChecklist = (bodyText: string[]): string[] => {
    const allText = bodyText.join(' ');
    // Split existing sentences into logical chunks
    const items = [
      "45-minute session reviewing your answers and results",
      "Go through priorities and clarify next steps together", 
      "Deep dive into your systems based on assessment data"
    ];
    return items.slice(0, 3);
  };

  const checklist = createChecklist(body);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const hasPassedCard = rect.bottom < window.innerHeight;
      
      // Show sticky when card has entered viewport and user scrolled past
      setShowSticky(hasPassedCard && isInView);
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isInView]);

  const handleClick = () => {
    window.open(button.href, '_blank');
  };

  return (
    <>
      <Card 
        ref={cardRef}
        className="organic-card leaf-shadow hover:shadow-lg transition-all duration-300 hover:scale-[1.005] overflow-hidden"
        role="region"
        aria-labelledby="ctaTitle"
      >
        {/* Accent header */}
        <CardHeader className="bg-primary/5 border-b border-primary/10 py-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 id="ctaTitle" className="text-xl font-semibold">{title}</h3>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {/* Body text */}
          <div className="space-y-3">
            {body.map((paragraph, index) => (
              <p key={index} className="text-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Checklist */}
          <ul className="space-y-2" role="list">
            {checklist.map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-3 text-sm text-muted-foreground"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>

          {/* Button with disclaimer */}
          <div className="pt-4 space-y-3">
            <Button
              size="lg"
              className="w-full sm:w-auto organic-button h-12 px-8 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleClick}
              aria-describedby="cta-disclaimer"
            >
              {button.label}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground/80" id="cta-disclaimer">
              <Lock className="w-3 h-3" />
              <span>{disclaimer}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sticky mobile bar */}
      {showSticky && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border sm:hidden print:hidden"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Button
            size="lg"
            className="w-full organic-button h-12 px-6 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
            onClick={handleClick}
          >
            {button.label}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      )}

      {/* Print URL display */}
      <div className="hidden print:flex print:justify-center print:mt-8 print:break-inside-avoid">
        <div className="text-center">
          <div className="text-sm text-gray-600 mt-2">
            Visit: {button.href}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewCTACard;