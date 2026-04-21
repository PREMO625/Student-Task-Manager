'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { AnalyticsSummary, ChartData } from '@/types';

export function useAnalytics() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [charts, setCharts] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [summaryRes, chartsRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/charts'),
      ]);
      setSummary(summaryRes.data.data);
      setCharts(chartsRes.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { summary, charts, isLoading, error, refetch: fetchAnalytics };
}
