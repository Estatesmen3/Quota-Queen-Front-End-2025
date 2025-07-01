
export interface Call {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  scheduled_at: string | null;
  created_by: string;
  call_type: string;
  call_participants?: any[];
}

export interface CreateCallData {
  title: string;
  description?: string;
  scheduled_at?: string;
  call_type: string;
  participants?: string[];
}
