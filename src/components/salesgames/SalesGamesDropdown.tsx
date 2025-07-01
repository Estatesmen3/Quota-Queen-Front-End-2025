import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CircleHelp, 
  ChevronsDown, 
  ChevronsUp, 
  BrainCircuit,
  LucideIcon, 
  Dices, 
  Flame,
  Puzzle
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GameOption {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  path: string;
  className: string;
}

const gameOptions: GameOption[] = [
  {
    id: 'objection',
    name: 'Objection Challenge',
    icon: CircleHelp,
    description: 'Counter objections like a pro',
    path: '/student/sales-games/objection',
    className: 'text-dopamine-blue hover:text-dopamine-blue/80'
  },
  {
    id: 'wordle',
    name: 'Sales Wordle',
    icon: Puzzle,
    description: 'Guess the sales term',
    path: '/student/sales-games/wordle',
    className: 'text-dopamine-green hover:text-dopamine-green/80'
  },
  {
    id: 'negotiation',
    name: 'Negotiation Master',
    icon: BrainCircuit,
    description: 'Practice your negotiation skills',
    path: '/student/sales-games/negotiation',
    className: 'text-dopamine-purple hover:text-dopamine-purple/80'
  }
];

interface SalesGamesDropdownProps {
  variant?: 'default' | 'sidebar';
  className?: string;
}

const SalesGamesDropdown: React.FC<SalesGamesDropdownProps> = ({ 
  variant = 'default',
  className 
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleGameSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  if (variant === 'sidebar') {
    return (
      <div className={cn("space-y-1", className)}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start px-2 gap-2 font-medium"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Dices className="h-4 w-4 text-dopamine-pink" />
          <span>Sales Games</span>
          {isOpen ? (
            <ChevronsUp className="h-4 w-4 ml-auto" />
          ) : (
            <ChevronsDown className="h-4 w-4 ml-auto" />
          )}
        </Button>
        
        {isOpen && (
          <div className="pl-6 space-y-1">
            {gameOptions.map((option) => (
              <Button
                key={option.id}
                variant="ghost"
                size="sm"
                className="w-full justify-start px-2 text-muted-foreground hover:text-foreground"
                onClick={() => handleGameSelect(option.path)}
              >
                <option.icon className={cn("h-4 w-4 mr-2", option.className)} />
                {option.name}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn("gap-1", className)}
          onClick={() => navigate('/student/sales-games')}
        >
          <Dices className="h-4 w-4 text-dopamine-pink" />
          <span>Sales Games</span>
          <Flame className="h-3 w-3 text-dopamine-orange animate-pulse" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        {gameOptions.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onClick={() => handleGameSelect(option.path)}
            className="cursor-pointer"
          >
            <div className="flex gap-2 items-center">
              <option.icon className={cn("h-4 w-4", option.className)} />
              <div className="flex flex-col">
                <span className="font-medium">{option.name}</span>
                <span className="text-xs text-muted-foreground">{option.description}</span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SalesGamesDropdown;
