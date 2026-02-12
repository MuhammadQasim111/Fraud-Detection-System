
import React from 'react';
import { Alert } from '../types';

interface SARDraftViewProps {
  alert: Alert;
  analysis: any;
  onBack: () => void;
}

const SARDraftView: React.FC<SARDraftViewProps> = ({ alert, analysis, onBack }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300 pb-20">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Case Investigation
      </button>

      <div className="bg-white text-gray-900 rounded-none shadow-2xl p-16 min-h-[1000px] border-t-8 border-indigo-600 font-serif relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <div className="text-8xl font-black rotate-45 border-8 border-gray-900 p-8">CONFIDENTIAL</div>
        </div>

        <div className="flex justify-between items-start border-b-2 border-gray-100 pb-10 mb-10">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-indigo-950">Sentinel STR-Draft</h1>
            <p className="text-xs font-sans font-black text-indigo-600 mt-2 tracking-widest uppercase italic">Regulator Ready - AI Assisted Investigation Output</p>
          </div>
          <div className="text-right font-sans">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Internal Ref</div>
            <div className="text-lg font-black text-gray-800">SAR-{alert.id}-{new Date().getFullYear()}</div>
          </div>
        </div>

        <div className="space-y-12 relative z-10">
          <section>
            <h2 className="text-xs font-black font-sans text-gray-400 uppercase tracking-[0.2em] mb-4">I. Subject Intelligence</h2>
            <div className="grid grid-cols-2 gap-px bg-gray-200 border border-gray-200 font-sans text-sm">
              <div className="p-4 bg-white">
                <div className="text-gray-400 font-bold text-[9px] uppercase mb-1">Subject Account</div>
                <div className="font-black text-indigo-950">{alert.username}</div>
              </div>
              <div className="p-4 bg-white">
                <div className="text-gray-400 font-bold text-[9px] uppercase mb-1">System Identifier</div>
                <div className="font-black text-indigo-950">{alert.userId}</div>
              </div>
              <div className="p-4 bg-white">
                <div className="text-gray-400 font-bold text-[9px] uppercase mb-1">Primary Typology</div>
                <div className="font-black text-indigo-950">{alert.category}</div>
              </div>
              <div className="p-4 bg-white">
                <div className="text-gray-400 font-bold text-[9px] uppercase mb-1">Confidence Score</div>
                <div className="font-black text-indigo-950">{alert.riskScore}% Match</div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black font-sans text-gray-400 uppercase tracking-[0.2em] mb-4">II. Suspicious Activity Narrative</h2>
            <div className="text-lg leading-relaxed text-gray-900 space-y-6">
              <p>{analysis.sarDraft}</p>
            </div>
          </section>

          <section>
             <h2 className="text-xs font-black font-sans text-gray-400 uppercase tracking-[0.2em] mb-4">III. Detailed Risk Rationale</h2>
             <div className="grid grid-cols-1 gap-6">
                <div className="p-6 bg-gray-50 border-l-4 border-indigo-200">
                  <h3 className="text-[10px] font-black font-sans uppercase text-indigo-800 mb-2">Behavioral Baseline Deviation</h3>
                  <p className="text-sm leading-relaxed text-gray-700">{analysis.behavioralDeviation}</p>
                </div>
                <div className="p-6 bg-gray-50 border-l-4 border-purple-200">
                  <h3 className="text-[10px] font-black font-sans uppercase text-purple-800 mb-2">Alignment with AML/CTF Typologies</h3>
                  <p className="text-sm leading-relaxed text-gray-700">{analysis.fraudAlignment}</p>
                </div>
             </div>
          </section>

          <section>
            <h2 className="text-xs font-black font-sans text-gray-400 uppercase tracking-[0.2em] mb-4">IV. Network Linkage Intelligence</h2>
            <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
              <p className="text-sm font-sans text-gray-700 mb-6 leading-relaxed">
                {analysis.networkAnalysis?.summary || "Direct network correlations and device-level associations suggest coordinated activity with multiple external actors."}
              </p>
              <div className="space-y-4">
                {analysis.networkAnalysis?.signals?.map((sig: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-24 shrink-0">
                       <span className={`text-[9px] font-black font-sans uppercase px-2 py-0.5 rounded ${sig.relevance === 'High' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                         {sig.relevance} Priority
                       </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-black font-sans uppercase text-gray-900 mb-1">{sig.type}</h4>
                      <p className="text-xs text-gray-600 font-sans italic">"{sig.detail}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black font-sans text-gray-400 uppercase tracking-[0.2em] mb-4">V. Evidence Re-construction</h2>
            <table className="w-full text-left font-sans text-[11px] border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="py-2 px-2 uppercase tracking-widest font-black">Date/Time (UTC)</th>
                  <th className="py-2 px-2 uppercase tracking-widest font-black">Type</th>
                  <th className="py-2 px-2 uppercase tracking-widest font-black">Rationale/Description</th>
                </tr>
              </thead>
              <tbody>
                {alert.timeline.map((event, i) => (
                  <tr key={i} className="border-b border-gray-100 group">
                    <td className="py-3 px-2 font-mono whitespace-nowrap">{new Date(event.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-2 font-black">{event.type}</td>
                    <td className="py-3 px-2 text-gray-600 leading-normal">{event.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-xs font-black font-sans text-gray-400 uppercase tracking-[0.2em] mb-4">VI. Benign Explanations</h2>
            <div className="p-6 bg-amber-50 border-l-4 border-amber-200">
               <p className="text-sm leading-relaxed text-gray-700 italic">
                 {analysis.benignExplanations || "No significant benign explanations identified that adequately account for the identified risk signatures."}
               </p>
            </div>
          </section>

          <section className="pt-10 border-t border-gray-100">
             <div className="flex gap-10">
                <div className="flex-1">
                   <h3 className="text-[9px] font-black font-sans uppercase text-gray-400 mb-2">Intelligence Synthesis Summary</h3>
                   <p className="text-xs italic text-gray-500 leading-relaxed">{analysis.reasoning}</p>
                </div>
                <div className="w-48 text-center border-t border-gray-200 pt-2 font-sans">
                  <div className="text-[9px] text-gray-400 uppercase font-black">Compliance Officer</div>
                  <div className="h-8"></div>
                  <div className="text-[10px] italic border-t border-gray-100 pt-1">Authorized Digitally</div>
                </div>
             </div>
          </section>
        </div>

        <div className="mt-32 pt-8 border-t border-gray-200 flex justify-between items-center text-[9px] font-sans font-bold text-gray-300 uppercase tracking-[0.3em]">
          <div>Generated by Sentinel Intelligence L4 Orchestration - V-3.0.4-PROD</div>
          <div>INTERNAL USE ONLY - Page 01</div>
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-6">
         <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center gap-3 shadow-xl border border-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Export as Reg-PDF
         </button>
         <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-500 shadow-2xl shadow-indigo-600/30 transition-all uppercase tracking-widest scale-105">
            File Report with Regulator
         </button>
      </div>
    </div>
  );
};

export default SARDraftView;
