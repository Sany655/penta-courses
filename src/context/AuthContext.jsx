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
      pendingModules: [],
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
      instructions: 'Send Money to the bKash number below with your email as Reference, then submit your Transaction ID (TrxID) for admin approval.'
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
        timestamp: new Date(Date.now() - 3600000 * 2).toLocaleString(),
        status: 'PENDING'
      }
    ];
  });

  // Persistent granted access dictionary: { [email]: string[] }
  const [grantedAccessMap, setGrantedAccessMap] = useState(() => {
    const saved = localStorage.getItem('penta_granted_access');
    return saved ? JSON.parse(saved) : {};
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

  useEffect(() => {
    localStorage.setItem('penta_granted_access', JSON.stringify(grantedAccessMap));
  }, [grantedAccessMap]);

  // Sync granted access with active user
  useEffect(() => {
    if (user?.email && grantedAccessMap[user.email]) {
      const additionalUnlocked = grantedAccessMap[user.email];
      setUser(prev => {
        const merged = Array.from(new Set([...prev.unlockedModules, ...additionalUnlocked]));
        if (merged.length !== prev.unlockedModules.length) {
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

  const updateBkashSettings = (newSettings) => {
    setBkashSettings(prev => ({ ...prev, ...newSettings }));
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
    if (itemId) {
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

    // Save into granted access map for that student
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
        unlockedModules: Array.from(new Set([...prev.unlockedModules, ...itemsToUnlock])),
        bypassedModules: Array.from(new Set([...prev.bypassedModules, ...itemsToUnlock])),
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
        unlockedModules: Array.from(new Set([...prev.unlockedModules, ...itemsToUnlock])),
        pendingModules: (prev.pendingModules || []).filter(id => !itemsToUnlock.includes(id))
      }));
    }

    return { success: true };
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
        pendingModules: [],
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
      unlockedModules: Array.from(new Set([...prev.unlockedModules, moduleId])),
      pendingModules: (prev.pendingModules || []).filter(id => id !== moduleId)
    }));
  };

  const bypassModuleWithPayment = (moduleId) => {
    setUser(prev => ({
      ...prev,
      unlockedModules: Array.from(new Set([...prev.unlockedModules, moduleId])),
      bypassedModules: Array.from(new Set([...prev.bypassedModules, moduleId])),
      pendingModules: (prev.pendingModules || []).filter(id => id !== moduleId)
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
      approveTransaction,
      rejectTransaction,
      manualGrantAccess,
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
