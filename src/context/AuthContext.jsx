import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  GUEST: 'GUEST',
  // Backward-compatibility aliases
  SUPER_ADMIN: 'ADMIN',
  STUDENT: 'USER',
};

const normalizeUser = (account) => {
  if (!account) return null;
  const saved = typeof window !== 'undefined' ? localStorage.getItem('penta_user') : null;
  let parsed = {};
  try {
    parsed = saved ? JSON.parse(saved) : {};
  } catch {
    parsed = {};
  }

  const rawRole = (account.role || parsed.role || ROLES.USER).toUpperCase();
  const canonicalRole = rawRole === 'SUPER_ADMIN' ? ROLES.ADMIN : (rawRole === 'STUDENT' ? ROLES.USER : rawRole);

  return {
    ...account,
    name: account.name || account.full_name || account.email,
    role: canonicalRole,
    unlockedModules: account.unlockedModules || parsed.unlockedModules || ['module-1'],
    bypassedModules: account.bypassedModules || parsed.bypassedModules || [],
    completedQuizzes: account.completedQuizzes || parsed.completedQuizzes || [],
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('penta_access_token');
    if (!token) return;

    fetch('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    })
      .then(response => {
        if (!response.ok) throw new Error('Session expired');
        return response.json();
      })
      .then(normalizeUser)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('penta_access_token');
        setUser(null);
      });
  }, []);
  const [adminCredentials, setAdminCredentials] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('penta_admin_creds') : null;
    return saved ? JSON.parse(saved) : {
      email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@pentabrid.com',
      password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'ChangeMeImmediately'
    };
  });

  const [bkashSettings, setBkashSettings] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('penta_bkash_settings') : null;
    return saved ? JSON.parse(saved) : {
      phoneNumber: '01712-345678',
      accountType: 'Personal',
      defaultFeeBdt: '250',
      instructions: 'Send Money to the bKash number below with your email as Reference, then submit your Transaction ID (TrxID) for admin approval.'
    };
  });

  const [transactions, setTransactions] = useState([]);

  // Contact / Suggestions / Custom Track Inquiries
  const [inquiries, setInquiries] = useState([]);

  // Persistent granted access dictionary: { [email]: string[] }
  useEffect(() => {
    if (user) {
      localStorage.setItem('penta_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('penta_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('penta_admin_creds', JSON.stringify(adminCredentials));
  }, [adminCredentials]);

  useEffect(() => {
    localStorage.setItem('penta_bkash_settings', JSON.stringify(bkashSettings));
  }, [bkashSettings]);

  useEffect(() => {
    const token = localStorage.getItem('penta_access_token');
    const userRole = (user?.role || '').toUpperCase();
    const userEmail = (user?.email || '').toLowerCase();
    if (!token || !['ADMIN', 'SUPER_ADMIN'].includes(userRole) || userEmail !== 'admin@pentabrid.com') return;
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch('/api/v1/admin/inquiries', { headers }).then(response => response.ok ? response.json() : []),
      fetch('/api/v1/admin/commerce/payments', { headers }).then(response => response.ok ? response.json() : [])
    ]).then(([serverInquiries, serverTransactions]) => {
      setInquiries(serverInquiries);
      setTransactions(serverTransactions);
    });
  }, [user?.role, user?.email]);

  const authenticate = async (endpoint, payload) => {
    try {
      const response = await fetch(`/api/v1/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { success: false, message: data.detail || data.message || 'Authentication failed.' };
      }

      localStorage.setItem('penta_access_token', data.access_token);
      const normalizedUser = normalizeUser(data.user);
      setUser(normalizedUser);
      return { success: true, user: normalizedUser };
    } catch {
      return { success: false, message: 'Unable to reach the authentication server.' };
    }
  };

  const login = (email, password) => authenticate('login', {
    email: email.trim().toLowerCase(),
    password: password.trim()
  });

  const register = (name, email, password) => authenticate('register', {
    full_name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim()
  });

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('penta_access_token');
    localStorage.removeItem('penta_user');
  };

  const updateAdminCredentials = (newEmail, newPassword) => {
    setAdminCredentials({ email: newEmail, password: newPassword });
  };

  const updateBkashSettings = (newSettings) => {
    setBkashSettings(prev => ({ ...prev, ...newSettings }));
  };

  const authRequest = async (url, options = {}) => {
    const token = localStorage.getItem('penta_access_token');
    const response = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` }
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(data?.detail || 'Server request failed');
    return data;
  };

  const submitInquiry = async (payload) => {
    try {
      const inquiry = await fetch('/api/v1/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(async response => {
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.detail || 'Inquiry submission failed');
        return data;
      });
      setInquiries(prev => [inquiry, ...prev]);
      return { success: true, inquiry };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateInquiryStatus = async (id, newStatus) => {
    const inquiry = await authRequest(`/api/v1/admin/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setInquiries(prev => prev.map(item => item.id === id ? inquiry : item));
    return { success: true, inquiry };
  };

  const deleteInquiry = async (id) => {
    await authRequest(`/api/v1/admin/inquiries/${id}`, { method: 'DELETE' });
    setInquiries(prev => prev.filter(item => item.id !== id));
    return { success: true };
  };

  // Student submits payment -> status is PENDING (No automatic unlock)
  const submitBkashPayment = async ({ itemType, itemId, itemTitle, amount, trxId, senderPhone }) => {
    try {
      const transaction = await authRequest('/api/v1/commerce/manual-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_type: itemType === 'module' ? 'MODULE_BYPASS' : 'COURSE',
          item_id: itemId,
          item_title: itemTitle,
          amount_bdt: Number.parseFloat(String(amount).replace(/[^0-9.]/g, '')),
          trx_id: trxId,
          sender_phone: senderPhone
        })
      });
      const txn = {
        ...transaction,
        trxId: transaction.transaction_ref,
        itemTitle: transaction.metadata_json?.item_title,
        senderPhone: transaction.metadata_json?.sender_phone,
        status: transaction.status
      };
      setTransactions(prev => [txn, ...prev]);
      return { success: true, message: 'Transaction submitted! Awaiting administrator verification.', txn };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Admin approves transaction -> access is granted to student
  const approveTransaction = async (txnId) => {
    try {
      const transaction = await authRequest(`/api/v1/admin/commerce/payments/${txnId}/approve`, { method: 'POST' });
      setTransactions(prev => prev.map(item => item.id === txnId ? { ...item, status: 'SUCCESS' } : item));
      return { success: true, txn: transaction };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Admin rejects transaction
  const rejectTransaction = async (txnId, reason = 'Verification Failed') => {
    try {
      await authRequest(`/api/v1/admin/commerce/payments/${txnId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      setTransactions(prev => prev.map(item => item.id === txnId ? { ...item, status: 'FAILED' } : item));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Admin manual direct grant
  const manualGrantAccess = async (studentEmail, moduleId) => {
    try {
      await authRequest('/api/v1/admin/commerce/grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_email: studentEmail, module_id: moduleId })
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deleteTransaction = async (txnId) => {
    try {
      await authRequest(`/api/v1/admin/commerce/payments/${txnId}`, { method: 'DELETE' });
      setTransactions(prev => prev.filter(item => item.id !== txnId));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const unlockNextModule = (moduleId) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      unlockedModules: Array.from(new Set([...(prev?.unlockedModules || []), moduleId])),
      pendingModules: (prev?.pendingModules || []).filter(id => id !== moduleId)
    }));
  };

  const bypassModuleWithPayment = async (moduleId, transactionId = null) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      unlockedModules: Array.from(new Set([...(prev?.unlockedModules || []), moduleId])),
      bypassedModules: Array.from(new Set([...(prev?.bypassedModules || []), moduleId])),
      pendingModules: (prev?.pendingModules || []).filter(id => id !== moduleId)
    }));

    const token = typeof window !== 'undefined' ? localStorage.getItem('penta_access_token') : null;
    if (token && moduleId) {
      try {
        await fetch(`/api/v1/tracks/modules/${moduleId}/bypass-pay`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ transaction_id: transactionId })
        });
      } catch (err) {
        console.warn('Payment bypass sync note:', err.message);
      }
    }
  };

  const recordQuizSuccess = async (quizId, moduleId) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      completedQuizzes: Array.from(new Set([...(prev?.completedQuizzes || []), quizId])),
      unlockedModules: Array.from(new Set([...(prev?.unlockedModules || []), moduleId]))
    }));

    const token = typeof window !== 'undefined' ? localStorage.getItem('penta_access_token') : null;
    if (token && moduleId) {
      try {
        await fetch(`/api/v1/tracks/modules/${moduleId}/bypass-exam`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ responses: [{ quiz_id: quizId, status: 'PASSED' }] })
        });
      } catch (err) {
        console.warn('Quiz exam sync note:', err.message);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
      updateAdminCredentials,
      adminEmail: adminCredentials.email,
      bkashSettings,
      updateBkashSettings,
      transactions,
      submitBkashPayment,
      approveTransaction,
      rejectTransaction,
      manualGrantAccess,
      deleteTransaction,
      inquiries,
      submitInquiry,
      updateInquiryStatus,
      deleteInquiry,
      unlockNextModule,
      bypassModuleWithPayment,
      recordQuizSuccess,
      isAdmin: ['ADMIN', 'SUPER_ADMIN'].includes((user?.role || '').toUpperCase()) && (user?.email || '').toLowerCase() === 'admin@pentabrid.com',
      isUser: Boolean(user),
      isGuest: !user,
      isStudent: Boolean(user) && !(['ADMIN', 'SUPER_ADMIN'].includes((user?.role || '').toUpperCase()) && (user?.email || '').toLowerCase() === 'admin@pentabrid.com'),
      isStaff: ['ADMIN', 'SUPER_ADMIN'].includes((user?.role || '').toUpperCase()),
      role: user ? (['ADMIN', 'SUPER_ADMIN'].includes((user?.role || '').toUpperCase()) ? ROLES.ADMIN : ROLES.USER) : ROLES.GUEST,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
