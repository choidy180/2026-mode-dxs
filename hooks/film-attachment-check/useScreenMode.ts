'use client';

import { useEffect, useState } from 'react';
import type { ScreenMode } from '@/types/gasketCheck';

export function useScreenMode() {
    const [screenMode, setScreenMode] = useState<ScreenMode>('FHD');

    useEffect(() => {
        const handleResize = () => {
            setScreenMode(window.innerWidth > 2200 ? 'QHD' : 'FHD');
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenMode;
}
