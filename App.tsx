
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import StatsOverview from './components/StatsOverview';
import AlertStream from './components/AlertStream';
import InvestigationView from './components/InvestigationView';
import NetworkGraph from './components/NetworkGraph';
import TransactionFeed from './components/TransactionFeed';
import { MOCK_ALERTS } from './constants';
import { Alert, RiskLevel, FraudCategory } from './types';

const INITIAL_DISTRIBUTION = [
  { bucket: '0-20', count: 124, color: '#3b82f6' },
  { bucket: '21-40', count: 86, color: '#6366f1' },
  { bucket: '41-60', count: 42, color: '#8b5cf6' },
  { bucket: '61-80', count: 28, color: '#f59e0b' },
  { bucket: '81-100', count: 12, color: '#ef4444' },
];

const INITIAL_THROUGHPUT = Array.from({ length: 7 }, () => ({ value: 400 + Math.random() * 600 }));

const App: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [view, setView] = useState<'DASHBOARD' | 'NETWORK'>('DASHBOARD');
  
  // Queue Filter State (Lifted for cross-component control)
  const [filterText, setFilterText] = useState('');
  const [minRisk, setMinRisk] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Shared Real-time States
  const [distribution, setDistribution] = useState(INITIAL_DISTRIBUTION);
  const [throughput, setThroughput] = useState(INITIAL_THROUGHPUT);

  const selectedAlert = useMemo(() => 
    alerts.find(a => a.id === selectedAlertId) || null,
    [alerts, selectedAlertId]
  );

  const handleAutoSelectPriority = () => {
    const priorityAlert = [...alerts]
      .filter(a => a.status !== 'RESOLVED_SUSPICIOUS' && a.status !== 'RESOLVED_BENIGN')
      .sort((a, b) => b.riskScore - a.riskScore)[0];
    
    if (priorityAlert) {
      setSelectedAlertId(priorityAlert.id);
    }
  };

  const setAnomalyFilter = () => {
    setFilterText('Anomaly');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
  };

  const setNetworkFilter = () => {
    setFilterText('Network');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
  };

  const handleNewTransaction = useCallback((riskScore: number) => {
    setThroughput(prev => {
      const lastValue = prev[prev.length - 1].value;
      const nextValue = Math.max(200, Math.min(1500, lastValue + (Math.random() * 100 - 50)));
      return [...prev.slice(1), { value: nextValue }];
    });

    setDistribution(prev => prev.map(item => {
      const [min, max] = item.bucket.split('-').map(Number);
      if (riskScore >= min && riskScore <= max) {
        return { ...item, count: item.count + 1 };
      }
      const decay = Math.random() > 0.7 ? 1 : 0;
      return { ...item, count: Math.max(0, item.count - decay) };
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDistribution(prev => prev.map(item => ({
        ...item,
        count: Math.max(0, item.count + (Math.floor(Math.random() * 3) - 1))
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-950 text-gray-100 overflow-hidden">
      <Sidebar activeView={view} setView={setView} />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">S</div>
               <h1 className="text-xl font-bold tracking-tight">Sentinel <span className="font-light text-gray-400">Intelligence</span></h1>
            </div>
            <div className="flex items-center gap-2 bg-green-950/30 border border-green-500/30 px-2 py-1 rounded text-[10px] text-green-400 font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              L1-L4 Analysis Active
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-gray-400">Compliance Mode: <span className="text-gray-100 font-medium italic">High Precision</span></div>
            <div className="w-px h-4 bg-gray-700"></div>
            <div className="font-mono text-[11px] text-gray-500 bg-gray-800/50 px-2 py-1 rounded border border-gray-700 uppercase">SYS_UPTIME: 99.999%</div>
          </div>
        </header>

        {view === 'DASHBOARD' ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Col: Queue and Stats */}
            <div className="w-1/3 min-w-[400px] border-r border-gray-800 flex flex-col h-full bg-gray-950 z-20 overflow-hidden">
              <StatsOverview distribution={distribution} throughput={throughput} />
              <div className="flex-1 relative overflow-hidden">
                <AlertStream 
                  alerts={alerts} 
                  selectedId={selectedAlertId} 
                  onSelect={setSelectedAlertId}
                  filterText={filterText}
                  setFilterText={setFilterText}
                  minRisk={minRisk}
                  setMinRisk={setMinRisk}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                />
              </div>
              <div className="h-48 shrink-0">
                <TransactionFeed onNewEvent={handleNewTransaction} />
              </div>
            </div>

            {/* Right Col: Detail / Investigation View */}
            <div className="flex-1 bg-gray-950 overflow-y-auto custom-scroll relative z-10">
              {selectedAlert ? (
                <InvestigationView alert={selectedAlert} />
              ) : (
                <div 
                  className="h-full flex flex-col items-center justify-center p-8 text-center"
                  style={{ background: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.1) 0%, transparent 70%)' }}
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full scale-150"></div>
                    <div className="w-24 h-24 border-2 border-dashed border-indigo-500/20 rounded-[2.5rem] flex items-center justify-center rotate-12 transition-all hover:rotate-0 hover:border-indigo-500/40 duration-500 relative z-10 bg-gray-900/50">
                      <svg className="w-12 h-12 text-indigo-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-100 tracking-tight">System Awaiting Dispatch</h3>
                  <p className="max-w-md mt-4 text-gray-400 text-sm leading-relaxed">
                    The intelligence layer has prioritized <span className="text-indigo-400 font-bold">{alerts.filter(a => a.riskLevel === RiskLevel.CRITICAL).length} Critical Cases</span>. 
                    Select an alert from the queue or use the auto-dispatch to begin deep reasoning analysis.
                  </p>

                  <div className="mt-10 flex flex-col items-center gap-6">
                    <button 
                      onClick={handleAutoSelectPriority}
                      className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all shadow-2xl shadow-indigo-600/30 flex items-center gap-3 overflow-hidden active:scale-95"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      AUTO-DISPATCH NEXT CASE
                    </button>

                    <div className="flex gap-4">
                      <button 
                        onClick={setAnomalyFilter}
                        className={`px-4 py-2 border rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all ${filterText === 'Anomaly' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-indigo-500/50 hover:text-indigo-400'}`}
                      >
                        Filter Anomaly (L1)
                      </button>
                      <button 
                        onClick={setNetworkFilter}
                        className={`px-4 py-2 border rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all ${filterText === 'Network' ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-purple-500/50 hover:text-purple-400'}`}
                      >
                        Filter Network (L3)
                      </button>
                    </div>
                  </div>

                  <div className="mt-16 grid grid-cols-3 gap-8 w-full max-w-2xl border-t border-gray-800 pt-10">
                    <div className="text-center">
                      <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Queue Health</div>
                      <div className="text-lg font-mono font-bold text-gray-300">OPTIMAL</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Inference Latency</div>
                      <div className="text-lg font-mono font-bold text-gray-300">42ms</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Signal Strength</div>
                      <div className="text-lg font-mono font-bold text-green-500">98.2%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <NetworkGraph />
        )}
      </main>
    </div>
  );
};

export default App;
