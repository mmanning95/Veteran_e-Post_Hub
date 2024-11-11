'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input } from '@nextui-org/react';

type AdminProfile = {
  id: string;
  name: string;
  email: string;
  officeNumber?: string;
  officeHours?: string;
  officeLocation?: string;
  role: string;
};

export default function ProfilePage() {
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ensure that the code runs only in the client-side environment
    if (typeof window !== 'undefined') {
      // Fetch the current user's profile details from the API
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setError('No token found. Please log in.');
            setLoading(false);
            return;
          }

          const response = await fetch('/api/admins/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const profileData = await response.json();
            setAdminProfile(profileData);
          } else {
            const errorResponse = await response.json();
            setError(`Failed to fetch profile: ${errorResponse.message}`);
          }
        } catch (error) {
          setError('An error occurred while fetching the profile');
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, []);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <Card className="w-3/5 mx-auto my-10">
      <CardHeader className="flex flex-col items-center justify-center">
        <h2 className="text-3xl font-semibold">Admin Profile</h2>
      </CardHeader>
      <CardBody className="space-y-6">
        <div className="flex flex-col gap-4 self-center">
            <p><strong>Name:</strong>     {adminProfile?.name}</p>
            <p><strong>Email:</strong>     {adminProfile?.email}</p>
            <p><strong>Office Number:     </strong>{adminProfile?.officeNumber}</p>
            <p><strong>Office Location     </strong>{adminProfile?.officeLocation}</p>
            <p><strong>Office Hours     </strong>{adminProfile?.officeHours}</p>
        </div>
        <Button
          className="bg-orange-400 text-white mt-4"
          onClick={() => (window.location.href = '/Admin')}
        >
          Back to Dashboard
        </Button>
        <Button
          className="bg-orange-400 text-white mt-4"
          onClick={() => (window.location.href = '')}
          isDisabled
        >
          Edit Profile
        </Button>
        <Button
          className="bg-orange-400 text-white mt-4"
          onClick={() => (window.location.href = '/Admin')}
          isDisabled
        >
          Update Password
        </Button>
      </CardBody>
    </Card>
  );
}
