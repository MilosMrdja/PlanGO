import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerUser } from '../services/auth';
import type { AuthResponse } from '../types/AuthResponse';
import H1 from '../components/UI/H1';
import H2 from '../components/UI/H2';
import { toast } from 'react-toastify';
import {useAuth} from '../AuthProvider'
import TextInput from '../components/UI/TextInput';

// Register stranica: korisnik unosi podatke za registraciju
// Bitno: validacija podataka pre slanja na backend
const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const navigate = useNavigate();
  const {login} = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerUser(email, password, firstName, lastName, Number(age)) as AuthResponse;
      login(response.data.accessToken);
      toast.success('You successfully created an account!');
      setTimeout(() => navigate('/dashboard'), 1500);
     
    } catch (err: any) {
      toast.error(err.message)
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
            <H2>Registration</H2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <TextInput
            label='Email:'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            />
          </div>
          <div>
            <TextInput
            type='password'
            label='Password:'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            />
          </div>
          <div>
          <TextInput
            label='Name:'
            type='text'
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            />
          </div>
          <div>
            <TextInput
            label='Last name:'
            type='text'
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            />
          </div>
          <div>
            <TextInput
            label='Age:'
            type='number'
            value={age}
            min={1}
            required
            onChange={e => setAge(Number(e.target.value))}
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