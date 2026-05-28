// 이름에서 'use'를 빼고 일반 함수로 만듭니다.
export function useVehicleImageUrl(filePath) {
  if (!filePath) return '';

  // window 객체가 없는 환경(SSR 등) 방어 코드
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  
  const baseImageUrl = isLocalhost 
    ? 'https://gapi.dxsplatform.com' 
    : 'http://192.168.2.147:24828';

  // 1. 배포환경 주소가 포함되어 있다면 삭제
  let purePath = filePath.replace('http://192.168.2.147:24828', '');
  
  // 2. 개발환경 주소가 포함되어 있다면 이것도 삭제
  purePath = purePath.replace('https://gapi.dxsplatform.com', '');
  
  // 3. 앞부분에 슬래시(/)가 없다면 붙여서 안전하게 경로를 결합
  const cleanPath = purePath.startsWith('/') ? purePath : `/${purePath}`;
  
  return `${baseImageUrl}${cleanPath}`;
}