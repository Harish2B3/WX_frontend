
import React from 'react';
import { LogoIcon } from '../constants/icons';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <div className="inline-block text-accent-purple">
                <LogoIcon className="w-16 h-16" />
            </div>
            <h1 className="text-4xl font-bold text-shiny-gradient mt-2">WormX Drive</h1>
            <p className="text-mono-text-secondary mt-2">Your Secure Cloud Storage</p>
        </div>
        
        <div className="glossy-card rounded-xl p-6 sm:p-8">
            {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
