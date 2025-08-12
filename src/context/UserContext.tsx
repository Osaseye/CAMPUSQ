import { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextProps {
  username: string;
  setUsername: (username: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const logout = () => {
    setUsername('');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        isAuthenticated,
        setIsAuthenticated,
        isAdmin,
        setIsAdmin,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
