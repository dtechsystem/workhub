import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  stack?: string;
  location?: string;
  bio?: string;
  xp: number;
  balance: number;
  pendingBalance: number;
  requestBalance: number;
  frozenBalance: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isAuthenticated: boolean;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 98765-4321',
    password: 'senha123',
    stack: 'Full Stack Developer',
    xp: 2500,
    balance: 5420.00,
    pendingBalance: 1200.00,
    requestBalance: 10000.00,
    frozenBalance: 2500.00,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    phone: '(11) 91234-5678',
    password: 'senha456',
    stack: 'Frontend Developer',
    xp: 1800,
    balance: 3200.00,
    pendingBalance: 800.00,
    requestBalance: 8000.00,
    frozenBalance: 1500.00,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);

    if (!foundUser) {
      throw new Error('Email ou senha inválidos');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));

    toast({
      title: 'Login realizado!',
      description: `Bem-vindo de volta, ${userWithoutPassword.name}!`,
    });

    navigate('/dashboard');
  };

  const signup = async (data: SignupData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const newUser: User = {
      id: String(mockUsers.length + 1),
      name: data.name,
      email: data.email,
      phone: data.phone,
      stack: 'Developer',
      xp: 0,
      balance: 0,
      pendingBalance: 0,
      requestBalance: 5000.00,
      frozenBalance: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`
    };

    mockUsers.push({ ...newUser, password: data.password });
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));

    toast({
      title: 'Conta criada!',
      description: 'Sua conta foi criada com sucesso.',
    });

    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: 'Logout realizado',
      description: 'Até logo!',
    });
    navigate('/');
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
