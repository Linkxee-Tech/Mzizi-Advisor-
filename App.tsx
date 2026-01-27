import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Tools from './pages/Tools';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { BusinessProfile } from './types';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    const savedProfile = localStorage.getItem('mzizi_profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse profile", e);
        localStorage.removeItem('mzizi_profile');
      }
    }
    setLoading(false);
  }, []);

  const handleSetProfile = (p: BusinessProfile) => {
    setProfile(p);
    localStorage.setItem('mzizi_profile', JSON.stringify(p));
  };

  const handleLogout = () => {
    setProfile(null);
    localStorage.clear(); // Clear all data including chat history
  };

  if (loading) {
    return <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center text-green-800">Loading...</div>;
  }

  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/onboarding" element={<Onboarding setProfile={handleSetProfile} />} />
            
            <Route 
              path="/" 
              element={profile ? <Dashboard profile={profile} /> : <Navigate to="/onboarding" replace />} 
            />
            
            <Route 
              path="/chat" 
              element={profile ? <Chat profile={profile} /> : <Navigate to="/onboarding" replace />} 
            />
            
            <Route 
              path="/tools" 
              element={profile ? <Tools /> : <Navigate to="/onboarding" replace />} 
            />
            
            <Route 
              path="/insights" 
              element={profile ? <Insights /> : <Navigate to="/onboarding" replace />} 
            />

            <Route 
              path="/profile" 
              element={profile ? <Profile profile={profile} onLogout={handleLogout} /> : <Navigate to="/onboarding" replace />} 
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;