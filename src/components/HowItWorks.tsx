
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChartLine, Users, BookOpen, GraduationCap } from 'lucide-react';

export const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const steps = [
    {
      number: "01",
      title: "Create Profiles",
      description: "Students sign up with university emails, complete their profiles, and set preferences for industries and sales roles.",
      delay: 0,
      icon: <Users className="h-6 w-6 text-primary/70" />,
      color: "from-dopamine-blue to-dopamine-purple"
    },
    {
      number: "02",
      title: "Practice with AI",
      description: "Students engage in customized sales scenarios powered by AI, receive instant feedback, and track progress over time.",
      delay: 100,
      icon: <BookOpen className="h-6 w-6 text-primary/70" />,
      color: "from-dopamine-purple to-dopamine-pink"
    },
    {
      number: "03",
      title: "Build Portfolios",
      description: "Students accumulate performance data, improvement metrics, and showcase their best roleplays in personal libraries.",
      delay: 200,
      icon: <GraduationCap className="h-6 w-6 text-primary/70" />,
      color: "from-dopamine-pink to-dopamine-orange"
    },
    {
      number: "04",
      title: "Connect to Careers",
      description: "Students get discovered by recruiters searching for top talent, participate in company-sponsored challenges, and receive direct opportunities.",
      delay: 300,
      icon: <ChartLine className="h-6 w-6 text-primary/70" />,
      color: "from-dopamine-orange to-dopamine-green"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 -z-10"></div>
      
      {/* Animated background shapes */}
      <motion.div 
        className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl -z-10"
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl -z-10"
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 highlight-gradient">
            From Potential to Data-Driven Results
          </h2>
          <p className="text-lg text-muted-foreground">
            Quota Queen's streamlined process polishes sales skills so students land the career of their dreams.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate={isVisible ? "show" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative group"
            >
              <div className="bg-white rounded-xl p-8 border border-border shadow-sm h-full transition-all duration-300 hover:shadow-md hover:border-primary/20 overflow-hidden">
                {/* Static colored accent line at the bottom */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color}`}></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    {step.icon}
                  </div>
                  <div className="text-4xl font-bold text-primary/20 group-hover:text-primary/30 transition-colors duration-300">{step.number}</div>
                </div>
                <h3 className="text-xl font-semibold mb-3 relative z-10">{step.title}</h3>
                <p className="text-muted-foreground relative z-10">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-border z-10"></div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
