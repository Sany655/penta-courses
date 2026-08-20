import React from 'react';
import './globals.css';
import Providers from '../components/Providers';
import NavigationBar from '../components/NavigationBar';
import { ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Pentabrid Engine',
  description: 'The Official Next-Gen Technical eLearning Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#05070a] text-slate-100 flex flex-col font-sans transition-colors antialiased">
        <Providers>
          <NavigationBar />
          <div className="flex-1">
            {children}
          </div>
          <footer className="py-10 bg-[#030508] border-t border-slate-900 text-xs font-mono text-slate-400 transition-colors">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <span className="font-bold text-white">Pentabrid Engine</span>
                <span className="hidden sm:inline text-slate-600">&bull;</span>
                <span>An Official Education Platform of <a href="https://pentabrid.com/" target="_blank" rel="noreferrer" className="text-emerald-400 font-bold hover:underline">Pentabrid</a></span>
              </div>
              <div className="flex items-center space-x-6 font-medium">
                <a href="/#faq" className="hover:text-emerald-400 transition">FAQ</a>
                <a href="/#contact" className="hover:text-emerald-400 transition">Advisory</a>
                <a href="https://pentabrid.com/" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition flex items-center gap-1">
                  <span>pentabrid.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-emerald-400 font-bold">● 4 Nodes Online</span>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
