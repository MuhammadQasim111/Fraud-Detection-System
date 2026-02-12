
import React, { useState, useEffect } from 'react';

const TX_TYPES = ['DEPOSIT', 'WITHDRAWAL', 'TRADE', 'TRANSFER'];
const CURRENCIES = ['USD', 'BTC', 'ETH', 'EUR'];

interface TransactionFeedProps {
  onNewEvent?: (riskScore: number) => void;
}

const TransactionFeed: React.FC<TransactionFeedProps> = ({ onNewEvent }) => {
  const [feed, setFeed] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate a random risk score for this event
      const riskScore = Math.floor(Math.random() * 101);
      const isFlagged = riskScore > 85;

      const newTx = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        type: TX_TYPES[Math.floor(Math.random() * TX_TYPES.length)],
        amount: (Math.random() * 5000).toFixed(2),
        currency: CURRENCIES[Math.floor(Math.random() * CURRENCIES.length)],
        timestamp: new Date().toLocaleTimeString(),
        riskScore,
        isFlagged
      };

      setFeed(prev => [newTx, ...prev].slice(0, 15));
      
      // Emit event to update global stats
      if (onNewEvent) {
        onNewEvent(riskScore);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [onNewEvent]);

  return (
    <div className="flex flex-col h-full bg-gray-950 border-t border-gray-800">
      <div className="px-6 py-3 border-b border-gray-800 flex items-center justify-between bg-gray-900/20">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          Real-time Ingestion Feed
        </span>
        <span className="text-[10px] text-gray-600 font-mono">Kafka-0 / Node-B</span>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto p-4 space-y-2">
          {feed.map((tx, idx) => (
            <div 
              key={tx.id} 
              className={`flex items-center justify-between p-2 rounded border text-[10px] mono transition-all duration-500 ${tx.isFlagged ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' : 'bg-gray-900/50 border-gray-800 text-gray-500 opacity-60'}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center gap-3">
                <span className="w-16 truncate">{tx.id}</span>
                <span className="w-16 font-bold">{tx.type}</span>
                <span className="w-20 text-right">{tx.amount} {tx.currency}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-bold ${tx.riskScore > 50 ? 'text-amber-500' : 'text-gray-600'}`}>R:{tx.riskScore}%</span>
                {tx.isFlagged && <span className="text-[8px] font-bold bg-red-500 text-white px-1 rounded">FLAGGED (L1)</span>}
                <span>{tx.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default TransactionFeed;
