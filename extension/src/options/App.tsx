import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import './App.css';

// Components
import { TemplateManager } from './components/TemplateManager';
import { SettingsPanel } from './components/SettingsPanel';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'templates' | 'settings'>('templates');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = () => {
    chrome.runtime.sendMessage({ type: 'SIGN_IN' });
  };

  const handleSignOut = () => {
    chrome.runtime.sendMessage({ type: 'SIGN_OUT' });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-container">
        <h1>DesAInR Extension Settings</h1>
        <div className="auth-card">
          <h2>Sign In Required</h2>
          <p>Please sign in to manage your templates and settings.</p>
          <button className="btn btn-primary" onClick={handleSignIn}>
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>DesAInR Extension Settings</h1>
        <div className="user-info">
          <span>{user.email}</span>
          <button className="btn btn-sm" onClick={handleSignOut}>Sign Out</button>
        </div>
      </header>

      <nav className="tab-nav">
        <button 
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          Prompt Templates
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'templates' ? (
          <TemplateManager userId={user.uid} />
        ) : (
          <SettingsPanel />
        )}
      </main>
    </div>
  );
}
