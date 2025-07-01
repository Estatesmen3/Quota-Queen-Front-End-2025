
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Crown, User, Briefcase, University, AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<'student' | 'recruiter'>('student');
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Pass user type as metadata to be stored in the session
      const { error } = await signIn(email, password, {
        user_type: userType
      });
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // Successful login will trigger the useEffect above
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Crown className="text-white" size={20} />
            </div>
            <span className="font-semibold text-xl">Quota Queen</span>
          </Link>
        </div>
        
        <div className="bg-background rounded-xl shadow-lg border border-border p-8 animate-scale-in">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-1">Log in to your account</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <RadioGroup
              defaultValue={userType}
              className="grid grid-cols-2 gap-4"
              onValueChange={(value) => setUserType(value as 'student' | 'recruiter')}
            >
              <div className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${userType === 'student' ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}`}>
                <RadioGroupItem value="student" id="student" className="sr-only" />
                <Label htmlFor="student" className="flex items-center space-x-2 cursor-pointer w-full">
                  <University className="h-5 w-5" />
                  <div className="flex flex-col">
                    <span className="font-medium">Student</span>
                    <span className="text-xs text-muted-foreground">University email</span>
                  </div>
                </Label>
              </div>
              
              <div className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${userType === 'recruiter' ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}`}>
                <RadioGroupItem value="recruiter" id="recruiter" className="sr-only" />
                <Label htmlFor="recruiter" className="flex items-center space-x-2 cursor-pointer w-full">
                  <Briefcase className="h-5 w-5" />
                  <div className="flex flex-col">
                    <span className="font-medium">Recruiter</span>
                    <span className="text-xs text-muted-foreground">Company email</span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={userType === 'student' ? "you@university.edu" : "you@company.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
