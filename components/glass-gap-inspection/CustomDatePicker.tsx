'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import {
  CalendarDayButton,
  CalendarDayGrid,
  CalendarEmptyCell,
  CalendarHeader,
  CalendarMonthLabel,
  CalendarNavButton,
  CalendarPanel,
  CalendarWeekGrid,
  CalendarWeekName,
  DatePickerChevron,
  DatePickerRoot,
  DatePickerTrigger,
  DatePickerValue,
} from '@/styles/glassGapInspection.styles';
import { glassGapTheme } from '@/styles/glassGapInspection.theme';

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function CustomDatePicker({ value, onChange }: CustomDatePickerProps) {
  const initialDate = value ? new Date(value) : new Date();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const days = useMemo(() => {
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const nextDays: Array<number | null> = [];

    for (let index = 0; index < firstDayOfWeek; index += 1) {
      nextDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      nextDays.push(day);
    }

    return nextDays;
  }, [viewMonth, viewYear]);

  const formattedDate = useMemo(() => {
    if (!value) {
      return '날짜를 선택하세요';
    }

    return new Date(value).toLocaleDateString('ko-KR', {
      day: 'numeric',
      month: 'long',
      weekday: 'short',
      year: 'numeric',
    });
  }, [value]);

  const handlePrevMonth = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((previous) => previous - 1);
      return;
    }

    setViewMonth((previous) => previous - 1);
  };

  const handleNextMonth = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((previous) => previous + 1);
      return;
    }

    setViewMonth((previous) => previous + 1);
  };

  const handleSelectDate = (day: number) => {
    const monthValue = String(viewMonth + 1).padStart(2, '0');
    const dayValue = String(day).padStart(2, '0');

    onChange(`${viewYear}-${monthValue}-${dayValue}`);
    setIsOpen(false);
  };

  return (
    <DatePickerRoot ref={containerRef}>
      <DatePickerTrigger type="button" $open={isOpen} onClick={() => setIsOpen((previous) => !previous)}>
        <Calendar size={20} color={glassGapTheme.accent} />
        <DatePickerValue>{formattedDate}</DatePickerValue>
        <DatePickerChevron $open={isOpen}>
          <ChevronDown size={18} />
        </DatePickerChevron>
      </DatePickerTrigger>

      {isOpen && (
        <CalendarPanel>
          <CalendarHeader>
            <CalendarNavButton type="button" onClick={handlePrevMonth} aria-label="이전 달">
              <ChevronLeft size={20} />
            </CalendarNavButton>
            <CalendarMonthLabel>{viewYear}년 {viewMonth + 1}월</CalendarMonthLabel>
            <CalendarNavButton type="button" onClick={handleNextMonth} aria-label="다음 달">
              <ChevronRight size={20} />
            </CalendarNavButton>
          </CalendarHeader>

          <CalendarWeekGrid>
            {WEEK_DAYS.map((day, index) => (
              <CalendarWeekName
                key={day}
                $weekend={index === 0 ? 'sun' : index === 6 ? 'sat' : undefined}
              >
                {day}
              </CalendarWeekName>
            ))}
          </CalendarWeekGrid>

          <CalendarDayGrid>
            {days.map((day, index) => {
              if (!day) {
                return <CalendarEmptyCell key={`empty-${index}`} />;
              }

              const dateValue = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = value === dateValue;
              const isToday = new Date().toDateString() === new Date(viewYear, viewMonth, day).toDateString();

              return (
                <CalendarDayButton
                  key={dateValue}
                  type="button"
                  $selected={isSelected}
                  $today={isToday}
                  onClick={() => handleSelectDate(day)}
                >
                  {day}
                </CalendarDayButton>
              );
            })}
          </CalendarDayGrid>
        </CalendarPanel>
      )}
    </DatePickerRoot>
  );
}
