'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Button } from '@nextui-org/react';

// Define the type for AdminProfile with optional properties
// This ensures that TypeScript knows the structure of the admin profile object
type AdminProfile = {
  id: string;
  name: string;
  email: string;
  officeNumber?: string;
  officeHours?: string;
  officeLocation?: string;
  role: string;
};

// States to store data
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

          // calls to api
          const response = await fetch('/api/admins/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const profileData = await response.json();
            if (profileData.role !== 'ADMIN') {
              window.location.href = '/not-authorized';
              return;
            }
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

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          return;
        }

        const response = await fetch('/api/admins/delete', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          alert('Your account has been deleted successfully.');
          // Clear localStorage and redirect to homepage after successful deletion
          localStorage.removeItem('token');
          window.location.href = '/';
        } else {
          const errorResponse = await response.json();
          setError(`Failed to delete account: ${errorResponse.message}`);
        }
      } catch (error) {
        setError('An error occurred while deleting the account');
      }
    }
  };

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
          <p><strong>Name:</strong> {adminProfile?.name}</p>
          <p><strong>Email:</strong> {adminProfile?.email}</p>
          <p><strong>Office Number:</strong> {adminProfile?.officeNumber}</p>
          <p><strong>Office Location:</strong> {adminProfile?.officeLocation}</p>
          <p><strong>Office Hours:</strong> {adminProfile?.officeHours}</p>
        </div>

        <Button
          className="mt-4 bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black w-full"
          onClick={() => (window.location.href = '/Admin')}
        >
          Back to Dashboard
        </Button>

        <Button
          className="mt-4 bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black w-full"
          onClick={() => (window.location.href = '/UpdatePassword')}
        >
          Update Password
        </Button>

        <Button
          className="mt-4 bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black text-black w-full"
          onClick={() => (window.location.href = '/Admin/profile/edit')}
        >
          Edit Profile
        </Button>

        <Button
          className="mt-4 bg-gradient-to-r from-[#e74949] to-[#f95d09] border border-black text-black w-full"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </Button>

        {error && <p className="text-red-500">{error}</p>}
      </CardBody>
    </Card>
  );
}
