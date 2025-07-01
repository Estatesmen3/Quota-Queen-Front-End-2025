
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useRedirectUser = () => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasRedirected, setHasRedirected] = useState(false);
  const redirectAttempts = useRef(0);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const maxRedirectAttempts = 2;
  const lastRedirectPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Clear any previous redirect timers
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }

    // Don't attempt redirection if authentication is still loading
    // or if we've already done a redirection to prevent loops
    if (isLoading || hasRedirected) return;
    
    // Prevent infinite redirect loops
    if (redirectAttempts.current >= maxRedirectAttempts) {
      console.warn("Maximum redirect attempts reached. Stopping redirection logic.");
      return;
    }
    
    // Prevent redirects to the same path multiple times
    if (lastRedirectPathRef.current === location.pathname) {
      console.warn("Preventing duplicate redirect to the same path", location.pathname);
      return;
    }
    
    redirectAttempts.current += 1;

    // Only redirect on public pages (not on protected routes)
    const publicPaths = ['/', '/login', '/signup', '/about', '/for-students', '/for-recruiters', '/pricing'];
    const isPublicPath = publicPaths.includes(location.pathname);
    
    // Check if user is logged in and on a public page
    if (user && isPublicPath) {
      redirectTimerRef.current = setTimeout(() => {



        console.log("profile ----->>>>>> ", profile)


        try {
          // Check for explicit user_type in profile first
          if (profile?.user_type === 'recruiter') {
            lastRedirectPathRef.current = '/recruiter/dashboard';
            navigate('/recruiter/dashboard');
            setHasRedirected(true);
            return;
          }
          
          if (profile?.user_type === 'student') {
            lastRedirectPathRef.current = '/student/dashboard';
            navigate('/student/dashboard');
            setHasRedirected(true);
            return;
          }
          
          // Fall back to email domain check if user_type not set
          const isStudent = user.email?.endsWith('.edu');
          
          if (isStudent) {
            lastRedirectPathRef.current = '/student/dashboard';
            navigate('/student/dashboard');
          } else {
            // Redirect recruiters/companies to the recruiter dashboard
            lastRedirectPathRef.current = '/recruiter/dashboard';
            navigate('/recruiter/dashboard');
          }
          
          setHasRedirected(true);
        } catch (error) {
          console.error("Error during redirection:", error);
          
          toast({
            title: "Navigation Error",
            description: "There was a problem redirecting you. Please try refreshing the page.",
            variant: "destructive"
          });
          
          // Only attempt to navigate if we haven't exceeded the maximum number of attempts
          if (redirectAttempts.current < maxRedirectAttempts && location.pathname === '/') {
            const fallbackPath = user.email?.endsWith('.edu') ? '/student/dashboard' : '/recruiter/dashboard';
            lastRedirectPathRef.current = fallbackPath;
            navigate(fallbackPath);
            setHasRedirected(true);
          }
        }
      }, 100); // Small delay to let React finish current render
    }
    
    // Reset redirect attempts when location changes
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
      redirectAttempts.current = 0;
      // Don't reset hasRedirected here to prevent loops
    };
  }, [user, profile, isLoading, location.pathname, navigate, hasRedirected, toast]);

  // Reset the redirect flag when user logs out
  useEffect(() => {
    if (!user) {
      setHasRedirected(false);
      lastRedirectPathRef.current = null;
    }
  }, [user]);
};

export default useRedirectUser;
