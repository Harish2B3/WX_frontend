
import React, { useState, useEffect, useCallback } from 'react';
import App from './App';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AuthLayout from './components/AuthLayout';
import { User } from './types';

const Root: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, [token]);

  const handleLoginSuccess = (data: { token: string; user: User }) => {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    // Dev tools detection logic
    const devToolsCheck = () => {
        const start = performance.now();
        // This statement will pause execution only if developer tools are open
        debugger;
        const end = performance.now();
        
        // If the time difference is significant, it implies dev tools paused execution
        if (end - start > 500) {
            handleLogout();
        }
    };

    // Run the check periodically
    const intervalId = setInterval(devToolsCheck, 2000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [handleLogout]);

  useEffect(() => {
    const handleAuthError = () => {
        console.warn("Authentication error detected, logging out.");
        handleLogout();
    };
    window.addEventListener('auth-error', handleAuthError);
    return () => window.removeEventListener('auth-error', handleAuthError);
  }, [handleLogout]);


  if (isLoading) {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <p className="text-mono-text-secondary">Loading...</p>
        </div>
    );
  }

  if (!token || !user) {
    return (
      <AuthLayout>
        {authView === 'login' ? (
          <LoginPage onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setAuthView('register')} />
        ) : (
          <RegisterPage onRegisterSuccess={() => setAuthView('login')} onSwitchToLogin={() => setAuthView('login')} />
        )}
      </AuthLayout>
    );
  }

  return <App user={user} onLogout={handleLogout} />;
};

export default Root;
