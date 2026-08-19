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

  useEffect(() => {
    localStorage.setItem('penta_user', JSON.stringify(user));
  }, [user]);

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
