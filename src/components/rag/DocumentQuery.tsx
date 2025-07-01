
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, MessageSquare, List, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { queryDocument, getRecentQueries, RagQuery, FeatureSource } from "@/services/ragService";

interface DocumentQueryProps {
  documentId?: string;
  featureSource: FeatureSource;
}

export function DocumentQuery({ documentId, featureSource }: DocumentQueryProps) {
  const [query, setQuery] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [sources, setSources] = useState<{ content: string; id: string }[]>([]);
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [recentQueries, setRecentQueries] = useState<RagQuery[]>([]);
  const [isLoadingQueries, setIsLoadingQueries] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchRecentQueries();
    }
  }, [user, documentId]);
  
  const fetchRecentQueries = async () => {
    if (!user) return;
    
    setIsLoadingQueries(true);
    try {
      const queries = await getRecentQueries(user.id, featureSource, documentId);
      setRecentQueries(queries);
    } catch (error) {
      console.error("Error fetching recent queries:", error);
    } finally {
      setIsLoadingQueries(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim() || !user) {
      return;
    }
    
    setIsQuerying(true);
    setAnswer("");
    setSources([]);
    
    try {
      const response = await queryDocument(
        query,
        user.id,
        featureSource,
        documentId
      );
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setAnswer(response.answer);
      if (response.sources) {
        setSources(response.sources);
      }
      
      // Refresh recent queries
      fetchRecentQueries();
      
    } catch (error) {
      console.error("Query error:", error);
      toast({
        title: "Query failed",
        description: error.message || "Failed to process your query",
        variant: "destructive"
      });
    } finally {
      setIsQuerying(false);
    }
  };
  
  const handleSelectQuery = (queryText: string) => {
    setQuery(queryText);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
          <CardDescription>
            Ask any question about the document content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are the key points in this document?"
                disabled={isQuerying}
                className="flex-1"
              />
              <Button type="submit" disabled={!query.trim() || isQuerying}>
                {isQuerying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Ask"
                )}
              </Button>
            </div>
          </form>
          
          {isQuerying ? (
            <div className="p-4 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Processing your question...</span>
            </div>
          ) : answer ? (
            <div className="mt-4">
              <div className="bg-accent/50 p-4 rounded-lg">
                <h3 className="font-medium text-sm mb-2">Answer</h3>
                <div className="text-sm whitespace-pre-wrap">
                  {answer}
                </div>
              </div>
              
              {sources.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-sm mb-2">Sources</h3>
                  <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                    {sources.map((source, index) => (
                      <div key={index} className="text-xs text-muted-foreground">
                        {source.content}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={() => {
                    setAnswer("");
                    setSources([]);
                  }}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Ask another question
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
      
      {recentQueries.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center">
              <List className="h-4 w-4 mr-2" />
              <CardTitle className="text-base">Recent Questions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentQueries.map((item) => (
                <li 
                  key={item.id} 
                  className="p-2 hover:bg-accent/50 rounded cursor-pointer flex items-start gap-2"
                  onClick={() => handleSelectQuery(item.query_text)}
                >
                  <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{item.query_text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
