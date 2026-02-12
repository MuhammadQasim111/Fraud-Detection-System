
import React, { useMemo } from 'react';
import { Alert, RiskLevel, FraudCategory } from '../types';

interface AlertStreamProps {
  alerts: Alert[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  filterText: string;
  setFilterText: (t: string) => void;
  minRisk: number;
  setMinRisk: (r: number) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
}

const AlertStream: React.FC<AlertStreamProps> = ({ 
  alerts, 
  selectedId, 
  onSelect,
  filterText,
  setFilterText,
  minRisk,
  setMinRisk,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter
}) => {
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const searchTerms = filterText.toLowerCase();
      const matchesSearch = 
        alert.username.toLowerCase().includes(searchTerms) || 
        alert.id.toLowerCase().includes(searchTerms) ||
        alert.originExplanation.toLowerCase().includes(searchTerms);
      
      const matchesRisk = alert.riskScore >= minRisk;
      const matchesCategory = categoryFilter === 'ALL' || alert.category === categoryFilter;
      const matchesStatus = statusFilter === 'ALL' || alert.status === statusFilter;
      
      return matchesSearch && matchesRisk && matchesCategory && matchesStatus;
    });
  }, [alerts, filterText, minRisk, categoryFilter, statusFilter]);

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.CRITICAL: return 'bg-red-500';
      case RiskLevel.HIGH: return 'bg-orange-500';
      case RiskLevel.MEDIUM: return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FLAGGED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'BLOCKED': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'MONITORING': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'RESOLVED_SUSPICIOUS': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'RESOLVED_BENIGN': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Filtering Header - Stays at top of the queue component */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-950/95 backdrop-blur-md sticky top-0 z-30 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Intelligent Priority Queue</h2>
          <span className="text-[10px] text-indigo-400 font-mono font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            {filteredAlerts.length} ACTIVE
          </span>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search user, ID or pattern..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-indigo-500 transition-colors text-gray-100 placeholder:text-gray-600"
            />
            <svg className="absolute right-3 top-2 w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2"></path></svg>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-[10px] text-gray-400 focus:outline-none shrink-0"
            >
              <option value="ALL">All Categories</option>
              {Object.values(FraudCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-[10px] text-gray-400 focus:outline-none shrink-0"
            >
              <option value="ALL">All Statuses</option>
              <option value="MONITORING">Monitoring</option>
              <option value="FLAGGED">Flagged</option>
              <option value="BLOCKED">Blocked</option>
              <option value="RESOLVED_SUSPICIOUS">Resolved (Suspicious)</option>
              <option value="RESOLVED_BENIGN">Resolved (Benign)</option>
            </select>
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded px-2 py-1 shrink-0">
              <span className="text-[10px] text-gray-500">Risk &gt; {minRisk}%</span>
              <input 
                type="range" min="0" max="100" step="10" 
                value={minRisk} 
                onChange={(e) => setMinRisk(Number(e.target.value))}
                className="w-16 accent-indigo-500 h-1"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Alert Cards Container */}
      <div className="flex-1 overflow-y-auto custom-scroll">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center text-gray-600 text-xs italic">No alerts matching current filters.</div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => onSelect(alert.id)}
              className={`w-full text-left p-6 border-b border-gray-800/50 cursor-pointer transition-all relative overflow-hidden group active:scale-[0.98] z-10 ${selectedId === alert.id ? 'bg-indigo-900/10' : 'hover:bg-gray-900'}`}
            >
              {selectedId === alert.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-20"></div>
              )}
              
              <div className="flex items-start justify-between mb-4 pointer-events-none">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-gray-500">{alert.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${getStatusColor(alert.status)}`}>
                      {alert.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="font-bold text-gray-100 text-sm tracking-tight">{alert.username}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-bold mono ${alert.riskScore > 80 ? 'text-red-400' : 'text-gray-400'}`}>
                    {alert.riskScore}%
                  </span>
                  <span className="text-[8px] uppercase text-gray-600 font-bold tracking-tighter">AI Confidence</span>
                </div>
              </div>

              <div className="mb-4 pointer-events-none">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">
                  <span>{alert.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getRiskColor(alert.riskLevel)} transition-all duration-1000`} 
                      style={{ width: `${alert.riskScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-950/50 rounded-lg border border-gray-800 group-hover:border-gray-700 transition-colors pointer-events-none">
                <p className="text-[11px] text-gray-400 leading-relaxed italic">
                  "{alert.originExplanation}"
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between pointer-events-none">
                 <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" title="Behavioral"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500/40" title="Temporal"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500/40" title="Network"></div>
                 </div>
                 <span className="text-[10px] text-gray-600 font-mono">
                   {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertStream;
