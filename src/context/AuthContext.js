import { createContext, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const isActive = localStorage.getItem('sessionActive') === 'true';
      if (storedUser && isActive) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error al cargar usuario del localStorage:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('sessionActive', 'true');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('sessionActive');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
      updateUser,
    }),
    [user, isAuthenticated]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
