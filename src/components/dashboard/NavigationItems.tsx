import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ActivitySquare,
  Book,
  Briefcase,
  Calendar,
  FileText,
  Gamepad2,
  MessageCircle,
  PieChart,
  Settings,
  TrendingUp,
  Trophy,
  UserCircle,
  Users,
  ClipboardList,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

export const getRecruiterNavItems = (): NavItem[] => [
  {
    label: "Dashboard",
    href: "/recruiter/dashboard",
    icon: <ActivitySquare className="h-5 w-5" />,
  },
  {
    label: "Talent Pool",
    href: "/recruiter/talent-pool",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Jobs",
    href: "/recruiter/jobs",
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    label: "Calendar",
    href: "/recruiter/calendar",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    label: "Messages",
    href: "/recruiter/messages",
    icon: <MessageCircle className="h-5 w-5" />,
  },
  {
    label: "Analytics",
    href: "/recruiter/analytics",
    icon: <PieChart className="h-5 w-5" />,
  },
  {
    label: "Assessments",
    href: "/recruiter/assessments",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: "Leaderboard",
    href: "/recruiter/leaderboard",
    icon: <Trophy className="h-5 w-5" />,
  },
  {
    label: "Sponsored Challenges",
    href: "/recruiter/sponsored-challenges",
    icon: <TrendingUp className="h-5 w-5" />,
  },
];

export const getStudentNavItems = (): NavItem[] => {
  const navItems = [
    {
      label: "Dashboard",
      href: "/student/dashboard",
      icon: <ActivitySquare className="h-5 w-5" />,
    },
    {
      label: "Practice",
      href: "/student/roleplay/new",
      icon: <UserCircle className="h-5 w-5" />,
    },
    {
      label: "Scorecards",
      href: "/scorecards",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      label: "Competitions",
      href: "/student/explore",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      label: "Messages",
      href: "/student/messages",
      icon: <MessageCircle className="h-5 w-5" />,
    },
    {
      label: "Leaderboard",
      href: "/student/leaderboard",
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      label: "Community",
      href: "/student/community",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Sales Games",
      href: "/student/sales-games",
      icon: <Gamepad2 className="h-5 w-5" />,
    },
    {
      label: "Resources",
      href: "/student/resources",
      icon: <Book className="h-5 w-5" />,
    },
    {
      label: "Career Tools",
      href: "/student/career-tools",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "/student/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return navItems;
};
