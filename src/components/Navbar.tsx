
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Crown, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update main navigation links to ensure they match routes in App.tsx
  const navLinks = [
    { name: "For Students", path: "/for-students" },
    { name: "For Recruiters", path: "/for-recruiters" },
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-200",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-b py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div
            className={cn(
              "w-10 h-10 rounded-lg bg-primary flex items-center justify-center"
            )}
          >
            <Crown className="text-white" size={20} />
          </div>
          <span className="font-semibold text-xl">Quota Queen</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Button
              key={link.name}
              variant="ghost"
              asChild
              className={cn(
                "text-sm",
                location.pathname === link.path &&
                  "bg-muted hover:bg-muted"
              )}
            >
              <Link to={link.path}>{link.name}</Link>
            </Button>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          {user ? (
            <Button asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b animate-fade-in">
          <div className="container py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-md",
                  location.pathname === link.path
                    ? "bg-muted font-medium"
                    : "hover:bg-muted/50"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t pt-4 mt-2 space-y-4">
              {user ? (
                <Button className="w-full" onClick={() => setIsMenuOpen(false)} asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button
                    className="w-full"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
