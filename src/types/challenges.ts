
export interface SponsoredChallenge {
  id: string;
  company_name: string;
  company_description: string;
  product_name: string;
  scenario_title: string;
  scenario_description: string;
  prospect_background: string;
  research_notes: string;
  company_info: Record<string, any>;
  prospect_info: Record<string, any>;
  call_info: string;
  difficulty: string;
  industry: string;
  prize_description: string;
  prize_amount: number;
}
