import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface UrlParams {
  userId?: string;
  trackingId?: string;
  source?: string;
  campaign?: string;
}

export const useUrlParams = (): UrlParams => {
  const location = useLocation();
  const [params, setParams] = useState<UrlParams>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    const extractedParams: UrlParams = {
      userId: searchParams.get('userId') || searchParams.get('uid') || undefined,
      trackingId: searchParams.get('trackingId') || searchParams.get('tid') || undefined,
      source: searchParams.get('source') || searchParams.get('src') || undefined,
      campaign: searchParams.get('campaign') || searchParams.get('utm_campaign') || undefined,
    };

    // Store in localStorage for persistence across page reloads
    if (extractedParams.userId) {
      localStorage.setItem('assessment_userId', extractedParams.userId);
    }
    if (extractedParams.trackingId) {
      localStorage.setItem('assessment_trackingId', extractedParams.trackingId);
    }
    if (extractedParams.source) {
      localStorage.setItem('assessment_source', extractedParams.source);
    }
    if (extractedParams.campaign) {
      localStorage.setItem('assessment_campaign', extractedParams.campaign);
    }

    setParams(extractedParams);
  }, [location.search]);

  // Fallback to localStorage if no URL params
  useEffect(() => {
    if (!params.userId && !params.trackingId) {
      const storedParams: UrlParams = {
        userId: localStorage.getItem('assessment_userId') || undefined,
        trackingId: localStorage.getItem('assessment_trackingId') || undefined,
        source: localStorage.getItem('assessment_source') || undefined,
        campaign: localStorage.getItem('assessment_campaign') || undefined,
      };
      setParams(storedParams);
    }
  }, [params]);

  return params;
};
