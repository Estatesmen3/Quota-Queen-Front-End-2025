
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const useRedirectStudent = () => {
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect on public pages (not on protected routes)
    const publicPaths = ['/', '/login', '/signup', '/about', '/for-students', '/for-recruiters', '/pricing'];
    const isPublicPath = publicPaths.includes(location.pathname);
    
    // Check if user is logged in and on a public page
    if (user && isPublicPath) {
      // Check if user is a student (either by email domain or profile type)
      const isStudent = user.email?.endsWith('.edu') || profile?.user_type === 'student';
      
      if (isStudent) {
        navigate('/student/dashboard');
      } else {
        navigate('/recruiter/dashboard');
      }
    }
  }, [user, profile, location.pathname, navigate]);
};

export default useRedirectStudent;
