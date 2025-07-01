import { Scorecard } from "@/types/scorecard";

export const mockScorecards: Scorecard[] = [
  {
    id: "1",
    title: "Salesforce Challenge Scorecard",
    roleplaySessionId: "sf-123",
    categories: [
      {
        id: "rapport",
        name: "Rapport Building & Agenda",
        weight: 10,
        lineItems: [
          { id: "rapport-1", text: "Introduction that is professional", score: 9 },
          { id: "rapport-2", text: "Effectively gains the prospect's attention and builds rapport", score: 8 },
          { id: "rapport-3", text: "Sets a clear agenda and smoothly transitions to discovery", score: 8 }
        ]
      },
      {
        id: "discovery",
        name: "Discovery",
        weight: 25,
        lineItems: [
          { id: "discovery-1", text: "Uncovers the decision-making process", score: 7 },
          { id: "discovery-2", text: "Determines relevant company or buyer facts", score: 8 },
          { id: "discovery-3", text: "Uncovers the buyer's current pain points or goals", score: 9 },
          { id: "discovery-4", text: "Asks effective questions that reveal business impact", score: 8 },
          { id: "discovery-5", text: "Helps convert implied to explicit needs", score: 7 },
          { id: "discovery-6", text: "Gains pre-commitment before transition to presentation", score: 8 }
        ]
      },
      {
        id: "presentation",
        name: "Presentation & Product Knowledge",
        weight: 20,
        lineItems: [
          { id: "presentation-1", text: "Focuses on benefits aligned to buyer needs, not just features", score: 6 },
          { id: "presentation-2", text: "Delivers a logical, persuasive presentation", score: 7 },
          { id: "presentation-3", text: "Uses appropriate visual aids professionally", score: 8 },
          { id: "presentation-4", text: "Demonstrates product/service effectively", score: 9 },
          { id: "presentation-5", text: "Engages the buyer in the demo", score: 8 },
          { id: "presentation-6", text: "Uses trial closes to understand decision process", score: 7 }
        ]
      },
      {
        id: "closing",
        name: "Closing",
        weight: 15,
        lineItems: [
          { id: "closing-1", text: "Presents a compelling reason to buy", score: 8 },
          { id: "closing-2", text: "Asks for the business or an appropriate commitment", score: 9 }
        ]
      },
      {
        id: "objection",
        name: "Objection Handling",
        weight: 15,
        lineItems: [
          { id: "objection-1", text: "Clarifies the objection before addressing it", score: 7 },
          { id: "objection-2", text: "Effectively answers the objection", score: 8 },
          { id: "objection-3", text: "Confirms resolution with the buyer", score: 9 }
        ]
      },
      {
        id: "communication",
        name: "Communication",
        weight: 10,
        lineItems: [
          { id: "communication-1", text: "Demonstrates strong verbal communication", score: 8 },
          { id: "communication-2", text: "Actively listens, clarifies, and probes", score: 9 },
          { id: "communication-3", text: "Avoids filler words like \"um\" or \"like\"", score: 7 }
        ]
      },
      {
        id: "professionalism",
        name: "Overall Professionalism",
        weight: 5,
        lineItems: [
          { id: "professionalism-1", text: "Polished tone, confidence, and overall presence", score: 9 }
        ]
      }
    ],
    totalScore: 85,
    createdAt: new Date("2025-04-15")
  },
  {
    id: "2",
    title: "Cold Call Practice Scorecard",
    roleplaySessionId: "cc-456",
    categories: [
      {
        id: "rapport",
        name: "Rapport Building & Agenda",
        weight: 10,
        lineItems: [
          { id: "rapport-1", text: "Introduction that is professional", score: 9 },
          { id: "rapport-2", text: "Effectively gains the prospect's attention and builds rapport", score: 8 },
          { id: "rapport-3", text: "Sets a clear agenda and smoothly transitions to discovery", score: 8 }
        ]
      },
      {
        id: "discovery",
        name: "Discovery",
        weight: 25,
        lineItems: [
          { id: "discovery-1", text: "Uncovers the decision-making process", score: 7 },
          { id: "discovery-2", text: "Determines relevant company or buyer facts", score: 8 },
          { id: "discovery-3", text: "Uncovers the buyer's current pain points or goals", score: 9 },
          { id: "discovery-4", text: "Asks effective questions that reveal business impact", score: 8 },
          { id: "discovery-5", text: "Helps convert implied to explicit needs", score: 7 },
          { id: "discovery-6", text: "Gains pre-commitment before transition to presentation", score: 8 }
        ]
      },
      {
        id: "presentation",
        name: "Presentation & Product Knowledge",
        weight: 20,
        lineItems: [
          { id: "presentation-1", text: "Focuses on benefits aligned to buyer needs, not just features", score: 6 },
          { id: "presentation-2", text: "Delivers a logical, persuasive presentation", score: 7 },
          { id: "presentation-3", text: "Uses appropriate visual aids professionally", score: 8 },
          { id: "presentation-4", text: "Demonstrates product/service effectively", score: 9 },
          { id: "presentation-5", text: "Engages the buyer in the demo", score: 8 },
          { id: "presentation-6", text: "Uses trial closes to understand decision process", score: 7 }
        ]
      },
      {
        id: "closing",
        name: "Closing",
        weight: 15,
        lineItems: [
          { id: "closing-1", text: "Presents a compelling reason to buy", score: 8 },
          { id: "closing-2", text: "Asks for the business or an appropriate commitment", score: 9 }
        ]
      },
      {
        id: "objection",
        name: "Objection Handling",
        weight: 15,
        lineItems: [
          { id: "objection-1", text: "Clarifies the objection before addressing it", score: 7 },
          { id: "objection-2", text: "Effectively answers the objection", score: 8 },
          { id: "objection-3", text: "Confirms resolution with the buyer", score: 9 }
        ]
      },
      {
        id: "communication",
        name: "Communication",
        weight: 10,
        lineItems: [
          { id: "communication-1", text: "Demonstrates strong verbal communication", score: 8 },
          { id: "communication-2", text: "Actively listens, clarifies, and probes", score: 9 },
          { id: "communication-3", text: "Avoids filler words like \"um\" or \"like\"", score: 7 }
        ]
      },
      {
        id: "professionalism",
        name: "Overall Professionalism",
        weight: 5,
        lineItems: [
          { id: "professionalism-1", text: "Polished tone, confidence, and overall presence", score: 9 }
        ]
      }
    ],
    totalScore: 92,
    createdAt: new Date("2025-04-14")
  },
  {
    id: "3",
    title: "Product Demo Scorecard",
    roleplaySessionId: "pd-789",
    categories: [
      {
        id: "rapport",
        name: "Rapport Building & Agenda",
        weight: 10,
        lineItems: [
          { id: "rapport-1", text: "Introduction that is professional", score: 9 },
          { id: "rapport-2", text: "Effectively gains the prospect's attention and builds rapport", score: 8 },
          { id: "rapport-3", text: "Sets a clear agenda and smoothly transitions to discovery", score: 8 }
        ]
      },
      {
        id: "discovery",
        name: "Discovery",
        weight: 25,
        lineItems: [
          { id: "discovery-1", text: "Uncovers the decision-making process", score: 7 },
          { id: "discovery-2", text: "Determines relevant company or buyer facts", score: 8 },
          { id: "discovery-3", text: "Uncovers the buyer's current pain points or goals", score: 9 },
          { id: "discovery-4", text: "Asks effective questions that reveal business impact", score: 8 },
          { id: "discovery-5", text: "Helps convert implied to explicit needs", score: 7 },
          { id: "discovery-6", text: "Gains pre-commitment before transition to presentation", score: 8 }
        ]
      },
      {
        id: "presentation",
        name: "Presentation & Product Knowledge",
        weight: 20,
        lineItems: [
          { id: "presentation-1", text: "Focuses on benefits aligned to buyer needs, not just features", score: 6 },
          { id: "presentation-2", text: "Delivers a logical, persuasive presentation", score: 7 },
          { id: "presentation-3", text: "Uses appropriate visual aids professionally", score: 8 },
          { id: "presentation-4", text: "Demonstrates product/service effectively", score: 9 },
          { id: "presentation-5", text: "Engages the buyer in the demo", score: 8 },
          { id: "presentation-6", text: "Uses trial closes to understand decision process", score: 7 }
        ]
      },
      {
        id: "closing",
        name: "Closing",
        weight: 15,
        lineItems: [
          { id: "closing-1", text: "Presents a compelling reason to buy", score: 8 },
          { id: "closing-2", text: "Asks for the business or an appropriate commitment", score: 9 }
        ]
      },
      {
        id: "objection",
        name: "Objection Handling",
        weight: 15,
        lineItems: [
          { id: "objection-1", text: "Clarifies the objection before addressing it", score: 7 },
          { id: "objection-2", text: "Effectively answers the objection", score: 8 },
          { id: "objection-3", text: "Confirms resolution with the buyer", score: 9 }
        ]
      },
      {
        id: "communication",
        name: "Communication",
        weight: 10,
        lineItems: [
          { id: "communication-1", text: "Demonstrates strong verbal communication", score: 8 },
          { id: "communication-2", text: "Actively listens, clarifies, and probes", score: 9 },
          { id: "communication-3", text: "Avoids filler words like \"um\" or \"like\"", score: 7 }
        ]
      },
      {
        id: "professionalism",
        name: "Overall Professionalism",
        weight: 5,
        lineItems: [
          { id: "professionalism-1", text: "Polished tone, confidence, and overall presence", score: 9 }
        ]
      }
    ],
    totalScore: 78,
    createdAt: new Date("2025-04-13")
  }
];
