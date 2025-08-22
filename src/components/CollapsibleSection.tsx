import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  description?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  icon, 
  children, 
  defaultOpen = false,
  className = "",
  description
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div 
          className="flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-2 -m-2"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-expanded={isOpen}
          aria-controls={`collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
        >
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 mb-1">
              {icon}
              {title}
            </CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground font-normal">
                {description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 flex-shrink-0"
            tabIndex={-1}
            aria-hidden="true"
          >
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <CardContent className="pt-0">
              {children}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default CollapsibleSection;