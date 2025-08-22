import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronUp, Menu, Target, BarChart3, MessageSquare, TrendingUp, Settings, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const FloatingNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navigationItems: NavigationItem[] = [
    { id: 'score', label: 'Complexity Score', icon: <Target className="w-4 h-4" /> },
    { id: 'adjustments', label: 'Scoring Adjustments', icon: <Settings className="w-4 h-4" /> },
    { id: 'summary', label: 'Executive Summary', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'analysis', label: 'Complexity Analysis', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'methodology', label: 'Scoring Methodology', icon: <Scale className="w-4 h-4" /> },
    { id: 'insights', label: 'Business Insights', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'impact', label: 'Business Impact', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="mb-4">
            <Card className="p-2 shadow-lg border">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollToSection(item.id)}
                    className="w-full justify-start text-left">
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                ))}
                <hr className="my-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={scrollToTop}
                  className="w-full justify-start">
                  <ChevronUp className="w-4 h-4" />
                  <span className="ml-2">Back to Top</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
        <Menu className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default FloatingNavigation;