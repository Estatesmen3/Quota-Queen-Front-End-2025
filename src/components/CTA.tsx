
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { Sparkles } from "lucide-react";

export const CTA = () => {
  const { user } = useAuth();
  
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/15"></div>
        <motion.div 
          className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-dopamine-green/10 rounded-full blur-3xl"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
      </div>
      
      <div className="max-w-5xl mx-auto text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 highlight-gradient">
            Ready to Transform Your Sales Career?
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              asChild 
              className="dopamine-gradient-1 border-none glow-on-hover relative overflow-hidden group"
            >
              <Link to={user ? "/explore" : "/signup"}>
                <span className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Join Quota Queen Today
                </span>
                <motion.div 
                  className="absolute inset-0 bg-white opacity-0"
                  whileHover={{ 
                    opacity: [0, 0.1, 0],
                    transition: { duration: 0.5 }
                  }}
                />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="border-primary/50 text-primary hover:bg-primary/5 relative overflow-hidden"
            >
              <Link to="/for-recruiters">
                Recruiter Access
                <motion.div 
                  className="absolute inset-0 bg-primary/10 opacity-0"
                  whileHover={{ 
                    opacity: [0, 0.2, 0],
                    transition: { duration: 0.5 }
                  }}
                />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
