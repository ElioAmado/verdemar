// Calendar.tsx
import React, { useState } from 'react';
import { CalendarProps } from './date-range-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from "@/contexts/language-context";

const Calendar: React.FC<CalendarProps> = ({
  initialStartDate = null,
  initialEndDate = null,
  onRangeChange,
  numberOfMonths
}) => {

  const { t } = useLanguage()
  const daysOfWeek: string[] = t('calendar.daysOfWeek');

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleDateClick = (day: number, mounthStep: number) => {
    const yearStep = mounthStep == -11 ? 1 : 0;
    const realYear = currentYear + yearStep;
    const realMonth = currentMonth + mounthStep;
    const selectedDate = new Date(realYear, realMonth, day);

    if (!startDate || (startDate && endDate)) {
      setStartDate(selectedDate);
      setEndDate(null);
      if (onRangeChange) onRangeChange({ from: selectedDate, to: undefined });
    } else if (selectedDate <= startDate) {
      setStartDate(selectedDate);
      setEndDate(null);
      if (onRangeChange) onRangeChange({ from: selectedDate, to: undefined });
    } else {
      setEndDate(selectedDate);
      if (onRangeChange) onRangeChange({ from: startDate, to: selectedDate });
    }

    // console.log('Selected Dates:', {
    //   selectedDate: selectedDate ? selectedDate.toLocaleDateString() : null,
    //   yearStep: yearStep,
    //   monthStep: mounthStep,
    // });

  };

  const isInRange = (day: number, mounthStep: number): boolean => {
    const yearStep = mounthStep == -11 ? 1 : 0;
    if (!startDate || !endDate) return false;
    const current = new Date(currentYear + yearStep, currentMonth + mounthStep, day).getTime();
    return current > startDate.getTime() && current < endDate.getTime();
  };



  const isSameDay = (date: Date | null, day: number, mounthStep: number): boolean => {
    const yearStep = mounthStep == -11 ? 1 : 0;
    return (
      !!date &&
      date.getDate() === day &&
      date.getMonth() === currentMonth + mounthStep &&
      date.getFullYear() === currentYear + yearStep
    );
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = t('calendar.monthNames');

  const gridMonth = (mounthStep: number, changeMounth: number = 0) => {
    let yearStep = 0;
    if (currentMonth + mounthStep > 11) {
      yearStep = 1;
      mounthStep = -11;
    }
    const realYear = currentYear + yearStep;
    const realMonth = currentMonth + mounthStep;
    const firstDayOfMonth = new Date(realYear, realMonth, 0).getDay();
    const daysInMonth = getDaysInMonth(realMonth, realYear);

    const showPrevMonth = () => {
      if (changeMounth == 1 || changeMounth == 0) {
        return (
          <button onClick={prevMonth}>
            <ChevronLeft />
          </button>
        )
      } else {
        return (
          <div></div>
        )
      }
    }

    const showNextMonth = () => {
      if (changeMounth == 2 || changeMounth == 0) {
        return (
          <button onClick={nextMonth}>
            <ChevronRight />
          </button>
        )
      } else {
        return (
          <div></div>
        )
      }
    }

    return (
      <div>
        <div className="flex items-center justify-between">
          {showPrevMonth()}
          <h2>{monthNames[realMonth]} {realYear}</h2>
          {showNextMonth()}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginTop: '10px' }}>
          {daysOfWeek.map(day => (
            <div key={day} style={{ fontWeight: 'bold' }}>{day.slice(0, 2)}</div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isStart = isSameDay(startDate, day, mounthStep);
            const isEnd = isSameDay(endDate, day, mounthStep);
            const inRange = isInRange(day, mounthStep);

            const backgroundColor = isStart || isEnd
              ? '#4caf50'
              : inRange
                ? '#c8e6c9'
                : '#f0f0f0';

            const textColor = isStart || isEnd ? 'white' : 'black';

            return (
              <div
                key={day}
                onClick={() => handleDateClick(day, mounthStep)}
                style={{
                  padding: '8px',
                  backgroundColor,
                  color: textColor,
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: 'auto', textAlign: 'center', margin: '20px' }}>
      <div className='flex gap-6 justify-center'>
        {
        // Usando un ciclo 'map'
          numberOfMonths == 1 ? gridMonth(0, 0) : (
          Array.from({ length: numberOfMonths }).map((_, i) => (
            <div key={i}>
              {gridMonth(i, i+1)}
            </div>
          )))
        }
      </div>
    </div>
  );
};

export default Calendar;
