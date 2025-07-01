
export function getProductDescription(company: string, product: string): string {
  const descriptions: Record<string, string> = {
    'Gartner for High Tech Providers': 'Gartner for High Tech Providers offers research, analysis, and advisory services specifically tailored for technology providers to help them identify opportunities, improve go-to-market strategies, and grow their business.',
    'Sales Cloud Enterprise': 'Salesforce Sales Cloud Enterprise is a CRM platform that gives sales teams the tools they need to close more deals, faster. It includes contact management, opportunity tracking, and workflow automation.',
    'Marketing Hub': 'HubSpot Marketing Hub helps businesses attract visitors, convert leads, and run complete inbound marketing campaigns at scale with tools for content creation, social media, SEO, and analytics.',
    'Zoom Enterprise': 'Zoom Enterprise provides large organizations with enterprise-grade video communications, including meeting recordings, cloud storage, dedicated support, and advanced security features.',
    'Creative Cloud': 'Adobe Creative Cloud is a subscription service that gives users access to a collection of software for graphic design, video editing, web development, photography, and cloud services.',
    'Shopify Plus': 'Shopify Plus is an enterprise e-commerce platform offering high-volume merchants advanced features, dedicated support, and customization options for scaling their online business.',
    'Microsoft 365': 'Microsoft 365 is a productivity cloud that delivers best-in-class Office apps, intelligent cloud services, and advanced security to help businesses achieve more.',
    'Twilio Flex': 'Twilio Flex is a programmable contact center platform that gives businesses complete control to customize every aspect of their contact center experience.',
    'Stripe Terminal': 'Stripe Terminal enables businesses to build their own in-person checkout experience with pre-certified card readers, SDKs, and cloud-based hardware management.',
    'Zendesk Suite': 'Zendesk Suite is a service-first CRM offering that unifies all support channels in one simple package with everything needed to deliver the best customer experiences.',
    'SmartLink Water Management System': 'Weathermatic\'s SmartLink Water Management System is a cloud-based irrigation management platform that helps reduce water consumption by 30-50% through weather-based adjustments, real-time monitoring, and automatic leak detection.'
  };
  
  return descriptions[product] || `A premium solution offered by ${company} designed to solve complex business challenges.`;
}

export function getRequiredSkills(difficulty: string): string[] {
  const basicSkills = [
    "Product knowledge",
    "Clear communication",
    "Active listening",
    "Building rapport"
  ];
  
  const intermediateSkills = [
    "Needs assessment",
    "Objection handling",
    "Value proposition delivery",
    "Solution positioning"
  ];
  
  const advancedSkills = [
    "Complex negotiation",
    "Competitive differentiation",
    "ROI justification",
    "Strategic account planning"
  ];
  
  const expertSkills = [
    "Enterprise solution architecture",
    "C-suite engagement",
    "Multi-stakeholder alignment",
    "Long-term relationship management"
  ];
  
  switch(difficulty.toLowerCase()) {
    case 'beginner':
      return basicSkills;
    case 'intermediate':
      return [...basicSkills.slice(0, 2), ...intermediateSkills.slice(0, 2)];
    case 'advanced':
      return [...intermediateSkills.slice(0, 2), ...advancedSkills.slice(0, 2)];
    case 'expert':
      return [...advancedSkills.slice(0, 2), ...expertSkills.slice(0, 2)];
    default:
      return [...intermediateSkills.slice(0, 2), ...advancedSkills.slice(0, 2)];
  }
}
