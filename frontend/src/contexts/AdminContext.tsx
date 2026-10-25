import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export type UserAppRole = 'learner' | 'teacher' | 'admin';
export type UserCourse = 'village' | 'advanced';

export interface AdminUserData {
  id: string;
  name: string;
  email: string;
  role: UserAppRole;
  course: UserCourse;
  approvedRole: boolean;
  isRestricted: boolean;
  joinedDate: string;
  lastActive?: string;
  totalOnlineMinutes?: number;
}

interface AdminContextType {
  currentUserRole: UserAppRole;
  currentUserCourse: UserCourse;
  isCurrentUserRestricted: boolean;
  usersList: AdminUserData[];
  loading: boolean;
  updateUserRole: (userId: string, newRole: UserAppRole) => void;
  updateUserCourse: (userId: string, course: UserCourse) => void;
  approveUserRole: (userId: string) => void;
  toggleUserRestriction: (userId: string) => void;
  deleteUserAccount: (userId: string) => void;
  syncCurrentUser: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = (): AdminContextType => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};

// Helper to format Firestore timestamp to date string
function formatDate(ts: Timestamp | string | undefined): string {
  if (!ts) return new Date().toISOString().split('T')[0];
  if (typeof ts === 'string') return ts;
  return ts.toDate().toISOString().split('T')[0];
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserRole, setCurrentUserRoleState] = useState<UserAppRole>('learner');
  const [currentUserCourse, setCurrentUserCourse] = useState<UserCourse>('village');
  const [isCurrentUserRestricted, setIsCurrentUserRestricted] = useState(false);
  const [usersList, setUsersList] = useState<AdminUserData[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync current Firebase user to Firestore on login
  const syncCurrentUser = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    const isMainAdmin = user.email?.trim().toLowerCase() === 'mayeshaafrooz@gmail.com';

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // First time login — create user doc with default 'learner' role
      await setDoc(userRef, {
        displayName: user.displayName || user.email?.split('@')[0] || 'Villager',
        email: user.email || '',
        role: isMainAdmin ? 'admin' : 'learner',
        course: 'village',
        approvedRole: isMainAdmin,
        isRestricted: false,
        joinedDate: serverTimestamp(),
        lastActive: serverTimestamp(),
        totalOnlineMinutes: 0
      });
      setCurrentUserRoleState(isMainAdmin ? 'admin' : 'learner');
      setCurrentUserCourse('village');
      setIsCurrentUserRestricted(false);
    } else {
      const data = userSnap.data();
      if (isMainAdmin && (data.role !== 'admin' || !data.approvedRole)) {
        await updateDoc(userRef, { role: 'admin', approvedRole: true });
      }
      setCurrentUserRoleState(isMainAdmin ? 'admin' : (data.role || 'learner'));
      setCurrentUserCourse(data.course === 'advanced' ? 'advanced' : 'village');
      setIsCurrentUserRestricted(data.isRestricted || false);
    }

    // Update lastActive
    await updateDoc(userRef, { lastActive: serverTimestamp() });
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await syncCurrentUser();
      } else {
        setCurrentUserRoleState('learner');
        setCurrentUserCourse('village');
        setIsCurrentUserRestricted(false);
      }
      setLoading(false);
    });
    return unsub;
  }, [syncCurrentUser]);

  // Real-time listener for all users (admin/teacher use)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const users: AdminUserData[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.displayName || data.email || 'Unknown',
          email: data.email || '',
          role: data.role || 'learner',
          course: data.course === 'advanced' ? 'advanced' : 'village',
          approvedRole: data.approvedRole ?? false,
          isRestricted: data.isRestricted ?? false,
          joinedDate: formatDate(data.joinedDate),
          lastActive: formatDate(data.lastActive),
          totalOnlineMinutes: data.totalOnlineMinutes || 0
        };
      });
      setUsersList(users);
    });
    return unsub;
  }, []);

  // Update activity timer every 5 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const currentMinutes = snap.data().totalOnlineMinutes || 0;
        await updateDoc(userRef, {
          lastActive: serverTimestamp(),
          totalOnlineMinutes: currentMinutes + 5
        });
      }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const updateUserRole = async (userId: string, newRole: UserAppRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole, approvedRole: false });
    } catch (err) {
      console.error('Failed to update user role:', err);
    }
  };

  const updateUserCourse = async (userId: string, course: UserCourse) => {
    try {
      await updateDoc(doc(db, 'users', userId), { course });
      if (userId === auth.currentUser?.uid) setCurrentUserCourse(course);
    } catch (err) {
      console.error('Failed to update user course:', err);
    }
  };

  const approveUserRole = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { approvedRole: true });
    } catch (err) {
      console.error('Failed to approve role:', err);
    }
  };

  const toggleUserRestriction = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        await updateDoc(userRef, { isRestricted: !snap.data().isRestricted });
        // Update current user restriction if it's themselves
        if (userId === auth.currentUser?.uid) {
          setIsCurrentUserRestricted(!snap.data().isRestricted);
        }
      }
    } catch (err) {
      console.error('Failed to toggle restriction:', err);
    }
  };

  const deleteUserAccount = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        currentUserRole,
        currentUserCourse,
        isCurrentUserRestricted,
        usersList,
        loading,
        updateUserRole,
        updateUserCourse,
        approveUserRole,
        toggleUserRestriction,
        deleteUserAccount,
        syncCurrentUser
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
