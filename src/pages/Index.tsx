import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from "./LandingPage";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check for access token in URL hash (for OAuth redirects)
  useEffect(() => {
    const handleAuthRedirect = async () => {
      // Check if we have an access token in the URL hash
      const hash = window.location.hash;
      if (hash && hash.includes('access_token=')) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        
        if (accessToken) {
          console.log('Found GitHub auth token in URL, setting session...');
          try {
            // Set the session with the tokens from the URL
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
            
            if (error) throw error;
            
            // Redirect to dashboard on success
            navigate('/dashboard', { replace: true });
            
            toast({
              title: 'Successfully logged in',
              description: 'Welcome back!',
            });
          } catch (error) {
            console.error('Error setting auth session:', error);
            toast({
              title: 'Authentication failed',
              description: 'There was an error logging you in. Please try again.',
              variant: 'destructive',
            });
            // Redirect to login page on failure
            navigate('/login', { replace: true });
          }
          return; // Stop rendering the landing page during auth
        }
      }
    };
    
    handleAuthRedirect();
  }, [navigate, toast]);
  
  return <LandingPage />;
};

export default Index;
