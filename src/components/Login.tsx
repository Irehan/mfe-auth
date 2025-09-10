import React, { useState } from 'react';
import './Auth.css';

interface LoginProps {
  onLogin?: (user: any) => void;
  onError?: (error: string) => void;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

const Login: React.FC<LoginProps> = ({ onLogin, onError }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockUsers = {
    'admin': { 
      id: '1', 
      username: 'admin', 
      email: 'admin@example.com', 
      role: 'admin' as const,
      password: 'admin123' 
    },
    'user': { 
      id: '2', 
      username: 'user', 
      email: 'user@example.com', 
      role: 'user' as const,
      password: 'user123' 
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { username, password } = formData;
      const mockUser = mockUsers[username as keyof typeof mockUsers];

      if (!mockUser || mockUser.password !== password) {
        throw new Error('Invalid username or password');
      }

      const { password: _, ...userData } = mockUser;
      
      console.log('✅ Login successful:', userData);
      
      if (onLogin) {
        console.log('📤 Calling onLogin callback');
        onLogin(userData);
      }
      
      if (typeof window !== 'undefined' && (window as any).eventBus) {
        console.log('📡 Emitting auth:login event via eventBus');
        (window as any).eventBus.emit('auth:login', { payload: userData });
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('❌ Login error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: 'admin' | 'user') => {
    setFormData({
      username: role,
      password: role === 'admin' ? 'admin123' : 'user123'
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <p className="auth-subtitle">Access your account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your username"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`auth-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="button-loading">
                <span className="spinner-small"></span>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="demo-section">
          <p className="demo-title">Demo Accounts:</p>
          <div className="demo-buttons">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="demo-button admin"
              disabled={isLoading}
            >
              Admin Login
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('user')}
              className="demo-button user"
              disabled={isLoading}
            >
              User Login
            </button>
          </div>
          <div className="demo-credentials">
            <small>Admin: admin/admin123 | User: user/user123</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;