'use client'
import { useEffect, useState } from 'react';
import { Button, Card } from '@nextui-org/react';
import React from 'react';

type Question = {
  id: string;
  text: string;
  username: string;
  datePosted: string;
};

export default function CommunityPage() {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Fetch all non-private questions
    async function fetchQuestions() {
      try {
        const response = await fetch('/api/community/question/public');
        if (response.ok) {
          const data = await response.json();
          setQuestions(data.questions);
        } else {
          console.error('Failed to fetch questions:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }

    fetchQuestions();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Community Questions</h1>
      <div>
        <Button
          className="bg-orange-400 text-white mt-4"
          onClick={() => (window.location.href = '/Support/community/ask')}
        >
          Ask a question
        </Button>
      </div>
      <div className="mt-10">
        {questions.length === 0 ? (
          <p>No public questions available.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 w-3/4">
            {questions.map((question) => (
              <Card key={question.id} className="p-4 border border-gray-300">
                <h3 className="text-xl font-semibold">{question.username}</h3>
                <p>{question.text}</p>
                <p className="text-xs text-gray-500">Posted on: {new Date(question.datePosted).toLocaleDateString()}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
