
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/supabase_functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface RequestParams {
  industry?: string;
  region?: string;
}

interface SalesIndustryReport {
  id: string;
  industry: string;
  region: string;
  avg_performance_score: number;
  top_skills: string[];
  skill_gaps: string[];
  demand_trends: {
    increasingRoles: string[];
    decreasingRoles: string[];
    emergingSkills: string[];
    roleGrowthRate: Record<string, number>;
  };
  created_at: string;
  updated_at: string;
}

// Mock data function for sales industry reports
function generateMockReports(params: RequestParams): SalesIndustryReport[] {
  const reports: SalesIndustryReport[] = [
    {
      id: "1",
      industry: "SaaS",
      region: "North America",
      avg_performance_score: 76,
      top_skills: [
        "Product-Led Growth Expertise",
        "Technical Understanding",
        "Value-Based Selling",
        "Competitive Analysis"
      ],
      skill_gaps: [
        "Enterprise Solution Architecture",
        "Pricing Strategy Understanding",
        "Technical Implementation Knowledge"
      ],
      demand_trends: {
        increasingRoles: ["Product Specialist", "Solutions Consultant", "Customer Success Manager"],
        decreasingRoles: ["Outbound SDR"],
        emergingSkills: ["Product Usage Analytics", "AI-Assisted Selling", "Technical Integration"],
        roleGrowthRate: {
          "SDR": 15,
          "AE": 22,
          "CSM": 38,
          "SE": 12
        }
      },
      created_at: "2025-03-10T12:00:00Z",
      updated_at: "2025-03-10T12:00:00Z"
    },
    {
      id: "2",
      industry: "FinTech",
      region: "Global",
      avg_performance_score: 68,
      top_skills: [
        "Regulatory Compliance Knowledge",
        "Financial Services Expertise",
        "ROI Modeling",
        "Security Awareness"
      ],
      skill_gaps: [
        "Technical Integration Understanding",
        "Cross-Border Payment Knowledge",
        "Blockchain Applications"
      ],
      demand_trends: {
        increasingRoles: ["Financial Solutions Specialist", "Regulatory Expert"],
        decreasingRoles: ["General Account Executive"],
        emergingSkills: ["RegTech Knowledge", "Digital Payment Ecosystems", "Embedded Finance"],
        roleGrowthRate: {
          "SDR": 8,
          "AE": 12,
          "Solution Specialist": 25,
          "Implementation": -5
        }
      },
      created_at: "2025-03-12T12:00:00Z",
      updated_at: "2025-03-12T12:00:00Z"
    },
    {
      id: "3",
      industry: "Healthcare",
      region: "North America",
      avg_performance_score: 72,
      top_skills: [
        "HIPAA Compliance Knowledge",
        "Medical Terminology",
        "Value-Based Care Understanding",
        "Patient Journey Mapping"
      ],
      skill_gaps: [
        "Telehealth Solution Knowledge",
        "Healthcare IT Integration",
        "Outcomes-Based Selling"
      ],
      demand_trends: {
        increasingRoles: ["Healthcare Solution Specialist", "Patient Experience Consultant"],
        decreasingRoles: ["Traditional Medical Sales"],
        emergingSkills: ["Remote Care Solutions", "Healthcare Analytics", "Preventative Technology"],
        roleGrowthRate: {
          "Medical Sales": -2,
          "Healthcare IT": 32,
          "Digital Health": 45,
          "Value Consultant": 18
        }
      },
      created_at: "2025-03-14T12:00:00Z",
      updated_at: "2025-03-14T12:00:00Z"
    },
    {
      id: "4",
      industry: "Retail",
      region: "Global",
      avg_performance_score: 84,
      top_skills: [
        "Omnichannel Strategy",
        "Customer Experience Design",
        "Digital Marketing Integration",
        "Inventory Management Solutions"
      ],
      skill_gaps: [
        "Supply Chain Technology",
        "Advanced POS Integration",
        "Customer Data Analytics"
      ],
      demand_trends: {
        increasingRoles: ["Omnichannel Strategist", "Retail Technology Consultant"],
        decreasingRoles: ["Traditional POS Sales"],
        emergingSkills: ["Predictive Inventory", "Digital Shelf Optimization", "Contactless Solutions"],
        roleGrowthRate: {
          "Store Tech": 28,
          "eCommerce Solutions": 35,
          "Inventory Systems": 15,
          "Traditional POS": -12
        }
      },
      created_at: "2025-03-15T12:00:00Z",
      updated_at: "2025-03-15T12:00:00Z"
    }
  ];

  // Filter by industry if specified
  let filteredReports = [...reports];
  
  if (params.industry) {
    filteredReports = filteredReports.filter(report => 
      report.industry.toLowerCase() === params.industry?.toLowerCase()
    );
  }
  
  // Filter by region if specified
  if (params.region) {
    filteredReports = filteredReports.filter(report => 
      report.region.toLowerCase().includes(params.region?.toLowerCase() || '')
    );
  }
  
  return filteredReports;
}

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }
    
    // Get parameters from request body
    const params: RequestParams = await req.json();
    
    // Generate mock reports based on parameters
    const reports = generateMockReports(params);
    
    // Return the reports
    return new Response(JSON.stringify({ reports }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", 
      }
    });
  } catch (error) {
    console.error("Error in sales-industry-insights function:", error);
    return new Response(JSON.stringify({ error: "Internal server error", details: error.message }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", 
      }
    });
  }
});
