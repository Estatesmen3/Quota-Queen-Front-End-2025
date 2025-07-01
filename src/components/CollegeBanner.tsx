
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ExternalLink } from "lucide-react";

// University links mapping to their sales programs
const universityLinks = {
  "Kennesaw State University": "https://coles.kennesaw.edu/sales/",
  "Florida State University": "https://fsusalesinstitute.com/",
  "Baylor University": "https://www.baylor.edu/business/selling/",
  "University of Houston": "https://www.bauer.uh.edu/sei/",
  "Bradley University": "https://www.bradley.edu/academic/departments/marketing/",
  "Stetson University": "https://www.stetson.edu/business/sales/",
  "University of Texas Dallas": "https://jindal.utdallas.edu/centers-of-excellence/professional-sales/",
  "Arizona State University": "https://wpcarey.asu.edu/marketing-degrees/professional-sales",
  "University of Toledo": "https://www.utoledo.edu/business/essps/",
  "Illinois State University": "https://business.illinoisstate.edu/psi/",
  "Ball State University": "https://www.bsu.edu/academics/collegesanddepartments/marketing/programs/professional-selling",
  "University of Cincinnati": "https://business.uc.edu/programs-degrees/specialized-masters/marketing/professional-selling.html",
  "Temple University": "https://www.fox.temple.edu/institutes-centers/center-for-professional-sales/",
  "University of Central Florida": "https://business.ucf.edu/centers/professional-selling-program/",
  "Michigan State University": "https://salesleader.msu.edu/",
  "Ohio University": "https://business.ohio.edu/academics/centers-institutes/schey-sales-centre/",
  "Purdue University": "https://www.purdue.edu/goldenshovel/",
  "Louisiana State University": "https://lsu.edu/business/psi/",
  "University of Georgia": "https://www.terry.uga.edu/selig/",
  "Miami University of Ohio": "https://www.miamioh.edu/fsb/academics/marketing/academics/sales-management/",
};

const topColleges = Object.keys(universityLinks);

const CollegeBanner = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 -z-10"></div>
      
      {/* Animated background shapes */}
      <motion.div 
        className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl -z-10"
        animate={{ 
          y: [0, 15, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute -bottom-40 -left-20 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl -z-10"
        animate={{ 
          y: [0, -15, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-xl md:text-2xl font-bold mb-3 highlight-gradient">
            The Exclusive Sales Competition Platform For Top Universities
          </h3>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Partnering with the nation's leading collegiate sales programs to deliver exceptional career outcomes
          </p>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-y-4"
        >
          {topColleges.map((college, index) => (
            <motion.div 
              key={index} 
              variants={item}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4"
            >
              <a 
                href={universityLinks[college]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-dopamine-purple/20 to-dopamine-blue/20 flex items-center justify-center mr-3 group-hover:from-dopamine-purple/40 group-hover:to-dopamine-blue/40 transition-all duration-300">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-grow">
                  <span className="text-sm md:text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300 flex items-center">
                    {college}
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </span>
                  <div className="h-0.5 w-0 bg-gradient-to-r from-dopamine-purple to-dopamine-pink group-hover:w-full transition-all duration-300 mt-1"></div>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CollegeBanner;
