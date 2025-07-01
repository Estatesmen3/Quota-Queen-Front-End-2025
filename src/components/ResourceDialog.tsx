import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Resource } from "@/hooks/useResources";
import { Clock, FileText, Play, Download, BookOpen, Star, CheckCircle2, Loader2, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { FirecrawlService } from "@/utils/FirecrawlService";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResourceDialogProps {
  resource: Resource | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (resourceId: string) => void;
  isSaved: boolean;
  onSave: (resourceId: string) => void;
}

export const ResourceDialog = ({
  resource,
  isOpen,
  onOpenChange,
  onComplete,
  isSaved,
  onSave,
}: ResourceDialogProps) => {
  const [content, setContent] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedContent, setScrapedContent] = useState<any | null>(null);
  const [showFullContent, setShowFullContent] = useState(false);

  useEffect(() => {
    const incrementViewCount = async () => {
      if (resource && isOpen) {
        try {
          await supabase.rpc('increment_resource_view', { resource_id: resource.id });
          console.log("View count incremented for resource:", resource.id);
        } catch (error) {
          console.error('Error incrementing view count:', error);
        }
      }
    };

    incrementViewCount();
  }, [resource, isOpen]);

  useEffect(() => {
    const loadContent = async () => {
      if (!resource || !isOpen) return;
      
      setIsLoading(true);
      
      try {
        // If there's a file_url, we'll show a download button instead of content
        if (resource.file_url) {
          setContent(null);
          setSummary(null);
        } 
        // If there's a source_url for a video, we'll embed it
        else if (resource.source_url && resource.format === 'Video') {
          setContent(null);
          setSummary(null);
        }
        // Otherwise, fetch and show the scraped content
        else if (resource.source_url) {
          // First check if we have stored content for this URL
          const { data: storedContent, error: fetchError } = await supabase
            .from('resource_content')
            .select('content')
            .eq('url', resource.source_url)
            .single();

          if (storedContent && storedContent.content) {
            console.log("Using stored content for", resource.source_url);
            setScrapedContent(storedContent.content);
            
            // Process the content into HTML and summary
            const { processedContent, processedSummary } = processScrapedContent(storedContent.content, resource);
            setContent(processedContent);
            setSummary(processedSummary);
          } else {
            console.log("No stored content found for", resource.source_url, "- scraping now");
            
            // Scrape the content if we don't have it stored
            const crawlResult = await FirecrawlService.crawlWebsite(resource.source_url);
            
            if (crawlResult.success && crawlResult.data) {
              setScrapedContent(crawlResult.data);
              
              // Process the content into HTML and summary
              const { processedContent, processedSummary } = processScrapedContent(crawlResult.data, resource);
              setContent(processedContent);
              setSummary(processedSummary);
            } else {
              // Fallback to simulated content if scraping fails
              const simulatedContent = generateSimulatedContent(resource);
              setContent(simulatedContent);
              setSummary(generateSimulatedSummary(resource));
            }
          }
        } else {
          // Fallback to simulated content if there's no source URL
          const simulatedContent = generateSimulatedContent(resource);
          setContent(simulatedContent);
          setSummary(generateSimulatedSummary(resource));
        }
      } catch (error) {
        console.error('Error loading resource content:', error);
        const errorContent = `
          <div class="prose max-w-none">
            <h1>${resource.title}</h1>
            <div class="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
              <p class="text-red-600">Error loading content. We're having trouble accessing this resource.</p>
              <p class="text-red-600">Please try again later or check the original source.</p>
            </div>
            <p>${resource.description}</p>
            ${resource.source_url ? `<p>You can view the original content at <a href="${resource.source_url}" target="_blank" rel="noopener noreferrer" class="text-dopamine-purple hover:text-dopamine-pink underline">the source website</a>.</p>` : ''}
          </div>`;
        setContent(errorContent);
        setSummary("Error loading content. We're having trouble accessing this resource.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
  }, [resource, isOpen]);

  const processScrapedContent = (scrapedData: any, resource: Resource): { processedContent: string, processedSummary: string } => {
    if (!scrapedData || !scrapedData.data || scrapedData.data.length === 0) {
      return { 
        processedContent: generateSimulatedContent(resource),
        processedSummary: generateSimulatedSummary(resource)
      };
    }

    try {
      // Extract the most relevant content from the scraped data
      const pageData = scrapedData.data[0]; // Use the first page as main content
      let htmlContent = '';
      let summaryContent = '';
      
      // If we have a pre-generated summary, use it
      if (scrapedData.summary) {
        summaryContent = `
          <div class="prose max-w-none">
            <h1 class="text-2xl font-bold text-dopamine-purple">${resource.title}</h1>
            <div class="bg-dopamine-purple/5 p-4 rounded-lg my-4 border border-dopamine-purple/20">
              <p class="text-sm text-muted-foreground mb-2">Summary:</p>
              <div class="formatted-markdown">
                ${convertMarkdownToHtml(scrapedData.summary)}
              </div>
              <div class="mt-4 text-right">
                <a href="${resource.source_url}" target="_blank" rel="noopener noreferrer" class="text-dopamine-purple hover:text-dopamine-pink inline-flex items-center text-sm">
                  Read full article <ExternalLink size={12} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        `;
      } else {
        // Generate a simple summary if we don't have one
        const title = pageData.metadata?.title || resource.title;
        const description = pageData.metadata?.description || resource.description;
        
        summaryContent = `
          <div class="prose max-w-none">
            <h1 class="text-2xl font-bold text-dopamine-purple">${title}</h1>
            <div class="bg-dopamine-purple/5 p-4 rounded-lg my-4 border border-dopamine-purple/20">
              <p class="text-sm text-muted-foreground mb-2">Summary:</p>
              <p>${description}</p>
              <div class="mt-4 text-right">
                <a href="${resource.source_url}" target="_blank" rel="noopener noreferrer" class="text-dopamine-purple hover:text-dopamine-pink inline-flex items-center text-sm">
                  Read full article <ExternalLink size={12} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        `;
      }
      
      if (pageData.content?.html) {
        // Clean and process the HTML
        let cleanHtml = pageData.content.html
          // Remove script tags and their content
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          // Remove style tags and their content
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          // Remove comments
          .replace(/<!--[\s\S]*?-->/g, '')
          // Remove nav, header, footer elements
          .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
          .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
          .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
          // Remove common UI elements like banners, ads, etc.
          .replace(/<div[^>]*class="[^"]*(?:banner|ad|popup|cookie|notification)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
          
        // Extract the main content - usually in main, article, or content div
        const mainContentMatch = cleanHtml.match(/<main\b[^<]*(?:(?!<\/main>)<[^<]*)*<\/main>/i) || 
                               cleanHtml.match(/<article\b[^<]*(?:(?!<\/article>)<[^<]*)*<\/article>/i) ||
                               cleanHtml.match(/<div[^>]*class="[^"]*(?:content|main|post)[^"]*"[^>]*>[\s\S]*?<\/div>/i);
                               
        if (mainContentMatch) {
          cleanHtml = mainContentMatch[0];
        }
        
        // Wrap in a styled container
        htmlContent = `
          <div class="prose max-w-none">
            <h1 class="text-2xl font-bold text-dopamine-purple">${resource.title}</h1>
            <p class="lead text-lg text-muted-foreground mb-4">${resource.description}</p>
            <div class="border-l-4 border-dopamine-purple/30 pl-4 italic my-4 text-muted-foreground">
              <p>Content sourced from <a href="${resource.source_url}" target="_blank" rel="noopener noreferrer" class="text-dopamine-purple hover:text-dopamine-pink">original article</a></p>
            </div>
            <div class="content-container">
              ${cleanHtml}
            </div>
            <div class="mt-6 pt-4 border-t border-muted">
              <p class="text-sm text-muted-foreground">Category: ${resource.category} • Format: ${resource.format} • Difficulty: ${resource.difficulty_level}</p>
            </div>
          </div>
        `;
      } else if (pageData.content?.markdown) {
        // Use the markdown content
        htmlContent = `
          <div class="prose max-w-none">
            <h1 class="text-2xl font-bold text-dopamine-purple">${resource.title}</h1>
            <p class="lead text-lg text-muted-foreground mb-4">${resource.description}</p>
            <div class="border-l-4 border-dopamine-purple/30 pl-4 italic my-4 text-muted-foreground">
              <p>Content sourced from <a href="${resource.source_url}" target="_blank" rel="noopener noreferrer" class="text-dopamine-purple hover:text-dopamine-pink">original article</a></p>
            </div>
            <div class="content-container formatted-markdown">
              ${convertMarkdownToHtml(pageData.content.markdown)}
            </div>
            <div class="mt-6 pt-4 border-t border-muted">
              <p class="text-sm text-muted-foreground">Category: ${resource.category} • Format: ${resource.format} • Difficulty: ${resource.difficulty_level}</p>
            </div>
          </div>
        `;
      } else {
        // Fallback to simulated content
        return { 
          processedContent: generateSimulatedContent(resource),
          processedSummary: generateSimulatedSummary(resource)
        };
      }
      
      return { 
        processedContent: htmlContent,
        processedSummary: summaryContent
      };
    } catch (error) {
      console.error('Error processing scraped content:', error);
      return { 
        processedContent: generateSimulatedContent(resource),
        processedSummary: generateSimulatedSummary(resource)
      };
    }
  };

  const convertMarkdownToHtml = (markdown: string): string => {
    return markdown
      .replace(/#{1,6}\s(.*)/g, (match, p1) => `<h2 class="text-xl font-bold text-dopamine-purple mt-6 mb-3">${p1}</h2>`)
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-dopamine-purple">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-dopamine-purple hover:text-dopamine-pink underline">$1</a>')
      .replace(/^\s*>\s*(.*)/gm, '<blockquote class="border-l-4 border-dopamine-purple/50 pl-4 italic my-4 text-muted-foreground"><p>$1</p></blockquote>')
      .replace(/^\s*-\s*(.*)/gm, '<li class="mb-2">$1</li>')
      .replace(/(<li.*?>.*?<\/li>)+/g, '<ul class="list-disc pl-6 my-4">$&</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '<p>$1</p>');
  };

  const generateSimulatedContent = (resource: Resource): string => {
    return `
    <div class="prose max-w-none">
      <h1 class="text-2xl font-bold text-dopamine-purple">${resource.title}</h1>
      <p class="lead text-lg text-muted-foreground mb-4">${resource.description}</p>
      
      <p>This is a premium ${resource.format.toLowerCase()} about ${resource.category.toLowerCase()} techniques for sales professionals.</p>
      
      <h2 class="text-xl font-bold text-dopamine-purple mt-6 mb-3">Key Points</h2>
      <ul class="list-disc pl-6 my-4">
        ${resource.tags?.map(tag => `<li class="mb-2"><strong class="text-dopamine-purple">${tag}:</strong> Important information about ${tag.toLowerCase()}</li>`).join('')}
      </ul>
      
      <h2 class="text-xl font-bold text-dopamine-purple mt-6 mb-3">Best Practices</h2>
      <p>When implementing ${resource.category} strategies, it's important to consider the following:</p>
      <ol class="list-decimal pl-6 my-4">
        <li class="mb-2">Understand your customer's needs</li>
        <li class="mb-2">Communicate value clearly</li>
        <li class="mb-2">Follow up consistently</li>
      </ol>
      
      <blockquote class="border-l-4 border-dopamine-purple/50 bg-dopamine-purple/5 p-4 rounded-md my-6 not-italic">
        <p>"The key to success in sales is understanding the customer's problem better than they do."</p>
      </blockquote>
      
      <h2 class="text-xl font-bold text-dopamine-purple mt-6 mb-3">Additional Resources</h2>
      <p>For more information on this topic, check out our other resources on ${resource.category}.</p>
      
      <div class="mt-6 pt-4 border-t border-muted">
        <p class="text-sm text-muted-foreground">
          Note: This is simulated content. In a production environment, this content would be loaded from the actual resource.
          ${resource.source_url ? `<br>View the <a href="${resource.source_url}" target="_blank" rel="noopener noreferrer" class="text-dopamine-purple hover:text-dopamine-pink underline">original source</a> for accurate information.` : ''}
        </p>
      </div>
    </div>`;
  };

  const generateSimulatedSummary = (resource: Resource): string => {
    return `
    <div class="prose max-w-none">
      <h1 class="text-2xl font-bold text-dopamine-purple">${resource.title}</h1>
      <div class="bg-dopamine-purple/5 p-4 rounded-lg my-4 border border-dopamine-purple/20">
        <p class="text-sm text-muted-foreground mb-2">Summary:</p>
        <p>${resource.description}</p>
        <p class="mt-3">This ${resource.format.toLowerCase()} covers key ${resource.category.toLowerCase()} techniques including:</p>
        <ul class="list-disc pl-6 my-2">
          ${resource.tags?.slice(0, 3).map(tag => `<li>${tag}</li>`).join('')}
        </ul>
        ${resource.source_url ? `
        <div class="mt-4 text-right">
          <a href="${resource.source_url}" target="_blank" rel="noopener noreferrer" class="text-dopamine-purple hover:text-dopamine-pink inline-flex items-center text-sm">
            Read full article <ExternalLink size={12} className="ml-1" />
          </a>
        </div>
        ` : ''}
      </div>
    </div>`;
  };

  if (!resource) return null;

  const getResourceIcon = () => {
    switch (resource.format) {
      case 'Video':
        return <Play size={20} className="text-dopamine-purple" />;
      case 'PDF':
        return <Download size={20} className="text-dopamine-orange" />;
      case 'Article':
      case 'Guide':
      default:
        return <FileText size={20} className="text-dopamine-blue" />;
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 size={48} className="animate-spin text-dopamine-purple mb-4" />
          <p className="text-muted-foreground">Loading resource content...</p>
        </div>
      );
    }

    if (resource.format === 'Video' && resource.source_url) {
      // Handle YouTube videos
      let embedUrl = resource.source_url;
      
      if (resource.source_url.includes('youtube.com/watch?v=')) {
        embedUrl = resource.source_url.replace('watch?v=', 'embed/');
      } else if (resource.source_url.includes('youtu.be/')) {
        const videoId = resource.source_url.split('youtu.be/')[1].split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (resource.source_url.includes('vimeo.com')) {
        const videoId = resource.source_url.split('vimeo.com/')[1].split('?')[0];
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }
      
      return (
        <div className="space-y-6">
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mb-6">
            <iframe 
              src={embedUrl} 
              className="w-full h-full" 
              allowFullScreen 
              title={resource.title}
            ></iframe>
          </div>
          
          <div className="prose max-w-none">
            <h1 className="text-2xl font-bold text-dopamine-purple">{resource.title}</h1>
            <p className="lead text-lg text-muted-foreground">{resource.description}</p>
            
            {resource.tags && resource.tags.length > 0 && (
              <div className="my-4">
                <h2 className="text-xl font-bold text-dopamine-purple mt-6 mb-3">Topics Covered</h2>
                <ul className="list-disc pl-6">
                  {resource.tags.map((tag, i) => (
                    <li key={i} className="mb-2">
                      <strong className="text-dopamine-purple">{tag}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (resource.format === 'PDF' && resource.file_url) {
      return (
        <div className="flex flex-col items-center justify-center py-8 bg-dopamine-orange/5 rounded-lg mb-6">
          <Download size={48} className="text-dopamine-orange mb-4" />
          <p className="text-muted-foreground mb-4">This resource is available as a PDF</p>
          <Button 
            onClick={() => window.open(resource.file_url || '#', '_blank')}
            className="bg-gradient-to-r from-dopamine-orange to-dopamine-pink text-white"
          >
            <Download size={16} className="mr-2" />
            Download PDF
          </Button>
        </div>
      );
    }

    // For articles and other content types, show the summary by default
    // with an option to view the full content
    return (
      <Tabs defaultValue="summary">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="full">Full Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          {summary ? (
            <div 
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-dopamine-purple prose-blockquote:border-dopamine-purple/50 prose-blockquote:bg-dopamine-purple/5 prose-blockquote:p-4 prose-blockquote:rounded-md prose-blockquote:not-italic prose-strong:text-dopamine-purple"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          ) : (
            <p className="text-muted-foreground">Summary unavailable</p>
          )}
        </TabsContent>
        
        <TabsContent value="full">
          {content ? (
            <div 
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-dopamine-purple prose-blockquote:border-dopamine-purple/50 prose-blockquote:bg-dopamine-purple/5 prose-blockquote:p-4 prose-blockquote:rounded-md prose-blockquote:not-italic prose-strong:text-dopamine-purple"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">Full content is available at the original source</p>
              {resource.source_url && (
                <Button 
                  variant="outline"
                  onClick={() => window.open(resource.source_url || '#', '_blank')}
                >
                  <ExternalLink size={16} className="mr-2" />
                  Visit Original Source
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            {getResourceIcon()}
            <DialogTitle className="text-2xl">{resource.title}</DialogTitle>
          </div>
          <DialogDescription>
            <div className="flex flex-wrap gap-2 my-2">
              <Badge variant="outline" className="bg-dopamine-purple/10 border-dopamine-purple/30">
                {resource.format}
              </Badge>
              {resource.estimated_duration && (
                <Badge variant="outline">
                  <Clock size={12} className="mr-1" />
                  {resource.estimated_duration}
                </Badge>
              )}
              <Badge className="bg-gradient-to-r from-dopamine-purple to-dopamine-pink text-white border-none">
                {resource.difficulty_level}
              </Badge>
              {resource.tags && resource.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-dopamine-purple/5">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-muted-foreground my-2">{resource.description}</p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4">
          {renderContent()}
        </div>
        
        <div className="flex flex-wrap gap-3 mt-6 border-t pt-4">
          <Button 
            variant="ghost" 
            onClick={() => onSave(resource.id)}
            className={isSaved ? "text-dopamine-purple bg-dopamine-purple/10" : ""}
          >
            <Star size={16} className="mr-2" />
            {isSaved ? "Saved" : "Save Resource"}
          </Button>
          
          <Button 
            variant="ghost"
            onClick={() => onComplete(resource.id)}
            className="text-dopamine-green hover:text-dopamine-green hover:bg-dopamine-green/10"
          >
            <CheckCircle2 size={16} className="mr-2" />
            Mark as Complete
          </Button>
          
          {resource.source_url && (
            <Button 
              variant="outline"
              onClick={() => window.open(resource.source_url || '#', '_blank')}
              className="ml-auto"
            >
              <ExternalLink size={16} className="mr-2" />
              View Original
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
