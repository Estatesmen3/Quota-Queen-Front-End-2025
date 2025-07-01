
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { 
  Button
} from "@/components/ui/button"; 
import { 
  Input
} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { format } from "date-fns";
import { 
  Video, 
  Upload, 
  Filter, 
  Search, 
  Clock, 
  Tag, 
  FolderOpen,
  Plus,
  AlertCircle,
} from "lucide-react";
import UploadVideoDialog from "@/components/dashboard/UploadVideoDialog";

interface PerformanceEntry {
  id: string;
  title: string;
  description: string | null;
  source: 'upload' | 'roleplay' | 'challenge';
  created_at: string;
  video_url: string | null;
}

const PerformanceLibrary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<PerformanceEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<PerformanceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  useEffect(() => {
    fetchLibrary();
  }, [user]);

  useEffect(() => {
    filterEntries();
  }, [entries, searchTerm, sourceFilter]);

  const fetchLibrary = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('performance_library')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setEntries(data || []);
      setFilteredEntries(data || []);
    } catch (error) {
      console.error('Error fetching performance library:', error);
      toast({
        title: "Failed to load performance library",
        description: "There was an error loading your recordings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = [...entries];
    
    // Apply source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter(entry => entry.source === sourceFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(term) || 
        (entry.description && entry.description.toLowerCase().includes(term))
      );
    }
    
    setFilteredEntries(filtered);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'upload':
        return <Upload className="h-4 w-4 text-blue-500" />;
      case 'roleplay':
        return <Video className="h-4 w-4 text-purple-500" />;
      case 'challenge':
        return <span className="text-xs font-medium text-amber-500">Challenge</span>;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'upload':
        return "Uploaded";
      case 'roleplay':
        return "Roleplay";
      case 'challenge':
        return "Challenge";
      default:
        return source;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Performance Library</h1>
            <p className="text-muted-foreground">
              Build your collection of sales performance recordings
            </p>
          </div>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Upload Recording
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <Video className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium">{entries.length}</p>
              <p className="text-sm text-muted-foreground">Total Recordings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <Upload className="h-8 w-8 text-blue-500 mb-2" />
              <p className="font-medium">
                {entries.filter(e => e.source === 'upload').length}
              </p>
              <p className="text-sm text-muted-foreground">Uploaded Videos</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <Video className="h-8 w-8 text-purple-500 mb-2" />
              <p className="font-medium">
                {entries.filter(e => e.source === 'roleplay').length}
              </p>
              <p className="text-sm text-muted-foreground">Roleplay Recordings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <Tag className="h-8 w-8 text-amber-500 mb-2" />
              <p className="font-medium">
                {entries.filter(e => e.source === 'challenge').length}
              </p>
              <p className="text-sm text-muted-foreground">Challenge Entries</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search recordings..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <div className="w-48">
                  <Select 
                    value={sourceFilter} 
                    onValueChange={setSourceFilter}
                  >
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="upload">Uploaded</SelectItem>
                      <SelectItem value="roleplay">Roleplay</SelectItem>
                      <SelectItem value="challenge">Challenge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredEntries.length > 0 ? (
            <div className="divide-y">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-1/6 md:w-1/12 aspect-video rounded-md bg-muted/50 flex items-center justify-center overflow-hidden">
                      {entry.video_url ? (
                        <video src={entry.video_url} className="w-full h-full object-cover" />
                      ) : (
                        <Video className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{entry.title}</h3>
                        <div className="flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full">
                          {getSourceIcon(entry.source)}
                          <span>{getSourceLabel(entry.source)}</span>
                        </div>
                      </div>
                      
                      {entry.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {entry.description}
                        </p>
                      )}
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{formatDate(entry.created_at)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/performance/${entry.id}`}>View Details</a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No recordings found</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                {entries.length > 0 
                  ? "Try adjusting your search or filters to find what you're looking for." 
                  : "Start building your performance library by uploading recordings or completing roleplays."}
              </p>
              {entries.length === 0 && (
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First Recording
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <UploadVideoDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen} 
        onVideoUploaded={fetchLibrary} 
      />
    </DashboardLayout>
  );
};

export default PerformanceLibrary;
