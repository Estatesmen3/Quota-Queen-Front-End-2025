
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Crown, Star, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UniversityRankingsProps {
  universityRankings: Array<{name: string, score: number, students: number, logo?: string}>;
  currentPage: number;
  totalPages: number;
  navigateToPage: (page: number) => void;
  generatePageNumbers: () => number[];
}

const UniversityRankings = ({ 
  universityRankings,
  currentPage,
  totalPages,
  navigateToPage,
  generatePageNumbers
}: UniversityRankingsProps) => {
  return (
    <>
      <div className="hidden md:flex justify-center items-end space-x-6 py-8">
        {universityRankings.slice(0, 3).map((university, index) => {
          const height = index === 0 ? "h-40" : index === 1 ? "h-32" : "h-28";
          const width = index === 0 ? "w-36" : "w-32";
          const bgColor = index === 0 
            ? "bg-gradient-to-b from-dopamine-pink to-dopamine-purple" 
            : index === 1 
              ? "bg-gradient-to-b from-dopamine-purple to-dopamine-blue" 
              : "bg-gradient-to-b from-dopamine-blue to-dopamine-green";
          
          return (
            <div key={university.name} className="flex flex-col items-center">
              <div className={cn(
                "flex items-center justify-center rounded-full mb-3 transition-transform hover:scale-105 shadow-lg",
                index === 0 ? "border-dopamine-pink bg-dopamine-pink/10 text-dopamine-pink" : 
                index === 1 ? "border-dopamine-purple bg-dopamine-purple/10 text-dopamine-purple" : 
                "border-dopamine-blue bg-dopamine-blue/10 text-dopamine-blue",
                "w-20 h-20 border-2"
              )}>
                <GraduationCap className="h-10 w-10" />
              </div>
              
              <span className="font-bold text-center max-w-[160px] text-center">{university.name}</span>
              <span className="text-sm text-muted-foreground">{university.score} pts</span>
              
              <div 
                className={cn(
                  "mt-3 rounded-t-md flex items-center justify-center shadow-lg",
                  bgColor,
                  height, width
                )}
              >
                <div className="flex flex-col items-center text-white">
                  <div className="text-center">
                    <span className="text-2xl font-bold block">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium">{university.students} students</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <Card className="overflow-hidden border-2 shadow-md">
        <CardHeader className="pb-2 bg-gradient-to-r from-background via-dopamine-purple/5 to-dopamine-pink/5">
          <CardTitle>University Rankings</CardTitle>
          <CardDescription>
            Top performing universities based on student achievements
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {universityRankings.map((university, index) => (
              <div 
                key={university.name} 
                className={cn(
                  "flex items-center justify-between p-4 hover:bg-muted/50 transition-colors",
                  index < 3 && "bg-gradient-to-r from-dopamine-purple/5 to-dopamine-pink/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full font-semibold",
                    index === 0 ? "bg-gradient-to-r from-dopamine-purple to-dopamine-pink text-white" : 
                    index === 1 ? "bg-gradient-to-r from-dopamine-blue to-dopamine-purple text-white" : 
                    index === 2 ? "bg-gradient-to-r from-dopamine-green to-dopamine-blue text-white" : 
                    "bg-primary/10 text-primary"
                  )}>
                    {index === 0 ? (
                      <Crown className="h-5 w-5" />
                    ) : index === 1 ? (
                      <Star className="h-5 w-5" />
                    ) : index === 2 ? (
                      <Award className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  
                  <div className={cn(
                    "flex items-center justify-center rounded-full w-10 h-10",
                    index === 0 ? "bg-dopamine-pink/10 text-dopamine-pink" : 
                    index === 1 ? "bg-dopamine-purple/10 text-dopamine-purple" : 
                    index === 2 ? "bg-dopamine-blue/10 text-dopamine-blue" : 
                    "bg-dopamine-green/10 text-dopamine-green"
                  )}>
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  
                  <div>
                    <div className="font-medium">{university.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {university.students} students enrolled
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="font-semibold text-lg">{university.score}</div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                      index === 0 && "border-dopamine-pink text-dopamine-pink hover:bg-dopamine-pink/10",
                      index === 1 && "border-dopamine-purple text-dopamine-purple hover:bg-dopamine-purple/10",
                      index === 2 && "border-dopamine-blue text-dopamine-blue hover:bg-dopamine-blue/10"
                    )}
                  >
                    View Students
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col items-center py-4 border-t space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {generatePageNumbers().map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => navigateToPage(page)}
                  className={cn(
                    "h-8 w-8 p-0",
                    currentPage === page && "bg-gradient-to-r from-dopamine-purple to-dopamine-pink"
                  )}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default UniversityRankings;
