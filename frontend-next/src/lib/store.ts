import { create } from "zustand";

interface User {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    localStorage.setItem("cp_token", token);
    localStorage.setItem("cp_user", JSON.stringify(user));
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("cp_token");
    localStorage.removeItem("cp_user");
    set({ user: null, token: null });
  },
  hydrate: () => {
    const token = localStorage.getItem("cp_token");
    const raw = localStorage.getItem("cp_user");
    if (token && raw) {
      try {
        set({ token, user: JSON.parse(raw) });
      } catch {
        set({ token: null, user: null });
      }
    }
  },
}));

interface NotificationState {
  unreadCount: number;
  setUnreadCount: (n: number) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (n) => set({ unreadCount: n }),
}));
