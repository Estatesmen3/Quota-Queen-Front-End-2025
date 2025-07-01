
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getTalentPools, 
  createTalentPool, 
  getTalentPoolMembers,
  addStudentToTalentPool,
  removeStudentFromTalentPool,
  getTopWeeklyCandidates,
  TalentPool,
  TalentPoolMember
} from '@/services/talentPoolService';
import { useToast } from '@/hooks/use-toast';

export function useTalentPools() {
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { 
    data: poolsData, 
    isLoading: isLoadingPools,
    error: poolsError
  } = useQuery({
    queryKey: ['talentPools'],
    queryFn: getTalentPools
  });
  
  const {
    data: membersData,
    isLoading: isLoadingMembers,
    error: membersError
  } = useQuery({
    queryKey: ['talentPoolMembers', selectedPoolId],
    queryFn: () => getTalentPoolMembers(selectedPoolId!),
    enabled: !!selectedPoolId
  });
  
  const {
    data: topCandidatesData,
    isLoading: isLoadingTopCandidates,
    error: topCandidatesError
  } = useQuery({
    queryKey: ['topWeeklyCandidates'],
    queryFn: getTopWeeklyCandidates
  });
  
  const createPoolMutation = useMutation({
    mutationFn: ({ name, description }: { name: string; description?: string }) => 
      createTalentPool(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talentPools'] });
      toast({
        title: "Talent pool created",
        description: "Your new talent pool has been created successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating talent pool",
        description: error.message || "Failed to create talent pool",
        variant: "destructive"
      });
    }
  });
  
  const addMemberMutation = useMutation({
    mutationFn: ({ 
      poolId, 
      studentId, 
      notes 
    }: { 
      poolId: string; 
      studentId: string; 
      notes?: string 
    }) => addStudentToTalentPool(poolId, studentId, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['talentPoolMembers', variables.poolId] });
      toast({
        title: "Student added",
        description: "Student has been added to the talent pool."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding student",
        description: error.message || "Failed to add student to talent pool",
        variant: "destructive"
      });
    }
  });
  
  const removeMemberMutation = useMutation({
    mutationFn: ({ memberId, poolId }: { memberId: string; poolId: string }) => 
      removeStudentFromTalentPool(memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['talentPoolMembers', variables.poolId] });
      toast({
        title: "Student removed",
        description: "Student has been removed from the talent pool."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error removing student",
        description: error.message || "Failed to remove student from talent pool",
        variant: "destructive"
      });
    }
  });
  
  return {
    talentPools: poolsData?.success ? poolsData.pools as TalentPool[] : [],
    talentPoolMembers: membersData?.success ? membersData.members as TalentPoolMember[] : [],
    topCandidates: topCandidatesData?.success ? topCandidatesData.candidates : [],
    selectedPoolId,
    setSelectedPoolId,
    isLoadingPools,
    isLoadingMembers,
    isLoadingTopCandidates,
    isCreatingPool: createPoolMutation.isPending,
    isAddingMember: addMemberMutation.isPending,
    isRemovingMember: removeMemberMutation.isPending,
    poolsError,
    membersError,
    topCandidatesError,
    createTalentPool: createPoolMutation.mutate,
    addStudentToPool: addMemberMutation.mutate,
    removeStudentFromPool: removeMemberMutation.mutate
  };
}
