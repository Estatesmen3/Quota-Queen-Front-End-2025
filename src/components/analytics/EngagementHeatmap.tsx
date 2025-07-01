
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCandidateEngagement, CandidateEngagementData } from '@/hooks/useCandidateEngagement';
import { addDays, format, startOfWeek, subDays } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

interface EngagementHeatmapProps {
  candidateId?: string;
  days?: number;
}

export function EngagementHeatmap({ candidateId, days = 30 }: EngagementHeatmapProps) {
  const endDate = new Date();
  const startDate = subDays(endDate, days);
  
  const { engagementData, isLoading } = useCandidateEngagement({
    candidateId,
    dateRange: { from: startDate, to: endDate }
  });
  
  const heatmapData = useMemo(() => {
    if (!engagementData) return [];
    
    // Create date map for quick lookup
    const dateMap = new Map<string, CandidateEngagementData>();
    engagementData.forEach(data => {
      dateMap.set(data.activity_date, data);
    });
    
    // Generate data for each day in the range
    const result = [];
    let currentDate = startDate;
    
    while (currentDate <= endDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const data = dateMap.get(dateStr);
      
      result.push({
        date: currentDate,
        dateStr,
        dayOfWeek: format(currentDate, 'E'),
        value: data 
          ? data.roleplay_count + data.message_count + data.profile_views + data.job_applications
          : 0,
        level: data?.engagement_level || 'low',
        details: data
      });
      
      currentDate = addDays(currentDate, 1);
    }
    
    return result;
  }, [engagementData, startDate, endDate]);
  
  // Group by week for display
  const weeklyData = useMemo(() => {
    if (heatmapData.length === 0) return [];
    
    const weeks = [];
    let currentWeek = [];
    let currentWeekStart = null;
    
    heatmapData.forEach(day => {
      const weekStart = startOfWeek(day.date);
      
      if (!currentWeekStart || weekStart.getTime() !== currentWeekStart.getTime()) {
        if (currentWeek.length > 0) {
          weeks.push(currentWeek);
        }
        currentWeek = [];
        currentWeekStart = weekStart;
      }
      
      currentWeek.push(day);
    });
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [heatmapData]);
  
  const getLevelColor = (level: string, value: number) => {
    if (value === 0) return 'bg-gray-100';
    
    switch (level) {
      case 'high':
        return 'bg-green-500';
      case 'medium':
        return 'bg-green-300';
      case 'low':
      default:
        return 'bg-green-100';
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Activity</CardTitle>
          <CardDescription>
            Activity heatmap for the past {days} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Activity</CardTitle>
        <CardDescription>
          Activity heatmap for the past {days} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        {weeklyData.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No engagement data available
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
                <span className="text-xs text-muted-foreground">None</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-green-100"></div>
                <span className="text-xs text-muted-foreground">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-green-300"></div>
                <span className="text-xs text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                <span className="text-xs text-muted-foreground">High</span>
              </div>
            </div>
            
            <div className="grid gap-1">
              <div className="grid grid-cols-7 gap-1 text-center">
                <div className="text-xs text-muted-foreground">Sun</div>
                <div className="text-xs text-muted-foreground">Mon</div>
                <div className="text-xs text-muted-foreground">Tue</div>
                <div className="text-xs text-muted-foreground">Wed</div>
                <div className="text-xs text-muted-foreground">Thu</div>
                <div className="text-xs text-muted-foreground">Fri</div>
                <div className="text-xs text-muted-foreground">Sat</div>
              </div>
              
              {weeklyData.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                  {week.map((day, dayIndex) => (
                    <div 
                      key={dayIndex}
                      className={`
                        aspect-square rounded-sm flex items-center justify-center text-xs
                        ${getLevelColor(day.level, day.value)}
                        ${day.value > 0 ? 'text-white' : 'text-gray-700'}
                        hover:ring-2 hover:ring-dopamine-purple transition-all cursor-pointer
                      `}
                      title={`${format(day.date, 'MMM dd')}: ${day.value} activities`}
                    >
                      {format(day.date, 'd')}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-md border p-2 text-center">
                <div className="text-lg font-bold">
                  {heatmapData.reduce((sum, day) => sum + (day.details?.roleplay_count || 0), 0)}
                </div>
                <div className="text-xs text-muted-foreground">Roleplays</div>
              </div>
              <div className="rounded-md border p-2 text-center">
                <div className="text-lg font-bold">
                  {heatmapData.reduce((sum, day) => sum + (day.details?.message_count || 0), 0)}
                </div>
                <div className="text-xs text-muted-foreground">Messages</div>
              </div>
              <div className="rounded-md border p-2 text-center">
                <div className="text-lg font-bold">
                  {heatmapData.reduce((sum, day) => sum + (day.details?.job_applications || 0), 0)}
                </div>
                <div className="text-xs text-muted-foreground">Applications</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
