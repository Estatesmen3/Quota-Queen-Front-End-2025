
export interface LineItem {
  id: string;
  text: string;
  score?: number;
}

export interface ScorecardCategory {
  id: string;
  name: string;
  weight: number;
  lineItems: LineItem[];
}

export interface Scorecard {
  id: string;
  title: string;
  roleplaySessionId: string;
  categories: ScorecardCategory[];
  totalScore?: number;
  createdAt: Date;
}
