
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { toast } from '@/hooks/use-toast';

// These environment variables are automatically available
const supabaseUrl = 'https://pesnfpdwcojfomspprmf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlc25mcGR3Y29qZm9tc3Bwcm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNDMwNDcsImV4cCI6MjA1NjcxOTA0N30.gLrfIXIF-p0YxiXlRct16grCuSrryR8fEQhUMzTH0h8';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Initialize storage buckets when the app starts
export const initializeStorageBuckets = async () => {
  try {
    console.log('Initializing storage buckets...');
    
    // Check if 'videos' bucket exists
    try {
      const { data: videoBucket, error: videoCheckError } = await supabase
        .storage
        .getBucket('videos');
      
      // If bucket doesn't exist, create it
      if (videoCheckError && videoCheckError.message.includes('not found')) {
        console.log('Creating videos bucket...');
        
        try {
          const { data, error } = await supabase
            .storage
            .createBucket('videos', {
              public: true,
              fileSizeLimit: 104857600, // 100MB
              allowedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime']
            });
            
          if (error) {
            console.error('Failed to create videos bucket:', error);
          } else {
            console.log('Videos bucket created successfully');
          }
        } catch (createError) {
          console.error('Exception creating videos bucket:', createError);
        }
      } else {
        console.log('Videos bucket already exists');
      }
    } catch (videoError) {
      console.error('Error checking videos bucket:', videoError);
    }
    
    // Check if 'call_recordings' bucket exists
    try {
      const { data: callsBucket, error: callsCheckError } = await supabase
        .storage
        .getBucket('call_recordings');
      
      // If bucket doesn't exist, create it
      if (callsCheckError && callsCheckError.message.includes('not found')) {
        console.log('Creating call_recordings bucket...');
        
        try {
          const { data, error } = await supabase
            .storage
            .createBucket('call_recordings', {
              public: true,
              fileSizeLimit: 524288000, // 500MB
              allowedMimeTypes: ['video/mp4', 'video/webm']
            });
            
          if (error) {
            console.error('Failed to create call_recordings bucket:', error);
          } else {
            console.log('Call recordings bucket created successfully');
          }
        } catch (createError) {
          console.error('Exception creating call_recordings bucket:', createError);
        }
      } else {
        console.log('Call recordings bucket already exists');
      }
    } catch (callsError) {
      console.error('Error checking call_recordings bucket:', callsError);
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
    return false;
  }
};

// Function to ensure the videos bucket exists before upload
export const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    // First try to get the bucket info
    const { data, error } = await supabase.storage.getBucket(bucketName);
    
    if (!error) {
      // Bucket exists
      return true;
    }
    
    if (error.message.includes('not found')) {
      // Bucket doesn't exist, try to create it
      const config = {
        public: true,
        fileSizeLimit: bucketName === 'videos' ? 104857600 : 524288000, // 100MB or 500MB
        allowedMimeTypes: ['video/mp4', 'video/webm', 'video/quicktime']
      };
      
      const { error: createError } = await supabase
        .storage
        .createBucket(bucketName, config);
        
      if (createError) {
        console.error(`Error creating ${bucketName} bucket:`, createError);
        return false;
      }
      
      return true;
    }
    
    console.error(`Error checking ${bucketName} bucket:`, error);
    return false;
  } catch (e) {
    console.error(`Exception ensuring ${bucketName} bucket exists:`, e);
    return false;
  }
};
