
import { useState, useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: 'student' | 'recruiter' | 'any';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'any' 
}) => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const errorTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [hasError, setHasError] = useState(false);
  
  // Add a timeout to prevent infinite loading state
  useEffect(() => {
    // Clear any existing timers when component re-renders
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
    
    if (isLoading) {
      // Set a shorter timeout for loading state
      loadingTimerRef.current = setTimeout(() => {
        setIsLocalLoading(false);
      }, 2000);
      
      // Set a longer timeout for error state
      errorTimerRef.current = setTimeout(() => {
        console.warn("Protected route taking too long to load, assuming error state");
        setHasError(true);
        setIsLocalLoading(false);
      }, 5000);
    } else {
      setIsLocalLoading(false);
    }
    
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, [isLoading]);
  
  // If there's an error or loading takes too long, redirect to a safe path
  if (hasError) {
    console.error("Error in ProtectedRoute: Loading took too long");
    return <Navigate to="/login" replace />;
  }
  
  if (isLoading && isLocalLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Determine user role
  let userRole: 'student' | 'recruiter' = 'student';
  
  try {
    // First check for explicit user type in profile
    if (profile?.user_type === 'student' || profile?.user_type === 'recruiter') {
      userRole = profile.user_type;
    } else {
      // Fall back to email domain check if user_type not set explicitly
      userRole = user.email?.endsWith('.edu') ? 'student' : 'recruiter';
    }
    
    // Check if the user has the required role to access this route
    if (requiredRole !== 'any' && requiredRole !== userRole) {
      // Redirect to the appropriate home page based on actual role
      return <Navigate to={userRole === 'student' ? '/student/dashboard' : '/recruiter/dashboard'} replace />;
    }
    
    // Define which paths belong to each role
    const recruiterPaths = [
      '/recruiter', 
      '/talent-pool', 
      '/messages/recruiter',
      '/call',
      '/performance',
      '/leaderboard/recruiter'
    ];
    
    const studentPaths = [
      '/student',
      '/dashboard', 
      '/roleplay', 
      '/explore',
      '/community',
      '/leaderboard/student',
      '/resources',
      '/messages/student'
    ];
    
    // Check if the user is trying to access a path meant for the other role
    const isRecruiterPath = recruiterPaths.some(path => location.pathname.startsWith(path));
    const isStudentPath = studentPaths.some(path => location.pathname.startsWith(path));
    
    // Redirect if accessing wrong role's paths
    if (userRole === 'student' && isRecruiterPath) {
      return <Navigate to="/student/dashboard" replace />;
    }
    
    if (userRole === 'recruiter' && isStudentPath) {
      return <Navigate to="/recruiter/dashboard" replace />;
    }
  } catch (error) {
    console.error("Error in ProtectedRoute:", error);
    // If there's an error, direct to a safe route based on email domain
    const fallbackRole = user.email?.endsWith('.edu') ? 'student' : 'recruiter';
    return <Navigate to={fallbackRole === 'student' ? '/student/dashboard' : '/recruiter/dashboard'} replace />;
  }
  
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
