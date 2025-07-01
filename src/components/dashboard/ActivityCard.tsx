
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Video } from "lucide-react";
import { Link } from "react-router-dom";

interface Activity {
  id: string;
  type: "roleplay" | "video";
  title: string;
  completedTime: string;
  score: number;
}

interface ActivityCardProps {
  activities: Activity[];
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activities }) => {
  return (
    <Card className="md:col-span-2 lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Your latest roleplay sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center p-3 bg-muted rounded-lg">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                {activity.type === "roleplay" ? (
                  <PlayCircle className="h-5 w-5 text-primary" />
                ) : (
                  <Video className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">Completed {activity.completedTime}</p>
              </div>
              <div className="shrink-0 flex items-center">
                <span className={`${activity.score >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                  {activity.score}%
                </span>
                <Button variant="ghost" size="sm" asChild className="ml-2">
                  <Link to={`/roleplay/${activity.id}/feedback`}>View</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
