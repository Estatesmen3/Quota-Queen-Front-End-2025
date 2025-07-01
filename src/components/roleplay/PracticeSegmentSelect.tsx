
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Handshake, 
  ClipboardList, 
  Search, 
  Presentation, 
  ShieldQuestion, 
  Goal, 
  ArrowRight, 
  Clock,
  Mic,
  Sparkles,
  Star
} from "lucide-react";
import { motion } from 'framer-motion';

export type PracticeSegment = 'full_roleplay' | 'intro_rapport' | 'agenda' | 'needs_identification' | 'presentation' | 'objection_handling' | 'closing' | 'elevator_pitch';

interface PracticeOption {
  id: PracticeSegment;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: React.ReactNode;
  color: string;
  gradient: string;
  hoverGradient: string;
  iconBg: string;
  iconColor: string;
}

const practiceOptions: PracticeOption[] = [
  {
    id: 'elevator_pitch',
    title: 'Elevator Pitch',
    description: 'Record and get feedback on your concise value proposition',
    duration: '1-2 min',
    difficulty: 'Beginner',
    icon: <Mic className="h-5 w-5" />,
    color: 'border-dopamine-pink',
    gradient: 'from-pink-500/15 to-rose-500/10',
    hoverGradient: 'from-pink-500/20 to-rose-500/15',
    iconBg: 'bg-pink-50',
    iconColor: 'text-dopamine-pink'
  },
  {
    id: 'intro_rapport',
    title: 'Introduction & Rapport Building',
    description: 'Master the art of opening calls and building relationships',
    duration: '3-5 min',
    difficulty: 'Beginner',
    icon: <Handshake className="h-5 w-5" />,
    color: 'border-dopamine-blue',
    gradient: 'from-blue-500/15 to-indigo-500/10',
    hoverGradient: 'from-blue-500/20 to-indigo-500/15',
    iconBg: 'bg-blue-50',
    iconColor: 'text-dopamine-blue'
  },
  {
    id: 'agenda',
    title: 'Setting the Agenda',
    description: 'Learn to structure and control the conversation flow',
    duration: '2-3 min',
    difficulty: 'Beginner',
    icon: <ClipboardList className="h-5 w-5" />,
    color: 'border-teal-500',
    gradient: 'from-teal-500/15 to-cyan-500/10',
    hoverGradient: 'from-teal-500/20 to-cyan-500/15',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600'
  },
  {
    id: 'needs_identification',
    title: 'Needs Identification',
    description: 'Practice discovering customer pain points and needs',
    duration: '5-7 min',
    difficulty: 'Intermediate',
    icon: <Search className="h-5 w-5" />,
    color: 'border-amber-500',
    gradient: 'from-amber-500/15 to-orange-500/10',
    hoverGradient: 'from-amber-500/20 to-orange-500/15',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600'
  },
  {
    id: 'presentation',
    title: 'Solution Presentation',
    description: 'Present your solution effectively and handle questions',
    duration: '5-7 min',
    difficulty: 'Intermediate',
    icon: <Presentation className="h-5 w-5" />,
    color: 'border-dopamine-green',
    gradient: 'from-green-500/15 to-emerald-500/10',
    hoverGradient: 'from-green-500/20 to-emerald-500/15',
    iconBg: 'bg-green-50',
    iconColor: 'text-dopamine-green'
  },
  {
    id: 'objection_handling',
    title: 'Objection Handling',
    description: 'Master common objections and learn effective responses',
    duration: '5-7 min',
    difficulty: 'Advanced',
    icon: <ShieldQuestion className="h-5 w-5" />,
    color: 'border-red-500',
    gradient: 'from-red-500/15 to-orange-500/10',
    hoverGradient: 'from-red-500/20 to-orange-500/15',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600'
  },
  {
    id: 'closing',
    title: 'Closing Techniques',
    description: 'Practice various methods to close deals successfully',
    duration: '3-5 min',
    difficulty: 'Advanced',
    icon: <Goal className="h-5 w-5" />,
    color: 'border-yellow-500',
    gradient: 'from-yellow-500/15 to-amber-500/10',
    hoverGradient: 'from-yellow-500/20 to-amber-500/15',
    iconBg: 'bg-yellow-50',
    iconColor: 'text-yellow-600'
  },
  {
    id: 'full_roleplay',
    title: 'Full Sales Call',
    description: 'Practice a complete B2B sales call from start to finish',
    duration: '15-20 min',
    difficulty: 'Advanced',
    icon: <Users className="h-5 w-5" />,
    color: 'border-dopamine-purple',
    gradient: 'from-purple-500/20 to-violet-500/10',
    hoverGradient: 'from-purple-500/25 to-violet-500/15',
    iconBg: 'bg-purple-50',
    iconColor: 'text-dopamine-purple'
  }
];

interface Props {
  onSelect: (segment: PracticeSegment) => void;
}

const PracticeSegmentSelect = ({ onSelect }: Props) => {
  const [hoveredCard, setHoveredCard] = useState<PracticeSegment | null>(null);

  const getBadgeVariant = (difficulty: string) => {
    if (difficulty === 'Beginner') return 'secondary';
    if (difficulty === 'Intermediate') return 'default';
    return 'destructive';
  };

  const getBadgeColor = (difficulty: string) => {
    if (difficulty === 'Beginner') return 'bg-green-500/80 hover:bg-green-500';
    if (difficulty === 'Intermediate') return 'bg-amber-500/90 hover:bg-amber-500';
    return 'bg-red-500/90 hover:bg-red-500';
  };

  // Sort the practice options in a more logical order
  const sortedPracticeOptions = [...practiceOptions].sort((a, b) => {
    // Custom sort order based on the typical sales process flow
    const order: Record<PracticeSegment, number> = {
      'elevator_pitch': 0,
      'intro_rapport': 1,
      'agenda': 2,
      'needs_identification': 3,
      'presentation': 4,
      'objection_handling': 5,
      'closing': 6,
      'full_roleplay': 7
    };
    
    return order[a.id] - order[b.id];
  });

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
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {sortedPracticeOptions.map((option) => (
        <motion.div
          key={option.id}
          variants={item}
          whileHover={{ 
            y: -8,
            transition: { type: "spring", stiffness: 300, damping: 10 }
          }}
          onHoverStart={() => setHoveredCard(option.id)}
          onHoverEnd={() => setHoveredCard(null)}
        >
          <Card 
            className={`overflow-hidden transition-all duration-300 transform shadow-md hover:shadow-xl cursor-pointer ${option.color} border-t-4`}
            onClick={() => onSelect(option.id)}
          >
            <CardHeader 
              className={`space-y-1 pb-2 relative overflow-hidden bg-gradient-to-r ${hoveredCard === option.id ? option.hoverGradient : option.gradient}`}
            >
              {option.id === 'elevator_pitch' && (
                <motion.div 
                  className="absolute top-1 right-2 text-dopamine-purple/80"
                  animate={{ 
                    scale: [1, 1.2, 1], 
                    opacity: [0.5, 1, 0.5] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
              )}
            
              <div className="flex items-center justify-between">
                <motion.div 
                  className={`${option.iconBg} ${option.iconColor} p-2 rounded-full shadow-sm`}
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {option.icon}
                </motion.div>
                
                <Badge 
                  variant={getBadgeVariant(option.difficulty)} 
                  className={`${getBadgeColor(option.difficulty)} animate-fade-in`}
                >
                  {option.difficulty === 'Advanced' && (
                    <Star className="h-3 w-3 mr-1 fill-white" />
                  )}
                  {option.difficulty}
                </Badge>
              </div>
              
              <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                {option.title}
              </CardTitle>
              
              <CardDescription className="text-foreground/80">
                {option.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-4 bg-background/90">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  {option.duration}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`p-0 group ${hoveredCard === option.id ? `text-${option.iconColor.split('-').pop()}` : 'hover:text-dopamine-purple'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(option.id);
                  }}
                >
                  Start 
                  <motion.div
                    animate={{ x: hoveredCard === option.id ? 4 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </motion.div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PracticeSegmentSelect;
