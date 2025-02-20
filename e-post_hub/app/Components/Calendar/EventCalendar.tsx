import React, { useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type EventCalendarProps = {
  events: {
    id: string;
    title: string;
    startDate?: string;
    endDate?: string;
  }[];
  onDateClick: (date: string) => void;
};

export default function EventCalendar({ events, onDateClick }: EventCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      const formattedDate = value.toISOString().split('T')[0];
      onDateClick(formattedDate);
    }
  };

  const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
    return date >= startDate && date <= endDate;
  };

  return (
    <div className="calendar-container  rounded-lg shadow-md p-4">
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        locale="en-US" 
        tileContent={({ date }) => {
          const dateStr = date.toISOString().split("T")[0];
          const eventsOnDate = events.filter((event) => {
            if (!event.startDate) return false;
            const startDate = new Date(event.startDate);
            const endDate = event.endDate ? new Date(event.endDate) : startDate;
            return isDateInRange(date, startDate, endDate);
          });
        
          if (eventsOnDate.length > 0) {
            return (
              <div className="relative flex justify-center">
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-semibold px-[4px] py-[1px] rounded-full leading-none">
                  {eventsOnDate.length}
                </span>
              </div>
            );
          }
          return null;
        }}
                tileClassName={({ date }) => {
          const dateStr = date.toISOString().split('T')[0];
          const isEventDate = events.some((event) => {
            if (!event.startDate) return false;
            const startDate = new Date(event.startDate).toISOString().split('T')[0];
            const endDate = event.endDate
              ? new Date(event.endDate).toISOString().split('T')[0]
              : startDate;
            return dateStr >= startDate && dateStr <= endDate;
          });

          return isEventDate
            ? 'bg-orange-500 text-black font-semibold hover:bg-orange-600 transition'
            : 'hover:bg-white hover:text-black transition';
        }}
        className="border-none"
      />
    </div>
  );
}
