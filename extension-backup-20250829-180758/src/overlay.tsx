import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

interface OverlayProps {
  onClose: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000000,
      background: 'white',
      color: '#111',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
      maxWidth: '420px',
      fontFamily: 'Segoe UI, Arial, sans-serif',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>DesAInR Assistant</h3>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          style={{
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '4px 8px',
            background: '#f7f7f7',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Close
        </button>
      </div>
      <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
        <p>AI-powered writing assistant ready to help you:</p>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>Refine and clarify text</li>
          <li>Translate content</li>
          <li>Analyze pages</li>
          <li>Apply custom actions</li>
        </ul>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '12px' }}>
          Select text on any page to see options, or press <strong>Ctrl/Cmd+M</strong> to toggle this overlay.
        </p>
      </div>
    </div>
  );
};

export function mountOverlay(host: HTMLElement, onClose: () => void): { detach: () => void } {
  const root = ReactDOM.createRoot(host);
  root.render(<Overlay onClose={onClose} />);
  
  return {
    detach: () => {
      root.unmount();
      host.remove();
    }
  };
}
