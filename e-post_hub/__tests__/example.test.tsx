import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import the jest-dom matchers
import React from 'react';
import Adminpage from '@/app/Admin/page';
import jwt from 'jsonwebtoken';
import router from 'next-router-mock';

// Mock next/router
jest.mock('next/router', () => require('next-router-mock'));

describe('Adminpage Component', () => {
  beforeAll(() => {
    // Mock the global alert function
    global.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear any mock calls to avoid conflicts between tests
    localStorage.clear(); // Clear localStorage for isolation between tests
  });

  it('should redirect unauthorized users to login page', () => {
    // Render Adminpage without a token in localStorage
    render(<Adminpage />);

    // Check if an alert was triggered
    expect(global.alert).toHaveBeenCalledWith('You need to log in to access the admin page.');

    // Verify redirection to login page
    expect(global.window.location.href).toBe('/Login');
  });

  it('should display the admin page for an authorized admin user', () => {
    // Mock a valid admin JWT token
    const adminToken = jwt.sign({ userId: '123', role: 'ADMIN', name: 'Test Admin' }, 'dummy-secret');
    localStorage.setItem('token', adminToken);

    // Render the Adminpage component
    render(<Adminpage />);

    // Verify that the welcome message is displayed
    expect(screen.getByText(/Welcome, Test Admin!/i)).toBeInTheDocument();

    // Verify that the "Edit Event" button is displayed
    expect(screen.getByRole('button', { name: /Edit Event/i })).toBeInTheDocument();
  });
});
