
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface ResourceContent {
  id?: string;
  url: string;
  content: any;
  created_at?: string;
  updated_at?: string;
}

export const useResourceContent = (url?: string) => {
  const queryClient = useQueryClient();
  
  const fetchResourceContent = async (url: string): Promise<ResourceContent | null> => {
    if (!url) return null;
    
    const { data, error } = await supabase
      .from('resource_content')
      .select('*')
      .eq('url', url)
      .single();
      
    if (error) {
      if (error.code !== 'PGRST116') { // PGRST116 is the code for "no rows returned"
        console.error("Error fetching resource content:", error);
      }
      return null;
    }
    
    return data as ResourceContent;
  };
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['resourceContent', url],
    queryFn: () => fetchResourceContent(url || ''),
    enabled: !!url,
  });
  
  const storeResourceContent = useMutation({
    mutationFn: async (newContent: ResourceContent) => {
      const { data, error } = await supabase
        .from('resource_content')
        .upsert(newContent)
        .select()
        .single();
        
      if (error) {
        console.error("Error storing resource content:", error);
        throw error;
      }
      
      return data as ResourceContent;
    },
    onSuccess: () => {
      // Invalidate the cache for this URL
      if (url) {
        queryClient.invalidateQueries({ queryKey: ['resourceContent', url] });
      }
    },
  });
  
  return {
    content: data,
    isLoading,
    error,
    storeContent: storeResourceContent.mutate,
    isStoring: storeResourceContent.isPending
  };
};
