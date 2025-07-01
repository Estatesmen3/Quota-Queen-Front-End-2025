
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Trophy, Building, FileText } from "lucide-react";

const RoleplayScenario = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const segment = searchParams.get('segment');

  const { data: sponsoredChallenges, isLoading } = useQuery({
    queryKey: ['sponsored_challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsored_challenges')
        .select('*')
        .eq('is_active', true);
        
      if (error) throw error;
      return data;
    }
  });

  const handleScenarioSelect = async (scenarioType: string, challengeId?: string) => {
    if (scenarioType === 'template') {
      // Create a new roleplay session with template
      const { data, error } = await supabase
        .from('roleplay_sessions')
        .insert([{
          scenario_title: 'Standard B2B Sales Call',
          scenario_description: 'Practice a standard B2B sales call following best practices',
          industry: 'Technology',
          difficulty: 'intermediate',
          practice_segment: segment,
          status: 'in_progress'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating roleplay session:', error);
        return;
      }

      navigate(`/roleplay/session/${data.id}`);
    } else if (scenarioType === 'sponsored' && challengeId) {
      navigate(`/challenge/${challengeId}`);
    } else {
      navigate('/roleplay/custom');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Choose Your Scenario</h1>
          <p className="text-muted-foreground mt-2">
            Select from our templates, sponsored challenges, or create your own custom scenario
          </p>
        </div>

        <Separator />

        <Tabs defaultValue="templates">
          <TabsList>
            <TabsTrigger value="templates">
              <FileText className="mr-2 h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="sponsored">
              <Trophy className="mr-2 h-4 w-4" />
              Sponsored
            </TabsTrigger>
            <TabsTrigger value="custom">
              <Building className="mr-2 h-4 w-4" />
              Custom
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <Badge>Template</Badge>
                    <CardTitle className="mt-2">Standard B2B Sales Call</CardTitle>
                    <CardDescription>
                      Practice a standard B2B sales call following industry best practices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleScenarioSelect('template')}
                      className="w-full"
                    >
                      Start Practice
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sponsored">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : sponsoredChallenges && sponsoredChallenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sponsoredChallenges.map((challenge) => (
                    <Card 
                      key={challenge.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <CardHeader>
                        <Badge variant="secondary">{challenge.company_name}</Badge>
                        <CardTitle className="mt-2">{challenge.scenario_title}</CardTitle>
                        <CardDescription>{challenge.scenario_description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          onClick={() => handleScenarioSelect('sponsored', challenge.id)}
                          className="w-full"
                        >
                          Start Challenge
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Sponsored Challenges Available</CardTitle>
                    <CardDescription>
                      Check back later for new sponsored challenges
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="custom">
              <Card>
                <CardHeader>
                  <CardTitle>Create Custom Scenario</CardTitle>
                  <CardDescription>
                    Design your own sales scenario with specific requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleScenarioSelect('custom')}
                    className="w-full"
                  >
                    Create Custom Scenario
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default RoleplayScenario;
