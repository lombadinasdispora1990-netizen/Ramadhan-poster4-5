import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getCurrentUser } from '../utils/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider component
 * Wraps the app to provide authentication context throughout the component tree
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions on mount with timeout to prevent infinite hang
    const checkUser = async () => {
      try {
        // Race between auth check and a 2-second timeout (optimized for speed)
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Auth check timeout')), 2000)
        );

        const currentUser = await Promise.race([
          getCurrentUser(),
          timeoutPromise
        ]);
        
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.warn('Auth check skipped:', error.message);
      } finally {
        // ALWAYS stop loading after timeout or fast-check
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes — handle events efficiently
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isLoaded: !loading
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0f1a 0%, #0f172a 50%, #0a0f1a 100%)',
          color: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #064e3b, #022c22)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.15)',
          }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#d1fae5' }}>B</span>
          </div>
          <p style={{
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: '#10b981',
            marginBottom: '8px',
          }}>Loading</p>
          <div style={{
            width: '120px',
            height: '2px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '1px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: '40%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
              borderRadius: '1px',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }} />
          </div>
          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(350%); }
            }
          `}</style>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
