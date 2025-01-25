//Displays the login form

import React from 'react';
import LoginForm from './LoginForm';
import palouseHills from '../../Images/palouseHills.jpg'; 

export default function LoginPage() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${palouseHills.src})`,
      }}
    >
      <LoginForm />
    </div>
  );
}
