import React, { useState } from 'react';
import './App.css';

// Components
import { TemplateManager } from './components/TemplateManager';
import { SettingsPanel } from './components/SettingsPanel';

export function App() {
  const [activeTab, setActiveTab] = useState<'templates' | 'settings'>('templates');

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>DesAInR Extension Settings</h1>
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
          <TemplateManager />
        ) : (
          <SettingsPanel />
        )}
      </main>
    </div>
  );
}
