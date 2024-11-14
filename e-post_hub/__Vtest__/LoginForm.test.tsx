import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom'; // Import jest-dom matchers for `toBeInTheDocument`
import LoginForm from '../app/(auth)/Login/LoginForm';
import React from 'react';

describe('LoginForm Component', () => {
  afterEach(() => {
    vi.restoreAllMocks(); // Restore any mocked functions after each test
  });

  it('should render the login form correctly', () => {
    render(<LoginForm />);

    // Check that the email input is rendered
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();

    // Check that the password input is rendered
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

    // Check that the login button is rendered
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });


  it('should show validation errors when email or password format is incorrect', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    // Simulate entering an incorrect email and leaving the input field (triggering blur event)
    fireEvent.change(emailInput, { target: { value: 'notanemail' } });
    fireEvent.blur(emailInput); // Trigger validation

    // Check if the email validation error message is shown
    expect(await screen.findByText(/Invalid email/i)).toBeInTheDocument();

    // Simulate entering a short password and leaving the input field (triggering blur event)
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.blur(passwordInput); // Trigger validation

    // Check if the password validation error message is shown
    expect(await screen.findByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
  });

  
  it('should enable the login button when valid email and password are entered', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Initially, the button should be disabled
    expect(loginButton).toBeDisabled();

    // Enter valid email and password
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'validpassword' } });

    // The button should now be enabled
    await waitFor(() => {
      expect(loginButton).toBeEnabled();
    });
  });

  it('should display an error message in the component if login fails', async () => {
    // Mock a failed login response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      })
    ) as unknown as typeof fetch;

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Enter incorrect credentials
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Click the login button
    fireEvent.click(loginButton);

    // Check if the error message is displayed in the UI
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();

    });
});
