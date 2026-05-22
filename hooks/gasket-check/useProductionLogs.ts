'use client';

import { useEffect, useState } from 'react';
import { createDummyProductionLogs, createNextDummyLog } from '@/data/gasketCheckLogs';
import type { SystemLog } from '@/types/gasketCheck';

export function useProductionLogs() {
    const [logs, setLogs] = useState<SystemLog[]>([]);

    useEffect(() => {
        setLogs(createDummyProductionLogs());
    }, []);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setLogs((prevLogs) => {
                const nextId = (prevLogs[0]?.id ?? 0) + 1;
                return [createNextDummyLog(nextId), ...prevLogs].slice(0, 80);
            });
        }, 5000);

        return () => window.clearInterval(intervalId);
    }, []);

    return logs;
}
