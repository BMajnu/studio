/**
 * Toast notification component for the overlay
 * Provides accessible, styled notifications with auto-dismiss
 */

import React, { useEffect, useState } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
  highContrast?: boolean;
}

export function Toast({ messages, onRemove, highContrast = false }: ToastProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none'
      }}
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {messages.map(msg => (
        <ToastItem
          key={msg.id}
          message={msg}
          onRemove={onRemove}
          highContrast={highContrast}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  message: ToastMessage;
  onRemove: (id: string) => void;
  highContrast?: boolean;
}

function ToastItem({ message, onRemove, highContrast = false }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto-dismiss after duration
    const duration = message.duration || 5000;
    const dismissTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onRemove(message.id), 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [message, onRemove]);

  const getColors = () => {
    if (highContrast) {
      switch (message.type) {
        case 'success':
          return { bg: '#000', border: '#0f0', text: '#0f0', icon: '✓' };
        case 'error':
          return { bg: '#000', border: '#f00', text: '#f00', icon: '✕' };
        case 'warning':
          return { bg: '#000', border: '#ff0', text: '#ff0', icon: '⚠' };
        case 'info':
        default:
          return { bg: '#000', border: '#0ff', text: '#0ff', icon: 'ℹ' };
      }
    } else {
      switch (message.type) {
        case 'success':
          return { bg: '#f0f9ff', border: '#0ea5e9', text: '#0c4a6e', icon: '✓' };
        case 'error':
          return { bg: '#fef2f2', border: '#ef4444', text: '#991b1b', icon: '✕' };
        case 'warning':
          return { bg: '#fffbeb', border: '#f59e0b', text: '#92400e', icon: '⚠' };
        case 'info':
        default:
          return { bg: '#f0f9ff', border: '#3b82f6', text: '#1e3a8a', icon: 'ℹ' };
      }
    }
  };

  const colors = getColors();

  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: 8,
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`,
        color: colors.text,
        fontFamily: 'Segoe UI, Arial, sans-serif',
        fontSize: 14,
        fontWeight: highContrast ? 600 : 500,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minWidth: 250,
        maxWidth: 400,
        boxShadow: highContrast 
          ? `0 0 0 3px ${colors.border}40` 
          : '0 4px 12px rgba(0,0,0,0.15)',
        pointerEvents: 'auto',
        cursor: 'pointer',
        opacity: isLeaving ? 0 : (isVisible ? 1 : 0),
        transform: isLeaving 
          ? 'translateX(100%)' 
          : (isVisible ? 'translateX(0)' : 'translateX(100%)'),
        transition: 'opacity 0.3s, transform 0.3s'
      }}
      onClick={() => onRemove(message.id)}
      role="alert"
      aria-atomic="true"
    >
      <span style={{ fontSize: 18 }}>{colors.icon}</span>
      <span style={{ flex: 1 }}>{message.message}</span>
      <button
        style={{
          background: 'transparent',
          border: 'none',
          color: colors.text,
          cursor: 'pointer',
          padding: 4,
          fontSize: 18,
          opacity: 0.7
        }}
        aria-label="Dismiss notification"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(message.id);
        }}
      >
        ×
      </button>
    </div>
  );
}

// Toast manager hook
export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastMessage['type'] = 'info', duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setMessages(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return {
    messages,
    addToast,
    removeToast,
    showSuccess: (msg: string, duration?: number) => addToast(msg, 'success', duration),
    showError: (msg: string, duration?: number) => addToast(msg, 'error', duration),
    showWarning: (msg: string, duration?: number) => addToast(msg, 'warning', duration),
    showInfo: (msg: string, duration?: number) => addToast(msg, 'info', duration),
  };
}
