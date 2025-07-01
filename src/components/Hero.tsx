
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight, Crown, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background pattern with enhanced colors for dopamine */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-purple-100 to-pink-100"></div>
        <motion.div 
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/30 mix-blend-multiply filter blur-3xl"
          animate={{ 
            y: [0, 15, 0],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-accent/30 mix-blend-multiply filter blur-3xl"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-dopamine-green/20 mix-blend-multiply filter blur-3xl"
          animate={{ 
            x: [0, 20, 0],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>THE ONLY Sales Competition Platform for College Students</span>
              </div>
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                Master Sales Skills on the <span className="highlight-gradient">Ultimate</span> Collegiate Sales Network
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                The platform combines real-world sales scenarios with cutting-edge tools for students to master their skills, rise above the competition, and stand out to top recruiters.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4 pt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                <Button size="lg" asChild className="group dopamine-gradient-1 border-none glow-on-hover relative overflow-hidden">
                  <Link to={user ? "/explore" : "/signup"}>
                    {user ? "Get Started" : "Get Started Free"}
                    <ArrowRight size={18} className="ml-2 transform transition-transform group-hover:translate-x-1" />
                    <motion.div 
                      className="absolute inset-0 bg-white opacity-0"
                      whileHover={{ 
                        opacity: [0, 0.1, 0],
                        transition: { duration: 0.5 }
                      }}
                    />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-primary/50 text-primary hover:bg-primary/5 relative overflow-hidden">
                  <Link to="/for-recruiters">
                    For Recruiters
                    <motion.div 
                      className="absolute inset-0 bg-primary/10 opacity-0"
                      whileHover={{ 
                        opacity: [0, 0.2, 0],
                        transition: { duration: 0.5 }
                      }}
                    />
                  </Link>
                </Button>
              </motion.div>
              <motion.p 
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.7 }}
              >
                Join 5,000+ students from top universities already improving their skills
              </motion.p>
            </div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="relative z-10 frost-blur rounded-2xl overflow-hidden shadow-xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
              <div className="aspect-[16/9] p-4 md:p-8 dopamine-gradient-3 bg-opacity-20">
                <div className="bg-background/90 rounded-lg h-full flex items-center justify-center p-6">
                  <div className="text-center space-y-4">
                    <motion.div 
                      className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center"
                      animate={{ 
                        boxShadow: ['0 0 0 0 rgba(139, 92, 246, 0)', '0 0 0 10px rgba(139, 92, 246, 0.3)', '0 0 0 0 rgba(139, 92, 246, 0)']
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    >
                      <Crown className="w-8 h-8 text-primary animate-pulse-subtle" />
                    </motion.div>
                    <h3 className="font-medium text-lg">Exclusive Sales Competitions</h3>
                    <p className="text-sm text-muted-foreground">
                      The only platform for collegiate sales competitions
                    </p>
                    <Button size="sm" className="bg-primary/90 hover:bg-primary relative overflow-hidden group" asChild>
                      <Link to={user ? "/explore" : "/signup"}>
                        Join now
                        <motion.div 
                          className="absolute inset-0 bg-white opacity-0"
                          whileHover={{ 
                            opacity: [0, 0.1, 0],
                            transition: { duration: 0.5 }
                          }}
                        />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced decorative elements */}
            <motion.div 
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div 
              className="absolute top-1/4 -left-8 w-16 h-16 bg-accent/30 rounded-full blur-2xl"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5
              }}
            />
            <motion.div 
              className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-dopamine-green/20 rounded-full blur-xl"
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
