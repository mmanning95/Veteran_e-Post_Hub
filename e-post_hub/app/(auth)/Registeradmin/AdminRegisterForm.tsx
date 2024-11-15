//Form used to register Admin accounts

'use client'

import { adminRegisterSchema, AdminRegisterSchema } from '@/lib/schemas/adminRegisterSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react'
import React from 'react'
import { useForm } from 'react-hook-form';
import { GiPadlock } from 'react-icons/gi'

export default function AdminRegisterForm() {
  const {register,handleSubmit, formState: {errors, isValid}} = useForm<AdminRegisterSchema>({
    resolver: zodResolver(adminRegisterSchema),  //look at schema folder for output
    mode: 'onTouched'
  });

  const onSubmit = async (data: AdminRegisterSchema) => {
    //const results = await registerAdminUser(data);
    //console.log(results);
    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { token } = await response.json();
        //save token in local storage or cookies
        localStorage.setItem('token',token);
      }

      //redirect to admin-only page
      window.location.href = '/Admin';

    } catch (error) {
      console.error('An error occurred during registration', error);
      alert('An error occurred while registering the admin.');
    }
  };
  
  return (
    <Card className='w-2/5 mx-auto' >
      <CardHeader className='flex flex-col items-center justify-center'>
        <div className='flex flex-col gap-2 items-center text-orange-500'>
          <div className='flex flex-row items-center gap-3'>
            <GiPadlock size={30} />
            <h1 className='text-3xl font-semibold'>Admin Register</h1>
          </div>
          <p className='text-neutral-500'>Welcome to the Veteran e-Post Hub</p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-4'>
            <Input 
              isRequired
              defaultValue=''
              label = "Name"
              variant='bordered'
              {...register('name')}
              isInvalid = {!!errors.name}
              errorMessage ={errors.name?.message}
              autoComplete='name'
            />
            <Input 

              defaultValue=''
              label = "Office Number"
              variant='bordered'
              {...register('officeNumber')}
              isInvalid = {!!errors.officeNumber}
              errorMessage ={errors.officeNumber?.message}
            />
            <Input 
              defaultValue=''
              label = "Office Hours"
              variant='bordered'
              {...register('officeHours')}
              isInvalid = {!!errors.officeHours}
              errorMessage ={errors.officeHours?.message}
            />
            <Input 
              defaultValue=''
              label = "Office Location"
              variant='bordered'
              {...register('officeLocation')}
              isInvalid = {!!errors.officeLocation}
              errorMessage ={errors.officeLocation?.message}
            />
            <Input 
              isRequired
              defaultValue=''
              label = "Email"
              variant='bordered'
              {...register('email')}
              isInvalid = {!!errors.email}
              errorMessage ={errors.email?.message}
              autoComplete='email'
            />
            <Input 
              isRequired
              defaultValue=''
              label="Password"
              variant='bordered'
              type='password'
              {...register('password')}
              isInvalid = {!!errors.password}
              errorMessage ={errors.password?.message}
            />
            <Input 
              isRequired
              defaultValue=''
              label="Creator Code"
              variant='bordered'
              type='creatorCode'
              {...register('creatorCode')}
              isInvalid = {!!errors.creatorCode}
              errorMessage ={errors.creatorCode?.message}
            />
            <Button isDisabled={!isValid} fullWidth className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black" type='submit'>
              Register Admin
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
