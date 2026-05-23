'use client';

import { useEffect, useState } from 'react';
import { INSPECTION_API_URL } from '@/constants/smartFactoryViewer';
import { createMockApiData } from '@/data/smartFactoryViewer';
import type { ApiDataItem } from '@/types/smartFactoryViewer';
import { normalizeApiItem } from '@/utils/smartFactoryViewer';

interface ApiResponse {
  success?: boolean;
  data?: Partial<ApiDataItem>[];
}

export const useSmartFactoryData = () => {
  const [apiData, setApiData] = useState<ApiDataItem[]>([]);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch(INSPECTION_API_URL, {
          cache: 'no-store',
        });
        const json = (await response.json()) as ApiResponse;

        if (!mounted) return;

        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setApiData(json.data.map(normalizeApiItem));
          setIsFallback(false);
          return;
        }

        setApiData(createMockApiData());
        setIsFallback(true);
      } catch (error) {
        if (!mounted) return;
        console.error('Failed to fetch smart factory data:', error);
        setApiData(createMockApiData());
        setIsFallback(true);
      }
    };

    fetchData();
    const intervalId = window.setInterval(fetchData, 5000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return {
    apiData,
    isFallback,
  };
};
