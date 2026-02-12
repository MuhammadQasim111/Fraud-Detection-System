
import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';

interface StatsOverviewProps {
  distribution: any[];
  throughput: any[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-800 p-2 rounded shadow-xl">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{`Bucket: ${payload[0].payload.bucket}`}</p>
        <p className="text-xs font-mono font-bold text-white">{`Alerts: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const StatsOverview: React.FC<StatsOverviewProps> = ({ distribution, throughput }) => {
  const totalFiltered = useMemo(() => 
    distribution.reduce((acc, curr) => acc + curr.count, 0), 
    [distribution]
  );

  return (
    <div className="p-6 border-b border-gray-800 bg-gray-900/30 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Live Throughput</div>
          <div className="text-2xl font-bold mono">{(throughput[throughput.length - 1].value / 100).toFixed(1)}M <span className="text-xs text-green-500 font-normal ml-1">↑ 4%</span></div>
          <div className="h-8 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughput}>
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Alert Reduction</div>
          <div className="text-2xl font-bold mono">99.4% <span className="text-xs text-indigo-400 font-normal ml-1">AI Optimized</span></div>
          <div className="text-[10px] text-gray-500 mt-2">{totalFiltered * 4} raw triggers reduced to {totalFiltered} cases</div>
        </div>
      </div>

      {/* Dynamic Risk Distribution Chart - Connected to Ingestion Feed */}
      <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Risk Distribution Profile</h3>
          <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
             <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-tighter">Total Active: {totalFiltered}</span>
          </div>
        </div>
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="count" radius={[2, 2, 0, 0]} isAnimationActive={true} animationDuration={500}>
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Bar>
              <XAxis 
                dataKey="bucket" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fill: '#4b5563', fontWeight: 600 }} 
                interval={0}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1 flex items-center justify-between p-3 bg-red-950/20 border border-red-900/30 rounded-lg">
          <span className="text-xs text-red-400">Blocked High-Risk</span>
          <span className="text-lg font-bold text-red-500">24</span>
        </div>
        <div className="flex-1 flex items-center justify-between p-3 bg-amber-950/20 border border-amber-900/30 rounded-lg">
          <span className="text-xs text-amber-400">Awaiting Action</span>
          <span className="text-lg font-bold text-amber-500">12</span>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
