import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const fullName = localStorage.getItem('fullName');
    const email = localStorage.getItem('email');
    return token ? { token, role, fullName, email } : null;
  });

  const login = (token, role, fullName, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (fullName) localStorage.setItem('fullName', fullName);
    if (email) localStorage.setItem('email', email);
    setUser({ token, role, fullName, email });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
