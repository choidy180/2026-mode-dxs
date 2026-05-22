'use client';

import { useEffect, useState } from 'react';

import { INSPECTION_API_URL, POLLING_INTERVAL_MS } from '@/constants/glassGapInspection';
import type { ApiData, InspectionApiResponse, TotalData } from '@/types/glassGapInspection';

interface InspectionPollingState {
  apiData: ApiData | null;
  totalStats: TotalData | null;
  isDefectMode: boolean;
  hasFetched: boolean;
}

export const useInspectionPolling = () => {
  const [state, setState] = useState<InspectionPollingState>({
    apiData: null,
    totalStats: null,
    isDefectMode: false,
    hasFetched: false,
  });

  useEffect(() => {
    let mounted = true;

    const fetchInspectionData = async () => {
      try {
        const response = await fetch(INSPECTION_API_URL);
        const json = (await response.json()) as InspectionApiResponse;

        if (!mounted) {
          return;
        }

        const nextData = json.success && json.data?.length ? json.data[0] : null;
        const nextStats = json.success && json.total_data ? json.total_data : null;

        setState({
          apiData: nextData,
          totalStats: nextStats,
          isDefectMode: Boolean(nextData && nextData.RESULT !== '정상'),
          hasFetched: true,
        });
      } catch (error) {
        console.error('[GlassGapInspection] API polling failed:', error);

        if (mounted) {
          setState((previous) => ({
            ...previous,
            hasFetched: true,
          }));
        }
      }
    };

    fetchInspectionData();
    const intervalId = window.setInterval(fetchInspectionData, POLLING_INTERVAL_MS);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return state;
};
