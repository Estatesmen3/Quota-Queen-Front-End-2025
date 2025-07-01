
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ElevatorPitchHeader: React.FC = () => {
  return (
    <>
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="mb-2 group transition-all duration-300 hover:bg-dopamine-purple/10"
          asChild
        >
          <Link to="/student/roleplay/new">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:text-dopamine-purple transition-colors" />
            <span className="group-hover:text-dopamine-purple transition-colors">Back to Practice Options</span>
          </Link>
        </Button>
      </div>
      
      <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-dopamine-purple/20 to-dopamine-pink/10 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight highlight-gradient">
          Elevator Pitch Practice
        </h1>
        <p className="text-muted-foreground mt-2">
          Record, upload, and get AI feedback on your elevator pitch
        </p>
      </div>
    </>
  );
};

export default ElevatorPitchHeader;
