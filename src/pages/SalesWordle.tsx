import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSalesGames } from '@/hooks/useSalesGames';
import DashboardLayout from '@/components/DashboardLayout';
import RecruiterLayout from '@/components/RecruiterLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  ArrowRight, 
  Award,
  CheckCircle2, 
  Clock, 
  Flame, 
  Puzzle,
  RefreshCw,
  Trophy
} from 'lucide-react';

const WORD_LENGTH = 5;

const SalesWordle = () => {
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

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'completed'>('ready');
  const [dailyWord, setDailyWord] = useState('sales'); // Default word
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{letter: string, state: 'correct' | 'present' | 'absent'}[][]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState(6);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Initialize game data
    const initGame = async () => {
      await fetchUserGameData('wordle');
      await fetchDailyChallenge('wordle');
    };
    
    initGame();
  }, []);

  useEffect(() => {
    // Set initial streak from user data
    if (userGameData) {
      setStreak(userGameData.streak);
    }
  }, [userGameData]);

  useEffect(() => {
    // Update daily word from challenge
    if (dailyChallenge && dailyChallenge.challenge_data) {
      // Fix: Access the correct property from challenge_data
      const word = dailyChallenge.challenge_data.prompt || 'sales';
      setDailyWord(word.toLowerCase());
    }
  }, [dailyChallenge]);

  const handleStartGame = () => {
    setGameState('playing');
    setCurrentGuess('');
    setGuesses([]);
    setFeedback([]);
    setAttemptsLeft(6);
    setGameWon(false);
    setScore(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= WORD_LENGTH) {
      setCurrentGuess(value.toLowerCase());
    }
  };

  const checkGuess = (guess: string) => {
    const wordArray = dailyWord.split('');
    const guessArray = guess.split('');
    
    const result = guessArray.map((letter, index) => {
      if (letter === wordArray[index]) {
        return { letter, state: 'correct' as const };
      } else if (wordArray.includes(letter)) {
        return { letter, state: 'present' as const };
      } else {
        return { letter, state: 'absent' as const };
      }
    });
    
    return result;
  };

  const handleSubmitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) {
      toast.error(`Guess must be ${WORD_LENGTH} letters!`);
      return;
    }

    const newFeedback = checkGuess(currentGuess);
    setFeedback([...feedback, newFeedback]);
    setGuesses([...guesses, currentGuess]);
    setCurrentGuess('');
    setAttemptsLeft(attemptsLeft - 1);

    // Check if won
    const isCorrect = newFeedback.every(item => item.state === 'correct');
    
    if (isCorrect) {
      setGameWon(true);
      setGameState('completed');
      
      // Calculate score based on attempts left (reduced points)
      const newScore = (attemptsLeft + 1) * 5; // Reduced from 10 to 5 points per attempt left
      setScore(newScore);
      
      // Save game result
      if (user) {
        saveGameResult('wordle', newScore, true);
      }
      
      toast.success('You won!');
    } else if (attemptsLeft <= 1) {
      // Game over
      setGameState('completed');
      toast.error(`Game over! The word was "${dailyWord}"`);
      
      // Save streak broken
      if (user) {
        saveGameResult('wordle', 0, false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && gameState === 'playing') {
      handleSubmitGuess();
    }
  };

  const letterStateClassName = (state: 'correct' | 'present' | 'absent') => {
    switch (state) {
      case 'correct':
        return 'bg-dopamine-green text-white';
      case 'present':
        return 'bg-amber-500 text-white';
      case 'absent':
        return 'bg-muted-foreground/30 text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-dopamine-green to-dopamine-blue bg-clip-text text-transparent">
              Swordle
            </h1>
            <p className="text-muted-foreground">
              Guess the 5-letter sales term and climb the leaderboard
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student/sales-games')}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Games
            </Button>
            
            {userGameData && (
              <Badge variant="outline" className="flex gap-1 items-center py-1.5 px-3 bg-orange-100 text-orange-700 border-orange-200">
                <Flame className="h-4 w-4" />
                <span>Streak: {userGameData.streak} day{userGameData.streak !== 1 ? 's' : ''}</span>
              </Badge>
            )}
          </div>
        </div>
        
        <Separator />
        
        {gameState === 'ready' && (
          <Card className="max-w-xl mx-auto shadow-md border-t-4 border-dopamine-green">
            <CardHeader className="bg-gradient-to-r from-dopamine-green/20 to-dopamine-blue/10">
              <CardTitle>Daily Swordle Challenge</CardTitle>
              <CardDescription>
                Test your sales vocabulary with our daily word challenge
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-md p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Puzzle className="h-5 w-5 mr-1.5 text-dopamine-green" />
                    How to Play
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-dopamine-green mt-0.5 shrink-0" />
                      <span>Guess the SALES-related 5-letter word in 6 tries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-dopamine-green mt-0.5 shrink-0" />
                      <span>Each guess must be a valid 5-letter word</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-dopamine-green mt-0.5 shrink-0" />
                      <span>After each guess, you'll see hints about each letter's correctness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-dopamine-green mt-0.5 shrink-0" />
                      <span>Play daily to build your streak and climb the leaderboard</span>
                    </li>
                  </ul>
                </div>
                
                {streak > 0 && (
                  <div className="bg-orange-50 text-orange-700 rounded-md p-4 flex items-center gap-3">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Current streak: {streak} day{streak !== 1 ? 's' : ''}</p>
                      <p className="text-sm text-orange-600">Keep your streak going by playing daily!</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button 
                onClick={handleStartGame}
                className="bg-gradient-to-r from-dopamine-green to-dopamine-blue hover:from-dopamine-green/90 hover:to-dopamine-blue/90 group"
              >
                Start Challenge
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {gameState === 'playing' && (
          <Card className="max-w-xl mx-auto shadow-md">
            <CardHeader className="bg-muted/40">
              <div className="flex justify-between items-center">
                <CardTitle>Swordle</CardTitle>
                <Badge variant="outline" className="flex gap-1 items-center py-1.5">
                  <Clock className="h-4 w-4 mr-1.5 text-dopamine-pink" />
                  <span>Attempts left: {attemptsLeft}</span>
                </Badge>
              </div>
              <CardDescription>
                Guess the 5-letter sales term
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 pb-4">
              <div className="space-y-4">
                {/* Display previous guesses and feedback */}
                <div className="space-y-2">
                  {feedback.map((guess, guessIndex) => (
                    <div key={guessIndex} className="flex justify-center gap-2">
                      {guess.map((letterFeedback, letterIndex) => (
                        <div 
                          key={`${guessIndex}-${letterIndex}`}
                          className={`
                            w-10 h-10 flex items-center justify-center 
                            font-bold text-lg uppercase border 
                            ${letterStateClassName(letterFeedback.state)}
                          `}
                        >
                          {letterFeedback.letter}
                        </div>
                      ))}
                    </div>
                  ))}
                  
                  {/* Empty slots for remaining guesses */}
                  {Array.from({ length: attemptsLeft }).map((_, i) => (
                    <div key={`empty-${i}`} className="flex justify-center gap-2">
                      {Array.from({ length: WORD_LENGTH }).map((_, j) => (
                        <div 
                          key={`empty-${i}-${j}`}
                          className="w-10 h-10 flex items-center justify-center border border-muted-foreground/30"
                        >
                          {i === 0 && j < currentGuess.length ? currentGuess[j].toUpperCase() : ''}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                
                {/* Current guess input */}
                <div className="flex gap-2 mt-4 items-center">
                  <Input 
                    value={currentGuess}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter 5-letter word"
                    maxLength={WORD_LENGTH}
                    className="text-center font-medium"
                    autoFocus
                  />
                  <Button 
                    onClick={handleSubmitGuess} 
                    disabled={currentGuess.length !== WORD_LENGTH}
                  >
                    Guess
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {gameState === 'completed' && (
          <Card className="max-w-xl mx-auto shadow-md border-t-4 border-dopamine-green">
            <CardHeader className="bg-gradient-to-r from-dopamine-green/20 to-dopamine-blue/10 text-center">
              <CardTitle className="text-2xl">Game Completed!</CardTitle>
              <CardDescription>
                {gameWon ? 'Congratulations! You guessed the word.' : `Game over! The word was "${dailyWord.toUpperCase()}"`}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6 pb-4 flex flex-col items-center">
              <div className={`
                ${gameWon ? 'bg-dopamine-green/10' : 'bg-muted/30'} 
                rounded-full p-4 mb-4
              `}>
                {gameWon ? (
                  <Trophy className="h-12 w-12 text-dopamine-green" />
                ) : (
                  <RefreshCw className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              
              {gameWon && (
                <>
                  <h2 className="text-3xl font-bold mb-1">{score} points</h2>
                  <p className="text-muted-foreground mb-6">You solved it in {6 - attemptsLeft} attempts</p>
                </>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <Flame className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-semibold">{gameWon ? streak + 1 : 0} day{streak !== 0 ? 's' : ''}</p>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <Award className="h-6 w-6 text-dopamine-green mx-auto mb-1" />
                  <p className="text-sm text-muted-foreground">Daily Answer</p>
                  <p className="text-2xl font-semibold uppercase">{dailyWord}</p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">Come back tomorrow for a new word!</p>
                <div className="flex justify-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/student/leaderboard')}
                  >
                    View Leaderboard
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/student/sales-games')}
                  >
                    Back to Games
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SalesWordle;
