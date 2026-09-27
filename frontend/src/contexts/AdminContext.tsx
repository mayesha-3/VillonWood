import React, { createContext, useContext, useState } from 'react';

export type UserAppRole = 'learner' | 'teacher' | 'admin';

export interface AdminUserData {
  id: string;
  name: string;
  email: string;
  role: UserAppRole;
  approvedRole: boolean;
  isRestricted: boolean;
  joinedDate: string;
}

interface AdminContextType {
  currentUserRole: UserAppRole;
  isCurrentUserRestricted: boolean;
  usersList: AdminUserData[];
  setCurrentUserRole: (role: UserAppRole) => void;
  updateUserRole: (userId: string, newRole: UserAppRole) => void;
  approveUserRole: (userId: string) => void;
  toggleUserRestriction: (userId: string) => void;
  deleteUserAccount: (userId: string) => void;
}

const INITIAL_USERS: AdminUserData[] = [
  {
    id: 'u1',
    name: 'Mayesha Afrooz (Firebase Admin)',
    email: 'mayesha.admin@villonwood.com',
    role: 'admin',
    approvedRole: true,
    isRestricted: false,
    joinedDate: '2026-09-01'
  },
  {
    id: 'u2',
    name: 'Jean-Luc Boulanger',
    email: 'jeanluc.baker@villonwood.com',
    role: 'teacher',
    approvedRole: true,
    isRestricted: false,
    joinedDate: '2026-09-05'
  },
  {
    id: 'u3',
    name: 'Lucie Voyageuse',
    email: 'lucie.learner@villonwood.com',
    role: 'learner',
    approvedRole: true,
    isRestricted: false,
    joinedDate: '2026-09-12'
  },
  {
    id: 'u4',
    name: 'Pierre Négociant',
    email: 'pierre.learner@villonwood.com',
    role: 'learner',
    approvedRole: false,
    isRestricted: false,
    joinedDate: '2026-09-20'
  },
  {
    id: 'u5',
    name: 'Marc le Bâtisseur',
    email: 'marc.mason@villonwood.com',
    role: 'teacher',
    approvedRole: true,
    isRestricted: false,
    joinedDate: '2026-09-22'
  }
];

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = (): AdminContextType => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserRole, setCurrentUserRoleState] = useState<UserAppRole>('admin');
  const [usersList, setUsersList] = useState<AdminUserData[]>(INITIAL_USERS);

  // Check if current user is restricted
  const mainUser = usersList.find((u) => u.role === 'admin') || usersList[0];
  const isCurrentUserRestricted = mainUser?.isRestricted || false;

  const setCurrentUserRole = (role: UserAppRole) => {
    setCurrentUserRoleState(role);
  };

  const updateUserRole = (userId: string, newRole: UserAppRole) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole, approvedRole: false } : u))
    );
  };

  const approveUserRole = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, approvedRole: true } : u))
    );
  };

  const toggleUserRestriction = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isRestricted: !u.isRestricted } : u))
    );
  };

  const deleteUserAccount = (userId: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <AdminContext.Provider
      value={{
        currentUserRole,
        isCurrentUserRestricted,
        usersList,
        setCurrentUserRole,
        updateUserRole,
        approveUserRole,
        toggleUserRestriction,
        deleteUserAccount
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
