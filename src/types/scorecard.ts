export interface BusinessSnapshotData {
  industry?: string[];
  topClients?: string;
  teamSize?: string;
  systemAreas?: string[];
  systemsCount?: number;
  businessAreas?: string[];
  topThreeAreas?: string;
}

export interface SystemPerformanceData {
  q0?: number; // Ease of use
  q1?: number; // Efficiency of workflows
  q2?: number; // Confidence in data accuracy
  q3?: number; // Timeliness of reporting
  q4?: number; // Level of system integration
  q5?: number; // Use of automation
  q6?: number; // Team satisfaction
}

export interface PainPointsData {
  timeConsumingProcesses?: string[];
  biggestFrustrations?: string[];
  topFrustrations?: string;
  urgentFrustration?: string;
  affectedAreas?: string[];
  manualWorkarounds?: 'yes' | 'no';
  workaroundsDescription?: string;
  criticalToFix?: 'low' | 'medium' | 'high';
  supportGrowth?: 'yes' | 'no';
  growthReason?: string;
  growthChallenges?: string;
}

export interface ReportingDecisionsData {
  trackingMethods?: string[];
  criticalReports?: string[];
  reportFrequency?: string[];
  dataConfidence?: number;
  improvementNeeds?: string;
}

export interface VisionPrioritiesData {
  desiredOutcomes?: string[];
  businessImpact?: string[];
  successDefinition?: string;
}

export interface FormData {
  businessSnapshot: BusinessSnapshotData;
  systemPerformance: SystemPerformanceData;
  painPoints: PainPointsData;
  reportingDecisions: ReportingDecisionsData;
  visionPriorities: VisionPrioritiesData;
}

export type ComplexityTier = 'Low' | 'Medium' | 'High';