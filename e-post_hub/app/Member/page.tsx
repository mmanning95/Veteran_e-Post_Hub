"use client"
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import jwt from 'jsonwebtoken'
// export default function Memberpage() {
//   return (
//     <div>Member Page</div>
//   )
// }

export default function Memberpage() {
  const [isMember, setIsMember] = useState(false);
  const [memberName, setMemberName] = useState<string | null>(null);

  useEffect(() => {
    // Check if the token is present in localStorage
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Verify and decode the token to determine if the user is an admin
        const decodedToken = jwt.decode(token) as { userId: string, role: string, name?: string };
        
        if (decodedToken && decodedToken.role === 'MEMBER') {
          setIsMember(true); // User is an admin
          if (decodedToken.name) {
            setMemberName(decodedToken.name || 'Member'); // Store the admin's name for display
          }
        } else {
          // If not an admin, redirect to a different page (e.g., login page)
          alert('Unauthorized access. Only member users can view this page.');
          window.location.href = '/Login';
        }
      } catch (error) {
        console.error("Invalid token", error);
        alert('Invalid token. Please log in again.');
        window.location.href = '/Login'; // Redirect to login page if token is invalid
      }
    } else {
      // If no token found, redirect to the login page
      alert('You need to log in to access the member page.');
      window.location.href = '/Login';
    }
  }, []);

  if (!isMember) {
    // Show a loading message while we verify if the user is an admin
    return <div>Loading...</div>;
  }

  // The content of the Admin page will only be shown if the user is an admin
  return (
    <div>
      <h3 className="text-3xl">Welcome, {memberName || 'Member'}!</h3>
      <h3 className="text-3xl">This will be the member page</h3>
      <div style={{ margin: "20px 0" }}>
        <Button as={Link} href="/" color="primary" variant="bordered">
          Back to Homepage
        </Button>
      </div>
    </div>
  );
}
