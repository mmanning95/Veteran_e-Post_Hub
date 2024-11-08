// Form used when loggin in
'use client';

import { createEventSchema, CreateEventSchema } from '@/lib/schemas/createEventSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Card, CardBody, CardHeader, Input, Textarea } from '@nextui-org/react';
import React from 'react';

export default function EventForm() {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<CreateEventSchema>({
    //resolver: zodResolver(createEventSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: CreateEventSchema) => {
    try {
      const response = await fetch('/api/Event/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure this header is being set correctly
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Event successfully created!');
        // Redirect to event listing or a specific event page after successful creation
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
              label='Event Website'
              variant='bordered'
              {...register('website')}
              errorMessage={errors.website?.message}
            />

            <Input
              label='Event Title'
              variant='bordered'
              {...register('title')}
              errorMessage={errors.title?.message}
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
            
            <Input
              label='Event Time'
              variant='bordered'
              {...register('time')}
              errorMessage={errors.time?.message}
            />

            <Textarea
              label='Event Description'
              variant='bordered'
              {...register('description')}
              errorMessage={errors.description?.message}
            />

            <Input
              label='Event Flyer (URL)'
              variant='bordered'
              {...register('flyer')}
              errorMessage={errors.flyer?.message}
            />

            <Button isDisabled={!isValid} fullWidth type='submit' className='bg-orange-400 text-white'>
              Submit Event
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
