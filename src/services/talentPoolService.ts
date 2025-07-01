
import { supabase } from "@/integrations/supabase/client";

export interface TalentPool {
  id: string;
  recruiter_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface TalentPoolMember {
  id: string;
  talent_pool_id: string;
  student_id: string;
  added_at: string;
  notes: string | null;
  student?: {
    first_name: string;
    last_name: string;
    university: string;
    skills: string[];
    avatar_url: string | null;
  };
}

export async function getTalentPools() {
  try {
    const { data, error } = await (supabase
      .from('talent_pools') as any)
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return {
      success: true,
      pools: data
    };
  } catch (error: any) {
    console.error('Get talent pools error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get talent pools'
    };
  }
}

export async function createTalentPool(name: string, description?: string) {
  try {
    const user = supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await (supabase
      .from('talent_pools') as any)
      .insert({
        name,
        description,
        recruiter_id: (await user).data.user?.id
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      success: true,
      pool: data
    };
  } catch (error: any) {
    console.error('Create talent pool error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create talent pool'
    };
  }
}

export async function getTalentPoolMembers(poolId: string) {
  try {
    const { data, error } = await (supabase
      .from('talent_pool_members') as any)
      .select(`
        *,
        student:student_id (
          first_name,
          last_name,
          university,
          skills,
          avatar_url
        )
      `)
      .eq('talent_pool_id', poolId);
      
    if (error) throw error;
    
    return {
      success: true,
      members: data
    };
  } catch (error: any) {
    console.error('Get talent pool members error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get talent pool members'
    };
  }
}

export async function addStudentToTalentPool(poolId: string, studentId: string, notes?: string) {
  try {
    const { data, error } = await (supabase
      .from('talent_pool_members') as any)
      .insert({
        talent_pool_id: poolId,
        student_id: studentId,
        notes
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      success: true,
      member: data
    };
  } catch (error: any) {
    console.error('Add student to talent pool error:', error);
    return {
      success: false,
      error: error.message || 'Failed to add student to talent pool'
    };
  }
}

export async function removeStudentFromTalentPool(memberId: string) {
  try {
    const { error } = await (supabase
      .from('talent_pool_members') as any)
      .delete()
      .eq('id', memberId);
      
    if (error) throw error;
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Remove student from talent pool error:', error);
    return {
      success: false,
      error: error.message || 'Failed to remove student from talent pool'
    };
  }
}

export async function getTopWeeklyCandidates() {
  try {
    const currentDate = new Date();
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);
    
    // Try to get candidates from the top_weekly_candidates table first
    const { data: topCandidates, error: topError } = await (supabase
      .from('top_weekly_candidates') as any)
      .select(`
        *,
        student:student_id (
          id,
          first_name,
          last_name,
          university,
          skills,
          avatar_url,
          major,
          confidence_score,
          persuasion_score,
          objection_score
        )
      `)
      .eq('week_start_date', currentWeekStart.toISOString().split('T')[0])
      .order('ranking');
      
    if (topError) throw topError;
    
    if (topCandidates && topCandidates.length > 0) {
      return {
        success: true,
        candidates: topCandidates.map((c: any) => ({
          id: c.student?.id,
          first_name: c.student?.first_name,
          last_name: c.student?.last_name,
          university: c.student?.university,
          skills: c.student?.skills,
          avatar_url: c.student?.avatar_url,
          major: c.student?.major,
          confidence_score: c.student?.confidence_score,
          persuasion_score: c.student?.persuasion_score,
          objection_score: c.student?.objection_score,
          score: c.score,
          reason: c.reason
        }))
      };
    }
    
    // Fallback: get top candidates from leaderboard entries
    const { data: leaderboardCandidates, error: leaderboardError } = await supabase
      .from('leaderboard_entries')
      .select(`
        score,
        user_id,
        profiles!inner (
          id,
          first_name,
          last_name,
          university,
          skills,
          avatar_url,
          major,
          confidence_score,
          persuasion_score,
          objection_score
        )
      `)
      .eq('profiles.user_type', 'student')
      .order('score', { ascending: false })
      .limit(5);
      
    if (leaderboardError) throw leaderboardError;
    
    const candidates = leaderboardCandidates ? leaderboardCandidates.map((c: any) => {
      const profile = c.profiles as any;
      return {
        id: profile?.id,
        first_name: profile?.first_name,
        last_name: profile?.last_name,
        university: profile?.university,
        skills: profile?.skills,
        avatar_url: profile?.avatar_url,
        major: profile?.major,
        confidence_score: profile?.confidence_score,
        persuasion_score: profile?.persuasion_score,
        objection_score: profile?.objection_score,
        score: c.score,
        reason: 'High leaderboard ranking'
      };
    }) : [];
    
    return {
      success: true,
      candidates
    };
  } catch (error: any) {
    console.error('Get top weekly candidates error:', error);
    return {
      success: false,
      error: error.message || 'Failed to get top weekly candidates',
      candidates: []
    };
  }
}
