
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  university: string;
  industry?: string;
  score: number;
  change: number;
  badges: string[];
  streak?: number;
  highlighted?: boolean;
}

export const useLeaderboard = (userRole: "student" | "recruiter") => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null);
  const [universityRankings, setUniversityRankings] = useState<{name: string, score: number, students: number, logo?: string}[]>([]);
  const [industryRankings, setIndustryRankings] = useState<{name: string, score: number, companies: number, students: number, logo?: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching leaderboard data...");
        // First, try to get leaderboard data from the leaderboard_entries table
        let { data: entries, error } = await supabase
          .from('leaderboard_entries')
          .select(`
            id,
            user_id,
            score,
            rank,
            category,
            profiles:user_id(
              id,
              first_name,
              last_name,
              university,
              avatar_url,
              bio
            )
          `)
          .order('rank', { ascending: true })
          .limit(15);

        if (error) {
          console.error("Error fetching leaderboard:", error);
          
          // Fall back to mock data if there's an error
          const mockData = getMockLeaderboardData();
          setLeaderboardData(mockData);
          setCurrentUserRank(getMockCurrentUserRank());
          setIsLoading(false);
          
          // Show toast only if it's not a relationship error (which is expected if the schema is not yet set up)
          if (!error.message.includes("relationship")) {
            toast({
              title: "Error loading leaderboard",
              description: "There was a problem loading the leaderboard data.",
              variant: "destructive",
            });
          }
          return;
        }

        console.log("Raw leaderboard entries:", entries);

        // Transform data for rendering
        const transformedData = entries?.map(entry => {
          const profileData = entry.profiles as any;
          return {
            id: entry.id,
            rank: entry.rank || 0,
            name: profileData ? `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() : 'Anonymous User',
            avatar: profileData?.avatar_url || `https://i.pravatar.cc/150?u=${entry.user_id}`,
            university: profileData?.university || 'Unknown University',
            score: entry.score,
            change: Math.floor(Math.random() * 5) - 2, // Mock change value
            badges: getRandomBadges(),
            streak: Math.floor(Math.random() * 8) + 1,
            highlighted: user && entry.user_id === user.id, // Highlight the current user
          };
        }) || [];

        console.log("Transformed leaderboard data:", transformedData);

        if (transformedData.length > 0) {
          setLeaderboardData(transformedData);
          // Find current user's entry
          const userEntry = user ? transformedData.find(entry => entry.highlighted) : null;
          setCurrentUserRank(userEntry || getMockCurrentUserRank());
        } else {
          // Fall back to mock data if no entries
          const mockData = getMockLeaderboardData();
          setLeaderboardData(mockData);
          setCurrentUserRank(getMockCurrentUserRank());
        }
        
        // Set university and industry rankings (using mock data for now)
        const uniRankings = getMockUniversityRankings();
        const indRankings = getMockIndustryRankings();
        setUniversityRankings(uniRankings);
        setIndustryRankings(indRankings);

        console.log("University rankings:", uniRankings);
        console.log("Industry rankings:", indRankings);
      } catch (error) {
        console.error("Error in leaderboard data fetching:", error);
        
        // Fall back to mock data
        const mockData = getMockLeaderboardData();
        setLeaderboardData(mockData);
        setCurrentUserRank(getMockCurrentUserRank());
        setUniversityRankings(getMockUniversityRankings());
        setIndustryRankings(getMockIndustryRankings());
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();

    // Set up realtime subscription for leaderboard updates
    const channel = supabase
      .channel('leaderboard-updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'leaderboard_entries' 
      }, (payload) => {
        console.log('Leaderboard update received:', payload);
        fetchLeaderboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, userRole, user]);

  // Helper functions for mock data
  const getRandomBadges = () => {
    const allBadges = [
      "Quota Queen", "Rising Star", "Technical Expert", "Fast Learner", 
      "Communication Pro", "Negotiation Expert", "Problem Solver", "Team Player",
      "Quick Thinker", "Analytical Mind", "Creative", "Strategic Thinker",
      "Detail Oriented", "Enthusiastic", "Critical Thinker", "Up and Coming"
    ];
    
    const numBadges = Math.floor(Math.random() * 2) + 1;
    const badges = [];
    
    for (let i = 0; i < numBadges; i++) {
      const randomIndex = Math.floor(Math.random() * allBadges.length);
      badges.push(allBadges[randomIndex]);
      allBadges.splice(randomIndex, 1);
    }
    
    return badges;
  };

  const getMockLeaderboardData = (): LeaderboardEntry[] => {
    return [
      {
        id: "user1",
        rank: 1,
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?img=1",
        university: "Stanford University",
        industry: "Technology",
        score: 985,
        change: 2,
        badges: ["Quota Queen", "Rising Star"],
        streak: 7,
        highlighted: false
      },
      {
        id: "user2",
        rank: 2,
        name: "Michael Chen",
        avatar: "https://i.pravatar.cc/150?img=2",
        university: "UC Berkeley",
        industry: "Finance",
        score: 940,
        change: 0,
        badges: ["Consistent"],
        streak: 5
      },
      {
        id: "user3",
        rank: 3,
        name: "Emma Wilson",
        avatar: "https://i.pravatar.cc/150?img=3",
        university: "MIT",
        industry: "Healthcare",
        score: 925,
        change: -1,
        badges: ["Technical Expert"],
        streak: 3
      },
      {
        id: "user4",
        rank: 4,
        name: "Carlos Rodriguez",
        avatar: "https://i.pravatar.cc/150?img=4",
        university: "UCLA",
        industry: "Technology",
        score: 910,
        change: 3,
        badges: ["Fast Learner"],
        streak: 4
      },
      {
        id: "user5",
        rank: 5,
        name: "Jessica Park",
        avatar: "https://i.pravatar.cc/150?img=5",
        university: "Harvard University",
        industry: "Consulting",
        score: 895,
        change: -2,
        badges: ["Communication Pro"],
        streak: 2
      },
      {
        id: "user6",
        rank: 6,
        name: "David Kim",
        avatar: "https://i.pravatar.cc/150?img=6",
        university: "Columbia University",
        industry: "Finance",
        score: 880,
        change: 1,
        badges: ["Negotiation Expert"],
        streak: 6
      },
      {
        id: "user7",
        rank: 7,
        name: "Sophia Martinez",
        avatar: "https://i.pravatar.cc/150?img=7",
        university: "Yale University",
        industry: "Legal",
        score: 865,
        change: 0,
        badges: ["Problem Solver"],
        streak: 8
      },
      {
        id: "user8",
        rank: 8,
        name: "James Taylor",
        avatar: "https://i.pravatar.cc/150?img=8",
        university: "Princeton University",
        industry: "Marketing",
        score: 850,
        change: -3,
        badges: ["Team Player"],
        streak: 1
      },
      {
        id: "user9",
        rank: 9,
        name: "Olivia Brown",
        avatar: "https://i.pravatar.cc/150?img=9",
        university: "University of Chicago",
        industry: "Healthcare",
        score: 835,
        change: 2,
        badges: ["Quick Thinker"],
        streak: 3
      },
      {
        id: "user10",
        rank: 10,
        name: "Ethan Davis",
        avatar: "https://i.pravatar.cc/150?img=10",
        university: "Technology",
        industry: "Duke University",
        score: 820,
        change: -1,
        badges: ["Analytical Mind"],
        streak: 4
      },
      {
        id: "user11",
        rank: 11,
        name: "Ava Taylor",
        avatar: "https://i.pravatar.cc/150?img=11",
        university: "Cornell University",
        industry: "Education",
        score: 815,
        change: 3,
        badges: ["Creative"],
        streak: 2
      },
      {
        id: "user12",
        rank: 12,
        name: "Noah Wilson",
        avatar: "https://i.pravatar.cc/150?img=12",
        university: "Brown University",
        industry: "Non-profit",
        score: 810,
        change: -2,
        badges: ["Strategic Thinker"],
        streak: 5
      },
      {
        id: "user13",
        rank: 13,
        name: "Isabella Garcia",
        avatar: "https://i.pravatar.cc/150?img=13",
        university: "University of Pennsylvania",
        industry: "Manufacturing",
        score: 805,
        change: 4,
        badges: ["Detail Oriented"],
        streak: 3
      },
      {
        id: "user14",
        rank: 14,
        name: "Liam Johnson",
        avatar: "https://i.pravatar.cc/150?img=14",
        university: "Dartmouth College",
        industry: "Entertainment",
        score: 800,
        change: 1,
        badges: ["Enthusiastic"],
        streak: 6
      },
      {
        id: "user15",
        rank: 15,
        name: "Sophia Thomas",
        avatar: "https://i.pravatar.cc/150?img=15",
        university: "Georgetown University",
        industry: "Real Estate",
        score: 795,
        change: -1,
        badges: ["Critical Thinker"],
        streak: 4
      }
    ].filter(entry => entry.id !== "current-user");
  };

  const getMockCurrentUserRank = (): LeaderboardEntry => {
    return {
      id: user?.id || "current-user",
      rank: 42,
      name: "You",
      avatar: "https://i.pravatar.cc/150?img=42",
      university: "Your University",
      industry: "Your Industry",
      score: 620,
      change: 5,
      badges: ["Up and Coming"],
      streak: 3,
      highlighted: true
    };
  };

  const getMockUniversityRankings = () => {
    return [
      { name: "Stanford University", score: 965, students: 127, logo: null },
      { name: "MIT", score: 945, students: 112, logo: null },
      { name: "Harvard University", score: 930, students: 143, logo: null },
      { name: "UC Berkeley", score: 912, students: 98, logo: null },
      { name: "Yale University", score: 890, students: 88, logo: null },
      { name: "Princeton University", score: 872, students: 76, logo: null },
      { name: "Columbia University", score: 861, students: 105, logo: null },
      { name: "UCLA", score: 855, students: 83, logo: null },
      { name: "University of Chicago", score: 840, students: 91, logo: null },
      { name: "Duke University", score: 835, students: 67, logo: null }
    ];
  };

  const getMockIndustryRankings = () => {
    return [
      { name: "Technology", score: 925, companies: 43, students: 127, logo: null },
      { name: "Finance", score: 910, companies: 36, students: 112, logo: null },
      { name: "Healthcare", score: 895, companies: 28, students: 98, logo: null },
      { name: "Consulting", score: 880, companies: 22, students: 83, logo: null },
      { name: "Marketing", score: 870, companies: 19, students: 76, logo: null },
      { name: "Legal", score: 855, companies: 15, students: 88, logo: null },
      { name: "Education", score: 845, companies: 31, students: 105, logo: null },
      { name: "Non-profit", score: 830, companies: 25, students: 91, logo: null },
      { name: "Manufacturing", score: 825, companies: 18, students: 67, logo: null },
      { name: "Entertainment", score: 810, companies: 14, students: 43, logo: null }
    ];
  };

  return {
    leaderboardData,
    currentUserRank,
    universityRankings,
    industryRankings,
    isLoading
  };
};

export default useLeaderboard;
