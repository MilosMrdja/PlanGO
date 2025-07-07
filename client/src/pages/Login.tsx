import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginUser} from '../services/auth';
import {useAuth} from '../AuthProvider'
import type { AuthResponse, AuthError } from '../types/api';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {login} = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await loginUser(email, password);
      if (response.status === 'success') {
        login(response.data.accessToken);
        toast.success('You are logged in!');
        navigate('/dashboard');
      } else {
        setError('Login failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
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
              <h2 className="text-2xl font-bold mb-6 text-center text-amber-800">Log in</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="text-red-600 text-center mb-2">{error}</div>
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
                <button
                  type="submit"
                  className="w-full bg-amber-900 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200"
                >
                  Sign in
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-amber-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-amber-800 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
  );
};

export default Login; 