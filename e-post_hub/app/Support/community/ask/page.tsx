'use client'
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Checkbox, Input, Textarea, Divider } from '@nextui-org/react';

export default function AskPage() {
  const [isPrivate, setIsPrivate] = useState(true);
  
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <Card className="w-2/3 p-5 border border-orange-300 ">
        <CardHeader>
          <div className="flex flex-col gap-3">
            <Checkbox
              isSelected={!isPrivate}
              onChange={() => setIsPrivate(false)}
              color="primary"
            >
              Public
              <p className='text-xs text-gray-500'>Posted to the community page </p>
            </Checkbox>
            <Divider style={{ backgroundColor: 'orange' }} />
            <Checkbox
              isSelected={isPrivate}
              onChange={() => setIsPrivate(true)}
              color="primary"
            >
              Private
              <p className="text-xs text-gray-500">Sends an email privately to someone who can help</p>
            </Checkbox>
          </div>
        </CardHeader>
        <CardBody>
          {isPrivate && (
            <Input
              isRequired
              placeholder="Your contact email"
              variant="bordered"
              className="mb-4"
            />
          )}
          <Textarea
            isRequired
            placeholder="Please enter the details of your question here."
            variant="bordered"
          />
        </CardBody>
        <CardFooter>
          <Button className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] text-white w-full">
            Post Question
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
