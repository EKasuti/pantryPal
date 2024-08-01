import React, { useState } from 'react';
import { validateEmail } from '../utils/helper';

function EmailModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/waitlist/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log('Server response:', data);  // Log the server response

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        setEmail('');
      } else if (response.status === 409) {
        setError(data.message);
      } else {
        throw new Error(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Fetch error:', error);  // Log any fetch errors
      setError(error.message || 'Failed to submit email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    if (!isSubmitting) {
      setEmail('');
      setError('');
      setIsSuccess(false);
      setMessage('');
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg relative max-w-md w-full">
        <button 
          onClick={handleClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
          disabled={isSubmitting}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSuccess ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">Thank You!</h2>
            <p className="mb-4">{message}</p>
            <button
              onClick={handleClose}
              className="bg-primary text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Get Early Access</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full p-2 border rounded mb-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
                required
                disabled={isSubmitting}
              />
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <button 
                type="submit" 
                className="bg-primary text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default EmailModal;