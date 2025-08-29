import React, { useState, useEffect } from 'react';

export function SettingsPanel() {
  const [defaultLang, setDefaultLang] = useState('en');
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [parallelMode, setParallelMode] = useState(false);
  const [modelPreference, setModelPreference] = useState('default');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load settings from chrome.storage.sync
    chrome.storage.sync.get([
      'desainr.defaultLang',
      'desainr.autoTranslate',
      'desainr.parallelMode',
      'desainr.modelPreference'
    ], (data: any) => {
      if (data['desainr.defaultLang']) setDefaultLang(data['desainr.defaultLang']);
      if (data['desainr.autoTranslate']) setAutoTranslate(data['desainr.autoTranslate']);
      if (data['desainr.parallelMode']) setParallelMode(data['desainr.parallelMode']);
      if (data['desainr.modelPreference']) setModelPreference(data['desainr.modelPreference']);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await chrome.storage.sync.set({
        'desainr.defaultLang': defaultLang,
        'desainr.autoTranslate': autoTranslate,
        'desainr.parallelMode': parallelMode,
        'desainr.modelPreference': modelPreference
      });
      
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'success-toast';
      successMsg.textContent = 'Settings saved successfully!';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h2>Extension Settings</h2>
        <p className="subtitle">Configure your DesAInR extension preferences</p>
      </div>

      <div className="settings-section">
        <h3>Language Settings</h3>
        
        <div className="setting-item">
          <label htmlFor="defaultLang">Default Translation Language</label>
          <select 
            id="defaultLang" 
            value={defaultLang} 
            onChange={(e) => setDefaultLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="bn">Bengali</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="zh">Chinese (Simplified)</option>
            <option value="zh-TW">Chinese (Traditional)</option>
            <option value="ar">Arabic</option>
            <option value="it">Italian</option>
          </select>
          <span className="setting-description">
            Default language for translation when using the translate feature
          </span>
        </div>

        <div className="setting-item">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={autoTranslate} 
              onChange={(e) => setAutoTranslate(e.target.checked)}
            />
            <span>Auto-translate on selection</span>
          </label>
          <span className="setting-description">
            Automatically show translation option when text is selected
          </span>
        </div>

        <div className="setting-item">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={parallelMode} 
              onChange={(e) => setParallelMode(e.target.checked)}
            />
            <span>Enable parallel translation mode by default</span>
          </label>
          <span className="setting-description">
            Show original and translated text side by side when translating pages
          </span>
        </div>
      </div>

      <div className="settings-section">
        <h3>AI Model Settings</h3>
        
        <div className="setting-item">
          <label htmlFor="modelPreference">Preferred AI Model</label>
          <select 
            id="modelPreference" 
            value={modelPreference} 
            onChange={(e) => setModelPreference(e.target.value)}
          >
            <option value="default">System Default</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
            <option value="claude-3-opus">Claude 3 Opus</option>
            <option value="claude-3-sonnet">Claude 3 Sonnet</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
          </select>
          <span className="setting-description">
            Select your preferred AI model for text generation and analysis
          </span>
        </div>
      </div>

      <div className="settings-section">
        <h3>Keyboard Shortcuts</h3>
        <div className="shortcuts-list">
          <div className="shortcut-item">
            <span className="shortcut-keys">Ctrl/Cmd + M</span>
            <span className="shortcut-description">Toggle overlay</span>
          </div>
          <div className="shortcut-item">
            <span className="shortcut-keys">Escape</span>
            <span className="shortcut-description">Close overlay or cancel action</span>
          </div>
          <div className="shortcut-item">
            <span className="shortcut-keys">Alt + T</span>
            <span className="shortcut-description">Quick translate selection</span>
          </div>
          <div className="shortcut-item">
            <span className="shortcut-keys">Alt + R</span>
            <span className="shortcut-description">Quick refine selection</span>
          </div>
        </div>
        <p className="setting-description">
          Note: Some shortcuts can be customized in Chrome's extension shortcuts settings
        </p>
      </div>

      <div className="settings-section">
        <h3>Data & Privacy</h3>
        
        <div className="setting-item">
          <button className="btn btn-secondary" onClick={() => {
            if (confirm('This will clear all locally cached data. Are you sure?')) {
              chrome.storage.local.clear(() => {
                alert('Local cache cleared successfully');
              });
            }
          }}>
            Clear Local Cache
          </button>
          <span className="setting-description">
            Clear all locally stored temporary data (does not affect your templates or settings)
          </span>
        </div>

        <div className="setting-item">
          <button className="btn btn-secondary" onClick={() => {
            chrome.tabs.create({ url: 'https://desainr.com/privacy' });
          }}>
            View Privacy Policy
          </button>
          <span className="setting-description">
            Learn about how we handle your data
          </span>
        </div>
      </div>

      <div className="settings-actions">
        <button 
          className="btn btn-primary" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
