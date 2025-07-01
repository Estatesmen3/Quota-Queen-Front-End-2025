
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  source_url: string | null;
  file_url: string | null;
  difficulty_level: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  is_featured: boolean;
  view_count: number;
  estimated_duration: string | null;
};

export const useResources = ({ 
  category, 
  format, 
  searchTerm,
  featured 
}: { 
  category?: string; 
  format?: string; 
  searchTerm?: string;
  featured?: boolean;
}) => {
  return useQuery({
    queryKey: ['resources', { category, format, searchTerm, featured }],
    queryFn: async () => {
      let query = supabase
        .from('sales_resources')
        .select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (format) {
        query = query.eq('format', format);
      }
      
      if (featured !== undefined) {
        query = query.eq('is_featured', featured);
      }
      
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching resources:", error);
        throw new Error('Failed to fetch resources');
      }
      
      console.log("Fetched resources:", data?.length || 0);
      return data as Resource[];
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useResourceCategories = () => {
  return useQuery({
    queryKey: ['resourceCategories'],
    queryFn: async () => {
      // Get unique categories with counts
      const { data, error } = await supabase
        .from('sales_resources')
        .select('category')
        .order('category');
      
      if (error) {
        console.error("Error fetching resource categories:", error);
        throw new Error('Failed to fetch resource categories');
      }
      
      // Process categories to get counts
      const categories = data.reduce((acc, item) => {
        const category = item.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category]++;
        return acc;
      }, {} as Record<string, number>);
      
      return Object.entries(categories).map(([category, resource_count]) => ({
        category,
        resource_count
      }));
    },
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFeaturedResource = () => {
  return useQuery({
    queryKey: ['featuredResource'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_resources')
        .select('*')
        .eq('is_featured', true)
        .order('view_count', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        console.error("Error fetching featured resource:", error);
        return null;
      }
      
      return data as Resource;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useResourceById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('sales_resources')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching resource:", error);
        return null;
      }
      
      return data as Resource;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateResourceViewCount = () => {
  return async (id: string) => {
    try {
      console.log("Incrementing view count for resource:", id);
      const { error } = await supabase.rpc('increment_resource_view', { resource_id: id });
      if (error) {
        console.error("Error updating view count:", error);
        throw error;
      }
      console.log("View count updated successfully");
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };
};
