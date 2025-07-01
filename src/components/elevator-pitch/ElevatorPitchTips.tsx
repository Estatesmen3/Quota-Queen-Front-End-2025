
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const ElevatorPitchTips: React.FC = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Tips for a Great Elevator Pitch</CardTitle>
        <CardDescription>
          Follow these guidelines to make your elevator pitch more effective
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-medium">Keep it brief</h3>
          <p className="text-sm text-muted-foreground">
            Your elevator pitch should be 30-60 seconds (about 150-250 words).
          </p>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-medium">State your goal</h3>
          <p className="text-sm text-muted-foreground">
            Clearly communicate what you're looking for or offering.
          </p>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-medium">Highlight your value</h3>
          <p className="text-sm text-muted-foreground">
            Explain what makes you unique and what value you can provide.
          </p>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-medium">Show your passion</h3>
          <p className="text-sm text-muted-foreground">
            Enthusiasm is contagious - let your genuine interest show through.
          </p>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-medium">Practice delivery</h3>
          <p className="text-sm text-muted-foreground">
            Focus on clear articulation, appropriate pace, and natural body language.
          </p>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-medium">End with a call to action</h3>
          <p className="text-sm text-muted-foreground">
            Make it clear what you want to happen next after your pitch.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElevatorPitchTips;
