import { MAX_CAMERA_COUNT } from '@/constants/material-monitoring';
import { VideoGrid } from './styles';
import CameraFrame from './CameraFrame';

type Props = {
  hosts: string[];
  isScanning: boolean;
  onExpand: (num: number) => void;
};

export default function CameraGrid({ hosts, isScanning, onExpand }: Props) {
  return (
    <VideoGrid>
      {Array.from({ length: MAX_CAMERA_COUNT }, (_, index) => index + 1).map(num => (
        <CameraFrame
          key={num}
          num={num}
          host={hosts[num - 1]}
          isScanning={isScanning}
          onExpand={() => onExpand(num)}
        />
      ))}
    </VideoGrid>
  );
}
