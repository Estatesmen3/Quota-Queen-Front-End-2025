
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const UserProfileSection = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="p-4 border-t border-dopamine-purple/10 bg-gradient-to-br from-white to-secondary/50">
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="border-2 border-dopamine-purple/20 hover:border-dopamine-purple/50 transition-colors">
          <AvatarImage src={profile?.avatar_url || ""} />
          <AvatarFallback className="bg-gradient-to-br from-dopamine-purple to-dopamine-pink text-white">
            {profile?.first_name?.[0]}{profile?.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">
            {profile?.first_name} {profile?.last_name}
          </p>
          <p className="text-xs text-muted-foreground truncate max-w-[160px]">
            {user?.email}
          </p>
        </div>
      </div>
      <Button 
        variant="outline" 
        className="w-full justify-start hover:bg-dopamine-purple/5 hover:border-dopamine-purple/20 transition-all border-dopamine-purple/10" 
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};
