
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { CareerTools as CareerToolsComponent } from "@/components/resume/CareerTools";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { FileText, Briefcase, TrendingUp, Sparkles } from "lucide-react";

const CareerTools = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();


  const isStudent = profile?.user_type === "student";
  
  // Redirect recruiters if they try to access this page
  useEffect(() => {
    if (profile && !isStudent) {
      navigate("/recruiter/dashboard", { replace: true });
    }
  }, [profile, isStudent, navigate]);
  
  if (!isStudent) {
    return null; // This prevents a flash of content before redirect
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        <motion.div 
          className="flex flex-col space-y-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-dopamine-purple to-dopamine-pink bg-clip-text text-transparent relative inline-block">
            Career Tools
            <motion.div 
              className="absolute -top-2 -right-6"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Sparkles className="h-5 w-5 text-yellow-400" />
            </motion.div>
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Optimize your resume, find matching jobs, and get career insights to accelerate your sales journey.
          </p>
        </motion.div>
        
        <motion.div 
          className="mt-6 bg-gradient-to-br from-background via-dopamine-purple/5 to-dopamine-pink/5 p-6 rounded-xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={container}
          >
            <motion.div variants={item} className="bg-white bg-opacity-60 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-dopamine-purple/10 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-dopamine-purple/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-dopamine-purple" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Resume Analysis</h3>
                <p className="text-sm text-muted-foreground">Get AI-powered feedback on your resume to stand out to recruiters</p>
              </div>
            </motion.div>
            
            <motion.div variants={item} className="bg-white bg-opacity-60 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-dopamine-blue/10 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-dopamine-blue/10 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-dopamine-blue" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Job Matching</h3>
                <p className="text-sm text-muted-foreground">Discover sales roles that match your skills and experience</p>
              </div>
            </motion.div>
            
            <motion.div variants={item} className="bg-white bg-opacity-60 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-dopamine-pink/10 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-dopamine-pink/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-dopamine-pink" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Career Insights</h3>
                <p className="text-sm text-muted-foreground">Access industry trends and salary data for informed decisions</p>
              </div>
            </motion.div>
          </motion.div>
          
          <CareerToolsComponent />
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default CareerTools;
