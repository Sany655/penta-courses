import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ROLES = {
  STUDENT: 'STUDENT',
  INSTRUCTOR: 'INSTRUCTOR',
  ADMIN: 'ADMIN',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('penta_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr_student_01',
      name: 'Alex Mercer (Student)',
      email: 'alex.mercer@pentabrid.io',
      role: ROLES.STUDENT,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      unlockedModules: ['module-1'],
      bypassedModules: [],
      completedQuizzes: []
    };
  });

  const [adminCredentials, setAdminCredentials] = useState(() => {
    const saved = localStorage.getItem('penta_admin_creds');
    return saved ? JSON.parse(saved) : {
      email: 'admin@pentabrid.com',
      password: 'Password'
    };
  });

  const [bkashSettings, setBkashSettings] = useState(() => {
    const saved = localStorage.getItem('penta_bkash_settings');
    return saved ? JSON.parse(saved) : {
      phoneNumber: '01712-345678',
      accountType: 'Personal', // 'Personal' | 'Merchant'
      defaultFeeBdt: '250',
      instructions: 'Send Money to the bKash number below with your email as Reference, then submit your Transaction ID (TrxID) to unlock access.'
    };
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('penta_bkash_txns');
    return saved ? JSON.parse(saved) : [
      {
        id: 'txn_init_01',
        studentEmail: 'alex.mercer@pentabrid.io',
        studentName: 'Alex Mercer (Student)',
        itemType: 'module',
        itemId: 'module-2',
        itemTitle: 'Phase 02: Kernel Tradecraft & EDR Hooks',
        amount: '250 BDT',
        trxId: '8M4K9L2P1Q',
        senderPhone: '01799887766',
        timestamp: new Date(Date.now() - 3600000 * 5).toLocaleString(),
        status: 'VERIFIED'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('penta_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('penta_admin_creds', JSON.stringify(adminCredentials));
  }, [adminCredentials]);

  useEffect(() => {
    localStorage.setItem('penta_bkash_settings', JSON.stringify(bkashSettings));
  }, [bkashSettings]);

  useEffect(() => {
    localStorage.setItem('penta_bkash_txns', JSON.stringify(transactions));
  }, [transactions]);

  const updateBkashSettings = (newSettings) => {
    setBkashSettings(prev => ({ ...prev, ...newSettings }));
  };

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
      status: 'VERIFIED'
    };

    setTransactions(prev => [newTxn, ...prev]);

    // Authorize & unlock access
    if (itemId) {
      if (Array.isArray(itemId)) {
        setUser(prev => ({
          ...prev,
          unlockedModules: Array.from(new Set([...prev.unlockedModules, ...itemId])),
          bypassedModules: Array.from(new Set([...prev.bypassedModules, ...itemId]))
        }));
      } else {
        setUser(prev => ({
          ...prev,
          unlockedModules: Array.from(new Set([...prev.unlockedModules, itemId])),
          bypassedModules: Array.from(new Set([...prev.bypassedModules, itemId]))
        }));
      }
    }

    return { success: true, txn: newTxn };
  };

  const deleteTransaction = (txnId) => {
    setTransactions(prev => prev.filter(t => t.id !== txnId));
  };

  const login = (email, password) => {
    if (email === adminCredentials.email && password === adminCredentials.password) {
      setUser({
        id: 'usr_admin_01',
        name: 'Root Administrator',
        email: email,
        role: ROLES.ADMIN,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        unlockedModules: [],
        bypassedModules: [],
        completedQuizzes: []
      });
      return true;
    }
    return false;
  };

  const updateAdminCredentials = (newEmail, newPassword) => {
    setAdminCredentials({ email: newEmail, password: newPassword });
  };

  const switchRole = (newRole) => {
    let name = 'Alex Mercer (Student)';
    let id = 'usr_student_01';
    if (newRole === ROLES.INSTRUCTOR) {
      name = 'Dr. Sarah Lin (Instructor)';
      id = 'usr_instructor_01';
    } else if (newRole === ROLES.ADMIN) {
      name = 'Root Administrator (Admin)';
      id = 'usr_admin_01';
    }

    setUser(prev => ({
      ...prev,
      id,
      name,
      role: newRole
    }));
  };

  const unlockNextModule = (moduleId) => {
    setUser(prev => ({
      ...prev,
      unlockedModules: Array.from(new Set([...prev.unlockedModules, moduleId]))
    }));
  };

  const bypassModuleWithPayment = (moduleId) => {
    setUser(prev => ({
      ...prev,
      unlockedModules: Array.from(new Set([...prev.unlockedModules, moduleId])),
      bypassedModules: Array.from(new Set([...prev.bypassedModules, moduleId]))
    }));
  };

  const recordQuizSuccess = (quizId, moduleId) => {
    setUser(prev => ({
      ...prev,
      completedQuizzes: Array.from(new Set([...prev.completedQuizzes, quizId])),
      unlockedModules: Array.from(new Set([...prev.unlockedModules, moduleId]))
    }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      switchRole,
      login,
      updateAdminCredentials,
      adminEmail: adminCredentials.email,
      bkashSettings,
      updateBkashSettings,
      transactions,
      submitBkashPayment,
      deleteTransaction,
      unlockNextModule,
      bypassModuleWithPayment,
      recordQuizSuccess,
      isAdmin: user.role === ROLES.ADMIN,
      isInstructor: user.role === ROLES.INSTRUCTOR,
      isStaff: user.role === ROLES.ADMIN || user.role === ROLES.INSTRUCTOR
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
