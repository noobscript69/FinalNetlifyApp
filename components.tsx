
import React from 'react';
import { View } from './types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: View.WRITER, label: 'AI Writer', icon: '✍️' },
    { id: View.IMAGE_LAB, label: 'Image Lab', icon: '🎨' },
    { id: View.HISTORY, label: 'Archive', icon: '📁' },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl h-screen sticky top-0 flex flex-col p-6 hidden md:flex">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold">L</div>
        <span className="text-xl font-bold tracking-tight text-white">Lumina</span>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-slate-800 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
        <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Pro Plan</p>
        <p className="text-sm text-slate-300">Unlimited generations with Gemini 3</p>
      </div>
    </aside>
  );
};

export const Header: React.FC<{ title: string }> = ({ title }) => (
  <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
    <h1 className="text-xl font-semibold text-white">{title}</h1>
    <div className="flex items-center gap-4">
      <div className="h-8 w-8 rounded-full bg-slate-700 overflow-hidden ring-2 ring-indigo-500/20">
        <img src="https://picsum.photos/32/32" alt="Avatar" />
      </div>
    </div>
  </header>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className, 
  ...props 
}) => {
  const baseStyles = "px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200",
    danger: "bg-rose-600 hover:bg-rose-500 text-white",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
