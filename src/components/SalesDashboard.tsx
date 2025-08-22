import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { 
  Users, Search, Eye, AlertTriangle, TrendingUp, Download, Trash2, Calendar, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
// import { getAssessmentRecords } from 'zite-endpoints-sdk';
import UserMenu from './UserMenu';
import LeadDetailsModal from './LeadDetailsModal';

import DeleteConfirmDialog from './DeleteConfirmDialog';

type AssessmentRecord = {
  id: string;
  completionDate?: string;
  tier?: string;
  status?: string;
  email?: string;
  businessSnapshot?: any;
  systemPerformance?: any;
  painPoints?: any;
  reportingDecisions?: any;
  visionPriorities?: any;
};

const SalesDashboard: React.FC = () => {
  const [records, setRecords] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      // const response = await getAssessmentRecords();
      const response = { records: [] }; // Mock empty data
      setRecords(response.records);
    } catch (error) {
      toast.error('Failed to load leads');
      console.error('Error loading assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!leadToDelete) return;

    try {
      setDeleting(true);
      
      // Optimistically remove from local state immediately
      setRecords(prev => prev.filter(record => record.id !== leadToDelete.id));
      toast.success(`Successfully deleted ${leadToDelete.name}`);
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
      
      // Delete from database in background
      await deleteLead({ leadId: leadToDelete.id });
    } catch (error) {
      toast.error('Failed to delete lead. Reloading data...');
      console.error('Error deleting lead:', error);
      // Only reload if there was an error
      loadAssessments();
    } finally {
      setDeleting(false);
    }
  };

  const getPriorityScore = (record: AssessmentRecord) => {
    let score = 0;
    if (record.complexityTier === 'High') score += 3;
    else if (record.complexityTier === 'Medium') score += 2;
    else score += 1;
    
    if (record.manualWorkarounds === 'yes') score += 2;
    if (record.dataConfidence <= 2) score += 2;
    if (record.daysSinceCompletion >= 7) score += 2;
    
    return score;
  };

  const filteredRecords = useMemo(() => {
    return records
      .filter(record => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          record.prospectName.toLowerCase().includes(searchLower) ||
          record.prospectEmail.toLowerCase().includes(searchLower) ||
          (record.company && record.company.toLowerCase().includes(searchLower))
        );
      })
      .sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
  }, [records, searchTerm]);

  const stats = useMemo(() => {
    const total = records.length;
    const totalLow = records.filter(r => (r.complexityTier || 'Low') === 'Low').length;
    const totalMedium = records.filter(r => r.complexityTier === 'Medium').length;
    const totalHigh = records.filter(r => r.complexityTier === 'High').length;

    return { total, totalLow, totalMedium, totalHigh };
  }, [records]);

  const handleExport = () => {
    const csvHeaders = ['Name', 'Email', 'Company', 'Complexity Score', 'Complexity Tier', 'Days Since Completion'];
    const csvRows = filteredRecords.map(record => [
      record.prospectName,
      record.prospectEmail,
      record.company || '',
      (record.complexityScore || 0).toString(),
      record.complexityTier || 'Low',
      record.daysSinceCompletion.toString()
    ]);
    
    const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Leads exported');
  };

  const formatDaysAgo = (days: number) => {
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Lead Management</h1>
            <p className="text-muted-foreground">Manage your sales pipeline</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
            </Link>
            <UserMenu />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-sm font-semibold">L</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Low</p>
                  <p className="text-2xl font-bold">{stats.totalLow}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-foreground">M</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Medium</p>
                  <p className="text-2xl font-bold">{stats.totalMedium}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center">
                  <span className="text-sm font-semibold text-destructive-foreground">H</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total High</p>
                  <p className="text-2xl font-bold">{stats.totalHigh}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Export */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>{filteredRecords.length} Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Complexity Score</TableHead>
                      <TableHead>Complexity Tier</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record, index) => (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.prospectName}</p>
                            {record.company && (
                              <p className="text-sm text-muted-foreground">{record.company}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm">{record.prospectEmail}</p>
                            {record.phone && (
                              <p className="text-sm text-muted-foreground">{record.phone}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <span className="text-lg font-semibold">{record.complexityScore || 0}</span>
                            <span className="text-sm text-muted-foreground">/100</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={record.complexityTier === 'High' ? 'destructive' : record.complexityTier === 'Medium' ? 'default' : 'secondary'}>
                            {record.complexityTier || 'Low'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {formatDaysAgo(record.daysSinceCompletion)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedLeadId(record.id);
                                setDetailsModalOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setLeadToDelete({ id: record.id, name: record.prospectName });
                                setDeleteDialogOpen(true);
                              }}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredRecords.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No leads found
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <LeadDetailsModal
        leadId={selectedLeadId}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteLead}
        title="Delete Lead"
        description={`Are you sure you want to delete ${leadToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete Lead"
        loading={deleting}
      />
    </div>
  );
};

export default SalesDashboard;