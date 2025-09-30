'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, Key, User } from 'lucide-react';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const { profile, updateProfile, isLoading } = useUserProfile();
  const router = useRouter();
  const [step, setStep] = useState<'welcome' | 'apikey' | 'profile'>('welcome');
  const [apiKey, setApiKey] = useState('');
  const [name, setName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setProfessionalTitle(profile.professionalTitle || '');
      
      // Check if user has valid API keys
      const hasValidKey = profile.geminiApiKeys && 
        profile.geminiApiKeys.length > 0 && 
        profile.geminiApiKeys[0] && 
        profile.geminiApiKeys[0].trim() !== '';
      
      if (hasValidKey && apiKey === '' && profile.geminiApiKeys) {
        setApiKey(profile.geminiApiKeys[0]);
      }
    }
  }, [profile]);

  const validateApiKey = (key: string): boolean => {
    // Basic validation: should be non-empty and look like an API key
    if (!key || key.trim().length < 20) {
      setError('অনুগ্রহ করে একটি বৈধ Gemini API Key প্রদান করুন (কমপক্ষে ২০ অক্ষর)');
      return false;
    }
    
    // Check if it starts with typical API key prefixes
    if (!key.startsWith('AI') && !key.startsWith('SK-')) {
      setError('API Key সাধারণত "AI" বা "SK-" দিয়ে শুরু হয়। নিশ্চিত করুন এটি সঠিক।');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleApiKeyNext = () => {
    if (validateApiKey(apiKey)) {
      setStep('profile');
    }
  };

  const handleComplete = async () => {
    if (!name.trim()) {
      setError('অনুগ্রহ করে আপনার নাম প্রদান করুন');
      return;
    }

    if (!validateApiKey(apiKey)) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      await updateProfile({
        name: name.trim(),
        professionalTitle: professionalTitle.trim() || 'Graphic Designer',
        geminiApiKeys: [apiKey.trim()],
      });

      onComplete();
    } catch (err) {
      console.error('Profile save error:', err);
      setError('প্রোফাইল সংরক্ষণে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setSaving(false);
    }
  };

  const handleGoToProfile = () => {
    router.push('/profile');
  };

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-[550px] glass-panel backdrop-blur-xl border-2 border-primary/20 shadow-2xl rounded-2xl animate-fade-in" 
        onPointerDownOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-2xl opacity-40 pointer-events-none"></div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-3xl font-bold flex items-center gap-3 text-gradient">
            {step === 'welcome' && (
              <>
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-accent/30 blur-md animate-pulse-slow"></div>
                  <span className="relative">🎨</span>
                </div>
                DesAInR এ স্বাগতম!
              </>
            )}
            {step === 'apikey' && (
              <>
                <div className="relative p-2 rounded-lg bg-gradient-to-br from-primary to-primary/70">
                  <Key className="h-7 w-7 text-primary-foreground" />
                </div>
                API Key সেটআপ
              </>
            )}
            {step === 'profile' && (
              <>
                <div className="relative p-2 rounded-lg bg-gradient-to-br from-accent to-accent/70">
                  <User className="h-7 w-7 text-accent-foreground" />
                </div>
                প্রোফাইল সেটআপ
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-base text-foreground/80 mt-2">
            {step === 'welcome' && '✨ শুরু করার আগে, আমাদের আপনার কিছু তথ্য প্রয়োজন'}
            {step === 'apikey' && '🔑 AI ফিচার ব্যবহারের জন্য আপনার Gemini API Key প্রয়োজন'}
            {step === 'profile' && '👤 আপনার প্রোফাইল তথ্য দিয়ে শেষ করুন'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 relative z-10">
          {/* Welcome Step */}
          {step === 'welcome' && (
            <div className="space-y-4 animate-fade-in">
              <Alert className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                  <AlertDescription className="text-base text-foreground/90">
                    DesAInR ব্যবহার করার জন্য আপনার <strong className="text-primary">নিজস্ব Gemini API Key</strong> এবং 
                    প্রোফাইল সেটআপ করতে হবে। এটি ছাড়া AI ফিচারগুলো কাজ করবে না।
                  </AlertDescription>
                </div>
              </Alert>

              <div className="space-y-3 glass-panel p-5 rounded-xl border border-accent/20 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-gradient-to-br from-accent to-accent/70">
                    <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <h3 className="font-bold text-lg text-gradient">কীভাবে Gemini API Key পাবেন?</h3>
                </div>
                <ol className="list-decimal list-inside space-y-3 text-sm text-foreground/90">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary min-w-[1.5rem]">1.</span>
                    <span>
                      <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
                      >
                        Google AI Studio
                      </a> এ যান
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary min-w-[1.5rem]">2.</span>
                    <span>Sign in করুন (Gmail দিয়ে)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary min-w-[1.5rem]">3.</span>
                    <span>"Create API Key" বাটনে ক্লিক করুন</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary min-w-[1.5rem]">4.</span>
                    <span>API Key কপি করুন</span>
                  </li>
                </ol>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  onClick={() => setStep('apikey')} 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-full btn-glow"
                >
                  পরবর্তী: API Key সেটআপ →
                </Button>
              </div>
            </div>
          )}

          {/* API Key Step */}
          {step === 'apikey' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-3">
                <Label htmlFor="apiKey" className="text-base font-semibold flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  Gemini API Key <span className="text-destructive">*</span>
                </Label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      setError('');
                    }}
                    placeholder="AIza... অথবা SK-..."
                    className="relative font-mono glass-panel border-primary/30 focus:border-primary shadow-lg transition-all duration-300"
                  />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  আপনার API Key নিরাপদ এবং শুধুমাত্র আপনার ডিভাইসে সংরক্ষিত থাকবে
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="border-2 border-destructive/30 bg-destructive/10">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertDescription className="font-medium">{error}</AlertDescription>
                  </div>
                </Alert>
              )}

              <Alert className="border-2 border-accent/30 bg-gradient-to-r from-accent/10 to-primary/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <AlertDescription className="text-sm font-medium">
                    API Key পাওয়ার পর, এখানে পেস্ট করুন এবং Next ক্লিক করুন
                  </AlertDescription>
                </div>
              </Alert>

              <div className="flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('welcome')}
                  className="rounded-full border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                >
                  ← পূর্ববর্তী
                </Button>
                <Button 
                  onClick={handleApiKeyNext} 
                  disabled={!apiKey.trim()}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 disabled:from-muted disabled:to-muted text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-full btn-glow"
                >
                  পরবর্তী: প্রোফাইল →
                </Button>
              </div>
            </div>
          )}

          {/* Profile Step */}
          {step === 'profile' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  আপনার নাম <span className="text-destructive">*</span>
                </Label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                    placeholder="যেমন: আপনার নাম"
                    className="relative glass-panel border-primary/30 focus:border-primary shadow-lg transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-semibold">
                  পেশাগত পদবী (ঐচ্ছিক)
                </Label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 via-secondary/20 to-accent/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <Input
                    id="title"
                    value={professionalTitle}
                    onChange={(e) => setProfessionalTitle(e.target.value)}
                    placeholder="যেমন: Graphic Designer, UI/UX Designer"
                    className="relative glass-panel border-accent/30 focus:border-accent shadow-lg transition-all duration-300"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="border-2 border-destructive/30 bg-destructive/10">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertDescription className="font-medium">{error}</AlertDescription>
                  </div>
                </Alert>
              )}

              <Alert className="border-2 border-accent/30 bg-gradient-to-r from-accent/10 to-secondary/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <AlertDescription className="text-sm font-medium">
                    আরও বিস্তারিত তথ্য পরে Profile পেজ থেকে আপডেট করতে পারবেন
                  </AlertDescription>
                </div>
              </Alert>

              <div className="flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('apikey')}
                  className="rounded-full border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                >
                  ← পূর্ববর্তী
                </Button>
                <Button 
                  onClick={handleComplete} 
                  disabled={saving || !name.trim()}
                  className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 disabled:from-muted disabled:to-muted text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-full btn-glow"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2"></div>
                      সংরক্ষণ করা হচ্ছে...
                    </>
                  ) : (
                    <>সম্পন্ন করুন ✓</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Alternative: Go to Profile Page */}
        <div className="border-t border-primary/10 pt-4 relative z-10">
          <Button 
            variant="ghost" 
            className="w-full hover:bg-primary/5 text-primary hover:text-primary/80 transition-all duration-300 rounded-full" 
            onClick={handleGoToProfile}
          >
            <User className="h-4 w-4 mr-2" />
            অথবা সম্পূর্ণ প্রোফাইল পেজে যান →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
