
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { getUserDocuments, deleteDocument, RagDocument, FeatureSource } from "@/services/ragService";
import { FileText, Trash2, Calendar, Loader2 } from "lucide-react";

interface DocumentListProps {
  featureSource: FeatureSource;
  onSelectDocument: (documentId: string) => void;
}

export function DocumentList({ featureSource, onSelectDocument }: DocumentListProps) {
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);
  
  const fetchDocuments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const docs = await getUserDocuments(user.id, featureSource);
      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (documentId: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      setIsDeleting(documentId);
      try {
        const result = await deleteDocument(documentId);
        
        if (!result.success) {
          throw new Error(result.error || "Delete failed");
        }
        
        toast({
          title: "Document deleted",
          description: "The document has been deleted successfully",
        });
        
        // Update the document list
        setDocuments(documents.filter(doc => doc.id !== documentId));
        
      } catch (error) {
        console.error("Delete error:", error);
        toast({
          title: "Delete failed",
          description: error.message || "Failed to delete document",
          variant: "destructive"
        });
      } finally {
        setIsDeleting(null);
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading documents...</span>
        </CardContent>
      </Card>
    );
  }
  
  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">No Documents Yet</h3>
          <p className="text-muted-foreground mb-4">
            Upload a document to get started with AI-powered analysis and Q&A.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Documents</CardTitle>
        <CardDescription>
          Select a document to ask questions about its content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div 
                className="flex items-start gap-3 cursor-pointer flex-1"
                onClick={() => onSelectDocument(doc.id)}
              >
                <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">{doc.title}</h4>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(doc.created_at)}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100"
                onClick={() => handleDelete(doc.id)}
                disabled={isDeleting === doc.id}
              >
                {isDeleting === doc.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
