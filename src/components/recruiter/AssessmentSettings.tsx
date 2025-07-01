
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AssessmentSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Settings</CardTitle>
        <CardDescription>Configure global assessment settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="feedback">Automatic Feedback</Label>
            <Select defaultValue="enabled">
              <SelectTrigger id="feedback">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">Enabled</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">Enable or disable automatic AI-generated feedback for candidates</p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="visibility">Default Visibility</Label>
            <Select defaultValue="private">
              <SelectTrigger id="visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="team">Visible to Team</SelectItem>
                <SelectItem value="company">Visible to Company</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">Control who can view assessment results by default</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default AssessmentSettings;
