//Form used to display the AdminRegisterForm

import React from 'react';
import AdminRegisterForm from './AdminRegisterForm';
import greenhills from '../../Images/greenhills.jpg';

export default function RegisterAdminPage() {
  return (
    <div
      className="flex items-center justify-center min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${greenhills.src})`,
      }}
    >
      <AdminRegisterForm />
    </div>
  );
}
