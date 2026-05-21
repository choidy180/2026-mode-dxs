import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_STREAM_HOSTS, MAX_CAMERA_COUNT, PORT } from '@/constants/material-monitoring';

export function useCameraHosts() {
  const [hosts, setHosts] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const [scanVersion, setScanVersion] = useState(0);

  // 입력 IP 중 최대 6개 카메라 연결 확인
  const scan = useCallback(async () => {
    if (hosts.length) return;

    const candidates = DEFAULT_STREAM_HOSTS.split(',')
      .map(ip => ip.trim())
      .filter(Boolean)
      .slice(0, MAX_CAMERA_COUNT);

    if (!candidates.length) {
      setScanMessage('IP를 입력해주세요.');
      return;
    }

    setIsScanning(true);
    setScanMessage('카메라 신호를 찾는 중...');

    const found: string[] = [];

    for (const ip of candidates) {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 2000);

      try {
        setScanMessage(`${ip} 연결 확인 중...`);
        await fetch(`http://${ip}:${PORT}/`, {
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal
        });
        found.push(ip);
      } catch (error) {
        console.log(`Failed to connect to ${ip}`, error);
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    setHosts(found);
    setScanMessage(found.length ? `${found.length}개 카메라 연결됨` : '연결 가능한 카메라가 없습니다.');
    setIsScanning(false);
  }, [hosts.length]);

  useEffect(() => {
    if (!hosts.length) scan();
  }, [hosts.length, scan, scanVersion]);

  const retry = useCallback(() => {
    setHosts([]);
    setScanVersion(value => value + 1);
  }, []);

  return {
    hosts,
    connectedIp: hosts[0] || null,
    isScanning,
    scanMessage,
    retry
  };
}
