
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalesIndustryReports, SalesIndustryReport } from '@/hooks/useSalesIndustryReports';
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Lightbulb, BarChart2, PieChart as PieChartIcon } from 'lucide-react';

interface SalesIndustryReportCardProps {
  industry?: string;
  region?: string;
}

export function SalesIndustryReportCard({ industry, region }: SalesIndustryReportCardProps) {
  const { reports, isLoading } = useSalesIndustryReports({ industry, region });
  const report = reports?.[0];
  
  const roleGrowthData = report?.demand_trends?.roleGrowthRate
    ? Object.entries(report.demand_trends.roleGrowthRate).map(([name, value]) => ({
        name,
        value: Number(value)
      }))
    : [];
    
  roleGrowthData.sort((a, b) => b.value - a.value);
  
  const colors = ['#7C3AED', '#EC4899', '#4338CA', '#3B82F6', '#10B981'];
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Industry Insights</CardTitle>
          <CardDescription>
            Talent trends for {industry || 'all industries'} in {region || 'all regions'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Industry Insights</CardTitle>
          <CardDescription>
            No data available for {industry || 'all industries'} in {region || 'all regions'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            No industry reports found for the selected criteria
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Sales Industry Insights</CardTitle>
        <CardDescription>
          Talent trends for {report.industry} in {report.region}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Average performance score */}
          <div className="text-center py-4 bg-dopamine-purple/5 rounded-lg">
            <div className="text-3xl font-bold bg-gradient-to-r from-dopamine-purple to-dopamine-pink bg-clip-text text-transparent">
              {report.avg_performance_score}%
            </div>
            <div className="text-sm text-muted-foreground">
              Average Performance Score
            </div>
          </div>
          
          {/* Growing and declining roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <h3 className="text-sm font-medium">Growing Roles</h3>
              </div>
              <div className="space-y-1">
                {report.demand_trends?.increasingRoles?.map((role, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span>{role}</span>
                    <Badge className="bg-green-500">{Math.round(roleGrowthData.find(d => d.name === role)?.value || 15)}%</Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-1 mb-2">
                <TrendingDown className="h-4 w-4 text-orange-500" />
                <h3 className="text-sm font-medium">Declining Roles</h3>
              </div>
              <div className="space-y-1">
                {report.demand_trends?.decreasingRoles?.map((role, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span>{role}</span>
                    <Badge variant="outline" className="text-orange-500 border-orange-500">↓</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1 mb-2">
                <BarChart2 className="h-4 w-4 text-dopamine-purple" />
                <h3 className="text-sm font-medium">Role Growth Rates</h3>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={roleGrowthData.slice(0, 5)}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 'dataMax']} />
                    <YAxis type="category" dataKey="name" width={70} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Growth Rate']} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {roleGrowthData.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Skills insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Lightbulb className="h-4 w-4 text-dopamine-purple" />
                <h3 className="text-sm font-medium">Top Skills in Demand</h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {report.top_skills?.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-dopamine-purple/10 text-dopamine-purple">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Lightbulb className="h-4 w-4 text-dopamine-pink" />
                <h3 className="text-sm font-medium">Skill Gaps</h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {report.skill_gaps?.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-dopamine-pink/10 text-dopamine-pink">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {/* Emerging skills */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-medium">Emerging Skills</h3>
            </div>
            <div className="flex flex-wrap gap-1">
              {report.demand_trends?.emergingSkills?.map((skill, idx) => (
                <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-500 border-blue-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
