import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginUser} from '../services/auth';
import {useAuth} from '../AuthProvider'
import { toast } from 'react-toastify';
import TextInput from '../components/UI/TextInput';
import H1 from '../components/UI/H1';
import H2 from '../components/UI/H2';
import Button from '../components/UI/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {login} = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      login(response.data.accessToken);
      toast.success('You are logged in!');
      navigate('/dashboard');
      
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <H1>Plan & Go</H1>
        <div className="flex w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-1/2">
              <img
                src="/logo.webp"
                alt="Login visual"
                className="h-full w-full object-cover"
              />
        </div>
        <div className="w-1/2 p-8">
        <H2>Log in</H2>
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <TextInput
                  label='Email:'
                  type='Email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  />
                </div>
                <div>
                  <TextInput
                  label='Password:'
                  type='password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  />
                </div>
               <Button type='submit' variant='submit'>Sign in</Button>
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