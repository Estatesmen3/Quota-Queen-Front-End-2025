export interface Conversation {
  id: string;
  with_user_id: string;
  with_user_name: string;
  with_user_avatar?: string;
  with_user_type: "student" | "recruiter";
  last_message: string;
  last_message_time: string;
  unread_count: number;
  has_attachment?: boolean;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  is_edited?: boolean;
  file_url?: string;
  file_name?: string;
  has_attachment?: boolean;
}

export interface VideoCallState {
  isInCall: boolean;
  callId: string | null;
  callPartner: Conversation | null;
  initiatingCall: boolean;
  error?: string;
  isAudioMuted: boolean;
  isVideoOff: boolean;
}

export interface RubricFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  lastModified?: number;
  webkitRelativePath?: string;
}

export interface ScenarioFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  lastModified?: number;
  webkitRelativePath?: string;
}

export interface TranscriptMessage {
  role: string;
  content: string;
  timestamp: string;
}

export interface PersonalityModel {
  id: string;
  name: string;
  description: string;
  traits: string[];
  icon?: React.ReactNode;
  color?: string;
  useCases: string[];
}

export interface AssessmentTemplate {
  id: string;
  name: string;
  description: string;
  model: string;
  questions: number;
  timeToComplete: string;
  usedBy: number;
}

export interface PersonalityAssessment {
  id: string;
  recruiter_id: string;
  title: string;
  description: string;
  model_type: string;
  target_role?: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  completion_time?: string;
  traits?: string[];
}

export interface AssessmentQuestion {
  id: string;
  assessment_id: string;
  question_text: string;
  question_type: "likert" | "multiple_choice" | "text";
  options?: string[];
  trait?: string;
  question_order: number;
  created_at: string;
}

export interface AssessmentResponse {
  id: string;
  assessment_id: string;
  candidate_id: string;
  started_at: string;
  completed_at?: string;
  score?: number;
  results?: Record<string, any>;
  created_at: string;
}

export interface ApiError {
  code?: string;
  message: string;
  details?: string;
}

export interface SalesGame {
  id: string;
  game_type: "objection" | "wordle" | "negotiation";
  score: number;
  streak: number;
  created_at: string;
  updated_at: string;
}

export interface DailyChallenge {
  id: string;
  challenge_type: "objection" | "wordle" | "negotiation";
  challenge_data: {
    prompt: string;
    options?: string[];
    correct_answer?: string;
  };
  date_active: string;
  is_active: boolean;
  created_at: string;
}
