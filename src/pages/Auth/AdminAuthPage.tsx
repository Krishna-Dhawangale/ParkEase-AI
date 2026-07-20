import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { AuthService } from '../../services/auth.service';

export const AdminAuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await AuthService.login({ email, password });
      if (response.user.role !== 'ADMIN') {
        throw new Error('Unauthorized access');
      }
      login(response.token, response.user);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="card max-w-md w-full border-t-4 border-[var(--color-primary)]">
        <h2 className="text-2xl font-bold mb-2 text-center text-[var(--color-text)]">
          Admin Portal
        </h2>
        <p className="text-center text-sm opacity-70 mb-6">Restricted Access</p>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Admin Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary w-full justify-center mt-2">
            Sign In to Admin Portal
          </button>
        </form>
      </div>
    </div>
  );
};
