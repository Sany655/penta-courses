import React, { useState } from 'react';
import { 
  Shield, Sparkles, LayoutDashboard, Settings, Lock, 
  FileCode2, Smartphone, CreditCard, Trash2, CheckCircle2, 
  Search, ExternalLink, RefreshCw 
} from 'lucide-react';
import LessonBuilder from '../components/admin/LessonBuilder';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('lesson-builder');
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // If not admin, redirect to auth
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/auth');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#05070a] pt-16 flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-[#090d16] hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI Admin Studio</span>
          </div>
          <p className="text-slate-500 text-xs font-mono mt-1">Platform Control Node</p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          <button
            onClick={() => setActiveTab('lesson-builder')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'lesson-builder'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            Lesson Builder
          </button>
          
          <button
            onClick={() => setActiveTab('site-settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'site-settings'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Site Settings
          </button>

          <button
            onClick={() => setActiveTab('bkash-payments')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'bkash-payments'
                ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            bKash & Payments
          </button>

          <button
            onClick={() => setActiveTab('security-settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'security-settings'
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Shield className="w-4 h-4" />
            Security & Auth
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-[#05070a]">
        {activeTab === 'lesson-builder' && <LessonBuilder />}
        {activeTab === 'site-settings' && <SiteSettings />}
        {activeTab === 'bkash-payments' && <BkashPaymentSettings />}
        {activeTab === 'security-settings' && <SecuritySettings />}
      </main>
    </div>
  );
};

const BkashPaymentSettings = () => {
  const { bkashSettings, updateBkashSettings, transactions, deleteTransaction } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState(bkashSettings?.phoneNumber || '01712-345678');
  const [accountType, setAccountType] = useState(bkashSettings?.accountType || 'Personal');
  const [defaultFeeBdt, setDefaultFeeBdt] = useState(bkashSettings?.defaultFeeBdt || '250');
  const [instructions, setInstructions] = useState(bkashSettings?.instructions || 'Send Money to the bKash number below with your email as Reference, then submit your Transaction ID (TrxID) to unlock access.');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    updateBkashSettings({
      phoneNumber,
      accountType,
      defaultFeeBdt,
      instructions
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filteredTxns = transactions.filter(t => 
    t.trxId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.itemTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#e2136e] flex items-center justify-center text-white font-bold text-sm">
              ৳
            </div>
            bKash Payment Gateway & Ledger
          </h2>
          <p className="text-slate-400 text-sm mt-1">Configure student payment numbers, fee structure, and inspect verified transaction records.</p>
        </div>
      </div>

      {/* Configuration Section */}
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Gateway Configuration</h3>
          <p className="text-slate-400 text-xs font-mono">Changes reflect immediately in the student checkout modal across all courses.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-300">
                bKash Wallet Number <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="e.g. 01712-345678"
                className="w-full bg-[#05070a] border border-slate-800 rounded-xl p-3 text-slate-200 text-sm font-mono focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-300">
                Account Type <span className="text-pink-400">*</span>
              </label>
              <select
                value={accountType}
                onChange={e => setAccountType(e.target.value)}
                className="w-full bg-[#05070a] border border-slate-800 rounded-xl p-3 text-slate-200 text-sm font-mono focus:border-pink-500 focus:outline-none"
              >
                <option value="Personal">Personal (Send Money)</option>
                <option value="Merchant">Merchant (Make Payment)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-300">
                Default Instant Bypass Fee (BDT) <span className="text-pink-400">*</span>
              </label>
              <input
                type="number"
                required
                value={defaultFeeBdt}
                onChange={e => setDefaultFeeBdt(e.target.value)}
                placeholder="250"
                className="w-full bg-[#05070a] border border-slate-800 rounded-xl p-3 text-slate-200 text-sm font-mono focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-mono text-slate-300">
              Payment Instructions for Students
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              className="w-full bg-[#05070a] border border-slate-800 rounded-xl p-3 text-slate-200 text-sm focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#e2136e] to-pink-600 hover:from-[#d01063] hover:to-pink-500 text-white font-bold rounded-xl text-sm transition shadow-[0_0_20px_rgba(226,19,110,0.3)] flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Save bKash Settings</span>
            </button>

            {saveSuccess && (
              <span className="text-emerald-400 text-xs font-mono flex items-center gap-1.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Settings updated and broadcasted live!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Transaction Audit Ledger</h3>
            <p className="text-slate-400 text-xs font-mono">
              Total Recorded Transactions: <span className="text-pink-400 font-bold">{transactions.length}</span>
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search TrxID, email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#05070a] border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-pink-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {filteredTxns.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-xl">
            No transactions found matching your filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#05070a] text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Access Granted</th>
                  <th className="py-3 px-4">TrxID / Sender</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredTxns.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {txn.timestamp}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-200">{txn.studentName}</div>
                      <div className="text-slate-500 text-[10px]">{txn.studentEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium max-w-[200px] truncate">
                      {txn.itemTitle}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="inline-block px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/30 text-pink-400 font-bold text-[11px]">
                        {txn.trxId}
                      </div>
                      <div className="text-slate-500 text-[10px] mt-0.5">Sender: {txn.senderPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold whitespace-nowrap">
                      {txn.amount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                        {txn.status || 'VERIFIED'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Remove transaction record ${txn.trxId}?`)) {
                            deleteTransaction(txn.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition hover:bg-slate-800 rounded-lg"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const SiteSettings = () => {
  const [heroTitle, setHeroTitle] = useState(localStorage.getItem('penta_hero_title') || 'Mission-Critical <br /> <span class="text-gradient-emerald">Offensive Cyber</span> & <br /> <span class="text-gradient-cyan">Distributed Architecture</span>');
  const [heroCmds, setHeroCmds] = useState(localStorage.getItem('penta_hero_cmds') || 'penta-core --track=cybersecurity, python3 train.py, clang -O2 -target bpf');
  const [hideHero, setHideHero] = useState(localStorage.getItem('penta_hero_hidden') === 'true');

  const saveSettings = () => {
    localStorage.setItem('penta_hero_title', heroTitle);
    localStorage.setItem('penta_hero_cmds', heroCmds);
    localStorage.setItem('penta_hero_hidden', hideHero.toString());
    alert('Site settings saved! These will now reflect on the landing page.');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <LayoutDashboard className="text-emerald-400" /> Site Settings
      </h2>
      
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Dynamic Landing Page (Hero)</h3>
          <p className="text-slate-400 text-sm mb-4">Configure the marketing copy shown on the front page.</p>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-800">
          <div>
            <div className="text-white font-medium">Hide Hero Section</div>
            <div className="text-slate-500 text-sm">Completely hide the marketing text and terminal graphic.</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={hideHero} onChange={e => setHideHero(e.target.checked)} />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {!hideHero && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Headline (Supports HTML tags like &lt;br/&gt;)</label>
              <textarea 
                value={heroTitle}
                onChange={e => setHeroTitle(e.target.value)}
                className="w-full bg-[#05070a] border border-slate-800 rounded-lg p-3 text-slate-200 text-sm focus:border-emerald-500 focus:outline-none font-mono"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Terminal Commands (Comma separated)</label>
              <input 
                type="text"
                value={heroCmds}
                onChange={e => setHeroCmds(e.target.value)}
                className="w-full bg-[#05070a] border border-slate-800 rounded-lg p-3 text-slate-200 text-sm focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>
        )}

        <button onClick={saveSettings} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition">
          Save Configuration
        </button>
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  const { adminEmail, updateAdminCredentials } = useAuth();
  const [email, setEmail] = useState(adminEmail);
  const [password, setPassword] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!password) {
      alert("Password cannot be empty.");
      return;
    }
    updateAdminCredentials(email, password);
    alert('Admin credentials updated successfully.');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Shield className="text-purple-400" /> Security & Authentication
      </h2>
      
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Root Administrator Credentials</h3>
          <p className="text-slate-400 text-sm mb-4">Update the primary admin account used to access the AI Admin Studio.</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Admin Email</label>
            <input 
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#05070a] border border-slate-800 rounded-lg p-3 text-slate-200 text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-[#05070a] border border-slate-800 rounded-lg p-3 text-slate-200 text-sm focus:border-purple-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="px-6 py-2.5 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-lg text-sm transition">
            Update Credentials
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;

