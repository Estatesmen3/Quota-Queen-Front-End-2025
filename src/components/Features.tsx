
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Trophy, Users } from "lucide-react";

export const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
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

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const features = [
    {
      icon: <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600"><Users size={24} /></div>,
      title: "Smart Sales Training",
      description: "Universities can provide students with industry-leading curriculum that delivers intelligent feedback to improve sales techniques.",
      color: "from-dopamine-blue to-dopamine-purple"
    },
    {
      icon: <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600"><Star size={24} /></div>,
      title: "Performance Library",
      description: "Institutions can help students build personal portfolios of sales interactions, complete with expert analysis and improvement suggestions.",
      color: "from-dopamine-purple to-dopamine-pink"
    },
    {
      icon: <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600"><Trophy size={24} /></div>,
      title: "Exclusive Competitions",
      description: "The ONLY platform for collegiate sales competitions. Universities can host industry-specific challenges and participate in nationwide tournaments.",
      color: "from-dopamine-pink to-dopamine-orange"
    },
    {
      icon: <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600"><Check size={24} /></div>,
      title: "Recruiter Connections",
      description: "Educational institutions can connect their students with top companies looking for sales talent based on actual performance, not just resumes.",
      color: "from-dopamine-green to-dopamine-blue"
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
    <section className="py-20 md:py-32 px-6" ref={featuresRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 highlight-gradient">
            The Ultimate Collegiate Sales Network
          </h2>
          <p className="text-lg text-muted-foreground">
            Our exclusive platform combines advanced technology with real-world sales scenarios to help universities prepare students with techniques that recruiters are looking for.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isVisible ? "show" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-card rounded-xl p-6 shadow-sm border border-border transition-all duration-300 hover:shadow-md hover:border-primary/20 relative overflow-hidden group"
            >
              {/* Static colored background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-5`}></div>
              
              {/* Static colored accent line at the bottom */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color}`}></div>
              
              <div className="mb-5 transform transition-transform duration-300 hover:scale-110 relative z-10">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 relative z-10">{feature.title}</h3>
              <p className="text-muted-foreground relative z-10">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
