import { useCallback, useEffect, useRef, useState } from 'react';
import { API_URL_MATERIAL_LIST } from '@/constants/material-monitoring';
import { DUMMY_INSPECTION_LOGS } from '@/data/dummy-inspection-logs';
import type { MaterialListItem } from '@/types/material-monitoring';
import { createLiveDummyLog, getMaterialStats, makeMaterialKey } from '@/utils/material-monitoring';

export function useMaterialData() {
  const [materialList, setMaterialList] = useState<MaterialListItem[]>(DUMMY_INSPECTION_LOGS);
  const [inspectionLogs, setInspectionLogs] = useState<MaterialListItem[]>(DUMMY_INSPECTION_LOGS);
  const [pendingList, setPendingList] = useState<MaterialListItem[]>(DUMMY_INSPECTION_LOGS.filter(item => item.InspConf !== 'Y' && item.QmConf !== 'Y'));
  const [materialStats, setMaterialStats] = useState(getMaterialStats(DUMMY_INSPECTION_LOGS));
  const [isMaterialLoading, setIsMaterialLoading] = useState(false);
  const [materialError, setMaterialError] = useState<string | null>(null);
  const dummyLogIndexRef = useRef(DUMMY_INSPECTION_LOGS.length);

  // 테스트 로그 5초 누적
  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextLog = createLiveDummyLog(dummyLogIndexRef.current);
      dummyLogIndexRef.current += 1;
      setInspectionLogs(prev => [nextLog, ...prev].slice(0, 40));
      setMaterialList(prev => [nextLog, ...prev].slice(0, 80));
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  // 리스트/통계 동기화
  useEffect(() => {
    setPendingList(materialList.filter(item => item.InspConf !== 'Y' && item.QmConf !== 'Y'));
    setMaterialStats(getMaterialStats(materialList));
  }, [materialList]);

  // 자재 API 조회
  const fetchMaterialData = useCallback(async () => {
    setMaterialError(null);
    setIsMaterialLoading(true);

    try {
      const res = await fetch(API_URL_MATERIAL_LIST);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      const json = await res.json();
      const data = (Array.isArray(json) ? json : []).filter((item: MaterialListItem) => !item.NmCustm?.includes('대일화학'));
      const displayData = data.length ? data : DUMMY_INSPECTION_LOGS;

      setMaterialList(displayData);

      if (data.length) {
        setInspectionLogs(prev => {
          const seen = new Set<string>();
          return [...data, ...prev].filter((item, index) => {
            const key = makeMaterialKey(item, index);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          }).slice(0, 40);
        });
      }
    } catch (error) {
      console.error(error);
      setMaterialError(null);
      setMaterialList(DUMMY_INSPECTION_LOGS);
    } finally {
      setIsMaterialLoading(false);
    }
  }, []);

  return {
    materialList,
    pendingList,
    inspectionLogs,
    materialStats,
    isMaterialLoading,
    materialError,
    fetchMaterialData
  };
}
