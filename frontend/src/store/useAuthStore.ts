import { create } from 'zustand';
import { apiClient } from '../services/apiClient';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  is_admin: boolean;
  is_super_admin: boolean;
  workspace_id: number;
}

export interface Workspace {
  id: number;
  company_name: string;
  plan_id: string;
  status: string;
  messages_limit: number;
  messages_used: number;
}

export interface Bot {
  id: number;
  name: string;
  is_active: boolean;
  ai_provider: string;
  model_type: string;
  bot_tone: string;
  welcome_message: string;
}

interface AuthState {
  user: User | null;
  workspace: Workspace | null;
  bot: Bot | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User, workspace: Workspace | null, bot: Bot | null) => void;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateBotStatus: (isActive: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize state from localStorage if available
  const savedToken = localStorage.getItem('rudood_token');
  const savedUser = localStorage.getItem('rudood_user');

  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    workspace: null,
    bot: null,
    token: savedToken,
    isAuthenticated: !!savedToken,
    isLoading: !!savedToken,

    login: (token, user, workspace, bot) => {
      localStorage.setItem('rudood_token', token);
      localStorage.setItem('rudood_user', JSON.stringify(user));
      set({
        token,
        user,
        workspace,
        bot,
        isAuthenticated: true,
        isLoading: false,
      });
    },

    logout: async () => {
      try {
        await apiClient.post('/auth/logout');
      } catch (e) {
        // non-fatal
      } finally {
        localStorage.removeItem('rudood_token');
        localStorage.removeItem('rudood_user');
        set({
          user: null,
          workspace: null,
          bot: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    },

    fetchUser: async () => {
      const token = localStorage.getItem('rudood_token');
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      try {
        set({ isLoading: true });
        const res = await apiClient.get('/auth/user');
        if (res.data.success) {
          const { user, workspace, bot } = res.data.data;
          localStorage.setItem('rudood_user', JSON.stringify(user));
          set({
            user,
            workspace,
            bot,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } catch (err) {
        localStorage.removeItem('rudood_token');
        localStorage.removeItem('rudood_user');
        set({
          user: null,
          workspace: null,
          bot: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    },

    updateBotStatus: (isActive: boolean) => {
      set((state) => ({
        bot: state.bot ? { ...state.bot, is_active: isActive } : null,
      }));
    },
  };
});
