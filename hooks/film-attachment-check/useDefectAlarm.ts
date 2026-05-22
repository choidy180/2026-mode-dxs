'use client';

import { useEffect, useRef } from 'react';

type AudioWindow = Window & typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
};

export function useDefectAlarm(isActive: boolean, isAllowed: boolean) {
    const audioContextRef = useRef<AudioContext | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!isActive || !isAllowed) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            return;
        }

        const AudioContextConstructor = window.AudioContext || (window as AudioWindow).webkitAudioContext;

        if (!AudioContextConstructor) {
            return;
        }

        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContextConstructor();
        }

        const playBeep = () => {
            const context = audioContextRef.current;

            if (!context) {
                return;
            }

            if (context.state === 'suspended') {
                context.resume();
            }

            const oscillator = context.createOscillator();
            const gain = context.createGain();

            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(880, context.currentTime);
            oscillator.connect(gain);
            gain.connect(context.destination);
            gain.gain.setValueAtTime(0.1, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.15);
            oscillator.start();
            oscillator.stop(context.currentTime + 0.15);
        };

        playBeep();
        intervalRef.current = setInterval(playBeep, 500);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isActive, isAllowed]);
}
