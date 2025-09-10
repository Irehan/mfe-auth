import React from 'react';
import './Auth.css';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

interface UserProfileProps {
  user?: User | null;
  onLogout?: () => void;
  onEditProfile?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  onLogout, 
  onEditProfile 
}) => {
  
  const handleLogout = () => {
    console.log('🚪 UserProfile: Logout button clicked');
    
    if (onLogout) {
      console.log('📤 Calling onLogout callback');
      onLogout();
    }
    
    if (typeof window !== 'undefined' && (window as any).eventBus) {
      console.log('📡 Emitting auth:logout event');
      (window as any).eventBus.emit('auth:logout', null);
    }
    
    console.log('✅ Logout complete');
  };

  if (!user) {
    return (
      <div className="user-profile-container">
        <div className="error-message">
          No user data available. Please log in again.
        </div>
      </div>
    );
  }

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {getInitials(user.username)}
        </div>
        <div className="profile-info">
          <h2>{user.username}</h2>
          <p style={{ margin: '0.25rem 0', color: '#718096' }}>
            {user.email}
          </p>
          <span className={`profile-role ${user.role}`}>
            {user.role}
          </span>
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-section">
          <h3 style={{ color: '#4a5568', marginBottom: '1rem' }}>
            Account Information
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="detail-item">
              <span style={{ fontWeight: 600, color: '#374151' }}>User ID:</span>
              <span style={{ color: '#718096', fontFamily: 'monospace' }}>
                {user.id}
              </span>
            </div>
            
            <div className="detail-item">
              <span style={{ fontWeight: 600, color: '#374151' }}>Username:</span>
              <span style={{ color: '#718096' }}>{user.username}</span>
            </div>
            
            <div className="detail-item">
              <span style={{ fontWeight: 600, color: '#374151' }}>Email:</span>
              <span style={{ color: '#718096' }}>{user.email}</span>
            </div>
            
            <div className="detail-item">
              <span style={{ fontWeight: 600, color: '#374151' }}>Role:</span>
              <span style={{ color: '#718096', textTransform: 'capitalize' }}>
                {user.role}
              </span>
            </div>
            
            <div className="detail-item">
              <span style={{ fontWeight: 600, color: '#374151' }}>Access Level:</span>
              <span style={{ color: user.role === 'admin' ? '#c53030' : '#276749' }}>
                {user.role === 'admin' ? 'Full Access' : 'Limited Access'}
              </span>
            </div>
          </div>
        </div>

        {user.role === 'admin' && (
          <div className="detail-section" style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#4a5568', marginBottom: '1rem' }}>
              Admin Privileges
            </h3>
            <div style={{ 
              background: '#fed7d7', 
              padding: '1rem', 
              borderRadius: '8px',
              border: '1px solid #feb2b2'
            }}>
              <p style={{ margin: 0, color: '#c53030', fontSize: '0.9rem' }}>
                ✓ Access to all micro-frontends<br/>
                ✓ User management capabilities<br/>
                ✓ System configuration access<br/>
                ✓ Reporting and analytics
              </p>
            </div>
          </div>
        )}

        {user.role === 'user' && (
          <div className="detail-section" style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#4a5568', marginBottom: '1rem' }}>
              Available Features
            </h3>
            <div style={{ 
              background: '#c6f6d5', 
              padding: '1rem', 
              borderRadius: '8px',
              border: '1px solid #9ae6b4'
            }}>
              <p style={{ margin: 0, color: '#276749', fontSize: '0.9rem' }}>
                ✓ Access to booking system<br/>
                ✓ Personal profile management<br/>
                ✓ Basic reporting features
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="profile-actions">
        <button
          onClick={onEditProfile}
          className="profile-button primary"
          disabled={!onEditProfile}
        >
          Edit Profile
        </button>
        
        <button
          onClick={handleLogout}
          className="profile-button secondary"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;