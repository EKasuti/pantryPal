import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../../components/Auth/InputField';
import { IoMdClose } from 'react-icons/io';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Backend logic
    console.log('Logged in with:', { email, password });
   
    // navigate('/dashboard');
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <IoMdClose className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold text-center mb-2">PantryPal</h1>
        <h2 className="text-2xl font-bold text-center mb-2">Login to your account</h2>
        <p className="text-center text-gray-600 mb-6">Effortlessly track your pantry</p>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
          <InputField
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:text-blue-700 font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;