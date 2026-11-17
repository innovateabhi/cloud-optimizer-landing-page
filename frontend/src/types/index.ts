export type CurrencyType = 'INR' | 'USD';

export interface PlanEntitlement {
  maxAccounts: number;
  maxRegions: number;
  maxResources: number;
  aiRecommendations: boolean;
  anomalyDetection: boolean;
  approvalWorkflows: boolean;
  forecasting: boolean;
  auditLogs: boolean;
  customRoles: boolean;
  reporting: 'basic' | 'standard' | 'advanced' | 'custom';
  support: 'community' | 'email' | 'priority' | 'dedicated';
}

export interface PricingPlan {
  id: 'free' | 'starter' | 'business' | 'enterprise';
  name: string;
  tagline: string;
  badge?: string;
  priceINR: number;
  priceUSD: number;
  billingPeriod: 'month';
  limitsDescription: string;
  entitlements: PlanEntitlement;
  features: string[];
  ctaText: string;
  ctaLink: string;
  isPopular?: boolean;
}

export interface DemoRequestData {
  fullName: string;
  workEmail: string;
  companyName: string;
  jobRole: string;
  monthlyCloudSpend: string;
  awsAccountCount: number;
  companySize: string;
  message?: string;
  consent: boolean;
}

export interface CloudResourceDemo {
  id: string;
  name: string;
  service: 'EC2' | 'RDS' | 'EBS' | 'S3';
  type: string;
  region: string;
  status: 'running' | 'idle' | 'stopped' | 'overprovisioned';
  monthlyCost: number;
  utilization: number; // percentage
  savingsOpportunity?: number;
}

export interface AIRecommendationDemo {
  id: string;
  resourceId: string;
  resourceName: string;
  service: 'EC2' | 'RDS' | 'EBS' | 'S3';
  finding: string;
  recommendedAction: string;
  estimatedSavings: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  confidence: number;
  status: 'Pending Review' | 'Approved' | 'Executed';
  explanation: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'security' | 'integration' | 'billing' | 'optimization';
}
