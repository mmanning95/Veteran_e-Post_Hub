'use client'
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Checkbox, Textarea, Divider } from '@nextui-org/react';

export default function AskPage() {
  const [isPrivate, setIsPrivate] = useState(true);
  const [text, setText] = useState('');

  const handlePostQuestion = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to post a question.');
        return;
      }

      const response = await fetch('/api/community/question/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text, isPrivate }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Question posted successfully');
        // Optionally reset form fields here
      } else {
        alert(`Failed to post question: ${result.message}`);
      }
    } catch (error) {
      console.error('Error posting question:', error);
      alert('An error occurred while posting the question.');
    }
  };

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
          <Textarea
            isRequired
            placeholder="Please enter the details of your question here."
            variant="bordered"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </CardBody>
        <CardFooter>
          <Button
            className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] text-white w-full"
            onClick={handlePostQuestion}
          >
            Post Question
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
