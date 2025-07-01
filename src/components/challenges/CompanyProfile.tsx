
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CompanyLogos, CompanyWebsites } from "./company-data";
import { SponsoredChallenge } from "@/types/challenges";
import { getProductDescription } from "./utils";

interface CompanyProfileProps {
  challenge: SponsoredChallenge;
}

export const CompanyProfile = ({ challenge }: CompanyProfileProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Company Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-4">
          {CompanyLogos[challenge.company_name] && (
            <img 
              src={CompanyLogos[challenge.company_name]}
              alt={`${challenge.company_name} logo`}
              className="h-16 object-contain"
            />
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-semibold">About {challenge.company_name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {challenge.company_description}
          </p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-semibold">About {challenge.product_name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {getProductDescription(challenge.company_name, challenge.product_name)}
          </p>
        </div>
        
        <Button 
          className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] mt-3"
          onClick={() => window.open(CompanyWebsites[challenge.company_name], '_blank')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Website
        </Button>
      </CardContent>
    </Card>
  );
};
