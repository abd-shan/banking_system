// src/components/CreateUserForm.tsx
'use client';

import React, { useState } from 'react';
import { bankFacade } from '@/facades/BankFacade';
import { UserRole } from '@/types';

export const CreateUserForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [full_name,setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);
    setFullName(firstName + lastName);
    
    try {
      const newUser = await bankFacade.createNewUser({
        email,
        password,
        full_name,
        role,
      });

      setMessage({ text: `User ${newUser.email} created successfully!`, type: 'success' });
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setRole(UserRole.CUSTOMER);
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || e.message || 'User creation failed.';
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const MessageDisplay = () => {
    if (!message) return null;
    const baseClass = "p-3 mb-4 text-sm rounded";
    const successClass = "text-green-700 bg-green-100";
    const errorClass = "text-red-700 bg-red-100";
    return (
      <div className={`${baseClass} ${message.type === 'success' ? successClass : errorClass}`} role="alert">
        {message.text}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-lg mx-auto">
      <h3 className="text-xl font-semibold mb-4">Create New User</h3>
      <MessageDisplay />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">First Name</label>
                <input id="firstName" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="shadow border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="shadow border rounded w-full py-2 px-3 text-gray-700" />
            </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="shadow border rounded w-full py-2 px-3 text-gray-700" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="shadow border rounded w-full py-2 px-3 text-gray-700" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
          >
            {Object.values(UserRole).map(r => (
                <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
};
