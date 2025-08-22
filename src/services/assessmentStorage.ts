import { FormData } from '../types/scorecard';

export interface AssessmentSubmission {
  id: string;
  userId?: string;
  trackingId?: string;
  source?: string;
  campaign?: string;
  formData: FormData;
  score: number;
  tier: string;
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

class AssessmentStorage {
  private storageKey = 'assessment_submissions';

  // Get all submissions from localStorage
  getSubmissions(): AssessmentSubmission[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading submissions from storage:', error);
      return [];
    }
  }

  // Save a new submission
  saveSubmission(submission: Omit<AssessmentSubmission, 'id' | 'submittedAt'>): AssessmentSubmission {
    const newSubmission: AssessmentSubmission = {
      ...submission,
      id: this.generateId(),
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    try {
      const submissions = this.getSubmissions();
      submissions.push(newSubmission);
      localStorage.setItem(this.storageKey, JSON.stringify(submissions));
      
      // Also send to console for debugging
      console.log('Assessment submitted:', {
        userId: newSubmission.userId,
        trackingId: newSubmission.trackingId,
        score: newSubmission.score,
        tier: newSubmission.tier,
        submittedAt: newSubmission.submittedAt
      });

      return newSubmission;
    } catch (error) {
      console.error('Error saving submission:', error);
      throw new Error('Failed to save assessment submission');
    }
  }

  // Get submissions by userId
  getSubmissionsByUserId(userId: string): AssessmentSubmission[] {
    return this.getSubmissions().filter(sub => sub.userId === userId);
  }

  // Get submissions by trackingId
  getSubmissionsByTrackingId(trackingId: string): AssessmentSubmission[] {
    return this.getSubmissions().filter(sub => sub.trackingId === trackingId);
  }

  // Export submissions as JSON for external system integration
  exportSubmissions(): string {
    return JSON.stringify(this.getSubmissions(), null, 2);
  }

  // Clear all submissions (for testing)
  clearSubmissions(): void {
    localStorage.removeItem(this.storageKey);
  }

  // Generate unique ID
  private generateId(): string {
    return `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // API simulation - in real implementation, this would call your backend
  async submitToAPI(submission: AssessmentSubmission): Promise<boolean> {
    try {
      // Simulate API call
      console.log('Submitting to API:', submission);
      
      // In real implementation, replace with:
      // const response = await fetch('/api/assessments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submission)
      // });
      // return response.ok;
      
      return true;
    } catch (error) {
      console.error('API submission failed:', error);
      return false;
    }
  }
}

export const assessmentStorage = new AssessmentStorage();
