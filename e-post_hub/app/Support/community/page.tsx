'use client';
import { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Divider, Textarea } from '@nextui-org/react';
import Link from 'next/link';

type Question = {
  id: string;
  text: string;
  username: string;
  datePosted: string;
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  createdBy: { name: string; email: string };
};

export default function CommunityPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({});


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserId(decodedToken.userId);
    }

    fetch('/api/community/question/public')
      .then(res => res.json())
      .then(data => setQuestions(data.questions));
  }, []);

  useEffect(() => {
    questions.forEach(async (question) => {
      const res = await fetch(`/api/community/question/${question.id}/comments/count`);
      if (res.ok) {
        const data = await res.json();
        setCommentsCount(prev => ({ ...prev, [question.id]: data.count }));
      }
    });
  }, [questions]);
  

  const fetchComments = async (questionId: string) => {
    if (showComments[questionId]) {
      setShowComments(prev => ({ ...prev, [questionId]: false }));
      return;
    }

    const res = await fetch(`/api/community/question/${questionId}/comments`);
    if (res.ok) {
      const data = await res.json();
      setComments(prev => ({ ...prev, [questionId]: data }));
      setShowComments(prev => ({ ...prev, [questionId]: true }));
    }
  };

  const handleCommentSubmit = async (questionId: string) => {
    const content = newComments[questionId]?.trim();
    if (!content) return;

    const token = localStorage.getItem('token');
    const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = decodedToken?.userId;

    if (!userId) return;

    const payload = { content, questionId, userId };

    const res = await fetch('/api/community/question/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const addedComment = await res.json();
      setComments(prev => ({
        ...prev,
        [questionId]: [...(prev[questionId] || []), addedComment],
      }));
      setNewComments(prev => ({ ...prev, [questionId]: '' }));
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Community Questions</h1>
      <div className='flex justify-center items-center'>
      <Button onPress={() => (window.location.href = '/Support/community/ask')}
        className="mt-2 hover:scale-105 transition-transform duration-200 ease-in-out bg-gradient-to-r 
        from-[#f7960d] to-[#f95d09] border border-black text-black">
        Ask a Question
      </Button> </div>

      {questions.map((question) => (
        <Card key={question.id} className="my-4 p-4 ">
          <CardHeader className="flex flex-col items-start">
            <h3 className="text-lg font-semibold">{question.username}</h3>
            <Divider />
            <p>{question.text}</p>
            <p className="text-xs text-gray-500">
              Posted on: {new Date(question.datePosted).toLocaleDateString()}
            </p>
            <Button
              className="mt-2 hover:scale-105 transition-transform duration-200 ease-in-out bg-gradient-to-r 
        from-[#f7960d] to-[#f95d09] border border-black text-black"
              onPress={() => fetchComments(question.id)}
            >
              {showComments[question.id] ? 'Hide Comments' : 'Show Comments'}
              {` (${commentsCount[question.id] || 0})`}
            </Button>
          </CardHeader>

          {showComments[question.id] && (
            <CardBody>
              {comments[question.id]?.map(comment => (
                <div key={comment.id} className="mb-2 bg-gray-100 p-2 rounded">
                  <p>{comment.content}</p>
                  <p className="text-xs text-gray-500">
                    - {comment.createdBy.name} ({new Date(comment.createdAt).toLocaleString()})
                  </p>
                </div>
              ))}

              {isLoggedIn ? (
                <div className="mt-4">
                  <Textarea
                    value={newComments[question.id] || ''}
                    onChange={(e) => setNewComments(prev => ({
                      ...prev,
                      [question.id]: e.target.value
                    }))}
                    placeholder="Type your comment..."
                  />
                  <Button
                    className="mt-2 hover:scale-105 transition-transform duration-200 ease-in-out bg-gradient-to-r 
        from-[#f7960d] to-[#f95d09] border border-black text-black"
                    onPress={() => handleCommentSubmit(question.id)}
                  >
                    Submit Comment
                  </Button>
                </div>
              ) : (
                <p className="mt-4">
                  <Link href="/Login" className="text-blue-500 underline">
                    Log in
                  </Link> to comment.
                </p>
              )}
            </CardBody>
          )}
        </Card>
      ))}
    </div>
  );
}
