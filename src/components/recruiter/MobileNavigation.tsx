
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationItems } from "./NavigationItems";
import { UserProfileSection } from "./UserProfileSection";
import { cn } from "@/lib/utils";

export const MobileNavigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Reset mobile menu when route changes
  useEffect(() => {
    // Close the mobile menu when navigating to a new page
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-background border-b border-dopamine-purple/10 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-dopamine-purple to-dopamine-pink flex items-center justify-center animate-pulse-subtle">
            <Crown className="text-white" size={16} />
          </div>
          <span className="font-semibold bg-gradient-to-r from-dopamine-purple to-dopamine-pink bg-clip-text text-transparent">
            Quota Queen
          </span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="hover:bg-dopamine-purple/10 hover:text-dopamine-purple transition-colors"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-20 animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile menu */}
      <div 
        className={cn(
          "md:hidden fixed top-[60px] right-0 bottom-0 w-64 bg-background border-l border-dopamine-purple/10 shadow-xl z-30 transition-transform duration-300 transform",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <NavigationItems variant="mobile" />
          <UserProfileSection />
        </div>
      </div>
    </>
  );
};
