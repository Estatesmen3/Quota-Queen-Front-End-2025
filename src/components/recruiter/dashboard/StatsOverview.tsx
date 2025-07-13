
import { useEffect, useState } from 'react';
import PulseCard from "@/components/recruiter/PulseCard";
import { Users, Briefcase, FileCheck, Calendar } from "lucide-react";
import { supabase } from '@/lib/supabase';

const StatsOverview = () => {
  const [talentPoolCount, setTalentPoolCount] = useState(0);

  useEffect(() => {
    const fetchTalentPoolCount = async () => {
      const { data, count, error } = await supabase
      .from('talent_pools')
      .select('*', { count: 'exact' });

      if (error) {
        console.error('Error fetching talent pool count:', error);
      } else {
        setTalentPoolCount(count || 0);
      }
    };

    fetchTalentPoolCount();
  }, []);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <PulseCard
        icon={<Users className="h-5 w-5 text-dopamine-purple" />}
        title="Talent Pool"
        value={talentPoolCount.toLocaleString()}
        subtitle="+23 new this week"
        trend={{ value: 4.2, isPositive: true }}
        gradient
      />
      
      <PulseCard
        icon={<Briefcase className="h-5 w-5 text-dopamine-pink" />}
        title="Active Jobs"
        value="0"
        subtitle="3=0 closing soon"
        trend={{ value: 2.8, isPositive: true }}
        gradient
      />
      
      <PulseCard
        icon={<FileCheck className="h-5 w-5 text-dopamine-orange" />}
        title="Applications"
        value="0"
        subtitle="0 need review"
        trend={{ value: 12.5, isPositive: true }}
        gradient
      />
      
      <PulseCard
        icon={<Calendar className="h-5 w-5 text-dopamine-blue" />}
        title="Interviews"
        value="0"
        subtitle="0 scheduled today"
        trend={{ value: 5.3, isPositive: true }}
        gradient
      />
    </div>
  );
};

export default StatsOverview;
