import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SplashScreenWrapper } from "@/components/SplashScreenWrapper";
import { useEffect } from "react";
import { initializeStorageBuckets } from "@/lib/supabase";

import Index from "./pages/Index";
import ForStudents from "./pages/ForStudents";
import ForRecruiters from "./pages/ForRecruiters";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterJobs from "./pages/RecruiterJobs";
import RecruiterNewJob from "./pages/RecruiterNewJob";
import RecruiterEditJob from "./pages/RecruiterEditJob";
import RecruiterJobDetails from "./pages/RecruiterJobDetails";
import Roleplays from "./pages/Roleplays";
import Leaderboard from "./pages/Leaderboard";
import NewRoleplay from "./pages/NewRoleplay";
import RoleplaySession from "./pages/RoleplaySession";
import RoleplayFeedback from "./pages/RoleplayFeedback";
import StudentProfile from "./pages/StudentProfile";
import NotFound from "./pages/NotFound";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import TalentPool from './pages/TalentPool';
import Explore from './pages/Explore';
import SponsoredChallenge from './pages/SponsoredChallenge';
import SponsoredChallenges from './pages/SponsoredChallenges';
import Messages from './pages/Messages';
import CallPage from './pages/CallPage';
import CallFeedback from './pages/CallFeedback';
import PerformanceLibrary from './pages/PerformanceLibrary';
import PerformanceDetails from './pages/PerformanceDetails';
import ContextSetup from './pages/ContextSetup';
import ElevatorPitch from './pages/ElevatorPitch';
import RecruiterAnalytics from './pages/RecruiterAnalytics';
import RecruiterAssessments from './pages/RecruiterAssessments';
import RecruiterStudentProfile from './pages/RecruiterStudentProfile';
import RecruiterCalendar from './pages/RecruiterCalendar';
import ObjectionChallenge from "./pages/ObjectionChallenge";
import SalesGamesHub from "./pages/SalesGamesHub";
import SalesWordle from "./pages/SalesWordle";
import NegotiationGame from "./pages/NegotiationGame";
import CareerTools from "./pages/CareerTools";
import Scorecards from "./pages/Scorecards";
import useRedirectUser from "@/hooks/useRedirectUser";

const queryClient = new QueryClient();

const ChallengeRedirect = () => {
  const location = useLocation();
  const id = location.pathname.split('/').pop();
  return <Navigate to={`/student/challenge/${id}`} replace />;
};

const RedirectWrapper = () => {
  useRedirectUser();
  return null;
};

// Determine which routes should show the splash screen
const shouldShowSplashScreen = (pathname: string) => {
  // Marketing/public pages should show splash
  const marketingPages = ['/', '/for-students', '/for-recruiters', '/pricing', '/about'];
  return marketingPages.includes(pathname);
};

const AppRoutes = () => {
  // Use redirect hook here, after AuthProvider is initialized
  useRedirectUser();
  const pathname = window.location.pathname;

  return (
    <>
      {shouldShowSplashScreen(pathname) ? (
        <SplashScreenWrapper>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/for-students" element={<ForStudents />} />
            <Route path="/for-recruiters" element={<ForRecruiters />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<ProtectedRoute requiredRole="student" />}>
              <Route path="/student/dashboard" element={<Dashboard />} />
              <Route path="/student/explore" element={<Explore />} />
              <Route path="/student/roleplays" element={<Roleplays />} />
              <Route path="/student/leaderboard" element={<Leaderboard />} />
              <Route path="/student/profile/:id" element={<StudentProfile />} />
              <Route path="/student/roleplay/new" element={<NewRoleplay />} />
              <Route path="/student/roleplay/elevator-pitch" element={<ElevatorPitch />} />
              <Route path="/student/roleplay/context-setup/:segment" element={<ContextSetup />} />
              <Route path="/student/roleplay/:id" element={<RoleplaySession />} />
              <Route path="/student/roleplay/:id/feedback" element={<RoleplayFeedback />} />
              <Route path="/student/community" element={<Community />} />
              <Route path="/student/resources" element={<Resources />} />
              <Route path="/student/messages" element={<Messages />} />
              <Route path="/student/settings" element={<Settings />} />
              <Route path="/student/challenge/:id" element={<SponsoredChallenge />} />
              <Route path="/student/career-tools" element={<CareerTools />} />
              <Route path="/scorecards" element={<Scorecards />} />

              <Route path="/student/sales-games" element={<SalesGamesHub />} />
              <Route path="/student/sales-games/objection" element={<ObjectionChallenge />} />
              <Route path="/student/sales-games/wordle" element={<SalesWordle />} />
              <Route path="/student/sales-games/negotiation" element={<NegotiationGame />} />
            </Route>

            <Route element={<ProtectedRoute requiredRole="recruiter" />}>
              <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
              <Route path="/recruiter/analytics" element={<RecruiterAnalytics />} />
              <Route path="/recruiter/assessments" element={<RecruiterAssessments />} />
              <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
              <Route path="/recruiter/jobs/new" element={<RecruiterNewJob />} />
              <Route path="/recruiter/jobs/edit/:id" element={<RecruiterEditJob />} />
              <Route path="/recruiter/jobs/:id" element={<RecruiterJobDetails />} />
              <Route path="/recruiter/calendar" element={<RecruiterCalendar />} />
              <Route path="/recruiter/talent-pool" element={<TalentPool />} />
              <Route path="/recruiter/student/:id" element={<RecruiterStudentProfile />} />
              <Route path="/recruiter/challenge/:id" element={<SponsoredChallenge />} />
              <Route path="/recruiter/sponsored-challenges" element={<SponsoredChallenges />} />
              <Route path="/recruiter/messages" element={<Messages />} />
              <Route path="/recruiter/leaderboard" element={<Leaderboard />} />
              <Route path="/recruiter/settings" element={<Settings />} />
            </Route>

            <Route element={<ProtectedRoute requiredRole="any" />}>
              <Route path="/call/:id" element={<CallPage />} />
              <Route path="/call/:id/feedback" element={<CallFeedback />} />

              <Route path="/performance-library" element={<PerformanceLibrary />} />
              <Route path="/performance/:id" element={<PerformanceDetails />} />
            </Route>

            <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="/explore" element={<Navigate to="/student/explore" replace />} />
            <Route path="/roleplay/*" element={<Navigate to="/student/roleplay/new" replace />} />
            <Route path="/talent-pool" element={<Navigate to="/recruiter/talent-pool" replace />} />
            <Route path="/talent-pool/student/:id" element={<Navigate to="/recruiter/student/:id" replace />} />
            <Route path="/messages" element={<Navigate to="/student/messages" replace />} />
            <Route path="/leaderboard" element={<Navigate to="/student/leaderboard" replace />} />
            <Route path="/resources" element={<Navigate to="/student/resources" replace />} />
            <Route path="/settings" element={<Navigate to="/student/settings" replace />} />

            <Route path="/challenge/:id" element={<ChallengeRedirect />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </SplashScreenWrapper>
      ) : (
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/for-students" element={<ForStudents />} />
          <Route path="/for-recruiters" element={<ForRecruiters />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute requiredRole="student" />}>
            <Route path="/student/dashboard" element={<Dashboard />} />
            <Route path="/student/explore" element={<Explore />} />
            <Route path="/student/roleplays" element={<Roleplays />} />
            <Route path="/student/leaderboard" element={<Leaderboard />} />
            <Route path="/student/profile/:id" element={<StudentProfile />} />
            <Route path="/student/roleplay/new" element={<NewRoleplay />} />
            <Route path="/student/roleplay/elevator-pitch" element={<ElevatorPitch />} />
            <Route path="/student/roleplay/context-setup/:segment" element={<ContextSetup />} />
            <Route path="/student/roleplay/:id" element={<RoleplaySession />} />
            <Route path="/student/roleplay/:id/feedback" element={<RoleplayFeedback />} />
            <Route path="/student/community" element={<Community />} />
            <Route path="/student/resources" element={<Resources />} />
            <Route path="/student/messages" element={<Messages />} />
            <Route path="/student/settings" element={<Settings />} />
            <Route path="/student/challenge/:id" element={<SponsoredChallenge />} />
            <Route path="/student/career-tools" element={<CareerTools />} />
            <Route path="/scorecards" element={<Scorecards />} />

            <Route path="/student/sales-games" element={<SalesGamesHub />} />
            <Route path="/student/sales-games/objection" element={<ObjectionChallenge />} />
            <Route path="/student/sales-games/wordle" element={<SalesWordle />} />
            <Route path="/student/sales-games/negotiation" element={<NegotiationGame />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="recruiter" />}>
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter/analytics" element={<RecruiterAnalytics />} />
            <Route path="/recruiter/assessments" element={<RecruiterAssessments />} />
            <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
            <Route path="/recruiter/jobs/new" element={<RecruiterNewJob />} />
            <Route path="/recruiter/jobs/edit/:id" element={<RecruiterEditJob />} />
            <Route path="/recruiter/jobs/:id" element={<RecruiterJobDetails />} />
            <Route path="/recruiter/calendar" element={<RecruiterCalendar />} />
            <Route path="/recruiter/talent-pool" element={<TalentPool />} />
            <Route path="/recruiter/student/:id" element={<RecruiterStudentProfile />} />
            <Route path="/recruiter/challenge/:id" element={<SponsoredChallenge />} />
            <Route path="/recruiter/sponsored-challenges" element={<SponsoredChallenges />} />
            <Route path="/recruiter/messages" element={<Messages />} />
            <Route path="/recruiter/leaderboard" element={<Leaderboard />} />
            <Route path="/recruiter/settings" element={<Settings />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="any" />}>
            <Route path="/call/:id" element={<CallPage />} />
            <Route path="/call/:id/feedback" element={<CallFeedback />} />

            <Route path="/performance-library" element={<PerformanceLibrary />} />
            <Route path="/performance/:id" element={<PerformanceDetails />} />
          </Route>

          <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/explore" element={<Navigate to="/student/explore" replace />} />
          <Route path="/roleplay/*" element={<Navigate to="/student/roleplay/new" replace />} />
          <Route path="/talent-pool" element={<Navigate to="/recruiter/talent-pool" replace />} />
          <Route path="/talent-pool/student/:id" element={<Navigate to="/recruiter/student/:id" replace />} />
          <Route path="/messages" element={<Navigate to="/student/messages" replace />} />
          <Route path="/leaderboard" element={<Navigate to="/student/leaderboard" replace />} />
          <Route path="/resources" element={<Navigate to="/student/resources" replace />} />
          <Route path="/settings" element={<Navigate to="/student/settings" replace />} />

          <Route path="/challenge/:id" element={<ChallengeRedirect />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
};

const App = () => {
  useEffect(() => {
    const setupStorage = async () => {
      await initializeStorageBuckets();
    };

    setupStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;