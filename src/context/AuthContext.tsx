import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthUser, Role } from '../types';
type AuthContextValue = { user: AuthUser | null; signIn: (user: AuthUser) => void; signOut: () => void; hasRole: (...roles: Role[]) => boolean };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const USER_KEY = 'jobPortalUser'; const TOKEN_KEY = 'jobPortalToken';
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; } });
  const signOut = () => { localStorage.removeItem(USER_KEY); localStorage.removeItem(TOKEN_KEY); setUser(null); };
  const signIn = (value: AuthUser) => { localStorage.setItem(USER_KEY, JSON.stringify(value)); localStorage.setItem(TOKEN_KEY, value.token); setUser(value); };
  useEffect(() => { window.addEventListener('auth:expired', signOut); return () => window.removeEventListener('auth:expired', signOut); }, []);
  useEffect(() => {
    const downloadProtectedResume = async (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a[href*="/api/applications/"][href$="/resume"]') as HTMLAnchorElement | null;
      if (!anchor || !user?.token) return;
      event.preventDefault();
      const response = await fetch(anchor.href, { headers: { Authorization: `Bearer ${user.token}` } });
      if (!response.ok) return;
      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement('a'); link.href = objectUrl; link.download = 'resume'; link.click(); URL.revokeObjectURL(objectUrl);
    };
    document.addEventListener('click', downloadProtectedResume);
    return () => document.removeEventListener('click', downloadProtectedResume);
  }, [user]);
  const value = useMemo(() => ({ user, signIn, signOut, hasRole: (...roles: Role[]) => !!user && roles.includes(user.role) }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider'); return context; };
