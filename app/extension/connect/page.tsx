'use client';

import { useEffect, useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { firebaseApp } from '@/lib/firebase/clientApp';

export default function ExtensionConnect() {
  const [status, setStatus] = useState<'loading' | 'signing-in' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        setStatus('loading');
        
        // Get redirect URI from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUri = urlParams.get('redirect_uri');
        
        if (!redirectUri) {
          throw new Error('No redirect URI provided');
        }

        setStatus('signing-in');
        
        // Sign in with Google
        const auth = getAuth(firebaseApp);
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        
        // Get the ID token
        const idToken = await result.user.getIdToken();
        
        setStatus('success');
        
        // Redirect back to extension with the token
        const redirectUrl = `${redirectUri}#id_token=${encodeURIComponent(idToken)}`;
        window.location.href = redirectUrl;
        
      } catch (err: any) {
        console.error('Auth error:', err);
        setStatus('error');
        setError(err?.message || 'Authentication failed');
      }
    };

    handleAuth();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '32px',
          fontWeight: 'bold',
          margin: '0 auto 24px'
        }}>
          D
        </div>
        
        <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#1a202c' }}>
          DesAInR Extension
        </h1>
        
        {status === 'loading' && (
          <>
            <p style={{ color: '#718096', marginBottom: '24px' }}>
              Preparing authentication...
            </p>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e2e8f0',
              borderTopColor: '#667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
          </>
        )}
        
        {status === 'signing-in' && (
          <>
            <p style={{ color: '#718096', marginBottom: '24px' }}>
              Please sign in with your Google account...
            </p>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e2e8f0',
              borderTopColor: '#667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
          </>
        )}
        
        {status === 'success' && (
          <>
            <p style={{ color: '#48bb78', marginBottom: '24px' }}>
              ✓ Authentication successful!
            </p>
            <p style={{ color: '#718096', fontSize: '14px' }}>
              Redirecting back to extension...
            </p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <p style={{ color: '#e53e3e', marginBottom: '16px' }}>
              Authentication failed
            </p>
            <p style={{ color: '#718096', fontSize: '14px', marginBottom: '24px' }}>
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </>
        )}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
