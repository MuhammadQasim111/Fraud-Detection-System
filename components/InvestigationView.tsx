
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Alert, Transaction } from '../types';
import { analyzeAlert, generateAudioBriefing, decodeBase64Audio, decodeAudioData } from '../services/grokService';
import SARDraftView from './SARDraftView';

interface InvestigationViewProps {
  alert: Alert;
}

const InvestigationView: React.FC<InvestigationViewProps> = ({ alert }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; isQuota: boolean } | null>(null);
  const [showSAR, setShowSAR] = useState(false);
  const [isBriefingPlaying, setIsBriefingPlaying] = useState(false);
  const [isTxDetailsOpen, setIsTxDetailsOpen] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Mock fetching 5 most recent transactions for the alert
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  const performAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    const result = await analyzeAlert(alert);

    if (result.error) {
      setError({ message: result.error, isQuota: result.isQuotaExceeded });
    } else {
      setAnalysis(result.data);
    }
    setLoading(false);
  }, [alert]);

  useEffect(() => {
    performAnalysis();

    // Mock "fetching" transactions
    const mockTxs: Transaction[] = [
      { id: 'TX-001', type: 'DEPOSIT', amount: 5000, currency: 'USD', timestamp: new Date().toISOString(), status: 'COMPLETED', metadata: { ip: '1.1.1.1', device: 'iPhone', location: 'SG' } },
      { id: 'TX-002', type: 'TRADE', amount: 450, currency: 'BTC', timestamp: new Date().toISOString(), status: 'COMPLETED', metadata: { ip: '1.1.1.1', device: 'iPhone', location: 'SG' } },
      { id: 'TX-003', type: 'TRADE', amount: 449, currency: 'BTC', timestamp: new Date().toISOString(), status: 'COMPLETED', metadata: { ip: '1.1.1.1', device: 'iPhone', location: 'SG' } },
      { id: 'TX-004', type: 'WITHDRAWAL', amount: 4990, currency: 'USD', timestamp: new Date().toISOString(), status: 'PENDING', metadata: { ip: '1.1.1.1', device: 'iPhone', location: 'SG' } },
      { id: 'TX-005', type: 'TRANSFER', amount: 120, currency: 'ETH', timestamp: new Date().toISOString(), status: 'COMPLETED', metadata: { ip: '1.1.1.1', device: 'iPhone', location: 'SG' } },
    ];
    setRecentTransactions(mockTxs);

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [alert.id, performAnalysis]);

  const handleSyntheticFallback = () => {
    setLoading(true);
    setError(null);

    // Simulate a high-quality analysis based on alert typology
    setTimeout(() => {
      const syntheticData = {
        reasoning: `[SYNTHETIC ANALYSIS] This alert for ${alert.username} exhibits high-correlation signals typical of ${alert.category}. The behavioral deviation is significant (Score: ${alert.signals.behavioralScore}), characterized by a rapid shift from dormancy to high-velocity transfers.`,
        behavioralDeviation: "Subject demonstrated a 400% increase in transaction frequency compared to the trailing 30-day baseline, primarily localized to sub-threshold crypto-rail deposits.",
        fraudAlignment: `The identified patterns strongly align with ${alert.category} typologies, specifically involving rapid layering through internal transfers to known high-risk counterparties.`,
        networkAnalysis: {
          summary: "Synthetic graph analysis identifies a potential coordinated hub via shared hardware IDs.",
          signals: [
            { type: "Device Correlation", detail: "Shared fingerprint with 2 previously blacklisted accounts.", relevance: "High" },
            { type: "IP Proximity", detail: "Transactions originating from a high-risk VPN exit node.", relevance: "Medium" }
          ]
        },
        evidence: ["Sudden velocity spike", "High-risk counterparty linkage", "Device fingerprint match"],
        benignExplanations: "Legitimate inheritance or large asset liquidation, though unlikely given the layering patterns.",
        urgency: alert.riskScore > 80 ? "Immediate" : "High",
        nextSteps: "Freeze withdrawal capabilities and request source of funds (SoF) documentation.",
        sarDraft: "The subject has engaged in a series of suspicious transfers consistent with money laundering typologies..."
      };
      setAnalysis(syntheticData);
      setLoading(false);
    }, 1500);
  };

  const handlePlayBriefing = async () => {
    if (!analysis || isBriefingPlaying) return;

    setIsBriefingPlaying(true);
    const base64Audio = await generateAudioBriefing(analysis.reasoning);

    if (base64Audio) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const audioData = decodeBase64Audio(base64Audio);
      const buffer = await decodeAudioData(audioData, audioContextRef.current, 24000, 1);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsBriefingPlaying(false);
      source.start();
    } else {
      setIsBriefingPlaying(false);
    }
  };

  if (showSAR && analysis) {
    return <SARDraftView alert={alert} analysis={analysis} onBack={() => setShowSAR(false)} />;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      {/* Investigation Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-widest ${alert.riskLevel === 'CRITICAL' ? 'bg-red-950/40 text-red-500 border-red-900/30' : 'bg-orange-950/40 text-orange-500 border-orange-900/30'}`}>
              Priority Level: {alert.riskLevel}
            </span>
            <span className="text-gray-500 text-xs font-mono">CASE_{alert.id}</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white mb-1">{alert.username}</h2>
          <p className="text-gray-400 text-sm">Suspected Typology: <span className="text-indigo-400 font-bold">{alert.category}</span></p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePlayBriefing}
            disabled={!analysis || isBriefingPlaying}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-indigo-400 rounded-xl text-sm font-semibold border border-gray-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isBriefingPlaying ? (
              <div className="flex gap-1 items-center h-4">
                <div className="w-0.5 h-3 bg-indigo-500 animate-pulse"></div>
                <div className="w-0.5 h-4 bg-indigo-500 animate-pulse delay-75"></div>
                <div className="w-0.5 h-2 bg-indigo-500 animate-pulse delay-150"></div>
              </div>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path></svg>
            )}
            AI Briefing
          </button>
          <button
            onClick={() => setShowSAR(true)}
            disabled={!analysis}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            Confirm & Draft SAR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Column: Timeline & Analysis */}
        <div className="col-span-2 space-y-8">
          {/* AI Intelligence Panel */}
          <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wider">Reasoning Engine v4.0</h3>
                  <div className="text-[10px] text-gray-500 font-mono">CONFIDENCE_SCORE: {alert.riskScore}%</div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 animate-pulse"></div>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-300 font-semibold">Synthesizing Temporal Signatures...</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Cross-referencing global fraud databases</p>
                </div>
              </div>
            ) : error ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-6 bg-amber-950/10 rounded-2xl border border-amber-900/20 px-6">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <div className="text-center">
                  <h4 className="text-amber-500 font-bold mb-2">AI Intelligence Layer Throttled</h4>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                    {error.isQuota
                      ? "System throughput has exceeded current API quota limits. Live generative reasoning is temporarily unavailable."
                      : `An unexpected intelligence error occurred: ${error.message}`}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={performAnalysis}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest border border-gray-700 transition-all"
                  >
                    Re-attempt Live Analysis
                  </button>
                  <button
                    onClick={handleSyntheticFallback}
                    className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-indigo-500/30 transition-all"
                  >
                    Run Synthetic Fallback
                  </button>
                </div>
              </div>
            ) : analysis ? (
              <div className="space-y-8 animate-in fade-in duration-700">
                {/* Regulator Friendly Narrative */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Investigation Summary</h4>
                  <p className="text-gray-200 text-sm leading-relaxed font-medium">
                    {analysis.reasoning}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Behavioral Deviation */}
                  <div className="p-5 rounded-2xl bg-gray-950 border border-gray-800 space-y-3">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      Behavioral Deviation
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed italic">
                      {analysis.behavioralDeviation}
                    </p>
                  </div>
                  {/* Fraud Typology Alignment */}
                  <div className="p-5 rounded-2xl bg-gray-950 border border-gray-800 space-y-3">
                    <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      Typology Alignment
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed italic">
                      {analysis.fraudAlignment}
                    </p>
                  </div>
                </div>

                {/* Evidence Chips */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Supporting Evidence</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.evidence.map((e: string, i: number) => (
                      <div key={i} className="px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700 text-[11px] text-gray-300 flex items-center gap-2">
                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path></svg>
                        {e}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation Block */}
                <div className="pt-6 border-t border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-[9px] font-bold text-gray-600 uppercase mb-1">Risk Intensity</div>
                      <div className={`text-xs font-black px-3 py-1 rounded-full ${analysis.urgency === 'Immediate' ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-500 text-white'}`}>
                        {analysis.urgency.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-bold text-gray-600 uppercase mb-1">Recommended Response</div>
                    <div className="text-sm text-indigo-400 font-bold underline decoration-indigo-500/30 underline-offset-4">{analysis.nextSteps}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500 text-sm italic">Initializing signal processing pipeline...</div>
            )}
          </div>

          {/* Chronological Timeline */}
          <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800">
            <h3 className="text-sm font-bold text-gray-100 mb-8 flex items-center gap-2 uppercase tracking-widest">
              Event Chain Re-construction
            </h3>
            <div className="relative space-y-12 before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-800">
              {alert.timeline.map((event, idx) => (
                <div key={event.id} className="relative flex items-start gap-8 group">
                  <div className={`mt-1 flex-shrink-0 w-9 h-9 rounded-xl border-2 border-gray-950 z-10 flex items-center justify-center transition-all group-hover:scale-110 shadow-lg ${event.importance === 'CRITICAL' ? 'bg-red-600 text-white ring-4 ring-red-600/10' : event.importance === 'HIGH' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                    {event.type === 'LOGIN' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>}
                    {event.type === 'DEPOSIT' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>}
                    {event.type === 'TRADE' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>}
                    {event.type === 'WITHDRAWAL' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20V4m0 16l-4-4m4 4l4-4"></path></svg>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <time className="text-[10px] font-mono text-gray-500">{new Date(event.timestamp).toLocaleString()}</time>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${event.importance === 'CRITICAL' ? 'text-red-500' : 'text-gray-600'}`}>{event.importance}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-200">{event.type}</h4>
                    <p className="text-sm text-gray-400 mt-1 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          {/* Risk Attribution Scoreboard */}
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Risk Factor Attribution</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2 font-bold uppercase tracking-tight">
                  <span className="text-indigo-400">Behavioral Anomaly</span>
                  <span className="text-gray-100">{(alert.signals.behavioralScore * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-950 rounded-full border border-gray-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${alert.signals.behavioralScore * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2 font-bold uppercase tracking-tight">
                  <span className="text-purple-400">Temporal Sequence</span>
                  <span className="text-gray-100">{(alert.signals.temporalScore * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-950 rounded-full border border-gray-800 overflow-hidden">
                  <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${alert.signals.temporalScore * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2 font-bold uppercase tracking-tight">
                  <span className="text-orange-400">Network Topology</span>
                  <span className="text-gray-100">{(alert.signals.networkScore * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-950 rounded-full border border-gray-800 overflow-hidden">
                  <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${alert.signals.networkScore * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Network Linkage Intelligence Section */}
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </div>
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              Network Linkage Insight
            </h3>

            {loading ? (
              <div className="space-y-3">
                <div className="h-3 w-3/4 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-2 w-full bg-gray-800 rounded animate-pulse"></div>
                <div className="h-2 w-5/6 bg-gray-800 rounded animate-pulse"></div>
              </div>
            ) : analysis?.networkAnalysis ? (
              <div className="space-y-4">
                <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                  {analysis.networkAnalysis.summary}
                </p>

                <div className="space-y-2">
                  {analysis.networkAnalysis.signals.map((sig: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-950 rounded-xl border border-gray-800/50 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{sig.type}</span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${sig.relevance === 'High' ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-800 text-gray-500'}`}>
                          {sig.relevance}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-snug">{sig.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="p-2 bg-orange-950/10 border border-orange-500/10 rounded text-[9px] text-orange-400/80 italic">
                  Coordinated activity detected via GraphSAGE subgraph matching.
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-gray-600 italic">Analysis unavailable.</p>
            )}
          </div>

          {/* Transaction Details Collapsible Section */}
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800">
            <button
              onClick={() => setIsTxDetailsOpen(!isTxDetailsOpen)}
              className="w-full flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest focus:outline-none"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                Transaction Details
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isTxDetailsOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {isTxDetailsOpen && (
              <div className="mt-4 overflow-x-auto animate-in slide-in-from-top-2 duration-300">
                <table className="w-full text-[10px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500 uppercase font-black">
                      <th className="py-2 pr-2">Type</th>
                      <th className="py-2 pr-2">Amount</th>
                      <th className="py-2 pr-2">Cur</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400">
                    {recentTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors">
                        <td className="py-2 pr-2 font-bold">{tx.type}</td>
                        <td className="py-2 pr-2">{tx.amount.toLocaleString()}</td>
                        <td className="py-2 pr-2">{tx.currency}</td>
                        <td className={`py-2 font-mono ${tx.status === 'BLOCKED' ? 'text-red-500' : tx.status === 'PENDING' ? 'text-amber-500' : 'text-green-500'}`}>
                          {tx.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Investigator Toolkit</h3>
            <div className="space-y-3">
              <button className="w-full p-3 rounded-xl bg-gray-950 border border-gray-800 hover:border-gray-600 text-xs text-gray-400 hover:text-white transition-all text-left flex items-center justify-between group">
                <span>View Full Transaction Set</span>
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
              <button className="w-full p-3 rounded-xl bg-gray-950 border border-gray-800 hover:border-gray-600 text-xs text-gray-400 hover:text-white transition-all text-left flex items-center justify-between group">
                <span>Linked KYC Documents</span>
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
              <button className="w-full p-3 rounded-xl bg-gray-950 border border-gray-800 hover:border-gray-600 text-xs text-gray-400 hover:text-white transition-all text-left flex items-center justify-between group">
                <span>External Chain Analysis</span>
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-red-900/5 border border-red-900/20">
            <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4">Emergency Protocol</h3>
            <button className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/10 transition-all">
              Block All Withdrawals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationView;
