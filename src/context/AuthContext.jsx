import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

const AuthContext = createContext();

export const ROLES = {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
};

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const nextAuthUser = session?.user;

  // Registered student accounts stored in localStorage (mock data fallback)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('penta_registered_students') : null;
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (nextAuthUser) {
      // Find extra metadata from mock storage if it exists, otherwise use basic NextAuth data
      const mockMeta = registeredUsers.find(u => u.email === nextAuthUser.email) || {};
      setUser({
        ...mockMeta,
        ...nextAuthUser,
      });
    } else if (status === 'unauthenticated') {
      setUser(null);
    }
  }, [nextAuthUser, status, registeredUsers]);
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

  const [transactions, setTransactions] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('penta_bkash_txns') : null;
    return saved ? JSON.parse(saved) : [];
  });

  // Contact / Suggestions / Custom Track Inquiries
  const [inquiries, setInquiries] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('penta_inquiries') : null;
    return saved ? JSON.parse(saved) : [];
  });

  // Persistent granted access dictionary: { [email]: string[] }
  const [grantedAccessMap, setGrantedAccessMap] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('penta_granted_access') : null;
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('penta_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('penta_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('penta_registered_students', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('penta_admin_creds', JSON.stringify(adminCredentials));
  }, [adminCredentials]);

  useEffect(() => {
    localStorage.setItem('penta_bkash_settings', JSON.stringify(bkashSettings));
  }, [bkashSettings]);

  useEffect(() => {
    localStorage.setItem('penta_bkash_txns', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('penta_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('penta_granted_access', JSON.stringify(grantedAccessMap));
  }, [grantedAccessMap]);

  // Sync granted access with active user
  useEffect(() => {
    if (user?.email && grantedAccessMap[user.email]) {
      const additionalUnlocked = grantedAccessMap[user.email];
      setUser(prev => {
        if (!prev) return prev;
        const merged = Array.from(new Set([...(prev.unlockedModules || []), ...additionalUnlocked]));
        if (merged.length !== (prev.unlockedModules || []).length) {
          return {
            ...prev,
            unlockedModules: merged,
            pendingModules: (prev.pendingModules || []).filter(id => !additionalUnlocked.includes(id))
          };
        }
        return prev;
      });
    }
  }, [user?.email, grantedAccessMap]);

  // Real Production Login
  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check Admin Login
    if (cleanEmail === adminCredentials.email.toLowerCase() && cleanPassword === adminCredentials.password) {
      const adminUser = {
        id: 'usr_admin_01',
        name: 'Root Administrator',
        email: adminCredentials.email,
        role: ROLES.ADMIN,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        unlockedModules: [],
        bypassedModules: [],
        pendingModules: [],
        completedQuizzes: []
      };
      setUser(adminUser);
      return { success: true, role: ROLES.ADMIN, user: adminUser };
    }

    // Check Student Accounts
    const student = registeredUsers.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
    );

    if (student) {
      const granted = grantedAccessMap[student.email] || [];
      const sessionUser = {
        id: student.id,
        name: student.name,
        email: student.email,
        role: ROLES.STUDENT,
        avatar: student.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        unlockedModules: Array.from(new Set([...(student.unlockedModules || ['module-1']), ...granted])),
        bypassedModules: student.bypassedModules || [],
        pendingModules: student.pendingModules || [],
        completedQuizzes: student.completedQuizzes || []
      };
      setUser(sessionUser);
      return { success: true, role: ROLES.STUDENT, user: sessionUser };
    }

    return { success: false, message: 'Invalid email or password.' };
  };

  // Real Production Registration
  const register = (name, email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (cleanEmail === adminCredentials.email.toLowerCase()) {
      return { success: false, message: 'This email is reserved for system administration.' };
    }

    const existing = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email already exists. Please sign in.' };
    }

    const newStudent = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: password.trim(),
      role: ROLES.STUDENT,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      unlockedModules: ['module-1'],
      bypassedModules: [],
      pendingModules: [],
      completedQuizzes: []
    };

    setRegisteredUsers(prev => [...prev, newStudent]);
    setUser(newStudent);
    return { success: true, user: newStudent };
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('penta_user');
  };

  const updateAdminCredentials = (newEmail, newPassword) => {
    setAdminCredentials({ email: newEmail, password: newPassword });
  };

  const updateBkashSettings = (newSettings) => {
    setBkashSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Submit Suggestion / Contact Request
  const submitInquiry = ({ name, email, company, category, message }) => {
    const newInquiry = {
      id: `inq_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      company: (company || 'Independent Practitioner').trim(),
      category: category || 'Curriculum Suggestion',
      message: message.trim(),
      timestamp: new Date().toLocaleString(),
      status: 'NEW'
    };

    setInquiries(prev => [newInquiry, ...prev]);
    return { success: true, inquiry: newInquiry };
  };

  const updateInquiryStatus = (id, newStatus) => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
  };

  const deleteInquiry = (id) => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
  };

  // Student submits payment -> status is PENDING (No automatic unlock)
  const submitBkashPayment = ({ itemType, itemId, itemTitle, amount, trxId, senderPhone }) => {
    const newTxn = {
      id: `txn_${Date.now()}`,
      studentEmail: user?.email || 'guest@pentabrid.io',
      studentName: user?.name || 'Student User',
      itemType: itemType || 'module',
      itemId: itemId || 'module-bypass',
      itemTitle: itemTitle || 'Gatekeeper Instant Bypass',
      amount: amount || `${bkashSettings.defaultFeeBdt} BDT`,
      trxId: trxId.toUpperCase(),
      senderPhone: senderPhone || 'N/A',
      timestamp: new Date().toLocaleString(),
      status: 'PENDING'
    };

    setTransactions(prev => [newTxn, ...prev]);

    // Tag the module as pending review for this student
    if (itemId && user) {
      const itemsToAdd = Array.isArray(itemId) ? itemId : [itemId];
      setUser(prev => ({
        ...prev,
        pendingModules: Array.from(new Set([...(prev.pendingModules || []), ...itemsToAdd]))
      }));
    }

    return { 
      success: true, 
      message: 'Transaction submitted! Awaiting administrator verification.',
      txn: newTxn 
    };
  };

  // Admin approves transaction -> access is granted to student
  const approveTransaction = (txnId) => {
    const targetTxn = transactions.find(t => t.id === txnId);
    if (!targetTxn) return { success: false, message: 'Transaction not found.' };

    const itemsToUnlock = Array.isArray(targetTxn.itemId) ? targetTxn.itemId : [targetTxn.itemId];

    // Update transaction status
    setTransactions(prev => prev.map(t => t.id === txnId ? { ...t, status: 'APPROVED' } : t));

    // Save into persistent granted access map for that student
    setGrantedAccessMap(prev => {
      const existing = prev[targetTxn.studentEmail] || [];
      return {
        ...prev,
        [targetTxn.studentEmail]: Array.from(new Set([...existing, ...itemsToUnlock]))
      };
    });

    // If currently logged in user matches, unlock immediately
    if (user?.email === targetTxn.studentEmail) {
      setUser(prev => ({
        ...prev,
        unlockedModules: Array.from(new Set([...(prev.unlockedModules || []), ...itemsToUnlock])),
        bypassedModules: Array.from(new Set([...(prev.bypassedModules || []), ...itemsToUnlock])),
        pendingModules: (prev.pendingModules || []).filter(id => !itemsToUnlock.includes(id))
      }));
    }

    return { success: true, txn: targetTxn };
  };

  // Admin rejects transaction
  const rejectTransaction = (txnId, reason = 'Verification Failed') => {
    const targetTxn = transactions.find(t => t.id === txnId);
    if (!targetTxn) return { success: false };

    setTransactions(prev => prev.map(t => t.id === txnId ? { ...t, status: 'REJECTED', rejectReason: reason } : t));

    if (targetTxn && user?.email === targetTxn.studentEmail) {
      const items = Array.isArray(targetTxn.itemId) ? targetTxn.itemId : [targetTxn.itemId];
      setUser(prev => ({
        ...prev,
        pendingModules: (prev.pendingModules || []).filter(id => !items.includes(id))
      }));
    }

    return { success: true };
  };

  // Admin manual direct grant
  const manualGrantAccess = (studentEmail, moduleIdOrIds) => {
    const itemsToUnlock = Array.isArray(moduleIdOrIds) ? moduleIdOrIds : [moduleIdOrIds];
    
    setGrantedAccessMap(prev => {
      const existing = prev[studentEmail] || [];
      return {
        ...prev,
        [studentEmail]: Array.from(new Set([...existing, ...itemsToUnlock]))
      };
    });

    if (user?.email === studentEmail) {
      setUser(prev => ({
        ...prev,
        unlockedModules: Array.from(new Set([...(prev.unlockedModules || []), ...itemsToUnlock])),
        pendingModules: (prev.pendingModules || []).filter(id => !itemsToUnlock.includes(id))
      }));
    }

    return { success: true };
  };

  const deleteTransaction = (txnId) => {
    setTransactions(prev => prev.filter(t => t.id !== txnId));
  };

  const unlockNextModule = (moduleId) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      unlockedModules: Array.from(new Set([...(prev.unlockedModules || []), moduleId])),
      pendingModules: (prev.pendingModules || []).filter(id => id !== moduleId)
    }));
  };

  const bypassModuleWithPayment = (moduleId) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      unlockedModules: Array.from(new Set([...(prev.unlockedModules || []), moduleId])),
      bypassedModules: Array.from(new Set([...(prev.bypassedModules || []), moduleId])),
      pendingModules: (prev.pendingModules || []).filter(id => id !== moduleId)
    }));
  };

  const recordQuizSuccess = (quizId, moduleId) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      completedQuizzes: Array.from(new Set([...(prev.completedQuizzes || []), quizId])),
      unlockedModules: Array.from(new Set([...(prev.unlockedModules || []), moduleId]))
    }));
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
      isAdmin: user?.role === ROLES.ADMIN,
      isStudent: user?.role === ROLES.STUDENT,
      isStaff: user?.role === ROLES.ADMIN || user?.role === 'INSTRUCTOR',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
