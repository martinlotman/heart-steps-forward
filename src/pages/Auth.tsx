
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from '@/hooks/useTranslations';
import { useToast } from '@/hooks/use-toast';
import { LanguageSelector } from '@/components/LanguageSelector';

const Auth = () => {
  const navigate = useNavigate();
  const { user, signUp, signIn, loading } = useAuth();
  const { t } = useTranslations();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Redirect authenticated users
  useEffect(() => {
    if (user && !loading) {
      const onboardingComplete = localStorage.getItem('onboardingComplete');
      if (onboardingComplete === 'true') {
        navigate('/');
      } else {
        navigate('/onboarding');
      }
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Try signing in instead.",
              variant: "destructive"
            });
            setIsSignUp(false);
          } else if (error.message.includes('rate limit') || error.message.includes('46 seconds')) {
            toast({
              title: "Please wait",
              description: "Too many requests. Please wait a moment before trying again.",
              variant: "destructive"
            });
          } else {
            throw error;
          }
        } else {
          setSignupSuccess(true);
          toast({
            title: "Account created successfully!",
            description: "Please check your email and click the confirmation link to complete your registration.",
          });
          // Auto-switch to sign in after showing success message
          setTimeout(() => {
            setSignupSuccess(false);
            setIsSignUp(false);
          }, 3000);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Invalid credentials",
              description: "Please check your email and password and try again.",
              variant: "destructive"
            });
          } else if (error.message.includes('Email not confirmed')) {
            toast({
              title: "Email not confirmed",
              description: "Please check your email and click the confirmation link first.",
              variant: "destructive"
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in.",
          });
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="absolute top-4 right-4">
            <LanguageSelector />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center text-green-600">
                Check Your Email
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                We've sent a confirmation link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Please check your email and click the confirmation link to complete your registration.
              </p>
              <Button 
                onClick={() => {
                  setSignupSuccess(false);
                  setIsSignUp(false);
                }}
                variant="outline"
                className="w-full"
              >
                {t('auth.sign_in', 'Back to Sign In')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isSignUp ? t('auth.create_account') : t('auth.welcome_back')}
            </CardTitle>
            <p className="text-center text-gray-600">
              {isSignUp 
                ? t('auth.start_journey') 
                : t('auth.continue_journey')
              }
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.email')}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.password')}
                  minLength={6}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (isSignUp ? t('auth.creating_account') : t('auth.signing_in')) 
                  : (isSignUp ? t('auth.create_account') : t('auth.sign_in'))
                }
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:underline"
              >
                {isSignUp 
                  ? t('auth.already_have_account') 
                  : t('auth.no_account')
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
