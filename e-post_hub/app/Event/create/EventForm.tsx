'use client';

import { createEventSchema, CreateEventSchema } from '@/lib/schemas/createEventSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Card, CardBody, CardHeader, Input, Textarea, TimeInput } from '@nextui-org/react';
import { Time } from '@internationalized/date'; // Importing Time
import React, { useState } from 'react';

export default function EventForm() {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<CreateEventSchema>({
    //resolver: zodResolver(createEventSchema), // Make sure the resolver is uncommented
    mode: 'onTouched',
  });

  // States to store the time values for start and end time
  const [startTime, setStartTime] = useState<Time | null>(null);
  const [endTime, setEndTime] = useState<Time | null>(null);

  const onSubmit = async (data: CreateEventSchema) => {
    try {
      // Format startTime and endTime to include AM/PM information
      const formattedStartTime = startTime
        ? `${startTime.hour % 12 || 12}:${startTime.minute.toString().padStart(2, '0')} ${startTime.hour >= 12 ? 'PM' : 'AM'}`
        : null;
  
      const formattedEndTime = endTime
        ? `${endTime.hour % 12 || 12}:${endTime.minute.toString().padStart(2, '0')} ${endTime.hour >= 12 ? 'PM' : 'AM'}`
        : null;
  
      const fullData = {
        ...data,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      };
  
      const response = await fetch('/api/Event/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure this header is being set correctly
        },
        body: JSON.stringify(fullData),
      });
  
      if (response.ok) {
        alert('Event successfully created!');
        // Redirect to fresh create event page after successful creation
        window.location.href = '/Event/create';
      } else {
        const errorResponse = await response.json();
        alert(`Event creation failed: ${errorResponse.message}`);
      }
    } catch (error) {
      console.error('An error occurred while creating the event:', error);
      alert('An error occurred while creating the event.');
    }
  };
  

  return (
    <Card className='w-2/5 mx-auto'>
      <CardHeader className='flex flex-col items-center justify-center'>
        <h3 className='text-3xl font-semibold'>Create New Event</h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>

          <Input
              isRequired
              isClearable
              label='Event Title'
              variant='bordered'
              {...register('title')}
              errorMessage={errors.title?.message}
            />

          <Input
              label='Event Flyer (URL)'
              variant='bordered'
              {...register('flyer')}
              errorMessage={errors.flyer?.message}
            />

            <div className='flex gap-4'>
              <Input
                type='date'
                label='Start Date'
                variant='bordered'
                {...register('startDate')}
                errorMessage={errors.startDate?.message}
              />

              <Input
                type='date'
                label='End Date'
                variant='bordered'
                {...register('endDate')}
                errorMessage={errors.endDate?.message}
              />
            </div>

            {/* Time Inputs for Start and End Time https://nextui.org/docs/components/time-input*/}
            <div className='flex gap-4'>
              <TimeInput
                label="Event Start Time"
                value={startTime}
                variant='bordered'
                onChange={(newValue) => setStartTime(newValue)} // Set the new value to the state
                errorMessage={errors.startTime?.message} 
              />

              <TimeInput
                label="Event End Time"
                value={endTime}
                variant='bordered'
                onChange={(newValue) => setEndTime(newValue)}
                errorMessage={errors.endTime?.message}
              />
            </div>

            <Textarea
              
              label='Event Description'
              variant='bordered'
              {...register('description')}
              errorMessage={errors.description?.message}
            />

            <Input
              label='Event Website'
              variant='bordered'
              {...register('website')}
              errorMessage={errors.website?.message}
              placeholder='For the use of external webpages'
            />

            <Button isDisabled={!isValid} fullWidth type='submit' className='bg-orange-400 text-white'>
              Submit Event
            </Button>

          <div className = "text-[#757575]" style={{ fontSize: '12px' }}>
            Note: Either (title and description) or (title and flyer) is required for flyer submissions. Additional information is encouraged            </div>
          </div>
        </form>
        
      </CardBody>
    </Card>
  );
}
