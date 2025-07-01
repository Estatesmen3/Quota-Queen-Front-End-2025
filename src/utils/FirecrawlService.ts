
import { supabase } from "@/lib/supabase";

interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
  summary?: string;
  title?: string;
  description?: string;
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';

  static async getApiKey(): Promise<string | null> {
    try {
      const { data } = await supabase.functions.invoke('get-firecrawl-key', {
        method: 'GET',
      });
      
      return data?.apiKey || null;
    } catch (error) {
      console.error('Error getting Firecrawl API key:', error);
      return null;
    }
  }

  static async crawlWebsite(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      console.log('Making crawl request to Firecrawl API via Edge Function');
      
      const { data, error } = await supabase.functions.invoke('crawl-website', {
        method: 'POST',
        body: { url }
      });

      if (error) {
        console.error('Error calling crawl-website function:', error);
        return { 
          success: false, 
          error: error.message || 'Failed to call the crawl function' 
        };
      }

      if (!data.success) {
        console.error('Crawl failed:', data.error);
        return { 
          success: false, 
          error: data.error || 'Failed to crawl website' 
        };
      }

      console.log('Crawl successful:', data);
      return { 
        success: true,
        data: data 
      };
    } catch (error) {
      console.error('Error during crawl:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Firecrawl API' 
      };
    }
  }
}
