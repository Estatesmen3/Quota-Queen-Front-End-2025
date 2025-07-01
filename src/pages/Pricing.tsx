
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pricingPlans = [
    {
      title: "Student",
      price: "Free",
      description: "For students looking to develop sales skills",
      features: [
        "AI-powered sales roleplays",
        "Performance tracking & feedback",
        "Participation in competitions",
        "Basic performance portfolio"
      ],
      cta: "Get Started",
      link: "/signup",
      highlight: false
    },
    {
      title: "Recruiter",
      price: "Custom Pricing",
      description: "For recruiters and hiring managers",
      features: [
        "Access to talent search",
        "Direct engagement with candidates",
        "Performance analytics",
        "Host custom roleplays",
        "Priority support"
      ],
      cta: "Schedule Demo",
      link: "/signup",
      highlight: true
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "For organizations with advanced needs",
      features: [
        "Everything in Recruiter plan",
        "Branded competitions",
        "Integration with ATS",
        "Dedicated success manager",
        "Custom reporting"
      ],
      cta: "Schedule Demo",
      link: "/contact",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-dopamine-purple">
                Simple, Transparent Pricing
              </h1>
              <p className="text-lg text-muted-foreground">
                Free for students. Powerful plans for recruiters and companies.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`rounded-xl p-8 border-2 relative overflow-hidden ${
                    plan.highlight 
                      ? 'border-dopamine-purple/50 shadow-[0_10px_25px_-5px_rgba(139,92,246,0.25)] scale-105 z-10' 
                      : 'border-border/50 shadow-sm'
                  } transition-all duration-300 hover:shadow-md animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-dopamine-purple text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-dopamine-pink to-dopamine-purple"></div>
                  <h3 className="text-xl font-semibold mb-2 text-dopamine-purple">{plan.title}</h3>
                  <div className="flex items-end mb-4">
                    <span className="text-2xl font-bold">{plan.price}</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-dopamine-pink mr-2 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <Button 
                      className={`w-full ${
                        plan.highlight 
                          ? "bg-dopamine-purple hover:bg-dopamine-purple/90" 
                          : "border-dopamine-purple text-dopamine-purple hover:bg-dopamine-purple/10"
                      }`}
                      variant={plan.highlight ? "default" : "outline"}
                      asChild
                    >
                      <Link to={plan.link}>{plan.cta}</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
