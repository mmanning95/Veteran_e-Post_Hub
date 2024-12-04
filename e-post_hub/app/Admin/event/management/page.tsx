'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Checkbox } from '@nextui-org/react';
import jwt from 'jsonwebtoken';

type Event = {
  id: string;
  title: string;
  description?: string;
  createdBy: {
    name: string;
    email: string;
  };
  status: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  website?: string;
  flyer?: string;
};

type Question = {
  id: string;
  text: string;
  username: string;
  userEmail: string;
  isPrivate: boolean;
  datePosted: string;
};

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedActions, setSelectedActions] = useState<{ [key: string]: 'approve' | 'deny' | null }>({});
  const [globalStatusMessage, setGlobalStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check admin token
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt.decode(token) as { role?: string };
      if (decodedToken?.role === 'ADMIN') {
        setIsAdmin(true);
      } else {
          window.location.href = '/Unauthorized';
      }
    } else {
        window.location.href = '/Unauthorized';
    }

    // Fetch pending events and private questions
    async function fetchPendingEventsAndQuestions() {
      try {
        const [eventsResponse, questionsResponse] = await Promise.all([
          fetch('/api/Event/pending'),
          fetch('/api/community/question/private'),
        ]);

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData.events);

          // Initialize selectedActions state for events
          const initialActions: { [key: string]: 'approve' | 'deny' | null } = {};
          eventsData.events.forEach((event: Event) => {
            initialActions[event.id] = null;
          });
          setSelectedActions(initialActions);
        } else {
          setGlobalStatusMessage('Failed to fetch pending events.');
        }

        if (questionsResponse.ok) {
          const questionsData = await questionsResponse.json();
          setQuestions(questionsData.questions);
        } else {
          setGlobalStatusMessage('Failed to fetch private questions.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setGlobalStatusMessage('An error occurred while fetching data.');
      }
    }

    if (isAdmin) {
      fetchPendingEventsAndQuestions();
    }
  }, [isAdmin]);

  // Define handleCheckboxChange function for events
  const handleCheckboxChange = (itemId: string, action: 'approve' | 'deny') => {
    setSelectedActions((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === action ? null : action,
    }));
  };

  // Submit all actions for events
  const handleSubmitActions = async () => {
    let allSuccess = true;
    for (const [eventId, action] of Object.entries(selectedActions)) {
      if (action === 'approve') {
        const success = await handleApproveEvent(eventId);
        if (!success) allSuccess = false;
      } else if (action === 'deny') {
        const success = await handleDenyEvent(eventId);
        if (!success) allSuccess = false;
      }
    }

    setGlobalStatusMessage(allSuccess ? 'All event actions completed successfully.' : 'Some actions failed.');
  };

  // Approve event
  const handleApproveEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/Event/approve/${eventId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
        return true;
      } else {
        const errorData = await response.json();
        console.error('Error approving event:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Error approving event:', error);
      return false;
    }
  };

  // Deny event
  const handleDenyEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/Event/deny/${eventId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
        return true;
      } else {
        const errorData = await response.json();
        console.error('Error denying event:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Error denying event:', error);
      return false;
    }
  };

  // Resolve (delete) question
  const handleResolveQuestion = async (questionId: string) => {
    try {
      const response = await fetch(`/api/community/question/${questionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setQuestions((prevQuestions) => prevQuestions.filter((question) => question.id !== questionId));
        setGlobalStatusMessage('Question resolved successfully.');
      } else {
        const errorData = await response.json();
        console.error('Error resolving question:', errorData);
        setGlobalStatusMessage('Failed to resolve question.');
      }
    } catch (error) {
      console.error('Error resolving question:', error);
      setGlobalStatusMessage('An error occurred while resolving the question.');
    }
  };

  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-4/5 mx-auto'>
      {/* Global Status Message */}
      {globalStatusMessage && (
        <div className='text-center mb-4 p-2 bg-blue-100 text-blue-800 border border-blue-300 rounded'>
          {globalStatusMessage}
        </div>
      )}

      <div className='flex gap-8'>
        {/* Left side: Events */}
        <div className='w-1/2'>
          <Card>
            <CardHeader className='flex flex-col items-center justify-center'>
              <h3 className='text-2xl font-semibold'>Pending Events</h3>
            </CardHeader>
            <CardBody className='max-h-[600px] overflow-y-auto'>
              {events.length === 0 ? (
                <p className='text-center'>No pending events at the moment.</p>
              ) : (
                events.map((event) => (
                  <div key={event.id} className='mb-4 p-4 border-b'>
                    <h4 className='text-xl font-bold'>{event.title}</h4>
                    <p className='text-gray-600'>{event.description}</p>
                    <p className='text-gray-600'>Created By: {event.createdBy.name} ({event.createdBy.email})</p>
                    {event.startDate && (
                      <p className='text-gray-600'>Start Date: {new Date(event.startDate).toLocaleDateString()}</p>
                    )}
                    <div className='flex justify-between mt-2'>
                      <Checkbox
                        isSelected={selectedActions[event.id] === 'approve'}
                        onChange={() => handleCheckboxChange(event.id, 'approve')}
                        color='primary'
                      >
                        Approve
                      </Checkbox>
                      <Checkbox
                        isSelected={selectedActions[event.id] === 'deny'}
                        onChange={() => handleCheckboxChange(event.id, 'deny')}
                        color='danger'
                      >
                        Deny
                      </Checkbox>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
            {events.length > 0 && (
              <div className='flex justify-center mt-8'>
                <Button onClick={handleSubmitActions} className='bg-gradient-to-r from-[#f7960d] to-[#f95d09] text-white'>
                  Submit Actions
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Right side: Private Questions */}
        <div className='w-1/2'>
          <Card>
            <CardHeader className='flex flex-col items-center justify-center'>
              <h3 className='text-2xl font-semibold'>Private Questions</h3>
              <div className="text-[#757575]" style={{ fontSize: '12px' }}>
                Note: Once an email is sent to user, please resolve the question. Resolved questions cannot be retrived.
              </div>
            </CardHeader>
            <CardBody className='max-h-[600px] overflow-y-auto'>
              {questions.length === 0 ? (
                <p className='text-center'>No private questions at the moment.</p>
              ) : (
                questions.map((question) => (
                  <div key={question.id} className='mb-4 p-4 border-b'>
                    <h4 className='text-xl font-bold'>Question from {question.username}</h4>
                    <p className='text-gray-600'>{question.text}</p>
                    <p className='text-gray-600'>User Email: {question.userEmail}</p>
                    <p className='text-gray-600'>Posted on: {new Date(question.datePosted).toLocaleDateString()}</p>
                    <div className='flex justify-end mt-4'>
                      <Button
                        onClick={() => handleResolveQuestion(question.id)}
                        color='success'
                        className='bg-blue-500 text-white'
                      >
                        Resolved
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
