import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
// import { GetAssessmentRecordsOutputType } from 'zite-endpoints-sdk';
import HeroMetrics from './HeroMetrics';
import CompletionTrendsChart from './CompletionTrendsChart';
import StatusDonutChart from './StatusDonutChart';
import LeadAgeProgress from './LeadAgeProgress';
import ComplexityRadial from './ComplexityRadial';

type AssessmentRecord = {
  id: string;
  completionDate?: string;
  tier?: string;
  complexityTier?: string;
  status?: string;
  daysSinceCompletion?: number;
};

interface LeadAnalyticsProps {
  records: AssessmentRecord[];
}

const LeadAnalytics: React.FC<LeadAnalyticsProps> = ({ records }) => {
  const analytics = useMemo(() => {
    if (records.length === 0) {
      return {
        statusData: [],
        completionTrends: [],
        tierData: [],
        ageDistribution: { fresh: 0, warm: 0, stale: 0 },
        conversionRate: '0',
        totalLeads: 0,
        activeLeads: 0,
        averageAge: 0
      };
    }

    // Status distribution
    const statusCounts = records.reduce((acc, record) => {
      const status = record.status || 'New';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: ((count / records.length) * 100).toFixed(1)
    }));

    // Completion trends (last 30 days)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const completionTrends = last30Days.map(date => {
      const completionsOnDate = records.filter(record => {
        try {
          if (!record.completionDate) return false;
          const recordDate = new Date(record.completionDate);
          if (isNaN(recordDate.getTime())) return false;
          return recordDate.toISOString().split('T')[0] === date;
        } catch (error) {
          return false;
        }
      }).length;

      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completions: completionsOnDate
      };
    });

    // Tier distribution
    const tierCounts = records.reduce((acc, record) => {
      acc[record.complexityTier] = (acc[record.complexityTier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tierData = Object.entries(tierCounts).map(([tier, count]) => ({
      tier,
      count,
      percentage: ((count / records.length) * 100).toFixed(1)
    }));

    // Lead age distribution
    const ageDistribution = records.reduce((acc, record) => {
      const days = record.daysSinceCompletion || 0;
      if (days < 3) acc.fresh++;
      else if (days < 7) acc.warm++;
      else acc.stale++;
      return acc;
    }, { fresh: 0, warm: 0, stale: 0 });

    // Conversion metrics
    const closedWon = records.filter(r => r.status === 'Closed Won').length;
    const closedLost = records.filter(r => r.status === 'Closed Lost').length;
    const totalClosed = closedWon + closedLost;
    const conversionRate = totalClosed > 0 ? ((closedWon / totalClosed) * 100).toFixed(1) : '0';

    // Average age
    const totalAge = records.reduce((sum, record) => sum + (record.daysSinceCompletion || 0), 0);
    const averageAge = Math.round(totalAge / records.length);

    return {
      statusData,
      completionTrends,
      tierData,
      ageDistribution,
      conversionRate,
      totalLeads: records.length,
      activeLeads: records.filter(r => !['Closed Won', 'Closed Lost'].includes(r.status || 'New')).length,
      averageAge
    };
  }, [records]);

  if (records.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64 text-muted-foreground"
      >
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No data available</p>
          <p className="text-sm">Analytics will appear once you have lead data</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Metrics */}
      <HeroMetrics
        totalLeads={analytics.totalLeads}
        activeLeads={analytics.activeLeads}
        conversionRate={analytics.conversionRate}
        averageAge={analytics.averageAge}
      />

      {/* Completion Trends - Full Width */}
      <CompletionTrendsChart completionTrends={analytics.completionTrends} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDonutChart statusData={analytics.statusData} />
        <LeadAgeProgress 
          ageDistribution={analytics.ageDistribution}
          totalLeads={analytics.totalLeads}
        />
      </div>

      {/* Complexity Distribution - Full Width */}
      <ComplexityRadial tierData={analytics.tierData} />
    </motion.div>
  );
};

export default LeadAnalytics;