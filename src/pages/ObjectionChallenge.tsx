
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSalesGames } from '@/hooks/useSalesGames';
import DashboardLayout from '@/components/DashboardLayout';
import RecruiterLayout from '@/components/RecruiterLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Award,
  CheckCircle2,
  CircleHelp, 
  Clock, 
  Flame, 
  Loader2,
  ThumbsDown,
  ThumbsUp,
  Trophy, 
  XCircle,
  Sparkles,
  Star
} from 'lucide-react';

const RESPONSE_OPTIONS = [
  {
    id: 'value_focus',
    text: 'Focus on value over price',
    description: 'Reframe the conversation around the value your solution provides'
  },
  {
    id: 'probing_questions',
    text: 'Ask probing questions',
    description: 'Ask questions to better understand the underlying concern'
  },
  {
    id: 'acknowledge_concern',
    text: 'Acknowledge the concern',
    description: 'Show empathy and validate the customer\'s perspective'
  },
  {
    id: 'share_success_story',
    text: 'Share a success story',
    description: 'Tell a story about a similar client who had great results'
  },
  {
    id: 'roi_calculation',
    text: 'Present ROI calculation',
    description: 'Show numbers that demonstrate the financial benefits'
  },
  {
    id: 'comparison_analysis',
    text: 'Offer competitive comparison',
    description: 'Highlight your differentiators against competing solutions'
  }
];

// Enhanced intermediate-level objections (more challenging)
const SAMPLE_OBJECTIONS = [
  {
    id: '1',
    objection: "Your solution seems interesting, but we've been burned before with similar products that promised a lot but delivered little.",
    bestResponse: 'share_success_story',
    explanation: "When facing skepticism from past experiences, sharing a concrete success story from a similar client helps rebuild confidence and provides proof of your solution's effectiveness."
  },
  {
    id: '2',
    objection: "Look, I understand the value, but our budget is already locked for this quarter. There's simply no wiggle room.",
    bestResponse: 'roi_calculation',
    explanation: "When budget timing is the obstacle, demonstrating concrete ROI helps the prospect see your solution as an investment rather than an expense, potentially unlocking emergency or strategic funding."
  },
  {
    id: '3',
    objection: "Your competitor is offering basically the same features at 15% less. Why wouldn't we go with them?",
    bestResponse: 'comparison_analysis',
    explanation: "When facing direct price comparison objections, a thoughtful competitive analysis highlights your differentiators and shows why your solution delivers more value despite the higher price."
  },
  {
    id: '4',
    objection: "I'm not convinced your solution can handle our specific industry regulations and compliance requirements.",
    bestResponse: 'probing_questions',
    explanation: "For industry-specific concerns, asking detailed questions about their specific compliance needs shows your expertise and allows you to address their exact requirements rather than making generic claims."
  },
  {
    id: '5',
    objection: "Our team is already stretched thin with several ongoing implementations. I can't ask them to learn another system right now.",
    bestResponse: 'acknowledge_concern',
    explanation: "When resource constraints are the real issue, acknowledging this legitimate concern builds trust and opens the conversation to address implementation support options and gradual rollout strategies."
  },
  {
    id: '6',
    objection: "We've built our own internal solution that does about 70% of what yours does. It's not perfect but it's free.",
    bestResponse: 'value_focus',
    explanation: "When competing with a 'good enough' internal solution, focusing on the value of the missing 30% and the opportunity cost of maintaining internal systems can shift the conversation from price to total business impact."
  }
];

const getRandomObjections = (count: number) => {
  // Shuffle array using Fisher-Yates algorithm
  const shuffled = [...SAMPLE_OBJECTIONS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Return the first 'count' items
  return shuffled.slice(0, count);
};

const ObjectionChallenge = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const userRole = profile?.user_type as "student" | "recruiter" || "student";
  const Layout = userRole === "recruiter" ? RecruiterLayout : DashboardLayout;
  
  const { 
    isLoading, 
    dailyChallenge, 
    userGameData, 
    fetchDailyChallenge, 
    fetchUserGameData, 
    saveGameResult 
  } = useSalesGames();

  const [objectionSet, setObjectionSet] = useState<typeof SAMPLE_OBJECTIONS>([]);
  const [currentObjectionIndex, setCurrentObjectionIndex] = useState(0);
  const [currentObjection, setCurrentObjection] = useState<(typeof SAMPLE_OBJECTIONS)[0] | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'completed'>('ready');
  const [round, setRound] = useState(1);
  const [loadingResult, setLoadingResult] = useState(false);

  useEffect(() => {
    // Initialize the game
    const initGame = async () => {
      await fetchUserGameData('objection');
      await fetchDailyChallenge('objection');
    };
    
    initGame();
  }, []);

  useEffect(() => {
    // Set initial streak from user data
    if (userGameData) {
      setStreak(userGameData.streak);
      setScore(userGameData.score);
    }
  }, [userGameData]);

  useEffect(() => {
    // When dailyChallenge changes, check if we have custom objections from the daily challenge
    if (dailyChallenge && dailyChallenge.challenge_data) {
      // Try to parse the prompt as JSON if it contains objections data
      try {
        const customObjections = JSON.parse(dailyChallenge.challenge_data.prompt);
        if (Array.isArray(customObjections) && customObjections.length > 0) {
          // Use objections from daily challenge if available and valid
          setObjectionSet(customObjections);
          return;
        }
      } catch (e) {
        console.log('Could not parse daily challenge prompt as objections data');
      }
    }
    // If no valid custom objections, use the sample ones
  }, [dailyChallenge]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeUp();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, gameState]);

  const handleStartGame = () => {
    setGameState('playing');
    setTimeLeft(30);
    setRound(1);
    setScore(0);
    setCurrentObjectionIndex(0);
    
    // Generate 5 random objections for today's game
    const dailyObjections = getRandomObjections(5);
    setObjectionSet(dailyObjections);
    setCurrentObjection(dailyObjections[0]);
    
    setSelectedResponse(null);
    setResult(null);
  };

  useEffect(() => {
    if (objectionSet.length > 0 && currentObjectionIndex < objectionSet.length) {
      setCurrentObjection(objectionSet[currentObjectionIndex]);
    }
  }, [objectionSet, currentObjectionIndex]);

  const handleSelectResponse = async (responseId: string) => {
    if (selectedResponse || result || !currentObjection) return;
    
    setSelectedResponse(responseId);
    setLoadingResult(true);
    
    // Simulate AI evaluation delay
    setTimeout(() => {
      const isCorrect = responseId === currentObjection.bestResponse;
      setResult(isCorrect ? 'correct' : 'incorrect');
      
      // Calculate points based on time left and correctness
      const timeBonus = Math.floor(timeLeft / 3);
      const roundPoints = isCorrect ? 5 + timeBonus : 0;
      
      setScore(prev => prev + roundPoints);
      setLoadingResult(false);
      
      // Show feedback with enhanced toast
      if (isCorrect) {
        toast.success(`Great job! +${roundPoints} points`, {
          icon: <Sparkles className="h-5 w-5 text-yellow-400" />,
          position: "top-center",
          duration: 2000,
        });
      } else {
        toast.error("Not the best approach. Try again!", {
          icon: <ThumbsDown className="h-5 w-5" />,
          position: "top-center",
          duration: 2000,
        });
      }
    }, 1500);
  };

  const handleNextRound = () => {
    const nextIndex = currentObjectionIndex + 1;
    
    if (nextIndex >= objectionSet.length) {
      handleEndGame();
      return;
    }
    
    setCurrentObjectionIndex(nextIndex);
    setRound(prev => prev + 1);
    setTimeLeft(30);
    setSelectedResponse(null);
    setResult(null);
  };

  const handleTimeUp = () => {
    if (!selectedResponse) {
      setResult('incorrect');
      toast.error("Time's up! You missed this one.");
    }
  };

  const handleEndGame = async () => {
    setGameState('completed');
    
    // Only increment streak if they got at least half right
    const shouldIncrementStreak = score >= 15; // Lowered threshold with lower point values
    
    // Save the game result
    if (user) {
      await saveGameResult('objection', score, shouldIncrementStreak);
      
      if (shouldIncrementStreak) {
        setStreak(prev => prev + 1);
      }
    } else {
      toast.error("Log in to save your progress!");
    }
  };

  const handlePlayAgain = () => {
    setGameState('ready');
  };

  // Render only if currentObjection is available during the playing state
  const renderGameContent = () => {
    if (!currentObjection) {
      return (
        <div className="text-center p-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-dopamine-blue" />
          <p>Loading challenge...</p>
        </div>
      );
    }

    return (
      <>
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-dopamine-blue/10 to-dopamine-purple/5 rounded-xl p-5 relative overflow-hidden shadow-sm border border-dopamine-blue/20"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-dopamine-blue/10 rounded-full -mr-10 -mt-10 z-0"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-dopamine-purple/10 rounded-full -ml-8 -mb-8 z-0"></div>
          
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2 text-dopamine-blue">Customer Objection:</h3>
            <p className="text-lg font-medium">"{currentObjection.objection}"</p>
          </div>
        </motion.div>
        
        <div className="space-y-3 mt-5">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            Select the best response strategy:
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {RESPONSE_OPTIONS.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Button
                  variant="outline"
                  className={`h-auto py-3 px-4 justify-start text-left flex flex-col items-start gap-1 transition-all w-full ${
                    selectedResponse === option.id
                      ? result === 'correct' 
                        ? 'bg-green-50 border-green-200 ring-1 ring-green-500'
                        : result === 'incorrect' && option.id === currentObjection.bestResponse
                          ? 'bg-green-50 border-green-200 ring-1 ring-green-500'
                          : result === 'incorrect'
                            ? 'bg-red-50 border-red-200 ring-1 ring-red-500'
                            : 'bg-blue-50 border-blue-200'
                      : (result && option.id === currentObjection.bestResponse)
                        ? 'bg-green-50 border-green-200 ring-1 ring-green-500'
                        : 'hover:border-dopamine-blue/40 hover:bg-dopamine-blue/5'
                  }`}
                  disabled={!!selectedResponse || loadingResult}
                  onClick={() => handleSelectResponse(option.id)}
                >
                  <div className="flex justify-between w-full items-center">
                    <span className="font-medium">{option.text}</span>
                    {selectedResponse === option.id && result === 'correct' && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {selectedResponse === option.id && result === 'incorrect' && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    {selectedResponse !== option.id && result && option.id === currentObjection.bestResponse && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {loadingResult && selectedResponse === option.id && (
                      <Loader2 className="h-5 w-5 animate-spin text-dopamine-blue" />
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{option.description}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
        
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`p-4 mt-4 rounded-md ${
                result === 'correct' 
                  ? 'bg-green-50 border border-green-100 text-green-800' 
                  : 'bg-amber-50 border border-amber-100 text-amber-800'
              }`}
            >
              <h4 className="font-medium mb-1 flex items-center">
                {result === 'correct' 
                  ? <><ThumbsUp className="h-4 w-4 mr-1.5" /> Great choice!</>
                  : <><ThumbsDown className="h-4 w-4 mr-1.5" /> Not quite</>
                }
              </h4>
              <p className="text-sm">{currentObjection.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-dopamine-blue to-dopamine-purple bg-clip-text text-transparent">
              Objection Challenge
            </h1>
            <p className="text-muted-foreground">
              Test your objection handling skills and climb the leaderboard
            </p>
          </div>
          
          {userGameData && (
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Badge variant="outline" className="flex gap-1 items-center py-1.5 px-3 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 border-amber-200 shadow-sm">
                  <Trophy className="h-4 w-4" />
                  <span>Score: {userGameData.score}</span>
                </Badge>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Badge variant="outline" className="flex gap-1 items-center py-1.5 px-3 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border-orange-200 shadow-sm">
                  <Flame className="h-4 w-4" />
                  <span>Streak: {userGameData.streak} day{userGameData.streak !== 1 ? 's' : ''}</span>
                </Badge>
              </motion.div>
            </div>
          )}
        </div>
        
        <Separator className="bg-gradient-to-r from-dopamine-blue/20 to-dopamine-purple/20" />
        
        {gameState === 'ready' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-3xl mx-auto shadow-md border-t-4 border-dopamine-blue overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-dopamine-blue/20 to-dopamine-purple/10">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-dopamine-blue" />
                  Daily Objection Challenge
                </CardTitle>
                <CardDescription>
                  Test your sales skills by responding to challenging objections
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-4">
                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-md p-4 border border-muted/50">
                    <h3 className="font-medium mb-2 flex items-center">
                      <CircleHelp className="h-5 w-5 mr-1.5 text-dopamine-blue" />
                      How to Play
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-dopamine-green mt-0.5 shrink-0" />
                        <span>You'll face 5 challenging customer objections</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-dopamine-green mt-0.5 shrink-0" />
                        <span>Choose the best response strategy for each objection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-dopamine-green mt-0.5 shrink-0" />
                        <span>Faster responses earn more points</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-dopamine-green mt-0.5 shrink-0" />
                        <span>Build a streak by playing daily</span>
                      </li>
                    </ul>
                  </div>
                  
                  {streak > 0 && (
                    <motion.div 
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                      }}
                      className="bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 rounded-md p-4 flex items-center gap-3 border border-orange-100 shadow-sm"
                    >
                      <div className="p-2 bg-orange-100 rounded-full">
                        <Flame className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium">Current streak: {streak} day{streak !== 1 ? 's' : ''}</p>
                        <p className="text-sm text-orange-600">Keep your streak going by playing daily!</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={handleStartGame}
                    className="bg-gradient-to-r from-dopamine-blue to-dopamine-purple hover:from-dopamine-blue/90 hover:to-dopamine-purple/90 group"
                  >
                    Start Challenge
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
        
        {gameState === 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-3xl mx-auto shadow-md border border-muted">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      Round {round} of {objectionSet.length}
                    </CardTitle>
                    <CardDescription>
                      Choose the best strategy to handle this objection
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ 
                        scale: timeLeft < 10 ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ 
                        repeat: timeLeft < 10 ? Infinity : 0, 
                        duration: 0.5
                      }}
                    >
                      <Badge variant="outline" className={`py-1.5 ${
                        timeLeft > 20 
                          ? "bg-green-50 text-green-700 border-green-200" 
                          : timeLeft > 10 
                            ? "bg-amber-50 text-amber-700 border-amber-200" 
                            : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        <Clock className="h-4 w-4 mr-1.5" />
                        <span>{timeLeft}s</span>
                      </Badge>
                    </motion.div>
                    <Badge variant="outline" className="py-1.5 bg-purple-50 text-purple-700 border-purple-200">
                      <Trophy className="h-4 w-4 mr-1.5 text-dopamine-purple" />
                      <span>{score} pts</span>
                    </Badge>
                  </div>
                </div>
                
                <Progress 
                  value={(timeLeft / 30) * 100} 
                  className="h-1.5 mt-2"
                  indicatorClassName={
                    timeLeft > 20 ? "bg-dopamine-green" : 
                    timeLeft > 10 ? "bg-amber-500" : 
                    "bg-dopamine-pink"
                  }
                />
              </CardHeader>
              
              <CardContent className="pt-4">
                <div className="space-y-6">
                  {renderGameContent()}
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-4 flex justify-between">
                <div>
                  {result && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      <Badge variant={result === 'correct' ? 'default' : 'destructive'} className="gap-1">
                        {result === 'correct' ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>+{5 + Math.floor(timeLeft / 3)} points</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5" />
                            <span>+0 points</span>
                          </>
                        )}
                      </Badge>
                    </motion.div>
                  )}
                </div>
                
                {result && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={handleNextRound}
                      className="bg-gradient-to-r from-dopamine-blue to-dopamine-purple hover:from-dopamine-blue/90 hover:to-dopamine-purple/90"
                    >
                      {currentObjectionIndex < objectionSet.length - 1 ? (
                        <>Next Objection</>
                      ) : (
                        <>Finish Game</>
                      )}
                    </Button>
                  </motion.div>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        )}
        
        {gameState === 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-3xl mx-auto shadow-md border-t-4 border-dopamine-purple overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-dopamine-purple/20 to-dopamine-pink/10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2 
                  }}
                >
                  <CardTitle className="text-2xl flex justify-center items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    Game Completed!
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                  </CardTitle>
                </motion.div>
                <CardDescription>
                  Here's how you did in today's challenge
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6 pb-4 flex flex-col items-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, 0] }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.4 
                  }}
                  className="bg-gradient-to-r from-dopamine-purple/20 to-dopamine-purple/10 rounded-full p-5 mb-5 border-2 border-dopamine-purple/20 shadow-md"
                >
                  <Trophy className="h-14 w-14 text-dopamine-purple" />
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-3xl font-bold mb-1 bg-gradient-to-r from-dopamine-purple to-dopamine-pink bg-clip-text text-transparent"
                >
                  {score} points
                </motion.h2>
                <p className="text-muted-foreground mb-6">You've earned {score} points today</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 text-center border border-orange-100 shadow-sm"
                  >
                    <Flame className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-2xl font-semibold">{streak} day{streak !== 1 ? 's' : ''}</p>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4 text-center border border-pink-100 shadow-sm"
                  >
                    <Award className="h-6 w-6 text-dopamine-pink mx-auto mb-1" />
                    <p className="text-sm text-muted-foreground">Total Score</p>
                    <p className="text-2xl font-semibold">{userGameData?.score || score}</p>
                  </motion.div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Come back tomorrow for a new challenge!</p>
                  <div className="flex justify-center gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/student/leaderboard')}
                      >
                        View Leaderboard
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={handlePlayAgain}
                        className="bg-gradient-to-r from-dopamine-purple to-dopamine-pink hover:from-dopamine-purple/90 hover:to-dopamine-pink/90"
                      >
                        Play Again
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default ObjectionChallenge;
