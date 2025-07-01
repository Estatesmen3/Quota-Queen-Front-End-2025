
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Construction } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const NegotiationGame = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Negotiation Master</h1>
            <p className="text-muted-foreground">
              Practice your negotiation skills with real-world scenarios
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/student/sales-games')}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Button>
        </div>
        
        <Separator />
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Construction className="h-5 w-5 text-yellow-500" />
              Coming Soon
            </CardTitle>
            <CardDescription>
              We're working on this exciting new feature
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-12 text-center space-y-4">
              <p className="text-muted-foreground">
                The Negotiation Master game is currently under development and will be available soon.
              </p>
              <p className="text-muted-foreground">
                Check back later to practice your negotiation skills with interactive scenarios!
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate('/student/sales-games')}
              >
                Back to Games Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NegotiationGame;
