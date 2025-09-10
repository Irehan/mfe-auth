import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import './App.css';

// This App is ONLY for standalone development, not for federated use
function App() {
  const [user, setUser] = React.useState(null);

  return (
    <Router>
      <div className="auth-app">
        <Routes>
          <Route path="/" element={
            user ? 
              <UserProfile user={user} onLogout={() => setUser(null)} /> : 
              <Login onLogin={setUser} />
          } />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/profile" element={<UserProfile user={user} onLogout={() => setUser(null)} />} />
          <Route path="*" element={<Login onLogin={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;