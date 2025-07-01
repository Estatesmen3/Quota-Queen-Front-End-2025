
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import RecruiterLayout from "@/components/RecruiterLayout";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import GamesLeaderboard from "@/components/salesgames/GamesLeaderboard";
import LeaderboardHeader from "@/components/leaderboard/LeaderboardHeader";
import CurrentUserRanking from "@/components/leaderboard/CurrentUserRanking";
import LeaderboardTopRankers from "@/components/leaderboard/LeaderboardTopRankers";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import UniversityRankings from "@/components/leaderboard/UniversityRankings";
import IndustryRankings from "@/components/leaderboard/IndustryRankings";

const Leaderboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const userRole = profile?.user_type as "student" | "recruiter" || "student";
  const Layout = userRole === "recruiter" ? RecruiterLayout : DashboardLayout;
  
  const [activeTab, setActiveTab] = useState("overall");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);

  const { 
    leaderboardData, 
    currentUserRank, 
    universityRankings, 
    industryRankings, 
    isLoading 
  } = useLeaderboard(userRole);

  const [filteredLeaderboardData, setFilteredLeaderboardData] = useState(leaderboardData);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredLeaderboardData(showAllEntries ? 
        leaderboardData : 
        leaderboardData.slice(0, 10));
    } else {
      const filteredData = leaderboardData.filter(
        entry => 
          (entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (entry.industry && entry.industry.toLowerCase().includes(searchQuery.toLowerCase())))
      );
      setFilteredLeaderboardData(filteredData);
    }
  }, [searchQuery, showAllEntries, leaderboardData]);

  const toggleShowAllEntries = () => {
    setShowAllEntries(!showAllEntries);
  };

  const navigateToPage = (page: number) => {
    setCurrentPage(page);
    setShowAllEntries(page > 1);
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center p-6">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading leaderboard data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <LeaderboardHeader 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        {userRole !== "recruiter" && currentUserRank && (
          <CurrentUserRanking currentUserRank={currentUserRank} />
        )}

        <Tabs defaultValue="overall" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full md:w-auto md:inline-flex bg-background border">
            <TabsTrigger 
              value="overall"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-dopamine-purple/90 data-[state=active]:to-dopamine-pink/90 data-[state=active]:text-white"
            >
              Overall
            </TabsTrigger>
            <TabsTrigger 
              value="games"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-dopamine-green/90 data-[state=active]:to-dopamine-blue/90 data-[state=active]:text-white"
            >
              Games
            </TabsTrigger>
            <TabsTrigger 
              value="university"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-dopamine-purple/90 data-[state=active]:to-dopamine-pink/90 data-[state=active]:text-white"
            >
              Universities
            </TabsTrigger>
            <TabsTrigger 
              value="industry"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-dopamine-purple/90 data-[state=active]:to-dopamine-pink/90 data-[state=active]:text-white"
            >
              Industries
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overall" className="space-y-6 animate-fade-in">
            <LeaderboardTopRankers topRankers={leaderboardData.slice(0, 3)} />
            
            <LeaderboardTable 
              entries={filteredLeaderboardData}
              showAllEntries={showAllEntries}
              toggleShowAllEntries={toggleShowAllEntries}
              currentPage={currentPage}
              totalPages={totalPages}
              navigateToPage={navigateToPage}
              generatePageNumbers={generatePageNumbers}
            />
          </TabsContent>
          
          <TabsContent value="games" className="space-y-6 animate-fade-in">
            <GamesLeaderboard />
          </TabsContent>
          
          <TabsContent value="university" className="animate-fade-in">
            <UniversityRankings 
              universityRankings={universityRankings}
              currentPage={currentPage}
              totalPages={totalPages}
              navigateToPage={navigateToPage}
              generatePageNumbers={generatePageNumbers}
            />
          </TabsContent>
          
          <TabsContent value="industry" className="animate-fade-in">
            <IndustryRankings 
              industryRankings={industryRankings}
              currentPage={currentPage}
              totalPages={totalPages}
              navigateToPage={navigateToPage}
              generatePageNumbers={generatePageNumbers}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Leaderboard;
