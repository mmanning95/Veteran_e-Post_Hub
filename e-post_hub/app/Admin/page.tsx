// Admin page that will be displayed. Does not allow unauthorized users to visit page

"use client"
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import jwt from 'jsonwebtoken'

export default function Adminpage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);

  useEffect(() => {
    // Check if the token is present in localStorage
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Verify and decode the token to determine if the user is an admin
        const decodedToken = jwt.decode(token) as { userId: string, role: string, name?: string };
        
        if (decodedToken && decodedToken.role === 'ADMIN') {
          setIsAdmin(true); // User is an admin
          if (decodedToken.name) {
            setAdminName(decodedToken.name || 'Admin'); // Store the admin's name for display
          }
        } else {
          // If not an admin, redirect to a different page (e.g., login page)
          alert('Unauthorized access. Only admin users can view this page.');
          window.location.href = './';
        }
      } catch (error) {
        console.error("Invalid token", error);
        alert('Invalid token. Please log in again.');
        window.location.href = './'; // Redirect to login page if token is invalid
      }
    } else {
      // If no token found, redirect to the login page
      alert('You need to log in to access the admin page.');
      window.location.href = './';
    }
  }, []);

   // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    window.location.href = './'; // Redirect to the login page
  };

  if (!isAdmin) {
    // Show a loading message while we verify if the user is an admin
    return <div>Loading...</div>;
  }

  // The content of the Admin page will only be shown if the user is an admin
  return (
    <div>
      <h3 className="text-3xl">Welcome, {adminName || 'Admin'}!</h3>
      <h3 className="text-3xl">This will be the admin page</h3>

      <div style={{ margin: "20px 0" }}>
        <Button
          as={Link}
          href="/Admin/editevent"
          color="primary"
          variant="bordered"
        >
          Edit Event
        </Button>
      </div>

      <div style={{ margin: "20px 0" }}>
        <Button as={Link} href="/" color="primary" variant="bordered">
          Back to Homepage
        </Button>
      </div>

      {/* Add Logout Button */}
      <div style={{ margin: "20px 0" }}>
        <Button onClick={handleLogout} color="secondary" variant="bordered">
          Logout
        </Button>
      </div>
    </div>
  );
}