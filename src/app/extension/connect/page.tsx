"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase/clientApp";

export default function ExtensionConnectPage() {
  const searchParams = useSearchParams();
  const redirectUri = searchParams.get("redirect_uri");
  const [status, setStatus] = useState<string>("Initializing...");
  const [err, setErr] = useState<string | null>(null);

  const doRedirect = useCallback(async () => {
    try {
      const auth = getAuth(firebaseApp as any);
      const user = auth.currentUser;
      if (!user) return;
      const idToken = await user.getIdToken(/* forceRefresh */ true);
      if (!redirectUri) {
        setErr("Missing redirect_uri");
        return;
      }
      const url = new URL(redirectUri);
      url.hash = `id_token=${encodeURIComponent(idToken)}`;
      window.location.href = url.toString();
    } catch (e: any) {
      setErr(e?.message || "Failed to complete redirect");
    }
  }, [redirectUri]);

  const doGoogleSignIn = useCallback(async () => {
    try {
      setStatus("Opening Google Sign-In...");
      const auth = getAuth(firebaseApp as any);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setStatus("Authenticated. Finalizing...");
      await doRedirect();
    } catch (e: any) {
      setErr(e?.message || "Google sign-in failed");
    }
  }, [doRedirect]);

  useEffect(() => {
    const auth = getAuth(firebaseApp as any);
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setStatus("Authenticated. Finalizing...");
        await doRedirect();
      } else {
        setStatus("Not signed in");
      }
    });
    return () => unsub();
  }, [doRedirect]);

  return (
    <div style={{
      fontFamily: 'Segoe UI, Arial, sans-serif',
      maxWidth: 520,
      margin: '40px auto',
      padding: 16,
      border: '1px solid #eee',
      borderRadius: 8,
      boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
    }}>
      <h2>Connect DesAInR Extension</h2>
      <p>Status: {status}</p>
      {err && <p style={{ color: 'crimson' }}>Error: {err}</p>}
      <button onClick={doGoogleSignIn} style={{
        padding: '10px 12px', borderRadius: 6, border: '1px solid #ddd',
        background: '#4F46E5', color: 'white', cursor: 'pointer'
      }}>Sign in with Google</button>
      <p style={{ marginTop: 12, color: '#555' }}>
        After signing in, you'll be redirected back to the extension to finish setup.
      </p>
    </div>
  );
}
