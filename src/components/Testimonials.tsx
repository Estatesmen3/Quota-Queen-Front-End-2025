
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export const Testimonials = () => {
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

  const testimonials = [
    {
      quote: "The AI roleplays helped me develop confidence in handling objections. I landed an SDR position at a top SaaS company after just three weeks of practice.",
      name: "Alex Chen",
      title: "Marketing Student at Stanford",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      quote: "As a recruiter, I love being able to see candidates in action before reaching out. The platform has helped us find amazing sales talent that traditional methods would have missed.",
      name: "Sarah Johnson",
      title: "Talent Acquisition at TechCorp",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "The competition feature pushed me to improve quickly. The feedback from both AI and human participants was invaluable for my development.",
      name: "Miguel Santos",
      title: "Business Major at UCLA",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg"
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
    <section ref={sectionRef} className="py-20 md:py-32 px-6 relative overflow-hidden bg-white">
      {/* Subtle accents in the background */}
      <motion.div 
        className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-20 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 highlight-gradient">
            What Users Are Saying
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of students and recruiters already transforming sales training and hiring
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate={isVisible ? "show" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              variants={item}
              whileHover={{ 
                y: -5, 
                transition: { duration: 0.2 } 
              }}
              className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-border shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 relative overflow-hidden group"
            >
              {/* Static colored trim/accent for each card */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-dopamine-purple via-dopamine-pink to-dopamine-blue"></div>
              
              <div className="flex flex-col h-full">
                <div className="mb-6 text-primary/50">
                  <Quote className="h-8 w-8" />
                </div>
                <p className="text-foreground mb-6 flex-grow">{testimonial.quote}</p>
                <div className="flex items-center mt-4">
                  <div className="relative">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-primary/20"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 to-accent/30 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
