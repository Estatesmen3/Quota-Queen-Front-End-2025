
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { SplashScreen } from "./SplashScreen";
import { useLocation } from "react-router-dom";

interface SplashScreenWrapperProps {
  children: React.ReactNode;
}

export const SplashScreenWrapper = ({ children }: SplashScreenWrapperProps) => {
  const [showSplash, setShowSplash] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only show splash on index page (/)
    if (location.pathname === "/") {
      // Check localStorage to determine if we should show the splash
      const hasShownSplash = localStorage.getItem("quotaQueenSplashShown");
      const timestamp = localStorage.getItem("quotaQueenSplashTimestamp");
      const currentTime = Date.now();
      
      // Show splash if never shown before or if it's been more than 3 hours
      const shouldShowSplash = 
        !hasShownSplash || 
        !timestamp || 
        (currentTime - parseInt(timestamp)) > 3 * 60 * 60 * 1000;
      
      if (shouldShowSplash) {
        setShowSplash(true);
        setAnimationComplete(false);
        localStorage.setItem("quotaQueenSplashShown", "true");
        localStorage.setItem("quotaQueenSplashTimestamp", currentTime.toString());
      } else {
        setAnimationComplete(true);
      }
    } else {
      // For other routes, don't show splash and set animation as complete
      setShowSplash(false);
      setAnimationComplete(true);
    }
    
    // Set a timeout to ensure content is displayed even if animation gets stuck
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleAnimationComplete = () => {
    setShowSplash(false);
    setAnimationComplete(true);
  };

  // Add a safety timeout to ensure content always displays even if animation fails
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 4000);
    
    return () => clearTimeout(safetyTimer);
  }, []);

  // Reset splash on manual navigation to home
  useEffect(() => {
    if (location.pathname === "/" && !showSplash && !animationComplete) {
      setAnimationComplete(true);
    }
  }, [location.pathname, showSplash, animationComplete]);

  // Don't render anything until we've decided whether to show splash
  if (!isLoaded) return null;

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onAnimationComplete={handleAnimationComplete} />
        )}
      </AnimatePresence>
      <div className={!animationComplete ? "invisible" : "visible animate-fade-in"}>
        {children}
      </div>
    </>
  );
};
