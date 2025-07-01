
export interface RoleplayScenario {
  title: string;
  company_description: string;
  buyer_profile: string;
  scenario_background: string;
  key_objectives: string[];
  common_objections: string[];
  talking_points: string[];
  evaluation_criteria: string[];
  difficulty: string;
}

export interface RoleplayRubric {
  criteria: string[];
  scoring_guide: {
    excellent: string;
    good: string;
    average: string;
    poor: string;
  };
  additional_notes?: string;
}

export interface Message {
  role: 'user' | 'buyer';
  content: string;
  timestamp: Date;
}

export interface RoleplaySession {
  id: string;
  student_id: string;
  recruiter_id?: string;
  scenario_title: string;
  scenario_data?: RoleplayScenario;
  rubric_data?: RoleplayRubric;
  industry: string;
  difficulty: string;
  status: 'pending' | 'in_progress' | 'ready' | 'completed';
  duration: number;
  created_at: string;
  updated_at: string;
  transcript: Message[];
  segment?: string;
}

export interface AIFeedback {
  id?: string;
  roleplay_session_id: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvement_tips: string[];
  created_at?: string;
  updated_at?: string;
}
