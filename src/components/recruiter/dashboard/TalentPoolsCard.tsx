
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, BookmarkPlus, Edit, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTalentPools } from "@/hooks/useTalentPools";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SkeletonCard } from "@/components/ui/skeleton";

const TalentPoolsCard = () => {
  const {
    talentPools,
    isLoadingPools,
    isCreatingPool,
    createTalentPool
  } = useTalentPools();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPoolName, setNewPoolName] = useState("");
  const [newPoolDescription, setNewPoolDescription] = useState("");

  const handleCreatePool = () => {
    if (!newPoolName.trim()) return;
    
    createTalentPool({ 
      name: newPoolName, 
      description: newPoolDescription 
    }, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewPoolName("");
        setNewPoolDescription("");
      }
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary/80" />
              Talent Pools
            </CardTitle>
            <CardDescription>
              Organize candidates into custom groups
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">New Pool</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Talent Pool</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="pool-name">Pool Name</Label>
                  <Input
                    id="pool-name"
                    placeholder="e.g., Top Enterprise Sellers"
                    value={newPoolName}
                    onChange={(e) => setNewPoolName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pool-description">Description (Optional)</Label>
                  <Textarea
                    id="pool-description"
                    placeholder="What makes this group unique?"
                    rows={3}
                    value={newPoolDescription}
                    onChange={(e) => setNewPoolDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreatePool}
                  disabled={!newPoolName.trim() || isCreatingPool}
                >
                  {isCreatingPool ? "Creating..." : "Create Pool"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingPools ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} className="h-10" />
            ))}
          </div>
        ) : talentPools.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-6 text-muted-foreground">
            <Users className="h-12 w-12 mb-4 text-muted-foreground/60" />
            <h3 className="text-lg font-medium mb-1">No talent pools yet</h3>
            <p className="text-sm mb-4">
              Create talent pools to organize and track your top candidates
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Create Your First Pool
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-60">
            <div className="space-y-2">
              {talentPools.map((pool) => (
                <div 
                  key={pool.id}
                  className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                        {pool.name}
                      </h4>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>
                            {pool.description || "No description available"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-[10px] px-1 py-0">
                        0 candidates
                      </Badge>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <BookmarkPlus className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        <Separator className="my-4" />
        <div className="flex justify-center">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" asChild>
            <a href="/recruiter/talent-pool-management">
              Manage All Talent Pools
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TalentPoolsCard;
