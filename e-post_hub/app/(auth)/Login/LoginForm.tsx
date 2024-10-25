// Form used when loggin in
'use client'

import { loginSchema, LoginSchema } from '@/lib/schemas/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { GiPadlock } from 'react-icons/gi';

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema), // look at schema folder for output
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        // Store the JWT token in localStorage or cookies for future authenticated requests
        localStorage.setItem('token', result.token);
        
        // Redirect the user to the admin page if the login is successful
        window.location.href = '/Admin';
      } else {
        const errorResponse = await response.json();
        alert(`Login failed: ${errorResponse.message}`);
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <Card className='w-2/5 mx-auto'>
      <CardHeader className='flex flex-col items-center justify-center'>
        <div className='flex flex-col gap-2 items-center text-orange-500'>
          <div className='flex flex-row items-center gap-3'>
            <GiPadlock size={30} />
            <h1 className='text-3xl font-semibold'>Login</h1>
          </div>
          <p className='text-neutral-500'>Welcome back to the Veteran e-Post Hub</p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <Input
              defaultValue=''
              label='Email'
              variant='bordered'
              {...register('email')}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message as string}
            />
            <Input
              defaultValue=''
              label='Password'
              variant='bordered'
              type='password'
              {...register('password')}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message as string}
            />
            <Button isDisabled={!isValid} fullWidth className='bg-orange-400 text-white' type='submit'>
              Login
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
