import { useMemo } from 'react';

export function useVehicleImageUrl(filePath) {
  const baseImageUrl = useMemo(() => {
    const isLocalhost = window.location.hostname === 'localhost';
    return isLocalhost 
      ? 'https://gapi.dxsplatform.com' 
      : 'http://192.168.2.147:24828';
  }, []);

  if (!filePath) return '';

  // 1. 배포환경 주소가 포함되어 있다면 삭제
  let purePath = filePath.replace('http://192.168.2.147:24828', '');
  
  // 2. 개발환경 주소가 포함되어 있다면 이것도 삭제 (중복 방지 🔥)
  purePath = purePath.replace('https://gapi.dxsplatform.com', '');
  
  // 3. 앞부분에 슬래시(/)가 없다면 붙여서 안전하게 경로를 결합
  const cleanPath = purePath.startsWith('/') ? purePath : `/${purePath}`;
  
  return `${baseImageUrl}${cleanPath}`;
}