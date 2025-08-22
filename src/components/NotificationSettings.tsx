import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Mail, Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationSettingsProps {
  onClose?: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onClose }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    notificationEmail: '',
    minComplexityScore: 30,
    priorityTiersOnly: false,
    immediateNotification: true,
    dailyDigest: false,
    weeklyReport: true
  });

  const handleSave = () => {
    // In a real app, this would save to backend/localStorage
    toast.success('Notification settings saved successfully!');
    onClose?.();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email alerts when new assessments are completed
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, emailNotifications: checked }))
              }
            />
          </div>

          {settings.emailNotifications && (
            <div className="space-y-2">
              <Label htmlFor="notification-email">Notification Email Address</Label>
              <Input
                id="notification-email"
                type="email"
                placeholder="sales@company.com"
                value={settings.notificationEmail}
                onChange={(e) => 
                  setSettings(prev => ({ ...prev, notificationEmail: e.target.value }))
                }
              />
            </div>
          )}
        </div>

        {/* Trigger Criteria */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Triggers</h3>
          
          <div className="space-y-2">
            <Label htmlFor="min-score">Minimum Complexity Score</Label>
            <Select 
              value={settings.minComplexityScore.toString()} 
              onValueChange={(value) => 
                setSettings(prev => ({ ...prev, minComplexityScore: parseInt(value) }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select minimum score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All assessments (0+)</SelectItem>
                <SelectItem value="20">Low priority (20+)</SelectItem>
                <SelectItem value="40">Medium priority (40+)</SelectItem>
                <SelectItem value="60">High priority (60+)</SelectItem>
                <SelectItem value="80">Critical priority (80+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">High Priority Tiers Only</Label>
              <p className="text-sm text-muted-foreground">
                Only notify for High complexity tier
              </p>
            </div>
            <Switch
              checked={settings.priorityTiersOnly}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, priorityTiersOnly: checked }))
              }
            />
          </div>
        </div>

        {/* Frequency Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Frequency</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Immediate Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send email immediately when assessment is completed
              </p>
            </div>
            <Switch
              checked={settings.immediateNotification}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, immediateNotification: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Daily Digest</Label>
              <p className="text-sm text-muted-foreground">
                Summary of all assessments completed each day
              </p>
            </div>
            <Switch
              checked={settings.dailyDigest}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, dailyDigest: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Weekly Report</Label>
              <p className="text-sm text-muted-foreground">
                Comprehensive weekly summary with trends and insights
              </p>
            </div>
            <Switch
              checked={settings.weeklyReport}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, weeklyReport: checked }))
              }
            />
          </div>
        </div>

        {/* Sample Email Preview */}
        <div className="bg-muted/30 p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Email Preview</span>
          </div>
          <div className="text-sm space-y-2">
            <div className="font-medium">🚨 New High-Priority Assessment Completed</div>
            <div className="text-muted-foreground">
              <strong>Prospect:</strong> John Smith (john@techcorp.com)<br/>
              <strong>Score:</strong> 78.5/100 (High Complexity)<br/>
              <strong>Key Insight:</strong> Manual workarounds needed, 2/5 data confidence<br/>
              <strong>Opportunity:</strong> 25-40% efficiency improvement potential
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;