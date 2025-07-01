
import { supabase } from "@/integrations/supabase/client";

export type FeatureSource = 'resume_analyzer' | 'roleplay_feedback' | 'recruiter_assessments' | 'talent_pool';

export interface RagDocument {
  id: string;
  title: string;
  feature_source: FeatureSource;
  created_at: string;
  file_url: string;
}

export interface RagQuery {
  id: string;
  query_text: string;
  response_text: string;
  created_at: string;
}

export interface RagQueryResponse {
  answer: string;
  sources?: {
    content: string;
    id: string;
  }[];
  error?: string;
}

/**
 * Uploads a document to Supabase storage and creates a document record
 */
export async function uploadDocument(
  file: File,
  userId: string,
  userRole: string,
  title: string,
  featureSource: FeatureSource
): Promise<{ success: boolean; documentId?: string; error?: string }> {
  try {
    // Upload file to Supabase storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('rag_documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Create document record in the database
    const { data: docData, error: docError } = await supabase
      .from('rag_documents')
      .insert({
        user_id: userId,
        user_role: userRole,
        file_url: filePath,
        title,
        content_text: '', // Will be populated after processing
        feature_source: featureSource
      })
      .select('id')
      .single();

    if (docError) throw docError;

    // Ensure docData has the expected structure
    const documentId = docData.id;
    if (!documentId) {
      throw new Error('Invalid response format: missing document ID');
    }

    // Extract content from the document and generate embeddings
    const fileReader = new FileReader();
    
    return new Promise((resolve, reject) => {
      fileReader.onload = async (event) => {
        try {
          // Get text content from the file
          const content = event.target?.result as string;
          
          // Call the process-document function to extract text and generate embeddings
          const { data: processData, error: processError } = await supabase.functions
            .invoke('process-document', {
              body: {
                documentId: documentId,
                content
              }
            });
          
          if (processError) throw processError;
          
          resolve({
            success: true,
            documentId: documentId
          });
        } catch (error: any) {
          console.error("Document processing error:", error);
          reject({
            success: false,
            error: error.message || "Failed to process document"
          });
        }
      };
      
      fileReader.onerror = (event) => {
        reject({
          success: false,
          error: "Failed to read file"
        });
      };
      
      fileReader.readAsText(file);
    });
  } catch (error: any) {
    console.error("Document upload error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload document"
    };
  }
}

/**
 * Queries a document using RAG
 */
export async function queryDocument(
  query: string,
  userId: string,
  featureSource: FeatureSource,
  documentId?: string
): Promise<RagQueryResponse> {
  try {
    const { data, error } = await supabase.functions
      .invoke('rag-query', {
        body: {
          query,
          userId,
          documentId,
          featureSource
        }
      });

    if (error) throw error;
    
    return data as RagQueryResponse;
  } catch (error: any) {
    console.error("RAG query error:", error);
    return {
      answer: "I'm sorry, but an error occurred while processing your query. Please try again later.",
      error: error.message || "Failed to process query"
    };
  }
}

/**
 * Gets recent queries for a user
 */
export async function getRecentQueries(
  userId: string,
  featureSource: FeatureSource,
  documentId?: string
): Promise<RagQuery[]> {
  try {
    let query = supabase
      .from('rag_queries')
      .select('id, query_text, response_text, created_at')
      .eq('user_id', userId)
      .eq('feature_source', featureSource)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (documentId) {
      query = query.eq('document_id', documentId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    // Transform data to ensure it matches the RagQuery interface
    const queries: RagQuery[] = data.map((item: any) => ({
      id: item.id,
      query_text: item.query_text,
      response_text: item.response_text,
      created_at: item.created_at
    }));
    
    return queries;
  } catch (error: any) {
    console.error("Get recent queries error:", error);
    return [];
  }
}

/**
 * Gets documents for a user
 */
export async function getUserDocuments(
  userId: string,
  featureSource: FeatureSource
): Promise<RagDocument[]> {
  try {
    const { data, error } = await supabase
      .from('rag_documents')
      .select('id, title, feature_source, created_at, file_url')
      .eq('user_id', userId)
      .eq('feature_source', featureSource)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    // Transform data to ensure it matches the RagDocument interface
    const documents: RagDocument[] = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      feature_source: item.feature_source,
      created_at: item.created_at,
      file_url: item.file_url
    }));
    
    return documents;
  } catch (error: any) {
    console.error("Get user documents error:", error);
    return [];
  }
}

/**
 * Deletes a document
 */
export async function deleteDocument(
  documentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // First, get the document to find the file path
    const { data: document, error: getError } = await supabase
      .from('rag_documents')
      .select('file_url')
      .eq('id', documentId)
      .single();
    
    if (getError) throw getError;
    
    if (!document) {
      throw new Error('Document not found or has invalid format');
    }
    
    const fileUrl = document.file_url;
    if (!fileUrl) {
      throw new Error('Document found but file URL is missing');
    }
    
    // Delete queries associated with the document
    const { error: queriesError } = await supabase
      .from('rag_queries')
      .delete()
      .eq('document_id', documentId);
    
    if (queriesError) throw queriesError;
    
    // Delete the document record
    const { error: docError } = await supabase
      .from('rag_documents')
      .delete()
      .eq('id', documentId);
    
    if (docError) throw docError;
    
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('rag_documents')
      .remove([fileUrl]);
    
    if (storageError) throw storageError;
    
    return { success: true };
  } catch (error: any) {
    console.error("Delete document error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete document"
    };
  }
}
