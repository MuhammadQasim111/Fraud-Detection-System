
export const RiskLevel = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW'
} as const;
export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel];

export const FraudCategory = {
  LAUNDERING: 'Money Laundering',
  ACCOUNT_TAKEOVER: 'Account Takeover',
  SYNTHETIC_IDENTITY: 'Synthetic Identity',
  COLLUSIVE_TRADING: 'Collusive Trading',
  STRUCTURING: 'Structuring / Smurfing',
  UNKNOWN: 'Unknown Anomaly'
} as const;
export type FraudCategory = (typeof FraudCategory)[keyof typeof FraudCategory];

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRADE' | 'TRANSFER';
  amount: number;
  timestamp: string;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'BLOCKED';
  metadata: {
    ip: string;
    device: string;
    location: string;
  };
}

export interface Alert {
  id: string;
  userId: string;
  username: string;
  riskScore: number;
  riskLevel: RiskLevel;
  category: FraudCategory;
  timestamp: string;
  status: 'MONITORING' | 'FLAGGED' | 'BLOCKED' | 'RESOLVED_SUSPICIOUS' | 'RESOLVED_BENIGN';
  originExplanation: string;
  signals: {
    behavioralScore: number;
    temporalScore: number;
    networkScore: number;
  };
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  importance: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  metadata?: any;
}

export interface GraphNode {
  id: string;
  type: 'ACCOUNT' | 'DEVICE' | 'IP' | 'CARD';
  label: string;
  risk: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
}
