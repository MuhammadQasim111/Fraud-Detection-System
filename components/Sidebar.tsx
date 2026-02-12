
import React from 'react';

interface SidebarProps {
  activeView: 'DASHBOARD' | 'NETWORK';
  setView: (view: 'DASHBOARD' | 'NETWORK') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView }) => {
  return (
    <nav className="w-20 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-6 gap-8 z-20">
      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
      </div>
      
      <div className="flex flex-col gap-4 mt-8 flex-1">
        <button 
          onClick={() => setView('DASHBOARD')}
          className={`p-3 rounded-xl transition-all ${activeView === 'DASHBOARD' ? 'bg-gray-800 text-indigo-400' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
        </button>
        <button 
          onClick={() => setView('NETWORK')}
          className={`p-3 rounded-xl transition-all ${activeView === 'NETWORK' ? 'bg-gray-800 text-indigo-400' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>
        </button>
      </div>

      <div className="mt-auto flex flex-col gap-4">
        <button className="p-3 text-gray-500 hover:text-gray-300 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-xs font-bold text-gray-400">
          JD
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
