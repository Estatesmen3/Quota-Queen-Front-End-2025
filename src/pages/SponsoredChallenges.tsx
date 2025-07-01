
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, Trophy, Users, Calendar, DollarSign, Briefcase, Flag, Target, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import ChallengeForm from "./ChallengeForm";
import axios from 'axios';

interface Challenge {
  id: string;
  company_name: string;
  product_name: string;
  scenario_title: string;
  scenario_description: string;
  industry: string;
  difficulty: string;
  agent_id: string;
  prize_description: string;
  prize_amount: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

const SponsoredChallenges = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  console.log("useruseruseruser ", user)

  const [formData, setFormData] = useState({
    company_name: "",               // required
    product_name: "",              // required
    scenario_title: "",            // required
    scenario_description: "",      // required
    industry: "",                  // required
    difficulty: "",                // required

    // Optional fields
    company_description: "",
    prospect_background: "",
    research_notes: "",
    call_info: "",

    company_info: {
      revenues: "",
      employees: 0,
      headquarters: "",
      founded: "",
      executives: {
        ceo: "",
        cfo: "",
        cso: ""
      }
    },

    prospect_info: {
      name: "",
      title: "",
      experience: {
        company: "",
        roles: []
      },
      education: "",
      pain_points: []
    },

    prize_description: "",
    prize_amount: 0,
    start_date: new Date().toISOString().split('T')[0], // default today
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], // default +1 month
    is_active: true // default active
  });


  useEffect(() => {
    fetchChallenges();
  }, [user]);

  const fetchChallenges = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('sponsored_challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast({
        title: "Failed to load challenges",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };


  const updateChallengeStatus = async (id: string, is_active: boolean) => {


    console.log("updateChallengeStatus -> ", id)


    try {
      const { error } = await supabase
        .from('sponsored_challenges')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: is_active ? "Challenge activated" : "Challenge deactivated",
        description: is_active ? "Students can now see this challenge" : "This challenge is now hidden from students"
      });

      fetchChallenges();
    } catch (error) {
      console.error('Error updating challenge status:', error);
      toast({
        title: "Failed to update challenge",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };


  const deleteChallengeAndAgent = async (id: string, agentId: string) => {


    try {


      const response = await axios.delete(`https://cc8f-13-59-58-130.ngrok-free.app/agents/${agentId}`);
      console.log('Agent Data:', response.data);

      const { error } = await supabase
      .from('sponsored_challenges')
      .delete()
      .eq('id', id);    

      if (error) throw error;

      toast({
        title: "Challenge Deleted",
        description: "This challenge is now deleted"
      });

      fetchChallenges();
    } catch (error) {
      console.error('Error updating challenge status:', error);
      toast({
        title: "Failed to update challenge",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      // Required fields
      company_name: "",
      product_name: "",
      scenario_title: "",
      scenario_description: "",
      industry: "",
      difficulty: "",

      // Optional fields
      company_description: "",
      prospect_background: "",
      research_notes: "",
      call_info: "",

      company_info: JSON.stringify({
        revenues: "",
        employees: 0,
        headquarters: "",
        founded: "",
        executives: {
          ceo: "",
          cfo: "",
          cso: ""
        }
      }, null, 2),

      prospect_info: JSON.stringify({
        name: "",
        title: "",
        experience: {
          company: "",
          roles: []
        },
        education: "",
        pain_points: []
      }, null, 2),

      prize_description: "",
      prize_amount: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      is_active: true
    });
  };


  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sponsored Challenges</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage sales challenges for students
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="glow-on-hover">
                <Plus className="mr-2 h-4 w-4" />
                New Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Challenge...</DialogTitle>
                <DialogDescription>
                  Create a new sales challenge for students to practice and showcase their skills.
                </DialogDescription>
              </DialogHeader>

              <ChallengeForm
                formData={formData}
                setFormData={setFormData}
                resetForm={resetForm}
                fetchChallenges={fetchChallenges}
              />




            </DialogContent>
          </Dialog>

        </div>

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Challenges</TabsTrigger>
            <TabsTrigger value="past">Inactive Challenges</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) :
            
            challenges.length > 0 ? (
              challenges.map((challenge) => (
                <Card key={challenge.id} className="overflow-hidden mb-4">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold">
                            {challenge.scenario_title}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              {challenge.industry}
                            </Badge>
                            <Badge variant="outline" className="bg-secondary/20">
                              {challenge.difficulty.charAt(0).toUpperCase() + 
                               challenge.difficulty.slice(1)}
                            </Badge>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              {new Date(challenge.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                                ? 'New' 
                                : 'Active'}
                            </Badge>
                          </div>
                        </div>
                      </div>
            
                      <CardDescription className="mt-4 text-base">
                        <div className="mb-2">
                          <span className="font-medium">{challenge.company_name}</span> • {challenge.product_name}
                        </div>
                        {challenge.scenario_description}
                      </CardDescription>
            
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            Created: {new Date(challenge.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Trophy className="h-4 w-4 mr-2" />
                          <span>
                            {challenge.prize_description || 'No prize specified'} 
                            {challenge.prize_worth ? ` ($${challenge.prize_worth})` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
            
                    <div className="w-full md:w-48 p-6 bg-muted flex flex-row md:flex-col items-center justify-center gap-2">
                      <Button variant="outline" className="w-full" size="sm"
                        onClick={() => window.open(`/challenge/${challenge.id}`, '_blank')}>
                        Preview
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        View Participants
                      </Button>
                      {user.id === "2aae160f-d215-494a-8005-193533e0717c" && <Button variant={challenge.is_active && "destructive"} className={challenge.is_active ? "w-full" : "glow-on-hover w-full"} size="sm"
                        onClick={() => updateChallengeStatus(challenge.id, !challenge.is_active)}>
                        {challenge.is_active && "Deactivate"}
                      </Button>}
                      {user.id === "2aae160f-d215-494a-8005-193533e0717c" && <Button variant={challenge.is_active ? "destructive" : "default"} className={challenge.is_active ? "w-full" : "glow-on-hover w-full"} size="sm"
                        onClick={() => deleteChallengeAndAgent(challenge.id, challenge?.agent_id)}>
                        Delete
                      </Button>}
                    </div>
                  </div>
                </Card>
              ))
            )
            
            : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No active challenges</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You don't have any active challenges yet. Create a new challenge to engage with students.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      New Challenge
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
                    <ChallengeForm
                      formData={formData}
                      setFormData={setFormData}
                      resetForm={resetForm}
                      fetchChallenges={fetchChallenges}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : challenges.filter(c => !c.is_active).length > 0 ? (
              challenges.filter(c => !c.is_active).map((challenge) => (
                <Card key={challenge.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold">{challenge.scenario_title}</CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              {challenge.industry}
                            </Badge>
                            <Badge variant="outline" className="bg-secondary/20">
                              {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                            </Badge>
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">
                              Inactive
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <CardDescription className="mt-4 text-base">
                        <div className="mb-2">
                          <span className="font-medium">{challenge.company_name}</span> • {challenge.product_name}
                        </div>
                        {challenge.scenario_description}
                      </CardDescription>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {new Date(challenge.start_date).toLocaleDateString()} - {challenge.end_date ? new Date(challenge.end_date).toLocaleDateString() : 'No end date'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Trophy className="h-4 w-4 mr-2" />
                          <span>{challenge.prize_description || 'No prize specified'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-48 p-6 bg-muted flex flex-row md:flex-col items-center justify-center gap-2">
                      <Button variant="outline" className="w-full" size="sm"
                        onClick={() => window.open(`/challenge/${challenge.id}`, '_blank')}>
                        Preview
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        View Results
                      </Button>
                      <Button className="w-full" size="sm"
                        onClick={() => updateChallengeStatus(challenge.id, !challenge.is_active)}>
                        Reactivate
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <Flag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No inactive challenges</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You don't have any inactive challenges yet. Inactive challenges will appear here after you deactivate them.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Alert className="mt-8 bg-soft-peach border-primary/30">
          <Trophy className="h-5 w-5 text-primary" />
          <AlertTitle>Boost engagement with sponsored challenges</AlertTitle>
          <AlertDescription>
            Sponsored challenges are a great way to identify top sales talent and engage with students. Winners receive prizes and gain visibility on the leaderboard.
          </AlertDescription>
        </Alert>
      </div>
    </DashboardLayout>
  );
};

export default SponsoredChallenges;
