// ../Components/Calendar/EventCalendar.tsx
import React, { useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type EventCalendarProps = {
  events: {
    id: string;
    title: string;
    startDate?: string; // Allow startDate to be string or undefined
    endDate?: string; // Allow endDate to be string or undefined
  }[];
  onDateClick: (date: string) => void;
};

export default function EventCalendar({ events, onDateClick }: EventCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      // Call the callback function to handle click
      const formattedDate = value.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
      onDateClick(formattedDate);
    }
  };

  const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
    return date >= startDate && date <= endDate;
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={({ date }) => {
          // Format the date for comparison
          const dateStr = date.toISOString().split('T')[0];

          // Check if the date falls within the range of any event
          const eventsOnDate = events.filter((event) => {
            if (!event.startDate) return false;

            const startDate = new Date(event.startDate);
            const endDate = event.endDate ? new Date(event.endDate) : startDate;

            // Check if the current calendar date is between the start and end date (inclusive)
            return isDateInRange(date, startDate, endDate);
          });

          // If there's an event that falls on this date, return a dot
          if (eventsOnDate.length > 0) {
            return <div className="event-dot" style={{ color: 'red' }}>•</div>;
          }

          return null;
        }}
      />
    </div>
  );
}
