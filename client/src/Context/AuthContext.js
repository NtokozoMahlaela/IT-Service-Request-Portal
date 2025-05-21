import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock login function
  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a mock user
      const user = { 
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'user'
      };
      
      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Failed to log in' };
    }
  };

  // Mock logout function
  const logout = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      setCurrentUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Failed to log out' };
    }
  };

  // Set up auth state listener (mock)
  useEffect(() => {
    const unsubscribe = () => {
      // Simulate checking if user is logged in
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    };
    
    return unsubscribe();
  }, []);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;