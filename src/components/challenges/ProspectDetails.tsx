
import { Briefcase, BookOpen } from "lucide-react";
import { SponsoredChallenge } from "@/types/challenges";

interface ProspectDetailsProps {
  challenge: SponsoredChallenge;
}

export const ProspectDetails = ({ challenge }: ProspectDetailsProps) => {
  return (
    <div className="mt-4 space-y-4">
      <div>
        <h3 className="font-semibold mb-1 flex items-center">
          <Briefcase className="h-4 w-4 mr-2" />
          Prospect Background
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {challenge.prospect_background}
        </p>
        
        <h3 className="font-semibold mb-1 flex items-center">
          <BookOpen className="h-4 w-4 mr-2" />
          Research Notes
        </h3>
        <p className="text-sm text-muted-foreground">
          {challenge.research_notes}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <CompanyInfo info={challenge.company_info} />
        <ProspectInfo info={challenge.prospect_info} />
      </div>
    </div>
  );
};

const CompanyInfo = ({ info }: { info: Record<string, any> }) => {
  return (
    <div className="border rounded-md p-4">
      <h4 className="font-medium mb-2">Company Information</h4>
      <dl className="space-y-2">
        {Object.entries(info).map(([key, value]) => {
          if (key === 'executives') return null;
          return (
            <div key={key} className="grid grid-cols-2">
              <dt className="text-sm text-muted-foreground capitalize">{key}:</dt>
              <dd className="text-sm font-medium">{value as string}</dd>
            </div>
          );
        })}
      </dl>
      
      {info.executives && (
        <div className="mt-4">
          <h5 className="text-sm font-medium mb-1">Key Executives:</h5>
          <dl className="space-y-1">
            {Object.entries(info.executives).map(([role, name]) => (
              <div key={role} className="grid grid-cols-2">
                <dt className="text-sm text-muted-foreground uppercase">{role}:</dt>
                <dd className="text-sm">{name as string}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
};

const ProspectInfo = ({ info }: { info: Record<string, any> }) => {
  return (
    <div className="border rounded-md p-4">
      <h4 className="font-medium mb-2">Prospect Information</h4>
      <dl className="space-y-2">
        {Object.entries(info).map(([key, value]) => {
          if (typeof value === 'object') return null;
          return (
            <div key={key} className="grid grid-cols-2">
              <dt className="text-sm text-muted-foreground capitalize">{key}:</dt>
              <dd className="text-sm font-medium">{value as string}</dd>
            </div>
          );
        })}
      </dl>
      
      {info.experience && (
        <div className="mt-4">
          <h5 className="text-sm font-medium mb-1">Experience:</h5>
          {Object.entries(info.experience).map(([key, value]) => {
            if (key === 'roles') return null;
            return (
              <div key={key} className="grid grid-cols-2 mb-1">
                <dt className="text-sm text-muted-foreground capitalize">{key}:</dt>
                <dd className="text-sm">{value as string}</dd>
              </div>
            );
          })}
          
          {info.experience.roles && (
            <div className="mt-2">
              <h6 className="text-xs font-medium">Previous Roles:</h6>
              <ul className="text-xs list-disc pl-4 mt-1 space-y-1">
                {info.experience.roles.map((role: string, index: number) => (
                  <li key={index}>{role}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {info.pain_points && (
        <div className="mt-4">
          <h5 className="text-sm font-medium mb-1">Pain Points:</h5>
          <ul className="text-xs list-disc pl-4 mt-1 space-y-1">
            {info.pain_points.map((point: string, index: number) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
