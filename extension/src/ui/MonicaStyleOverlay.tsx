// Monica-inspired overlay interface for DesAInR
import React, { useState, useEffect, useRef } from 'react';
import { MonicaTheme, FeatureIcons } from './MonicaStyleTheme';

interface OverlayProps {
  onClose: () => void;
  initialTab?: 'chat' | 'translate' | 'analyze' | 'write';
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MonicaStyleOverlay: React.FC<OverlayProps> = ({ onClose, initialTab = 'chat' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-pro');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Scroll to bottom when new messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I understand you want help with: "${userMessage.content}". This is a placeholder response from the Monica-style DesAInR interface.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const tabs = [
    { id: 'chat', label: 'Chat', icon: FeatureIcons.chat },
    { id: 'translate', label: 'Translate', icon: FeatureIcons.translate },
    { id: 'analyze', label: 'Analyze', icon: FeatureIcons.analyze },
    { id: 'write', label: 'Write', icon: FeatureIcons.rewrite },
  ];

  const quickSuggestions = [
    '✨ Summarize this page',
    '🌐 Translate to English', 
    '📝 Improve this text',
    '❓ Explain this concept',
    '🔍 Analyze content',
  ];

  const modelOptions = [
    { id: 'gemini-pro', name: 'Gemini Pro', badge: 'Smart' },
    { id: 'gemini-flash', name: 'Gemini Flash', badge: 'Fast' },
    { id: 'gpt-4', name: 'GPT-4', badge: 'Advanced' },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: MonicaTheme.zIndex.max,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: MonicaTheme.typography.fontFamily,
    }}>
      {/* Main overlay container */}
      <div style={{
        background: MonicaTheme.colors.surface,
        borderRadius: MonicaTheme.borderRadius.xl,
        border: `1px solid ${MonicaTheme.colors.border}`,
        boxShadow: MonicaTheme.shadows.lg,
        width: '100%',
        maxWidth: '800px',
        height: '80vh',
        maxHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{
          padding: MonicaTheme.spacing.lg,
          borderBottom: `1px solid ${MonicaTheme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'between',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: MonicaTheme.spacing.md }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: `linear-gradient(135deg, ${MonicaTheme.colors.primary}, ${MonicaTheme.colors.primaryHover})`,
              borderRadius: MonicaTheme.borderRadius.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: MonicaTheme.typography.fontWeight.bold,
              fontSize: MonicaTheme.typography.fontSize.lg,
            }}>
              D
            </div>
            <div>
              <h3 style={{
                margin: 0,
                color: MonicaTheme.colors.textPrimary,
                fontSize: MonicaTheme.typography.fontSize.lg,
                fontWeight: MonicaTheme.typography.fontWeight.semibold,
              }}>
                DesAInR Assistant
              </h3>
              <p style={{
                margin: 0,
                color: MonicaTheme.colors.textSecondary,
                fontSize: MonicaTheme.typography.fontSize.sm,
              }}>
                AI-powered writing & analysis assistant
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: MonicaTheme.colors.textSecondary,
              cursor: 'pointer',
              padding: MonicaTheme.spacing.sm,
              borderRadius: MonicaTheme.borderRadius.md,
              transition: `background ${MonicaTheme.animation.fast}`,
              fontSize: MonicaTheme.typography.fontSize.lg,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = MonicaTheme.colors.surfaceHover;
              e.currentTarget.style.color = MonicaTheme.colors.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = MonicaTheme.colors.textSecondary;
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab navigation */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${MonicaTheme.colors.border}`,
          background: MonicaTheme.colors.background,
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? MonicaTheme.colors.primary : 'transparent',
                color: activeTab === tab.id ? 'white' : MonicaTheme.colors.textSecondary,
                border: 'none',
                padding: `${MonicaTheme.spacing.md} ${MonicaTheme.spacing.lg}`,
                cursor: 'pointer',
                transition: `all ${MonicaTheme.animation.fast}`,
                fontSize: MonicaTheme.typography.fontSize.sm,
                fontWeight: MonicaTheme.typography.fontWeight.medium,
                display: 'flex',
                alignItems: 'center',
                gap: MonicaTheme.spacing.sm,
                flex: 1,
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = MonicaTheme.colors.surfaceHover;
                  e.currentTarget.style.color = MonicaTheme.colors.textPrimary;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = MonicaTheme.colors.textSecondary;
                }
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: tab.icon }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'chat' && (
            <>
              {/* Messages area */}
              <div style={{
                flex: 1,
                padding: MonicaTheme.spacing.lg,
                overflowY: 'auto',
                background: MonicaTheme.colors.background,
              }}>
                {messages.length === 0 ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontSize: '48px',
                      marginBottom: MonicaTheme.spacing.lg,
                    }}>
                      🤖
                    </div>
                    <h4 style={{
                      margin: 0,
                      marginBottom: MonicaTheme.spacing.sm,
                      color: MonicaTheme.colors.textPrimary,
                      fontSize: MonicaTheme.typography.fontSize.lg,
                    }}>
                      How can I help you today?
                    </h4>
                    <p style={{
                      margin: 0,
                      marginBottom: MonicaTheme.spacing.xl,
                      color: MonicaTheme.colors.textSecondary,
                      fontSize: MonicaTheme.typography.fontSize.sm,
                    }}>
                      Ask me anything or try one of these suggestions:
                    </p>
                    
                    {/* Quick suggestions */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: MonicaTheme.spacing.sm,
                      justifyContent: 'center',
                      maxWidth: '400px',
                    }}>
                      {quickSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setInputValue(suggestion.replace(/^[^\s]+ /, ''))}
                          style={{
                            background: MonicaTheme.colors.surface,
                            border: `1px solid ${MonicaTheme.colors.border}`,
                            borderRadius: MonicaTheme.borderRadius.full,
                            padding: `${MonicaTheme.spacing.sm} ${MonicaTheme.spacing.md}`,
                            color: MonicaTheme.colors.textSecondary,
                            fontSize: MonicaTheme.typography.fontSize.sm,
                            cursor: 'pointer',
                            transition: `all ${MonicaTheme.animation.fast}`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = MonicaTheme.colors.surfaceHover;
                            e.currentTarget.style.borderColor = MonicaTheme.colors.primary;
                            e.currentTarget.style.color = MonicaTheme.colors.textPrimary;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = MonicaTheme.colors.surface;
                            e.currentTarget.style.borderColor = MonicaTheme.colors.border;
                            e.currentTarget.style.color = MonicaTheme.colors.textSecondary;
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {messages.map(message => (
                      <div
                        key={message.id}
                        style={{
                          marginBottom: MonicaTheme.spacing.lg,
                          display: 'flex',
                          flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
                          gap: MonicaTheme.spacing.md,
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: MonicaTheme.borderRadius.full,
                          background: message.type === 'user' 
                            ? `linear-gradient(135deg, ${MonicaTheme.colors.primary}, ${MonicaTheme.colors.primaryHover})`
                            : MonicaTheme.colors.surface,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: message.type === 'user' ? 'white' : MonicaTheme.colors.textPrimary,
                          fontSize: MonicaTheme.typography.fontSize.sm,
                          fontWeight: MonicaTheme.typography.fontWeight.semibold,
                          flexShrink: 0,
                        }}>
                          {message.type === 'user' ? 'U' : '🤖'}
                        </div>
                        <div style={{
                          background: message.type === 'user' 
                            ? `linear-gradient(135deg, ${MonicaTheme.colors.primary}, ${MonicaTheme.colors.primaryHover})`
                            : MonicaTheme.colors.surface,
                          color: message.type === 'user' ? 'white' : MonicaTheme.colors.textPrimary,
                          padding: MonicaTheme.spacing.md,
                          borderRadius: MonicaTheme.borderRadius.lg,
                          maxWidth: '70%',
                          fontSize: MonicaTheme.typography.fontSize.sm,
                          lineHeight: MonicaTheme.typography.lineHeight.normal,
                        }}>
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div style={{
                        display: 'flex',
                        gap: MonicaTheme.spacing.md,
                        marginBottom: MonicaTheme.spacing.lg,
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: MonicaTheme.borderRadius.full,
                          background: MonicaTheme.colors.surface,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          🤖
                        </div>
                        <div style={{
                          background: MonicaTheme.colors.surface,
                          padding: MonicaTheme.spacing.md,
                          borderRadius: MonicaTheme.borderRadius.lg,
                          color: MonicaTheme.colors.textSecondary,
                          fontSize: MonicaTheme.typography.fontSize.sm,
                        }}>
                          Thinking...
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input area */}
              <div style={{
                padding: MonicaTheme.spacing.lg,
                borderTop: `1px solid ${MonicaTheme.colors.border}`,
                background: MonicaTheme.colors.surface,
              }}>
                {/* Model selector */}
                <div style={{
                  marginBottom: MonicaTheme.spacing.md,
                  display: 'flex',
                  gap: MonicaTheme.spacing.sm,
                }}>
                  {modelOptions.map(model => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      style={{
                        background: selectedModel === model.id ? MonicaTheme.colors.primary : MonicaTheme.colors.background,
                        color: selectedModel === model.id ? 'white' : MonicaTheme.colors.textSecondary,
                        border: `1px solid ${selectedModel === model.id ? MonicaTheme.colors.primary : MonicaTheme.colors.border}`,
                        borderRadius: MonicaTheme.borderRadius.md,
                        padding: `${MonicaTheme.spacing.xs} ${MonicaTheme.spacing.sm}`,
                        fontSize: MonicaTheme.typography.fontSize.xs,
                        cursor: 'pointer',
                        transition: `all ${MonicaTheme.animation.fast}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: MonicaTheme.spacing.xs,
                      }}
                    >
                      {model.name}
                      <span style={{
                        background: selectedModel === model.id ? 'rgba(255,255,255,0.2)' : MonicaTheme.colors.primary,
                        color: selectedModel === model.id ? 'white' : 'white',
                        padding: '2px 6px',
                        borderRadius: MonicaTheme.borderRadius.sm,
                        fontSize: '10px',
                      }}>
                        {model.badge}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Input field */}
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: MonicaTheme.spacing.md,
                }}>
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask anything..."
                    style={{
                      flex: 1,
                      background: MonicaTheme.colors.background,
                      border: `1px solid ${MonicaTheme.colors.border}`,
                      borderRadius: MonicaTheme.borderRadius.lg,
                      padding: MonicaTheme.spacing.md,
                      color: MonicaTheme.colors.textPrimary,
                      fontSize: MonicaTheme.typography.fontSize.sm,
                      fontFamily: MonicaTheme.typography.fontFamily,
                      resize: 'none',
                      minHeight: '44px',
                      maxHeight: '120px',
                      outline: 'none',
                      transition: `border-color ${MonicaTheme.animation.fast}`,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = MonicaTheme.colors.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = MonicaTheme.colors.border;
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    style={{
                      background: inputValue.trim() && !isLoading ? MonicaTheme.colors.primary : MonicaTheme.colors.surface,
                      color: inputValue.trim() && !isLoading ? 'white' : MonicaTheme.colors.textMuted,
                      border: 'none',
                      borderRadius: MonicaTheme.borderRadius.md,
                      padding: MonicaTheme.spacing.md,
                      cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
                      transition: `all ${MonicaTheme.animation.fast}`,
                      fontSize: MonicaTheme.typography.fontSize.lg,
                      minWidth: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isLoading ? '⏳' : '🚀'}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Other tabs content placeholder */}
          {activeTab !== 'chat' && (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: MonicaTheme.colors.textSecondary,
              fontSize: MonicaTheme.typography.fontSize.lg,
            }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} feature coming soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonicaStyleOverlay;
