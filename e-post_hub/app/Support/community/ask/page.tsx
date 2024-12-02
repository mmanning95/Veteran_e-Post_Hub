'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Checkbox, Textarea, Input, Divider } from '@nextui-org/react';

export default function AskPage() {
  const [isPrivate, setIsPrivate] = useState(true);
  const [text, setText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking for a token
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handlePostQuestion = async () => {
    try {
      let questionData;

      // Handle non-logged-in user input validation
      if (!isLoggedIn) {
        if (isPrivate) {
          // For private questions, both name and contact email are required
          if (!name || !contactEmail) {
            alert('Please provide both your name and contact email for private questions.');
            return;
          }
          // Set question data for private questions
          questionData = {
            text,
            isPrivate,
            username: name,
            contactEmail: contactEmail,
          };
        } else {
          // For public questions
          if (anonymous) {
            // Set default values for anonymous posting
            questionData = {
              text,
              isPrivate,
              username: 'Anonymous',
              contactEmail: 'placeholder@email.com',
            };
          } else {
            // If not posting anonymously, both name and email must be provided
            if (!name || !contactEmail) {
              alert('Please provide your name and email for public questions, or select anonymous.');
              return;
            }
            questionData = {
              text,
              isPrivate,
              username: name,
              contactEmail: contactEmail,
            };
          }
        }
      } else {
        // For logged-in users, only require the text and privacy setting
        questionData = {
          text,
          isPrivate,
        };
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/community/question/create', {
        method: 'POST',
        headers,
        body: JSON.stringify(questionData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Question posted successfully');
        // Optionally reset form fields here
        setText('');
        setName('');
        setContactEmail('');
        setAnonymous(false);
        setIsPrivate(true);
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
              onChange={() => {
                setIsPrivate(false);
                setContactEmail('');
              }}
              color="primary"
            >
              Public
              <p className='text-xs text-gray-500'>Posted to the community page</p>
            </Checkbox>
            <Divider style={{ backgroundColor: 'orange' }} />
            <Checkbox
              isSelected={isPrivate}
              onChange={() => {
                setIsPrivate(true);
                setAnonymous(false);
                setName('');
              }}
              color="primary"
            >
              Private
              <p className="text-xs text-gray-500">Sends an email privately to someone who can help</p>
            </Checkbox>
          </div>
        </CardHeader>
        <CardBody>
          {!isLoggedIn && (
            <div className="flex flex-col gap-4 mb-4">
              {isPrivate ? (
                <>
                  <Input
                    isRequired
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-2"
                  />
                  <Input
                    isRequired
                    placeholder="Enter your contact email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <Checkbox
                    isSelected={anonymous}
                    onChange={() => {
                      setAnonymous(!anonymous);
                      if (anonymous) {
                        setName('Anonymous');
                        setContactEmail('placeholder@email.com');
                      } else {
                        setName('');
                        setContactEmail('');
                      }
                    }}
                    color="primary"
                  >
                    Post anonymously
                  </Checkbox>
                  {!anonymous && (
                    <>
                      <Input
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mb-2"
                      />
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          )}
          <Textarea
            isRequired
            placeholder="Please enter the details of your question here."
            variant="bordered"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </CardBody>
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] text-white w-full"
            onClick={handlePostQuestion}
          >
            Post Question
          </Button>
          
          <Button
            className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] text-white w-full"
            onClick={() => (window.location.href = '/Support/community')}
          >
            Back to Community Questions
          </Button>

        </CardFooter>
      </Card>
    </div>
  );
}
