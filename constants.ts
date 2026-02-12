
import { RiskLevel, FraudCategory, Alert } from './types';

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'ALT-8821',
    userId: 'USR-9012',
    username: 'alex_trader_42',
    riskScore: 92,
    riskLevel: RiskLevel.CRITICAL,
    category: FraudCategory.COLLUSIVE_TRADING,
    timestamp: new Date().toISOString(),
    status: 'FLAGGED',
    originExplanation: 'Identified series of high-frequency wash trades with USR-4412 over a shared IP, suggesting risk-free profit laundering.',
    signals: {
      behavioralScore: 0.85,
      temporalScore: 0.94,
      networkScore: 0.88
    },
    timeline: [
      { id: 'ev-1', timestamp: '2023-11-20T10:00:00Z', type: 'LOGIN', description: 'Login from new device in Singapore', importance: 'MEDIUM' },
      { id: 'ev-2', timestamp: '2023-11-20T10:05:00Z', type: 'DEPOSIT', description: 'Deposit of $5,000 via Crypto Rail', importance: 'HIGH' },
      { id: 'ev-3', timestamp: '2023-11-20T10:12:00Z', type: 'TRADE', description: 'Series of 15 offsetting trades with USR-4412', importance: 'CRITICAL' },
      { id: 'ev-4', timestamp: '2023-11-20T10:25:00Z', type: 'WITHDRAWAL', description: 'Attempted withdrawal of $4,990 to external wallet', importance: 'HIGH' }
    ]
  },
  {
    id: 'ALT-8822',
    userId: 'USR-1150',
    username: 'merchant_ops_global',
    riskScore: 78,
    riskLevel: RiskLevel.HIGH,
    category: FraudCategory.LAUNDERING,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'BLOCKED',
    originExplanation: 'Sudden velocity shift: Large deposit followed by multi-hop internal transfers to high-risk legacy accounts.',
    signals: {
      behavioralScore: 0.72,
      temporalScore: 0.81,
      networkScore: 0.45
    },
    timeline: [
      { id: 'ev-5', timestamp: '2023-11-20T08:00:00Z', type: 'DEPOSIT', description: 'Batch deposit of $12,500 across 4 payment methods', importance: 'HIGH' },
      { id: 'ev-6', timestamp: '2023-11-20T09:30:00Z', type: 'TRANSFER', description: 'Internal transfer to USR-8812 (High Risk)', importance: 'HIGH' }
    ]
  },
  {
    id: 'ALT-8823',
    userId: 'USR-4491',
    username: 'crypto_newbie_01',
    riskScore: 45,
    riskLevel: RiskLevel.MEDIUM,
    category: FraudCategory.STRUCTURING,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'MONITORING',
    originExplanation: 'Sequence of sub-threshold deposits over 48 hours indicates possible deliberate limit avoidance (Structuring).',
    signals: {
      behavioralScore: 0.45,
      temporalScore: 0.55,
      networkScore: 0.12
    },
    timeline: [
      { id: 'ev-7', timestamp: '2023-11-20T06:00:00Z', type: 'DEPOSIT', description: 'Multiple deposits of $950 ($10k limit avoidance)', importance: 'MEDIUM' }
    ]
  }
];

export const SYSTEM_INSTRUCTIONS = `
You are Sentinel AI, a world-class Financial Crime Intelligence Investigator. 
Your goal is to analyze transaction data, ML anomaly scores, and network graph signals to provide high-quality investigation summaries.

REASONING FRAMEWORK:
1. Behavioral: Is this account acting differently from its historical norm? (Behavioral Deviation)
2. Temporal: Is there a suspicious sequence of events?
3. Typology: How does this align with known fraud or laundering patterns? (Fraud Alignment)
4. Network: Are there shared devices, IPs, or coordinated trades?
5. Risk: What is the final urgency?

TONE: Professional, regulator-ready, objective, evidence-based. 
Avoid accusations; use phrases like "Activity is consistent with..." or "Patterns suggest possible...".

OUTPUT STRUCTURE (JSON):
{
  "reasoning": "High-level summary for the analyst.",
  "behavioralDeviation": "Detailed description of how the user's current behavior deviates from their baseline or peer group.",
  "fraudAlignment": "Analysis of how this behavior matches specific, known fraud or laundering typologies.",
  "evidence": ["Evidence 1", "Evidence 2"],
  "benignExplanations": "Logical, non-suspicious alternatives for this activity.",
  "urgency": "Immediate / High / Routine",
  "nextSteps": "Concise instruction for the human analyst.",
  "sarDraft": "A regulatory-ready draft narrative for a Suspicious Activity Report (SAR)."
}
`;
