'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function CertificateVerificationView() {
  const params = useParams();
  const hash = params?.hash;
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hash) return;
    fetch(`/api/v1/commerce/certificates/verify/${hash}`)
      .then(res => {
        if (!res.ok) throw new Error('Certificate record not found or invalid signature');
        return res.json();
      })
      .then(data => {
        setCert(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [hash]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between">
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg text-slate-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center">P</span>
            <span>PentaCourse Public Ledger</span>
          </Link>
          <Link href="/certifications" className="text-xs text-slate-400 hover:text-emerald-400">Verify Another</Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-16 w-full">
        {loading && (
          <div className="text-center py-20 text-xs text-slate-400">
            Verifying cryptographic signature against authoritative state ledger...
          </div>
        )}

        {error && (
          <div className="p-8 rounded-2xl border border-red-500/30 bg-red-500/10 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-red-200 mb-2">Invalid Certificate Record</h2>
            <p className="text-xs text-slate-400 mb-6">{error}</p>
            <Link href="/certifications" className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-200">Return to Verification Search</Link>
          </div>
        )}

        {cert && (
          <div className="rounded-3xl border-2 border-emerald-500/60 bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
              <CheckCircle2 className="w-5 h-5" />
              <span>Authentic Verified Credential</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mb-2">{cert.title}</h1>
            <p className="text-sm text-cyan-400 font-semibold mb-8">{cert.course_title}</p>

            <div className="space-y-4 text-xs text-slate-300 border-t border-b border-slate-800 py-6 mb-8">
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient</span>
                <span className="font-bold text-slate-100">{cert.recipient_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Issued On</span>
                <span className="text-slate-200">{cert.issued_at ? new Date(cert.issued_at).toLocaleDateString() : 'Official'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Issuer Authority</span>
                <span className="text-slate-200">{cert.issuer || 'PentaCourse'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-500 break-all">
              <span className="text-slate-400 font-semibold block mb-1">SHA-256 Ledger Signature:</span>
              {cert.verification_hash}
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-slate-600 border-t border-slate-900">
        PentaCourse Verifiable Credentials Ledger • No personal private answers exposed
      </footer>
    </div>
  );
}
