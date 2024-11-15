'use client';

import { createEventSchema, CreateEventSchema } from '@/lib/schemas/createEventSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Card, CardBody, CardHeader, Input, Textarea, TimeInput } from '@nextui-org/react';
import { Time } from '@internationalized/date';
import React, { useState } from 'react';

export default function EventForm() {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<CreateEventSchema>({
    //resolver: zodResolver(createEventSchema),
    mode: 'onTouched',
  });

  // States to store the time values for start and end time
  const [startTime, setStartTime] = useState<Time | null>(null);
  const [endTime, setEndTime] = useState<Time | null>(null);

  // State for displaying success or error messages
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(fullData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Event successfully created!' });
        //redirect after some time
        setTimeout(() => {
          window.location.href = '/Event/create';
        }, 3000);
      } else {
        const errorResponse = await response.json();
        setMessage({ type: 'error', text: `Event creation failed: ${errorResponse.message}` });
      }
    } catch (error) {
      console.error('An error occurred while creating the event:', error);
      setMessage({ type: 'error', text: 'An error occurred while creating the event.' });
    }
  };

  return (
    <Card className='w-2/5 mx-auto'>
      <CardHeader className='flex flex-col items-center justify-center'>
        <h3 className='text-3xl font-semibold'>Create New Event</h3>
      </CardHeader>
      <CardBody>
        {/* Message Display */}
        {message && (
          <div
            className={`mb-4 p-4 rounded ${
              message.type === 'success' ? ' text-green-600' : ' text-red-600'
            }`}
          >
            {message.text}
          </div>
        )}
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
            <div className='flex gap-4'>
              <TimeInput
                label="Event Start Time"
                value={startTime}
                variant='bordered'
                onChange={(newValue) => setStartTime(newValue)}
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
            <Button isDisabled={!isValid} fullWidth type='submit' 
                className='bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black'>
              Submit Event
            </Button>
            <div className="text-[#757575]" style={{ fontSize: '12px' }}>
              Note: Either (title and description) or (title and flyer) is required for flyer submissions. Additional information is encouraged.
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
