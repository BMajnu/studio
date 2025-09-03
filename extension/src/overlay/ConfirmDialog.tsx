/**
 * Confirmation dialog component for destructive actions
 * Provides accessible, themed confirmation prompts
 */

import React, { useEffect, useRef } from 'react';
import { createFocusTrap, setupEscapeHandler, announceToScreenReader } from './accessibility';
import { Theme } from './theme';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  theme: Theme;
  destructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  theme,
  destructive = false
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    // Create focus trap
    const cleanupFocus = createFocusTrap(dialogRef.current);
    
    // Setup escape handler
    const cleanupEscape = setupEscapeHandler(onCancel);
    
    // Announce dialog
    announceToScreenReader(`Confirmation required: ${title}`, 'assertive');

    return () => {
      cleanupFocus();
      cleanupEscape();
    };
  }, [isOpen, title, onCancel]);

  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.name === 'high-contrast' 
      ? 'rgba(255, 255, 255, 0.5)' 
      : 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999
  };

  const dialogStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    border: `${theme.borders.width} solid ${theme.colors.border}`,
    borderRadius: theme.borders.radius,
    padding: '20px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: theme.shadows.lg
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: theme.fonts.weight.bold,
    color: destructive ? theme.colors.error : theme.colors.text,
    marginBottom: '12px'
  };

  const messageStyle: React.CSSProperties = {
    fontSize: '14px',
    color: theme.colors.textSecondary,
    marginBottom: '20px',
    lineHeight: '1.5'
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end'
  };

  const buttonStyle = (variant: 'primary' | 'secondary'): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: theme.borders.radius - 2,
    border: `${theme.borders.width} solid ${
      variant === 'primary' 
        ? (destructive ? theme.colors.error : theme.colors.primary)
        : theme.colors.border
    }`,
    backgroundColor: variant === 'primary'
      ? (destructive ? theme.colors.error : theme.colors.primary)
      : theme.colors.background,
    color: variant === 'primary'
      ? theme.colors.primaryText
      : theme.colors.text,
    fontWeight: theme.fonts.weight.medium,
    cursor: 'pointer',
    fontSize: '14px'
  });

  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div
        ref={dialogRef}
        style={dialogStyle}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <h2 id="confirm-title" style={titleStyle}>
          {title}
        </h2>
        <p id="confirm-message" style={messageStyle}>
          {message}
        </p>
        <div style={buttonContainerStyle}>
          <button
            style={buttonStyle('secondary')}
            onClick={onCancel}
            aria-label={cancelLabel}
          >
            {cancelLabel}
          </button>
          <button
            style={buttonStyle('primary')}
            onClick={() => {
              onConfirm();
              announceToScreenReader('Action confirmed', 'polite');
            }}
            aria-label={confirmLabel}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for managing confirmation dialogs
export function useConfirmDialog() {
  const [dialogState, setDialogState] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    destructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    destructive: false
  });

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    destructive = false
  ) => {
    setDialogState({
      isOpen: true,
      title,
      message,
      onConfirm,
      destructive
    });
  };

  const hideConfirm = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    dialogState,
    showConfirm,
    hideConfirm
  };
}
