import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, TrendingUp, Gift, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProspectInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, email: string) => Promise<void>;
}

const ProspectInfoDialog: React.FC<ProspectInfoDialogProps> = ({
  open,
  onOpenChange,
  onSave
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleContinue = async () => {
    if (!name.trim() || !email.trim()) return;
    
    setIsSaving(true);
    try {
      await onSave(name.trim(), email.trim());
      setName('');
      setEmail('');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save prospect info:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = name.trim() && email.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Gift className="w-5 h-5 text-primary" />
            Get Your Results
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Value proposition */}
          <div className="text-center space-y-2">
            <Badge variant="secondary" className="bg-secondary/10 text-secondary-foreground border-secondary/20">
              <Star className="w-3 h-3 mr-1" />
              Business Transformation
            </Badge>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ready to take your business to the next level? Let us help you turn these 
              insights into real growth and efficiency gains.
            </p>
          </div>

          {/* Benefits list */}
          <div className="bg-muted/30 p-3 rounded-lg">
            <h4 className="font-medium text-sm mb-2">What happens next:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• View your detailed assessment results immediately</li>
              <li>• Receive personalized optimization recommendations</li>
              <li>• Get follow-up insights tailored to your business</li>
              <li>• Access to strategic consultation opportunities</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="prospect-name" className="text-sm">
                Your Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="prospect-name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="touch-target"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prospect-email" className="text-sm">
                Your Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="prospect-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="touch-target"
                required
              />
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              onClick={handleContinue}
              disabled={!isFormValid || isSaving}
              className="w-full touch-target bg-gradient-to-r from-primary to-primary/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving & Loading Results...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Continue to Results
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            We'll save your information securely and follow up with valuable insights.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProspectInfoDialog;