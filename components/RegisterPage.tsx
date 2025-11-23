
import React, { useState } from 'react';
import { register } from '../services/api';

interface RegisterPageProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter.";
    if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter.";
    if (!/\d/.test(password)) return "Password must contain a number.";
    // eslint-disable-next-line no-useless-escape
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) return "Password must contain a special character.";
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setPasswordError(null);

    const passErr = validatePassword(formData.password);
    if (passErr) {
        setPasswordError(passErr);
        return;
    }
    
    setIsLoading(true);

    try {
      await register(formData);
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);
    } catch (err: any) {
      if (err.errors) {
        setError(err.errors.map((e: { msg: string }) => e.msg).join('. '));
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
        <h2 className="text-2xl font-semibold text-center text-mono-text-primary mb-6">Create Account</h2>
        {error && <div className="p-3 mb-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg text-sm text-center">{error}</div>}
        {success && <div className="p-3 mb-4 bg-green-900/50 border border-green-500 text-green-300 rounded-lg text-sm text-center">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="username" placeholder="Username" required onChange={handleChange} className="w-full bg-mono-gray-dark/50 border border-mono-border text-mono-text-primary rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent-purple shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
            <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="w-full bg-mono-gray-dark/50 border border-mono-border text-mono-text-primary rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent-purple shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
            <input name="phone" type="tel" placeholder="Phone Number" required onChange={handleChange} className="w-full bg-mono-gray-dark/50 border border-mono-border text-mono-text-primary rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent-purple shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
            <div>
              <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="w-full bg-mono-gray-dark/50 border border-mono-border text-mono-text-primary rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent-purple shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
              <div className="text-xs text-mono-text-secondary mt-2 p-2 bg-black/20 rounded-md space-y-1">
                  <p className="font-semibold">Password must contain at least:</p>
                  <ul className="list-disc list-inside pl-2">
                      <li>8 characters</li>
                      <li>1 uppercase & 1 lowercase letter</li>
                      <li>1 number & 1 special character</li>
                  </ul>
              </div>
              {passwordError && <p className="text-red-400 text-xs mt-1 p-1">{passwordError}</p>}
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !!success}
              className="w-full mt-2 glossy-accent-button text-mono-text-primary font-bold py-3 px-4 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
        </form>
        <p className="text-center text-sm text-mono-text-secondary mt-6">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="font-medium text-accent-purple-light hover:underline">
                Sign In
            </button>
        </p>
    </div>
  );
};

export default RegisterPage;