
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mic } from "lucide-react";
import UploadRoleplay from '@/components/roleplay/UploadRoleplay';
import ElevatorPitchHeader from '@/components/elevator-pitch/ElevatorPitchHeader';
import RecordingInterface from '@/components/elevator-pitch/RecordingInterface';
import ElevatorPitchTips from '@/components/elevator-pitch/ElevatorPitchTips';

const ElevatorPitch = () => {
  return (
    <DashboardLayout>
      <div className="flex-1 p-6 md:p-8 bg-gradient-to-br from-background to-muted/50">
        <div className="max-w-4xl mx-auto">
          <ElevatorPitchHeader />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="border-dopamine-purple">
              <CardHeader className="bg-gradient-to-r from-dopamine-purple/10 to-dopamine-pink/5">
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-dopamine-purple" />
                  Record Your Pitch
                </CardTitle>
                <CardDescription>
                  Use your device's camera and microphone to record your pitch
                </CardDescription>
              </CardHeader>
              <CardContent className="py-6">
                <RecordingInterface />
              </CardContent>
            </Card>
            
            <div>
              <UploadRoleplay 
                scenarioTitle="Elevator Pitch" 
                segment="elevator_pitch"
              />
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <ElevatorPitchTips />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ElevatorPitch;
