import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X, Users, Calendar, MessageSquare, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import { updateLeadStatus, UpdateLeadStatusInputType, bulkDeleteLeads } from 'zite-endpoints-sdk';
import { toast } from 'sonner';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface BulkActionsBarProps {
  selectedLeads: string[];
  onClearSelection: () => void;
  onUpdateComplete: () => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedLeads,
  onClearSelection,
  onUpdateComplete,
}) => {
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [bulkUpdate, setBulkUpdate] = useState<{
    status?: UpdateLeadStatusInputType['status'];
    notes?: string;
    followUpDate?: string;
  }>({});

  const handleBulkUpdate = async () => {
    if (selectedLeads.length === 0) return;

    try {
      setUpdating(true);
      
      // Process leads one by one since the endpoint only handles single updates
      const updatePromises = selectedLeads.map(leadId => 
        updateLeadStatus({
          leadId,
          status: bulkUpdate.status,
          notes: bulkUpdate.notes,
          followUpDate: bulkUpdate.followUpDate
        })
      );
      
      await Promise.all(updatePromises);
      
      toast.success(`Successfully updated ${selectedLeads.length} leads`);
      setUpdateDialogOpen(false);
      setBulkUpdate({});
      onClearSelection();
      onUpdateComplete();
    } catch (error) {
      toast.error('Failed to update leads');
      console.error('Error updating leads:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLeads.length === 0) return;

    try {
      setDeleting(true);
      
      await bulkDeleteLeads({ leadIds: selectedLeads });
      
      toast.success(`Successfully deleted ${selectedLeads.length} leads`);
      setDeleteDialogOpen(false);
      onClearSelection();
      onUpdateComplete();
    } catch (error) {
      toast.error('Failed to delete leads');
      console.error('Error deleting leads:', error);
    } finally {
      setDeleting(false);
    }
  };

  const statusOptions = [
    'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed Won', 'Closed Lost'
  ] as const;

  if (selectedLeads.length === 0) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
        >
          <Card className="shadow-lg border">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {selectedLeads.length} selected
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default" size="sm">
                        Bulk Update
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Bulk Update Leads</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Status (optional)</Label>
                          <Select 
                            value={bulkUpdate.status || ''} 
                            onValueChange={(value) => 
                              setBulkUpdate(prev => ({ 
                                ...prev, 
                                status: value as UpdateLeadStatusInputType['status']
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Follow-up Date (optional)</Label>
                          <Input
                            type="date"
                            value={bulkUpdate.followUpDate || ''}
                            onChange={(e) =>
                              setBulkUpdate(prev => ({ ...prev, followUpDate: e.target.value }))
                            }
                          />
                        </div>

                        <div>
                          <Label>Notes (optional)</Label>
                          <Textarea
                            placeholder="Add notes for all selected leads..."
                            value={bulkUpdate.notes || ''}
                            onChange={(e) =>
                              setBulkUpdate(prev => ({ ...prev, notes: e.target.value }))
                            }
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={handleBulkUpdate}
                            disabled={updating}
                            className="flex-1"
                          >
                            {updating ? 'Updating...' : `Update ${selectedLeads.length} Leads`}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setUpdateDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearSelection}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleBulkDelete}
        title="Delete Selected Leads"
        description={`Are you sure you want to delete ${selectedLeads.length} selected lead${selectedLeads.length === 1 ? '' : 's'}? This action cannot be undone.`}
        confirmText={`Delete ${selectedLeads.length} Lead${selectedLeads.length === 1 ? '' : 's'}`}
        loading={deleting}
      />
    </>
  );
};

export default BulkActionsBar;