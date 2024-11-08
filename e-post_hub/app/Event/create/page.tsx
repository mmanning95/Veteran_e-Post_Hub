import React from 'react';
import EventForm from './EventForm';

export default function CreateEventPage() {
  return (
    <div className='flex items-center justify-center' style={{ height: 'calc(100vh - 64px)' }}>
      <EventForm />
    </div>
  );
}
