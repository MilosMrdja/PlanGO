import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerUser } from '../services/auth';
import type { AuthResponse } from '../types/api';

// Register stranica: korisnik unosi podatke za registraciju
// Bitno: validacija podataka pre slanja na backend
const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await registerUser(email, password, firstName, lastName, Number(age)) as AuthResponse;
      if (response.status === 'success') {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setError('Registration failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-extrabold text-amber-800 mb-8">Plan & Go</h1>
        <div className="flex w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-1/2">
              <img
                src="/logo.webp"
                alt="Login visual"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-amber-800">Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-600 text-center mb-2">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-center mb-2">{success}</div>
          )}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Password:</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Last name:</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Age:</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(Number(e.target.value))}
              min={1}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-amber-900 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors duration-200"
          >
            Sing up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-amber-600">
          Have an account?{' '}
          <Link to="/" className="text-amber-800 hover:underline">
            Log in
          </Link>
        </p>
            </div>
        </div>
    </div>

  );
};

export default Register; 