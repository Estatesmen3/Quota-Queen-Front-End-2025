
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Target, Zap, TrendingUp, Sparkles, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OpportunityCard from "./OpportunityCard";
import ProgressChart from "./ProgressChart";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";


const tokenString = localStorage.getItem("sb-pesnfpdwcojfomspprmf-auth-token");
const tokenObject = tokenString ? JSON.parse(tokenString) : null;
const accessToken = tokenObject?.access_token;
const userId = tokenObject?.user?.id;

const ProfileSection = () => {
  const { profile } = useAuth();
  const [opportunities, setOpportunities] = useState([
    {
      id: 1,
      title: "Improve Discovery Questions",
      description: "Work on asking more focused questions to understand customer needs.",
      skill: "Discovery",
      progress: 35,
    },
    {
      id: 2,
      title: "Handle Price Objections",
      description: "Practice techniques to address price sensitivity concerns.",
      skill: "Objection Handling",
      progress: 50,
    },
  ]);

  const [animateSkills, setAnimateSkills] = useState(false);

  // Function to update opportunities when progress changes
  const handleOpportunityUpdate = () => {
    // In a real app, this would fetch updated data from the API
    console.log("Updating opportunities...");
  };

  useEffect(() => {
    // Animate skills progress after initial render
    const timer = setTimeout(() => {
      setAnimateSkills(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const [calls, setCalls] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [skillScores, setSkillScores] = useState({});


  useEffect(() => {
    const fetchCallCount = async () => {
      const { count, error } = await supabase
        .from('calls')
        .select('*', { count: 'exact', head: true })
        .eq('host_id', userId);

      if (error) {
        console.error('Error fetching call count:', error);
      } else {
        setCalls(count || 0);
        console.log('Total calls for host:', count);
      }
    };

    const fetchTotalScore = async () => {
      const { data, error } = await supabase
        .rpc('sum_user_score', { input_user_id: userId });

      if (error) {
        console.error('Error fetching total score:', error);
      } else {
        setTotalScore(data || 0);
        console.log('Total score for user:', data);
      }
    };

    if (userId) {
      fetchTotalScore();
    }



    fetchCallCount();
  }, []);


  useEffect(() => {
    const fetchStreak = async () => {
      const { data, error } = await supabase
        .rpc('get_user_call_streak', { input_host_id: userId });
  
      if (error) {
        console.error('Error fetching streak:', error);
      } else {
        console.log('Total streak days:', data);
        setStreakDays(data || 0);
      }
    };
  
    if (userId) {
      fetchStreak();
    }
  }, [userId]);

  // Mock data - in a real app, these would come from the backend
  const achievements = [
    { id: 1, title: "First Roleplay", completed: true },
    { id: 2, title: "5 Completed Calls", completed: true },
    { id: 3, title: "Perfect Score", completed: false },
    { id: 4, title: "Top 10 Rank", completed: false },
  ];

  useEffect(() => {
    const fetchResultScore = async () => {
      const { data, error } = await supabase
        .from('results')
        .select('result_score')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching result_score:', error);
        return;
      }

      const rawScores = data?.[0]?.result_score;

      if (rawScores) {
        const parsedScores = {
          discovery: parseInt(rawScores["Discovery"]?.percentage.replace('%', '') || '0'),
          objectionHandling: parseInt(rawScores["Objection Handling"]?.percentage.replace('%', '') || '0'),
          closing: parseInt(rawScores["Closing"]?.percentage.replace('%', '') || '0'),
          rapport: parseInt(rawScores["Rapport & Agenda"]?.percentage.replace('%', '') || '0'),
          professionalism: parseInt(rawScores["Overall Professionalism"]?.percentage.replace('%', '') || '0'),
          presentation: parseInt(rawScores["Presentation"]?.percentage.replace('%', '') || '0'),
          productKnowledge: parseInt(rawScores["Communication"]?.percentage.replace('%', '') || '0'),
        };

        setSkillScores(parsedScores);
        console.log('Skill Scores:', parsedScores);
      }
    };

    if (userId) {
      fetchResultScore();
    }
  }, []);

  // const skillScores = {
  //   discovery: 78,
  //   objectionHandling: 65,
  //   closing: 92,
  //   rapport: 85,
  //   productKnowledge: 70,
  // };

  const stats = [
    { label: "Calls Completed", value: calls || 0, icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
    { label: "Avg. Score", value: totalScore, icon: <TrendingUp className="h-4 w-4 text-primary" /> },
    { label: "Streak", value: streakDays + " days", icon: <Zap className="h-4 w-4 text-amber-500" /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Profile Header */}
      <motion.div
        className="flex flex-col sm:flex-row items-start gap-4 sm:items-center sm:justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-dopamine-purple/20 to-dopamine-pink/20 flex items-center justify-center overflow-hidden border-2 border-primary transition-all duration-500 hover:shadow-lg hover:shadow-primary/30 cursor-pointer">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={`${profile.first_name}'s avatar`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold text-primary">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </span>
              )}
            </div>
            <motion.div
              className="absolute -bottom-1 -right-1 bg-gradient-to-br from-dopamine-purple to-dopamine-pink text-white rounded-full p-1 cursor-pointer"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Award className="h-4 w-4" />
            </motion.div>
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              {profile?.first_name} {profile?.last_name}
              <motion.div
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
              </motion.div>
            </h2>
            <div className="flex flex-wrap gap-2 mt-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <Badge variant="secondary" className="bg-gradient-to-r from-dopamine-pink/20 to-dopamine-purple/20">
                  Top Closer
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                <Badge variant="outline" className="border-dopamine-purple/30">
                  <Zap className="h-3 w-3 mr-1 text-amber-500" />
                  3-Day Streak
                </Badge>
              </motion.div>
            </div>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            className="bg-gradient-to-r from-dopamine-purple to-dopamine-pink hover:shadow-lg hover:shadow-dopamine-pink/20 transition-all duration-300"
            size="sm"
          >
            <Target className="mr-1 h-4 w-4" />
            Set New Goals
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            <Card className="overflow-hidden border-t-2 border-primary/30 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-dopamine-purple to-dopamine-pink">{stat.value}</p>
                </div>
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-2 rounded-full shadow-sm">
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Skill Progress and Chart */}
      <motion.div
        className="grid md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-t-2 border-dopamine-green/30 hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2 bg-gradient-to-r from-dopamine-green/10 to-background">
              <CardTitle className="text-base font-medium flex items-center">
                <Star className="h-4 w-4 mr-2 text-dopamine-green" />
                Skills Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Discovery</span>
                  <span className="font-medium">{skillScores.discovery}%</span>
                </div>
                <Progress
                  value={animateSkills ? skillScores.discovery : 0}
                  className="h-2 bg-dopamine-blue/10"
                  style={{
                    transition: "all 1s cubic-bezier(0.65, 0, 0.35, 1)"
                  }}
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Objection Handling</span>
                  <span className="font-medium">{skillScores.objectionHandling}%</span>
                </div>
                <Progress
                  value={animateSkills ? skillScores.objectionHandling : 0}
                  className="h-2 bg-dopamine-orange/10"
                  style={{
                    transition: "all 1s cubic-bezier(0.65, 0, 0.35,, 1) 0.1s"
                  }}
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Closing</span>
                  <span className="font-medium highlight-gradient">{skillScores.closing}%</span>
                </div>
                <Progress
                  value={animateSkills ? skillScores.closing : 0}
                  className="h-2 bg-dopamine-purple/10"
                  style={{
                    transition: "all 1s cubic-bezier(0.65, 0, 0.35, 1) 0.2s"
                  }}
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Rapport Building</span>
                  <span className="font-medium">{skillScores.rapport}%</span>
                </div>
                <Progress
                  value={animateSkills ? skillScores.rapport : 0}
                  className="h-2 bg-dopamine-pink/10"
                  style={{
                    transition: "all 1s cubic-bezier(0.65, 0, 0.35, 1) 0.3s"
                  }}
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Product Knowledge</span>
                  <span className="font-medium">{skillScores.productKnowledge}%</span>
                </div>
                <Progress
                  value={animateSkills ? skillScores.productKnowledge : 0}
                  className="h-2 bg-dopamine-blue/10"
                  style={{
                    transition: "all 1s cubic-bezier(0.65, 0, 0.35, 1) 0.4s"
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-t-2 border-dopamine-blue/30 hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2 bg-gradient-to-r from-dopamine-blue/10 to-background">
              <CardTitle className="text-base font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-dopamine-blue" />
                Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressChart />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Areas of Opportunity */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Target className="mr-2 h-5 w-5 text-primary" />
          Areas of Opportunity
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {opportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <OpportunityCard
                opportunity={opportunity}
                onUpdate={handleOpportunityUpdate}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden border-t-2 border-amber-500/30 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-amber-500/10 to-background">
            <CardTitle className="text-base font-medium flex items-center">
              <Award className="mr-2 h-5 w-5 text-amber-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div
                    className={`p-3 rounded-lg border text-center ${achievement.completed
                        ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30'
                        : 'bg-muted border-muted-foreground/20'
                      } transition-all duration-500 hover:shadow-md cursor-pointer`}
                  >
                    <div className={`mx-auto mb-2 rounded-full p-2 ${achievement.completed ? 'bg-primary/20' : 'bg-muted-foreground/20'
                      }`}>
                      {achievement.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-primary mx-auto" />
                      ) : (
                        <Target className="h-5 w-5 text-muted-foreground mx-auto" />
                      )}
                    </div>
                    <p className={`text-sm font-medium ${achievement.completed ? '' : 'text-muted-foreground'
                      }`}>
                      {achievement.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ProfileSection;
