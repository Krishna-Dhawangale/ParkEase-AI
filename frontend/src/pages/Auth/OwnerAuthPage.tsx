import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { AuthService } from '../../services/auth.service';

export const OwnerAuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await AuthService.login({ email, password });
      if (response.user.role !== 'CLIENT_OWNER' && response.user.role !== 'CLIENT_ADMIN') {
        throw new Error('Unauthorized access. This portal is for partners only.');
      }
      login(response.token, response.user);
      
      if (response.user.requiresPasswordChange) {
        navigate('/force-password-change');
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
      <div className="card max-w-md w-full border-t-4 border-[var(--brand)]">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-center text-[var(--text-primary)]">
            Partner Portal
          </h2>
          <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
            Sign in to manage your parking portfolio
          </p>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Email address</label>
              <input 
                type="email" 
                className="input-field" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="admin@yourbusiness.com"
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Password</label>
              <input 
                type="password" 
                className="input-field" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-primary w-full justify-center mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
            <p className="text-xs text-[var(--text-secondary)]">
              Accounts are provisioned by ParkEase AI. <br/>
              Contact support if you need access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
