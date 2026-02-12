
import Groq from "groq-sdk";
import { Alert } from "../types";
import { SYSTEM_INSTRUCTIONS } from "../constants";

// Initialize Groq client
// Note: dangerouslyAllowBrowser: true is required for client-side usage.
// In production, API calls should be routed through a backend to secure the API key.
const groq = new Groq({
  apiKey: process.env.API_KEY || process.env.GROK_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface AnalysisResponse {
  data: any | null;
  error: string | null;
  isQuotaExceeded: boolean;
}

export async function analyzeAlert(alert: Alert): Promise<AnalysisResponse> {
  const prompt = `
    Analyze the following financial alert and provide a regulator-ready investigation briefing.
    
    Alert ID: ${alert.id}
    User: ${alert.username} (ID: ${alert.userId})
    Risk Level: ${alert.riskLevel}
    Risk Score (Confidence): ${alert.riskScore}
    Category: ${alert.category}
    Status: ${alert.status}
    
    ML SIGNALS:
    - Behavioral Anomaly Score: ${alert.signals.behavioralScore}
    - Sequence/Temporal Score: ${alert.signals.temporalScore}
    - Network Linkage Score: ${alert.signals.networkScore}
    
    TIMELINE:
    ${alert.timeline.map(e => `[${e.timestamp}] ${e.type}: ${e.description} (Importance: ${e.importance})`).join('\n')}
    
    REQUIREMENT: Provide a deep analysis of behavioral deviation and alignment with known fraud typologies. 
    Specifically, explain the network linkage signals and how they suggest coordinated activity.
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_INSTRUCTIONS + "\n\nIMPORTANT: Return ONLY valid JSON. No markdown formatting, no backticks."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: process.env.MODEL || "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
      temperature: 0.1 // Lower temperature for more consistent JSON output
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) throw new Error("Empty response from AI");

    return {
      data: JSON.parse(text),
      error: null,
      isQuotaExceeded: false
    };
  } catch (error: any) {
    console.error("Groq analysis failed:", error);
    const isQuota = error?.status === 429 || error?.message?.includes("429") || error?.type === 'rate_limit_exceeded';
    return {
      data: null,
      error: error?.message || "Internal Intelligence Error",
      isQuotaExceeded: isQuota
    };
  }
}

// Audio generation is not supported directly by Groq text models.
// Returning null to disable the feature gracefully in the UI.
export async function generateAudioBriefing(text: string) {
  console.warn("Audio briefing generation is currently disabled for Groq models.");
  return null;
}

export function decodeBase64Audio(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
