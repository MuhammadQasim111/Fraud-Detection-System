
import React, { useEffect, useRef } from 'react';

// Using a simplified SVG visualization since D3 setup in a single file might be verbose
// but simulating the feel of a complex graph.

const NetworkGraph: React.FC = () => {
  return (
    <div className="flex-1 relative bg-[#020617] overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-800 bg-gray-900/40 backdrop-blur flex items-center justify-between z-10">
        <div>
          <h2 className="text-xl font-bold">Network Intelligence Visualizer</h2>
          <p className="text-sm text-gray-500">Identifying hidden fraud rings via behavioral clustering and GNNs</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded text-xs font-medium">Clustering: Louvain</div>
          <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded text-xs font-medium">Model: GraphSAGE</div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative w-full h-full max-w-4xl bg-gray-900/20 rounded-3xl border border-gray-800/50 flex items-center justify-center overflow-hidden">
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%">
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 w-full aspect-square max-w-2xl flex items-center justify-center">
             {/* Central Node */}
             <div className="absolute w-24 h-24 rounded-full bg-red-500/20 border-2 border-red-500 animate-pulse flex items-center justify-center shadow-2xl shadow-red-500/40">
                <div className="text-[10px] font-bold text-red-500 text-center uppercase tracking-tight">Main Cluster<br/>Target</div>
             </div>
             
             {/* Orbiting Nodes - Simulated with CSS */}
             {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute"
                  style={{
                    transform: `rotate(${i * 45}deg) translateX(180px)`
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 hover:border-indigo-500 hover:text-indigo-400 cursor-pointer transition-all hover:scale-110 shadow-lg">
                    {['USR', 'IP', 'DEV', 'CARD', 'USR', 'DEV', 'IP', 'USR'][i]}
                  </div>
                  {/* Connection Lines */}
                  <div 
                    className="absolute h-0.5 bg-gradient-to-r from-red-500/50 to-transparent right-full top-1/2 -translate-y-1/2" 
                    style={{ width: '100px', transformOrigin: 'right center' }}
                  ></div>
                </div>
             ))}

             {/* Outlier Clusters */}
             <div className="absolute top-10 left-10 p-4 rounded-xl bg-gray-900 border border-gray-800">
               <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Isolated Cluster</div>
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                 <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                 <div className="w-3 h-3 rounded-full bg-blue-500 opacity-50"></div>
               </div>
             </div>
          </div>

          {/* Floating UI Overlay */}
          <div className="absolute bottom-8 right-8 w-64 p-6 bg-gray-900/90 backdrop-blur rounded-2xl border border-gray-800 shadow-2xl z-20">
             <h4 className="text-xs font-bold text-gray-100 mb-4 uppercase tracking-widest">Fraud Ring Hypothesis</h4>
             <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
               Central node identified as multi-account coordinator. Links established via shared hardware fingerprints (DEV-X9) and 4 coordinating IP addresses.
             </p>
             <div className="space-y-2">
               <div className="flex items-center justify-between text-[10px]">
                 <span className="text-gray-500">Coordination Index</span>
                 <span className="text-red-400 font-bold">0.89</span>
               </div>
               <div className="w-full h-1 bg-gray-800 rounded-full">
                 <div className="w-[89%] h-full bg-red-500 rounded-full"></div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;
