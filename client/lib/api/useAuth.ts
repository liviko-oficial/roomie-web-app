import { useCallback, useEffect, useState } from 'react';
import { userService } from '@/lib/api/userService';
import { arrendadorService } from '@/lib/api/arrendadorService';

type UserType = 'student' | 'arrendador' | null;

const readAuthSnapshot = () => {
  if (typeof window === 'undefined') {
    return { token: null, userType: null as UserType, userId: null as string | null, email: null as string | null };
  }
  const token = localStorage.getItem('jwtToken');
  const userType = (localStorage.getItem('userType') as UserType) || null;
  const userId =
    userType === 'arrendador'
      ? localStorage.getItem('arrendadorId')
      : localStorage.getItem('userId');
  const email = localStorage.getItem('userEmail');
  return { token, userType, userId, email };
};

export const useAuth = () => {
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<UserType>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const refreshAuth = useCallback(() => {
    const snapshot = readAuthSnapshot();
    setUserType(snapshot.token ? snapshot.userType : null);
    setUserId(snapshot.token ? snapshot.userId : null);
    setEmail(snapshot.token ? snapshot.email : null);
  }, []);

  useEffect(() => {
    refreshAuth();
    setLoading(false);

    const onStorage = (e: StorageEvent) => {
      if (
        e.key === 'jwtToken' ||
        e.key === 'userType' ||
        e.key === 'arrendadorId' ||
        e.key === 'userId' ||
        e.key === 'userEmail'
      ) {
        refreshAuth();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refreshAuth]);

  const loginStudent = async (emailArg: string, password: string) => {
    try {
      const response = await userService.login(emailArg, password);
      setUser(response.user);
      refreshAuth();
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const loginLandlord = async (emailArg: string, password: string) => {
    try {
      const response = await arrendadorService.login(emailArg, password);
      setUser(response.arrendador);
      refreshAuth();
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    if (userType === 'student') {
      userService.logout();
    } else {
      arrendadorService.logout();
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userEmail');
    }
    setUser(null);
    setUserType(null);
    setUserId(null);
    setEmail(null);
  };

  return {
    user,
    loading,
    userType,
    userId,
    email,
    loginStudent,
    loginLandlord,
    logout,
    refreshAuth,
    isAuthenticated: userType !== null && userId !== null,
  };
};
