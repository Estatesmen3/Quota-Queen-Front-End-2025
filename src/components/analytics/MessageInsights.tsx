
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { useMessageEngagementAnalytics } from "@/hooks/useMessageEngagementAnalytics";
import { MessageSquare, Clock, BarChart2, Calendar, CheckCircle, MessageSquareHeart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function MessageInsights() {
  const { analytics, isLoading } = useMessageEngagementAnalytics();
  
  const responseRateData = [
    { name: 'Mon', rate: analytics?.optimal_timing?.days_of_week?.monday || 0 },
    { name: 'Tue', rate: analytics?.optimal_timing?.days_of_week?.tuesday || 0 },
    { name: 'Wed', rate: analytics?.optimal_timing?.days_of_week?.wednesday || 0 },
    { name: 'Thu', rate: analytics?.optimal_timing?.days_of_week?.thursday || 0 },
    { name: 'Fri', rate: analytics?.optimal_timing?.days_of_week?.friday || 0 },
    { name: 'Sat', rate: analytics?.optimal_timing?.days_of_week?.saturday || 0 },
    { name: 'Sun', rate: analytics?.optimal_timing?.days_of_week?.sunday || 0 }
  ];
  
  const timeResponseData = Object.entries(analytics?.optimal_timing?.time_of_day || {}).map(([name, rate]) => ({
    name,
    rate
  }));
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Message Engagement Insights</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Message Engagement Insights</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No message engagement data available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-dopamine-purple" />
            Message Engagement Insights
          </CardTitle>
          <CardDescription>
            Optimize your messaging strategy with data-driven insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-dopamine-purple/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-dopamine-purple">
                {(analytics.response_rate * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Average Response Rate
              </div>
            </div>
            <div className="bg-blue-100 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {analytics.avg_response_time_hours.toFixed(1)} hrs
              </div>
              <div className="text-sm text-muted-foreground">
                Average Response Time
              </div>
            </div>
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {analytics.total_messages_sent}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Messages Sent
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-dopamine-blue" />
                Optimal Messaging Days
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={responseRateData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                    <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(0)}%`, 'Response Rate']} />
                    <Bar dataKey="rate" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-dopamine-pink" />
                Optimal Time of Day
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeResponseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                    <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(0)}%`, 'Response Rate']} />
                    <Line type="monotone" dataKey="rate" stroke="#ff4d8b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <MessageSquareHeart className="h-5 w-5 mr-2 text-dopamine-green" />
                Best Performing Templates
              </h3>
              <div className="space-y-4">
                {analytics.best_templates.map((template, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium flex items-center gap-2">
                        {template.name}
                        <Badge className="bg-green-500">
                          {(template.response_rate * 100).toFixed(0)}% Response
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground border-l-4 border-dopamine-blue/40 pl-3 italic">
                      "{template.sample}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
