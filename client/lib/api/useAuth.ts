import { useEffect, useState } from 'react';
import { userService } from '@/lib/api/userService';
import { arrendadorService } from '@/lib/api/arrendadorService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'student' | 'landlord' | null>(null);

  // Verificar si hay sesión al cargar
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const type = localStorage.getItem('userType');

    if (token) {
      // Aquí podrías validar el token con el backend
      setUserType(type as 'student' | 'landlord' | null);
    }
    setLoading(false);
  }, []);

  const loginStudent = async (email: string, password: string) => {
    try {
      const response = await userService.login(email, password);
      setUser(response.user);
      setUserType('student');
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const loginLandlord = async (email: string, password: string) => {
    try {
      const response = await arrendadorService.login(email, password);
      setUser(response.arrendador);
      setUserType('landlord');
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
    setUser(null);
    setUserType(null);
  };

  return {
    user,
    loading,
    userType,
    loginStudent,
    loginLandlord,
    logout,
    isAuthenticated: !!user,
  };
};