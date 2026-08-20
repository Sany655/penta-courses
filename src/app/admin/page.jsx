"use client";

import React, { useState } from 'react';
import { 
  Shield, Sparkles, LayoutDashboard, Settings, Lock, 
  FileCode2, Smartphone, CreditCard, Trash2, CheckCircle2, 
  Search, ExternalLink, RefreshCw, XCircle, UserCheck, Plus, Check,
  MessageSquare, Mail, Building2, Clock, CheckCheck, Archive 
} from 'lucide-react';
import LessonBuilder from '../../components/admin/LessonBuilder';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import coursesData from '../../data/courses.json';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('lesson-builder');
  const { isAdmin, inquiries } = useAuth();
  const router = useRouter();

  const newInquiriesCount = (inquiries || []).filter(i => i.status === 'NEW').length;

  // If not admin, redirect to auth
  React.useEffect(() => {
    if (!isAdmin) {
      router.push('/auth');
    }
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#05070a] pt-16 flex font-sans transition-colors">
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
            onClick={() => setActiveTab('inquiries-manager')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'inquiries-manager'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4" />
              <span>Inquiries & Requests</span>
            </div>
            {newInquiriesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] font-mono">
                {newInquiriesCount}
              </span>
            )}
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
        {activeTab === 'inquiries-manager' && <InquiriesManager />}
        {activeTab === 'bkash-payments' && <BkashPaymentSettings />}
        {activeTab === 'security-settings' && <SecuritySettings />}
      </main>
    </div>
  );
};

const InquiriesManager = () => {
  const { inquiries, updateInquiryStatus, deleteInquiry } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredInquiries = (inquiries || []).filter(inq => {
    const matchesSearch = 
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && inq.status === filterStatus;
  });

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="text-amber-400" />
            <span>Advisory Inquiries & Custom Track Requests</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-mono mt-1">
            Incoming suggestions and enterprise requests submitted from the landing page contact gateway.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Statuses ({inquiries?.length || 0})</option>
            <option value="NEW">New ({(inquiries || []).filter(i => i.status === 'NEW').length})</option>
            <option value="REVIEWED">Reviewed ({(inquiries || []).filter(i => i.status === 'REVIEWED').length})</option>
            <option value="ARCHIVED">Archived ({(inquiries || []).filter(i => i.status === 'ARCHIVED').length})</option>
          </select>

          <div className="relative w-56">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#090d16] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Inquiries Cards Grid */}
      {filteredInquiries.length === 0 ? (
        <div className="py-16 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-2xl bg-[#090d16]/40">
          No advisory inquiries match your search criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inq) => {
            const isNew = inq.status === 'NEW';
            const isReviewed = inq.status === 'REVIEWED';

            return (
              <div
                key={inq.id}
                className={`bg-[#090d16] border rounded-2xl p-6 space-y-4 shadow-xl transition-all ${
                  isNew 
                    ? 'border-amber-500/40 bg-amber-500/5' 
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center text-xs font-mono">
                      {inq.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 text-sm flex items-center gap-2">
                        <span>{inq.name}</span>
                        {inq.company && (
                          <span className="text-[11px] font-mono text-slate-400 font-normal">
                            &bull; {inq.company}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400 text-xs font-mono">{inq.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-mono font-bold">
                      {inq.category}
                    </span>

                    {isNew && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold animate-pulse">
                        ● New Inquiry
                      </span>
                    )}

                    {isReviewed && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                        ✓ Reviewed
                      </span>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans bg-[#05070a] p-4 rounded-xl border border-slate-800/80">
                  {inq.message}
                </p>

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-slate-400 gap-3 pt-1">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Received: {inq.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <a
                      href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.category)} - Pentabrid Engine&body=Hi ${encodeURIComponent(inq.name)},%0D%0A%0D%0AThank you for reaching out regarding ${encodeURIComponent(inq.category)} on Pentabrid Engine...`}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold transition flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>

                    {isNew ? (
                      <button
                        onClick={() => updateInquiryStatus(inq.id, 'REVIEWED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold transition flex items-center gap-1.5"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark as Reviewed</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => updateInquiryStatus(inq.id, 'NEW')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition"
                      >
                        Mark as New
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`Delete inquiry from ${inq.name}?`)) {
                          deleteInquiry(inq.id);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const BkashPaymentSettings = () => {
  const { 
    bkashSettings, 
    updateBkashSettings, 
    transactions, 
    approveTransaction, 
    rejectTransaction, 
    manualGrantAccess, 
    deleteTransaction 
  } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState(bkashSettings?.phoneNumber || '01712-345678');
  const [accountType, setAccountType] = useState(bkashSettings?.accountType || 'Personal');
  const [defaultFeeBdt, setDefaultFeeBdt] = useState(bkashSettings?.defaultFeeBdt || '250');
  const [instructions, setInstructions] = useState(bkashSettings?.instructions || 'Send Money to the bKash number below with your email as Reference, then submit your Transaction ID (TrxID) for admin approval.');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  // Manual Grant State
  const [manualEmail, setManualEmail] = useState('alex.mercer@pentabrid.io');
  const [manualModuleId, setManualModuleId] = useState('module-2');

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

  const handleApprove = (txnId, studentName, itemTitle) => {
    const res = approveTransaction(txnId);
    if (res.success) {
      setActionNotice(`Verified & granted access for ${studentName} on ${itemTitle}!`);
      setTimeout(() => setActionNotice(''), 4000);
    }
  };

  const handleReject = (txnId) => {
    if (confirm('Reject this transaction? The student will remain locked until verified.')) {
      rejectTransaction(txnId, 'Payment could not be verified with bKash statement');
      setActionNotice(`Transaction ${txnId} marked as Rejected.`);
      setTimeout(() => setActionNotice(''), 4000);
    }
  };

  const handleManualGrantSubmit = (e) => {
    e.preventDefault();
    if (!manualEmail) return;
    manualGrantAccess(manualEmail.trim(), manualModuleId);
    setActionNotice(`Direct access granted for ${manualEmail} on ${manualModuleId}!`);
    setTimeout(() => setActionNotice(''), 4000);
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
            bKash Gateway & Verification Center
          </h2>
          <p className="text-slate-400 text-sm mt-1">Review student transaction IDs, manually grant course access, and manage payment numbers.</p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-mono flex items-center gap-2.5 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Transaction Ledger Table with Manual Verify Actions */}
      <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Incoming Transactions & Access Requests</h3>
            <p className="text-slate-400 text-xs font-mono">
              Pending Verification: <span className="text-amber-400 font-bold">{transactions.filter(t => t.status === 'PENDING').length}</span> &bull; Total Records: <span className="text-pink-400 font-bold">{transactions.length}</span>
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
            No transaction records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#05070a] text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Access Target</th>
                  <th className="py-3 px-4">TrxID / Sender</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredTxns.map((txn) => {
                  const isPending = txn.status === 'PENDING';
                  const isApproved = txn.status === 'APPROVED' || txn.status === 'VERIFIED';
                  const isRejected = txn.status === 'REJECTED';

                  return (
                    <tr key={txn.id} className={`hover:bg-slate-900/40 transition ${isPending ? 'bg-amber-500/5' : ''}`}>
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
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold animate-pulse">
                            ● Awaiting Approval
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                            ✓ Verified & Granted
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                            ✗ Rejected
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {isPending ? (
                            <>
                              <button
                                onClick={() => handleApprove(txn.id, txn.studentName, txn.itemTitle)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                                title="Approve payment and unlock curriculum access"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verify & Grant</span>
                              </button>
                              <button
                                onClick={() => handleReject(txn.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition"
                                title="Reject payment"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                if (confirm(`Delete transaction record ${txn.trxId}?`)) {
                                  deleteTransaction(txn.id);
                                }
                              }}
                              className="p-1.5 text-slate-500 hover:text-rose-400 transition hover:bg-slate-800 rounded-lg"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Direct Grant Card & Gateway Config Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Direct Access Grant Tool */}
        <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-white font-bold">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            <h3>Manual Direct Grant (Admin Override)</h3>
          </div>
          <p className="text-slate-400 text-xs font-mono">Directly grant access to any student email without requiring a bKash TrxID.</p>

          <form onSubmit={handleManualGrantSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-300">Student Email</label>
              <input
                type="email"
                required
                value={manualEmail}
                onChange={e => setManualEmail(e.target.value)}
                placeholder="student@pentabrid.io"
                className="w-full bg-[#05070a] border border-slate-800 rounded-xl p-3 text-slate-200 text-sm font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-300">Select Target Module / Phase</label>
              <select
                value={manualModuleId}
                onChange={e => setManualModuleId(e.target.value)}
                className="w-full bg-[#05070a] border border-slate-800 rounded-xl p-3 text-slate-200 text-sm font-mono focus:border-cyan-500 focus:outline-none"
              >
                {coursesData.flatMap(c => c.modules.map((m, idx) => (
                  <option key={m.id} value={m.id} className="bg-[#090d16]">
                    {c.title} — Phase 0{idx + 1}: {m.title}
                  </option>
                )))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs font-mono transition shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Grant Instant Access to Student</span>
            </button>
          </form>
        </div>

        {/* Gateway Configuration */}
        <div className="bg-[#090d16] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-white font-bold">
            <Smartphone className="w-5 h-5 text-pink-400" />
            <h3>bKash Account Settings</h3>
          </div>
          <p className="text-slate-400 text-xs font-mono">Edit the number and instructions displayed in the student payment modal.</p>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-mono text-slate-300">bKash Number</label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full bg-[#05070a] border border-slate-800 rounded-xl p-3 text-slate-200 text-sm font-mono focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono text-slate-300">Account Type</label>
                <select
                  value={accountType}
                  onChange={e => setAccountType(e.target.value)}
                  className="w-full bg-[#05070a] border border-slate-800 rounded-xl p-3 text-slate-200 text-sm font-mono focus:border-pink-500 focus:outline-none"
                >
                  <option value="Personal">Personal (Send Money)</option>
                  <option value="Merchant">Merchant (Payment)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-300">Default Fee (BDT)</label>
              <input
                type="number"
                required
                value={defaultFeeBdt}
                onChange={e => setDefaultFeeBdt(e.target.value)}
                className="w-full bg-[#05070a] border border-slate-800 rounded-xl p-3 text-slate-200 text-sm font-mono focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-300">Student Instructions Note</label>
              <textarea
                rows={2}
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                className="w-full bg-[#05070a] border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:border-pink-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#e2136e] to-pink-600 hover:from-[#d01063] hover:to-pink-500 text-white font-bold rounded-xl text-xs font-mono transition shadow-[0_0_20px_rgba(226,19,110,0.3)] flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Gateway Settings</span>
            </button>
          </form>
        </div>

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
