
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, BarChart3, Clock, Play, Award, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ChallengeSkeleton } from "@/components/challenges/ChallengeSkeleton";
import { ChallengeNotFound } from "@/components/challenges/ChallengeNotFound";
import { ChallengeHeader } from "@/components/challenges/ChallengeHeader";
import { ChallengeTabs } from "@/components/challenges/ChallengeTabs";
import { CompanyProfile } from "@/components/challenges/CompanyProfile";
import { ChallengeStats } from "@/components/challenges/ChallengeStats";
import { RequiredSkills } from "@/components/challenges/RequiredSkills";
import { SponsoredChallenge as Challenge } from "@/types/challenges";
import apiClient from '../../apiClient';
import useCallsData from "@/hooks/useCallsData";
import { CallInterface } from "@/components/call-interface";
import AiAgentUI from "@/components/calls/AiAgentUI";
import { Room } from "livekit-client";



const SponsoredChallenge   = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [notes, setNotes] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const navigate = useNavigate();
  const [livekitRoom, setLivekitRoom] = useState<Room | null>(null);
  const [resData, setResData] = useState([])

  const state = location.state || JSON.parse(localStorage.getItem("challengeData") || "{}");


  useEffect(() => {
    const fetchChallengeDetails = async () => {
      if (!id) return;

      try {
        console.log("Fetching challenge with ID:", id);
        const { data, error } = await supabase
          .from("sponsored_challenges")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        console.log("Challenge data:", data);
        setChallenge(data);
      } catch (error) {
        console.error("Error fetching challenge details:", error);
        toast({
          title: "Error",
          description: "Failed to load challenge details",
          variant: "destructive",
        });
      } finally {
        // setIsLoading(false);
      }
    };

    fetchChallengeDetails();
  }, [id, toast]);


  const {
    upcomingCalls,
    isLoading,
    isCreating,
    createCall,
    callConfig,
    showCallInterface,
    endCall,
  } = useCallsData();


  const handleCreateCall = async (callData: any) => {
    await createCall({
      ...callData,
      scheduled_at: callData.scheduled_at || null,
    });
  };

  const handleStartChallenge = async () => {


    try {
      const tokenString = localStorage.getItem("sb-pesnfpdwcojfomspprmf-auth-token");
      const tokenObject = tokenString ? JSON.parse(tokenString) : null;
      const accessToken = tokenObject?.access_token;
      const userId = tokenObject?.user?.id;
      const user = tokenObject?.user;
    
      const res = await apiClient.post(
        'api/calls',
        {
          userId: userId,
          userMetadata: user,
          title: state.company_name,
          description: state. company_description,
          scheduledAt: state.start_date || null,
          callType: state.difficulty,
          LIVEKIT_URL: state.livekit_url,
          LIVEKIT_API_KEY: state.livekit_api_key,
          LIVEKIT_API_SECRET: state.livekit_api_secret
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    
      const data = res.data;
      setResData(data)
      console.log("daata handleCreateCall -< ", data)


      const response2 = await apiClient.post(`api/scorecard/create/${userId}/${data?.livekit?.roomName}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if(response2.data){
        console.log("response2 data ", response2.data)
      }



      await handleCreateCall(data);
    
      toast({
        title: "Call created",
        description: "Opening call interface…",
      });
    } catch (e: any) {
      toast({
        title: "Failed to create call",
        description: e.response?.data?.error || e.message || "Something went wrong",
        variant: "destructive",
      });
    }
    
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <ChallengeSkeleton />
      </DashboardLayout>
    );
  }

  if (!challenge) {
    return (
      <DashboardLayout>
        <div className="p-6 md:p-8">
          <ChallengeHeader />
          <ChallengeNotFound />
        </div>
      </DashboardLayout>
    );
  }


  console.log("resData?.livekit?.token _ ", resData?.livekit?.token)

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <ChallengeHeader />


        {showCallInterface && callConfig && resData?.livekit?.roomName && resData?.livekit?.token &&  (
        <div className="fixed inset-0 z-50 bg-black/80 flex">
          <CallInterface
            roomName={resData?.livekit?.roomName}
            token={resData?.livekit?.token}
            livekit_url={state.livekit_url}
            onDisconnect={() => {
              endCall();
              navigate("/scorecards")
              setLivekitRoom(null);
            }}
            onRoomConnected={setLivekitRoom}
          />
          {livekitRoom && <AiAgentUI room={livekitRoom} />}
        </div>
      )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{challenge.scenario_title}</CardTitle>
                    <CardDescription className="mt-1 text-base">
                      <span className="font-medium text-primary">{challenge.company_name}</span> • {challenge.product_name}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-background">
                    <Target className="mr-1 h-3 w-3" />
                    {challenge.industry}
                  </Badge>
                  <Badge variant="outline" className="bg-background">
                    <BarChart3 className="mr-1 h-3 w-3" />
                    {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="bg-background">
                    <Clock className="mr-1 h-3 w-3" />
                    10-15 min
                  </Badge>
                </div>
                
                <h3 className="font-semibold mb-2">Challenge Description</h3>
                <p className="text-muted-foreground mb-4">
                  {challenge.scenario_description}
                </p>
                
                {challenge.prize_description && (
                  <div className="mb-6 p-3 bg-green-500/10 rounded-md border border-green-500/20 flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="font-semibold text-green-700">{challenge.prize_description}</p>
                        <p className="text-xs text-green-700/80">Top performers will be eligible for this prize</p>
                      </div>
                    </div>
                    {challenge.prize_amount > 0 && (
                      <div className="flex items-center text-green-600">
                        <DollarSign className="h-5 w-5 mr-1" />
                        <span className="font-medium">{challenge.prize_amount}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <ChallengeTabs 
                  challenge={challenge} 
                  notes={notes}
                  setNotes={setNotes}
                />
              </CardContent>
              
              <CardFooter>
                <Button onClick={handleStartChallenge} className="w-full" size="lg" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start Challenge Now
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-6">
            <CompanyProfile challenge={challenge} />
            <ChallengeStats onStartChallenge={handleStartChallenge} />
            <RequiredSkills difficulty={challenge.difficulty} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SponsoredChallenge;
