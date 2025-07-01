
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Trophy, ChevronRight, Zap, Target, ArrowUpRight, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import HowItWorks from "@/components/HowItWorks";

const ForStudents = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32">
        {/* Hero Section */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 highlight-gradient">
                Elevate Your Sales Career
              </h1>
              <p className="text-xl text-foreground mb-8">
                Master sales techniques with personalized training, compete against top university sales talent, 
                build your portfolio, and get discovered by top recruiters actively looking for talent like you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8 py-6 text-lg dopamine-gradient-1 border-none shadow-lg glow-on-hover relative overflow-hidden group" asChild>
                  <Link to={user ? "/explore" : "/signup"}>
                    {user ? "Get Started" : "Get Started"}
                    <motion.div 
                      className="absolute inset-0 bg-white opacity-0"
                      whileHover={{ 
                        opacity: [0, 0.1, 0],
                        transition: { duration: 0.5 }
                      }}
                    />
                  </Link>
                </Button>
                {!user && (
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-primary/50 text-primary hover:bg-primary/5 relative overflow-hidden" asChild>
                    <Link to="/login">
                      Sign In
                      <motion.div 
                        className="absolute inset-0 bg-primary/10 opacity-0"
                        whileHover={{ 
                          opacity: [0, 0.2, 0],
                          transition: { duration: 0.5 }
                        }}
                      />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="transform transition-all duration-500 hover:scale-105"
              >
                <Card className="text-center dopamine-gradient-1 text-white border-none shadow-lg relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-white opacity-0"
                    whileHover={{ 
                      opacity: [0, 0.05, 0],
                      transition: { duration: 0.8, repeat: Infinity }
                    }}
                  />
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold">30+</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">Average job offers for top performers</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="transform transition-all duration-500 hover:scale-105"
              >
                <Card className="text-center dopamine-gradient-2 text-white border-none shadow-lg relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-white opacity-0"
                    whileHover={{ 
                      opacity: [0, 0.05, 0],
                      transition: { duration: 0.8, repeat: Infinity }
                    }}
                  />
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold">86%</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">Higher interview success rate</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="transform transition-all duration-500 hover:scale-105"
              >
                <Card className="text-center dopamine-gradient-3 text-white border-none shadow-lg relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-white opacity-0"
                    whileHover={{ 
                      opacity: [0, 0.05, 0],
                      transition: { duration: 0.8, repeat: Infinity }
                    }}
                  />
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold">125%</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg">Higher starting salary vs. peers</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* How It Works - Removed gradient background */}
        <section className="py-16 relative overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dopamine-purple">
                How Quota Queen Works
              </h2>
              <p className="text-lg text-foreground max-w-2xl mx-auto font-medium">
                Our platform provides everything you need to excel in sales interviews and accelerate your career.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="transform transition-all duration-500 hover:scale-105"
              >
                <Card className="card-hover-effect relative overflow-hidden h-full border border-dopamine-pink/20 shadow-[0_10px_25px_-5px_rgba(236,73,153,0.15)] bg-white backdrop-blur-sm">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dopamine-pink to-dopamine-purple"></div>
                  <motion.div 
                    className="absolute inset-0 bg-primary/5 opacity-0"
                    whileHover={{ 
                      opacity: 1,
                      transition: { duration: 0.3 }
                    }}
                  />
                  <CardHeader>
                    <div className="bg-dopamine-pink/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <Zap className="text-dopamine-pink" size={24} />
                    </div>
                    <CardTitle className="text-dopamine-pink">Practice Roleplays</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground font-medium">
                      Refine your pitch with real-world sales scenarios and get instant AI feedback on your performance.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="transform transition-all duration-500 hover:scale-105"
              >
                <Card className="card-hover-effect relative overflow-hidden h-full border border-dopamine-orange/20 shadow-[0_10px_25px_-5px_rgba(249,115,22,0.15)] bg-white backdrop-blur-sm">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dopamine-orange to-dopamine-pink"></div>
                  <motion.div 
                    className="absolute inset-0 bg-primary/5 opacity-0"
                    whileHover={{ 
                      opacity: 1,
                      transition: { duration: 0.3 }
                    }}
                  />
                  <CardHeader>
                    <div className="bg-dopamine-orange/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <Trophy className="text-dopamine-orange" size={24} />
                    </div>
                    <CardTitle className="text-dopamine-orange">Compete & Rank</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground font-medium">
                      Join sales competitions, climb the leaderboards, and showcase your abilities to potential employers.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="transform transition-all duration-500 hover:scale-105"
              >
                <Card className="card-hover-effect relative overflow-hidden h-full border border-dopamine-blue/20 shadow-[0_10px_25px_-5px_rgba(14,165,233,0.15)] bg-white backdrop-blur-sm">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dopamine-blue to-dopamine-green"></div>
                  <motion.div 
                    className="absolute inset-0 bg-primary/5 opacity-0"
                    whileHover={{ 
                      opacity: 1,
                      transition: { duration: 0.3 }
                    }}
                  />
                  <CardHeader>
                    <div className="bg-dopamine-blue/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <Target className="text-dopamine-blue" size={24} />
                    </div>
                    <CardTitle className="text-dopamine-blue">Get Discovered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground font-medium">
                      Top performers get noticed by recruiters looking for sales talent with proven skills and abilities.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Benefits - No boxes, just clean text with icons */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dopamine-orange">
                Benefits for Students
              </h2>
              <p className="text-lg text-foreground max-w-2xl mx-auto font-medium">
                Quota Queen gives you the edge in a competitive job market.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-white transition-colors"
              >
                <div className="bg-dopamine-pink/10 p-2 rounded-full">
                  <Check className="text-dopamine-pink" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-dopamine-pink">Personalized AI Feedback</h3>
                  <p className="text-foreground">
                    Get detailed analysis on your speaking patterns, objection handling, and overall sales performance.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-white transition-colors"
              >
                <div className="bg-dopamine-orange/10 p-2 rounded-full">
                  <Check className="text-dopamine-orange" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-dopamine-orange">Industry-Specific Training</h3>
                  <p className="text-foreground">
                    Practice sales scenarios tailored to tech, SaaS, finance, healthcare, and more.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-white transition-colors"
              >
                <div className="bg-dopamine-blue/10 p-2 rounded-full">
                  <Check className="text-dopamine-blue" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-dopamine-blue">Recruiter Connections</h3>
                  <p className="text-foreground">
                    Build relationships with companies actively seeking sales talent through our platform.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-white transition-colors"
              >
                <div className="bg-dopamine-green/10 p-2 rounded-full">
                  <Check className="text-dopamine-green" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-dopamine-green">Portfolio Building</h3>
                  <p className="text-foreground">
                    Showcase your best roleplay performances and achievements to potential employers.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-white transition-colors"
              >
                <div className="bg-dopamine-purple/10 p-2 rounded-full">
                  <Check className="text-dopamine-purple" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-dopamine-purple">Exclusive Challenges</h3>
                  <p className="text-foreground">
                    Participate in recruiter-sponsored challenges with opportunities for job interviews.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-white transition-colors"
              >
                <div className="bg-accent/10 p-2 rounded-full">
                  <Check className="text-accent" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-accent">Community Support</h3>
                  <p className="text-foreground">
                    Connect with other sales students and professionals to share tips and advice.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA section removed as requested */}
        
        {/* Testimonials - Changed background to white */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dopamine-green">
                Student Success Stories
              </h2>
              <p className="text-lg text-foreground max-w-2xl mx-auto font-medium">
                Hear from students who have used Quota Queen to accelerate their sales careers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="transform transition-all duration-500 hover:scale-105"
              >
                <Card className="card-hover-effect relative overflow-hidden h-full border border-dopamine-orange/20 shadow-[0_10px_25px_-5px_rgba(249,115,22,0.15)]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-dopamine-orange"></div>
                  <motion.div 
                    className="absolute inset-0 bg-primary/5 opacity-0"
                    whileHover={{ 
                      opacity: 1,
                      transition: { duration: 0.3 }
                    }}
                  />
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="text-yellow-400 fill-yellow-400" size={18} />
                      ))}
                    </div>
                    <CardTitle className="text-dopamine-orange">Jordan T.</CardTitle>
                    <CardDescription className="text-foreground/80">Boston University</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="italic text-foreground font-medium">
                      "Quota Queen helped me land 5 job offers before graduation. The AI feedback was spot-on and really helped me improve my pitch."
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm font-medium text-foreground/70">Now at HubSpot</p>
                  </CardFooter>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="transform transition-all duration-500 hover:scale-105"
              >
                <Card className="card-hover-effect relative overflow-hidden h-full border border-dopamine-pink/20 shadow-[0_10px_25px_-5px_rgba(236,73,153,0.15)]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dopamine-purple to-dopamine-pink"></div>
                  <motion.div 
                    className="absolute inset-0 bg-primary/5 opacity-0"
                    whileHover={{ 
                      opacity: 1,
                      transition: { duration: 0.3 }
                    }}
                  />
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="text-yellow-400 fill-yellow-400" size={18} />
                      ))}
                    </div>
                    <CardTitle className="text-dopamine-pink">Alexis M.</CardTitle>
                    <CardDescription className="text-foreground/80">University of Florida</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="italic text-foreground font-medium">
                      "I went from nervous about sales to confident in my abilities. The tournament-style competitions were fun and pushed me to improve."
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm font-medium text-foreground/70">Now at Salesforce</p>
                  </CardFooter>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="transform transition-all duration-500 hover:scale-105"
              >
                <Card className="card-hover-effect relative overflow-hidden h-full border border-dopamine-blue/20 shadow-[0_10px_25px_-5px_rgba(14,165,233,0.15)]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dopamine-blue to-dopamine-green"></div>
                  <motion.div 
                    className="absolute inset-0 bg-primary/5 opacity-0"
                    whileHover={{ 
                      opacity: 1,
                      transition: { duration: 0.3 }
                    }}
                  />
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="text-yellow-400 fill-yellow-400" size={18} />
                      ))}
                    </div>
                    <CardTitle className="text-dopamine-blue">Marcus J.</CardTitle>
                    <CardDescription className="text-foreground/80">Arizona State University</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="italic text-foreground font-medium">
                      "A recruiter found me through Quota Queen and offered me an interview on the spot. Two weeks later, I had my dream job."
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm font-medium text-foreground/70">Now at Gong</p>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForStudents;
