"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Button, Textarea } from "@nextui-org/react";

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

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
};

export default function EventDetailsPage() {
  const [eventId, setEventId] = useState<string | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Extract event ID from the URL path
    const pathSegments = window.location.pathname.split("/");
    const extractedId = pathSegments[pathSegments.length - 1]; // Get the last part of the path
    setEventId(extractedId);
    console.log("Extracted Event ID:", extractedId);
  }, []);

  useEffect(() => {
    if (!eventId) return;

    // Check if the user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Fetch event details
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/Event/${eventId}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data.event);
        } else {
          setMessage("Failed to fetch event details.");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        setMessage("An error occurred while fetching event details.");
      }
    };

    // Fetch comments
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/Event/comments/${eventId}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
          console.log("Comments fetched:", data);
        } else {
          setMessage("Failed to fetch comments.");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setMessage("An error occurred while fetching comments.");
      }
    };

    fetchEventDetails();
    fetchComments();
  }, [eventId]);

  // Submit a new comment
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      setMessage("Comment cannot be empty.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const token = localStorage.getItem("token");
    const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
    const userId = decodedToken?.userId;
    const userName = decodedToken?.name;
    const userEmail = decodedToken?.email;

    if (!userId || !userName || !userEmail) {
      setMessage("You must be logged in to comment.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const payload = {
        content: newComment,
        eventId,
        userId,
      };

      const response = await fetch(`/api/Event/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const addedComment = await response.json();

        // Update comments with the new comment
        setComments((prevComments) => [
          ...prevComments,
          {
            ...addedComment,
            createdBy: {
              name: userName,
              email: userEmail,
            },
          },
        ]);

        setNewComment("");
        setMessage("Comment added successfully.");
      } else {
        setMessage("Failed to add comment.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setMessage("An error occurred while adding the comment.");
    }

    setTimeout(() => setMessage(null), 3000);
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-3/4 mb-10">
        <CardHeader className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-semibold">{event.title}</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {message && (
              <p role="alert" className="text-red-500 text-center">
                {message}
              </p>
            )}
            {event.flyer && (
              <div className="text-center">
                <img src={event.flyer} alt="Event Flyer" className="mx-auto w-full max-w-lg" />
              </div>
            )}
            <p className="text-gray-600">
              <strong>Description:</strong> {event.description || "No description provided."}
            </p>
            {event.startDate && (
              <p className="text-gray-600">
                <strong>Start Date:</strong> {new Date(event.startDate).toLocaleDateString()}
              </p>
            )}
            {event.endDate && (
              <p className="text-gray-600">
                <strong>End Date:</strong> {new Date(event.endDate).toLocaleDateString()}
              </p>
            )}
            {event.startTime && (
              <p className="text-gray-600">
                <strong>Start Time:</strong> {event.startTime}
              </p>
            )}
            {event.endTime && (
              <p className="text-gray-600">
                <strong>End Time:</strong> {event.endTime}
              </p>
            )}
            <p className="text-gray-600">
              <strong>Created By:</strong> {event.createdBy.name} ({event.createdBy.email})
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Comment Section */}
      <Card className="w-3/4">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Comments</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4">
                  <p className="text-gray-800">{comment.content}</p>
                  <p className="text-gray-500 text-sm">
                    - {comment.createdBy.name} ({new Date(comment.createdAt).toLocaleString()})
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>

          {/* Comment Form */}
          {isLoggedIn ? (
            <div className="mt-6">
              <Textarea
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full mb-4"
              />
              <Button
                onClick={handleCommentSubmit}
                className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black"
              >
                Add Comment
              </Button>
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-6">
              Please <a href="/Login" className="text-blue-500 underline">log in</a> to leave a comment.
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
