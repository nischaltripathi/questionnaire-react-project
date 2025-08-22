import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, ChevronDown } from 'lucide-react';

interface ExploreArea {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
}

interface AreasToExploreProps {
  items: ExploreArea[];
}

const priorityConfig = {
  High: { color: 'bg-destructive', textColor: 'text-destructive-foreground', railColor: 'border-l-destructive' },
  Medium: { color: 'bg-secondary', textColor: 'text-secondary-foreground', railColor: 'border-l-secondary' },
  Low: { color: 'bg-muted', textColor: 'text-muted-foreground', railColor: 'border-l-border' }
};

const AreasToExplore: React.FC<AreasToExploreProps> = ({ items }) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const emphasizeVerbs = (text: string) => {
    const verbPatterns = /\b(identify|review|define|align|streamline|remove|consolidate|improve|start|build)\b/gi;
    return text.replace(verbPatterns, '<em>$1</em>');
  };

  return (
    <Card className="organic-card leaf-shadow hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            <h3 className="text-xl font-semibold">
              Areas ({items.length})
            </h3>
          </div>
          
          {/* Priority Legend */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <span>High</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-border" />
              <span>Low</span>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div role="list" className="space-y-3 print:space-y-2">
          {items.map((item, index) => {
            const config = priorityConfig[item.priority];
            const isExpanded = expandedItems.has(index);
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            
            return (
              <div
                key={index}
                role="listitem"
                className={`relative border-l-4 ${config.railColor} bg-card hover:bg-accent/50 focus-within:bg-accent/50 transition-colors duration-200 rounded-r-lg group print:border-l-0 print:list-decimal print:ml-6`}
                tabIndex={0}
                data-priority={item.priority}
              >
                <div className="p-4 space-y-2">
                  {/* Title Row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Lightbulb className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <h4 className="font-semibold text-foreground leading-tight">
                        {item.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`${config.color} ${config.textColor} text-xs px-2 py-1 print:hidden`}
                        aria-label={`Priority: ${item.priority}`}
                      >
                        {item.priority}
                      </Badge>
                      
                      {/* Print priority indicator */}
                      <span className="hidden print:inline text-xs text-gray-600">
                        [{item.priority}]
                      </span>
                      
                      {isMobile && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleExpanded(index)}
                          aria-expanded={isExpanded}
                          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${item.title}`}
                        >
                          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className={`text-sm text-muted-foreground leading-relaxed ${isMobile && !isExpanded ? 'hidden' : ''}`}>
                    <p dangerouslySetInnerHTML={{ __html: emphasizeVerbs(item.description) }} />
                  </div>
                </div>

                {/* Subtle Divider */}
                {index < items.length - 1 && (
                  <div className="absolute bottom-0 left-4 right-4 h-px bg-border/50" />
                )}
              </div>
            );
          })}
        </div>


      </CardContent>
    </Card>
  );
};

export default AreasToExplore;