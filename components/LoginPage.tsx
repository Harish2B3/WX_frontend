
import React, { useState } from 'react';
import { login } from '../services/api';
import { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (data: { token: string; user: User }) => void;
  onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const data = await login({ email, password });
      onLoginSuccess(data);
    } catch (err: any) {
      if (err.errors) {
        // Handle validation errors from express-validator
        setError(err.errors.map((e: { msg: string }) => e.msg).join('. '));
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
        <h2 className="text-2xl font-semibold text-center text-mono-text-primary mb-6">Welcome Back</h2>
        {error && <div className="p-3 mb-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg text-sm text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium text-mono-text-secondary block mb-2">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-mono-gray-dark/50 border border-mono-border text-mono-text-primary rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent-purple shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                />
            </div>
            <div>
                <label className="text-sm font-medium text-mono-text-secondary block mb-2">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-mono-gray-dark/50 border border-mono-border text-mono-text-primary rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent-purple shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 glossy-accent-button text-mono-text-primary font-bold py-3 px-4 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
        </form>
        <p className="text-center text-sm text-mono-text-secondary mt-6">
            Don't have an account?{' '}
            <button onClick={onSwitchToRegister} className="font-medium text-accent-purple-light hover:underline">
                Sign Up
            </button>
        </p>
    </div>
  );
};

export default LoginPage;