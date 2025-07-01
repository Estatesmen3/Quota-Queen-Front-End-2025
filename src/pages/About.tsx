
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Award, 
  Brain, 
  Briefcase, 
  CheckCircle, 
  GraduationCap, 
  Sparkles, 
  Target, 
  Trophy, 
  User, 
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-dopamine-purple via-dopamine-pink to-dopamine-orange/60 opacity-90 z-0"></div>
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center px-6">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Train. Compete. Get Hired.
              </motion.h1>
              <motion.h2
                className="text-2xl md:text-3xl font-semibold mb-6 text-white drop-shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Welcome to the Future of Sales.
              </motion.h2>
              <motion.p 
                className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed drop-shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="font-semibold text-white">Quota Queen exists to turn students into sales champions and job offers into reality.</span> Born from real-world victories and high-stakes competition, it's where elite training meets real opportunity—so you can stop wondering "how do I break in?" and start closing deals that change your life.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button size="lg" asChild className="bg-white text-dopamine-purple hover:bg-white/90 font-semibold shadow-md">
                  <Link to="/signup">Get Started</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Founder's Story Section */}
        <section className="py-20 bg-muted/30">
          <div className="container px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-dopamine-purple/10 text-dopamine-purple font-medium mb-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>The Origin Story</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">From Student to Sales Champion</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Quota Queen was founded by Isaac Choate, who discovered the transformative power of collegiate sales through the Stetson Centurion Sales Program—a program that didn't just teach sales, but opened a new world of opportunity.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Through this experience, Isaac went from a curious student to a National Champion, the #1 collegiate-ranked salesperson in the U.S., and part of the team that led Stetson University to its first-ever National and International Championships at both the National Collegiate Sales Competition and International Collegiate Sales Competition.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  These high-stakes competitions didn't just build skills—they changed Isaac's life, unlocking 30+ job offers straight out of college and landing him a role at a top tech firm. But the biggest lesson? These life-changing opportunities shouldn't be limited to a select few—they should be available to every student, everywhere.
                </p>
              </motion.div>

              <motion.div
                className="relative rounded-xl overflow-hidden shadow-2xl border border-dopamine-purple/20"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Carousel className="w-full">
                  <CarouselContent>
                    <CarouselItem>
                      <div className="relative aspect-[4/5]">
                        <img 
                          src="/lovable-uploads/3691cda6-0bef-4d3d-921f-d7a126efb7ca.png" 
                          alt="Isaac Choate headshot" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                          <div className="flex gap-3 mb-4">
                            <div className="bg-dopamine-purple/90 p-2 rounded-lg backdrop-blur-sm">
                              <Trophy className="h-6 w-6 text-white" />
                            </div>
                            <div className="bg-dopamine-pink/90 p-2 rounded-lg backdrop-blur-sm">
                              <Award className="h-6 w-6 text-white" />
                            </div>
                            <div className="bg-blue-500/90 p-2 rounded-lg backdrop-blur-sm">
                              <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <h3 className="text-white text-xl font-bold">Isaac Choate</h3>
                          <p className="text-white/80">Founder, Quota Queen</p>
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem>
                      <div className="relative aspect-[4/5]">
                        <img 
                          src="/lovable-uploads/de39805c-e371-476a-8711-fbfb84ad57b1.png" 
                          alt="Stetson Sales Team with trophy" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                          <h3 className="text-white text-xl font-bold">Team Champions</h3>
                          <p className="text-white/80">Stetson University Sales Team</p>
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem>
                      <div className="relative aspect-[4/5]">
                        <img 
                          src="/lovable-uploads/2608deb6-b42e-43ee-9ea6-37785bcda336.png" 
                          alt="Isaac with ICSC championship trophy" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                          <h3 className="text-white text-xl font-bold">ICSC Champion</h3>
                          <p className="text-white/80">International Collegiate Sales Competition</p>
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem>
                      <div className="relative aspect-[4/5]">
                        <img 
                          src="/lovable-uploads/4e471e9a-4f4c-4c8b-8875-1bf948a2a318.png" 
                          alt="Stetson Sales Team at NCSC" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                          <h3 className="text-white text-xl font-bold">NCSC Competitors</h3>
                          <p className="text-white/80">National Collegiate Sales Competition</p>
                        </div>
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious className="left-2 bg-white/70 hover:bg-white border-0" />
                  <CarouselNext className="right-2 bg-white/70 hover:bg-white border-0" />
                </Carousel>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Quota Queen Section */}
        <section className="py-20">
          <div className="container px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Quota Queen?</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Sales isn't just about talent—it's about preparation, performance, and persistence. Quota Queen gives students the same world-class training, competitive experience, and recruiter access that Isaac had, but on a broader scale. Powered by AI-driven roleplays, recruiter-led challenges, and a gamified platform, Quota Queen bridges the gap between sales education and career success.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <motion.div 
                className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-6 rounded-xl border border-blue-500/20 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-600">AI-Driven Roleplays</h3>
                <p className="text-muted-foreground">Practice with intelligent AI that adapts to your skill level and provides real-time feedback.</p>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-dopamine-purple/10 to-dopamine-purple/5 p-6 rounded-xl border border-dopamine-purple/20 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="w-16 h-16 rounded-full bg-dopamine-purple/20 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-dopamine-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-dopamine-purple">Recruiter-Led Challenges</h3>
                <p className="text-muted-foreground">Compete in real-world scenarios designed by top companies and get direct feedback from industry experts.</p>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-dopamine-pink/10 to-dopamine-pink/5 p-6 rounded-xl border border-dopamine-pink/20 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <div className="w-16 h-16 rounded-full bg-dopamine-pink/20 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-dopamine-pink" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-dopamine-pink">Gamified Platform</h3>
                <p className="text-muted-foreground">Earn points, climb leaderboards, and unlock achievements as you develop your sales skills and showcase your talent.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Audience Benefit Sections */}
        <section className="py-20 bg-muted/30">
          <div className="container px-6">
            <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
              {/* For Students */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-dopamine-purple/10 text-dopamine-purple font-medium">
                  <GraduationCap className="h-4 w-4" />
                  <span>For Students</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">Train in real-world scenarios. Get discovered.</h3>
                <p className="text-lg text-muted-foreground">
                  Whether you're aiming for tech, pharmaceuticals, logistics, finance, or beyond, Quota Queen equips you with the skills, experience, and connections to land the career of your dreams.
                </p>

                <ul className="space-y-4">
                  <li className="flex gap-3 items-start">
                    <CheckCircle className="h-6 w-6 text-dopamine-purple shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">AI-Powered Sales Training</h4>
                      <p className="text-muted-foreground">Practice unlimited roleplays with adaptive AI that helps you master key sales skills</p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle className="h-6 w-6 text-dopamine-purple shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Performance Portfolio</h4>
                      <p className="text-muted-foreground">Showcase your best performances and analytics to recruiters</p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle className="h-6 w-6 text-dopamine-purple shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Direct Recruiter Access</h4>
                      <p className="text-muted-foreground">Get discovered by top companies actively seeking sales talent</p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle className="h-6 w-6 text-dopamine-purple shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Competitive Edge</h4>
                      <p className="text-muted-foreground">Stand out with validated skills that go beyond resume claims</p>
                    </div>
                  </li>
                </ul>
                
                <div className="pt-4">
                  <Button asChild size="lg" className="bg-dopamine-purple hover:bg-dopamine-purple/90">
                    <Link to="/for-students">
                      Learn More About Student Benefits
                    </Link>
                  </Button>
                </div>
              </motion.div>

              {/* For Recruiters */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-dopamine-pink/10 text-dopamine-pink font-medium">
                  <Briefcase className="h-4 w-4" />
                  <span>For Recruiters & Companies</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">Stop guessing—start watching top candidates in action.</h3>
                <p className="text-lg text-muted-foreground">
                  Quota Queen gives companies exclusive access to high-performing, pre-vetted sales talent who are already battle-tested in real-world scenarios.
                </p>

                <ul className="space-y-4">
                  <li className="flex gap-3 items-start">
                    <CheckCircle className="h-6 w-6 text-dopamine-pink shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Faster, Smarter Hiring</h4>
                      <p className="text-muted-foreground">Instantly identify the best-fit candidates based on demonstrated performance</p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle className="h-6 w-6 text-dopamine-pink shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Lower Risk</h4>
                      <p className="text-muted-foreground">Hire with confidence—Quota Queen talent has already proven they can hit quota and drive results</p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle className="h-6 w-6 text-dopamine-pink shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Early Access to Rising Stars</h4>
                      <p className="text-muted-foreground">Build relationships with top collegiate talent before your competitors do</p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle className="h-6 w-6 text-dopamine-pink shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Brand Exposure</h4>
                      <p className="text-muted-foreground">Sponsor challenges, mentor top performers, and position your company as a destination for elite sales talent</p>
                    </div>
                  </li>
                </ul>
                
                <div className="pt-4">
                  <Button asChild size="lg" className="bg-dopamine-pink hover:bg-dopamine-pink/90">
                    <Link to="/for-recruiters">
                      Learn More About Recruiter Benefits
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-dopamine-purple via-dopamine-pink to-dopamine-orange/60 opacity-90 z-0"></div>
          <div className="container relative z-10 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/20 text-white font-medium mb-6">
                <Target className="h-4 w-4" />
                <span>Our Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-md">Democratizing Sales Success</h2>
              <p className="text-lg leading-relaxed text-white/90 mb-8 drop-shadow-sm">
                Isaac's journey—from the Stetson Centurion Sales Program to national victory, to a top tech career—proved that sales education can change lives. Now, we're on a mission to ensure every student has access to elite training, career preparation, and competitive opportunities, no matter their background or school.
              </p>
              <p className="text-lg md:text-xl font-medium text-white drop-shadow-sm mb-8">
                Quota Queen isn't just a training platform—it's a pipeline for the next generation of elite sales professionals. Whether you're here to hone your pitch, battle for the leaderboard, or secure your dream role, Quota Queen is your fast track to sales success.
              </p>
              <Button size="lg" variant="secondary" asChild className="bg-white hover:bg-white/90 text-dopamine-purple font-semibold shadow-lg border-0">
                <Link to="/signup">Explore the Platform</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
