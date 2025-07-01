
import { ScorecardCategory } from "@/types/scorecard";

export const scorecardCategories: ScorecardCategory[] = [
  {
    id: "rapport",
    name: "Rapport Building & Agenda",
    weight: 10,
    lineItems: [
      { id: "rapport-1", text: "Introduction that is professional" },
      { id: "rapport-2", text: "Effectively gains the prospect's attention and builds rapport" },
      { id: "rapport-3", text: "Sets a clear agenda and smoothly transitions to discovery" }
    ]
  },
  {
    id: "discovery",
    name: "Discovery",
    weight: 25,
    lineItems: [
      { id: "discovery-1", text: "Uncovers the decision-making process" },
      { id: "discovery-2", text: "Determines relevant company or buyer facts" },
      { id: "discovery-3", text: "Uncovers the buyer's current pain points or goals" },
      { id: "discovery-4", text: "Asks effective questions that reveal business impact" },
      { id: "discovery-5", text: "Helps convert implied to explicit needs" },
      { id: "discovery-6", text: "Gains pre-commitment before transition to presentation" }
    ]
  },
  {
    id: "presentation",
    name: "Presentation & Product Knowledge",
    weight: 20,
    lineItems: [
      { id: "presentation-1", text: "Focuses on benefits aligned to buyer needs, not just features" },
      { id: "presentation-2", text: "Delivers a logical, persuasive presentation" },
      { id: "presentation-3", text: "Uses appropriate visual aids professionally" },
      { id: "presentation-4", text: "Demonstrates product/service effectively" },
      { id: "presentation-5", text: "Engages the buyer in the demo" },
      { id: "presentation-6", text: "Uses trial closes to understand decision process" }
    ]
  },
  {
    id: "closing",
    name: "Closing",
    weight: 15,
    lineItems: [
      { id: "closing-1", text: "Presents a compelling reason to buy" },
      { id: "closing-2", text: "Asks for the business or an appropriate commitment" }
    ]
  },
  {
    id: "objection",
    name: "Objection Handling",
    weight: 15,
    lineItems: [
      { id: "objection-1", text: "Clarifies the objection before addressing it" },
      { id: "objection-2", text: "Effectively answers the objection" },
      { id: "objection-3", text: "Confirms resolution with the buyer" }
    ]
  },
  {
    id: "communication",
    name: "Communication",
    weight: 10,
    lineItems: [
      { id: "communication-1", text: "Demonstrates strong verbal communication" },
      { id: "communication-2", text: "Actively listens, clarifies, and probes" },
      { id: "communication-3", text: "Avoids filler words like \"um\" or \"like\"" }
    ]
  },
  {
    id: "professionalism",
    name: "Overall Professionalism",
    weight: 5,
    lineItems: [
      { id: "professionalism-1", text: "Polished tone, confidence, and overall presence" }
    ]
  }
];
