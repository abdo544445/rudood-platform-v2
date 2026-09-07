import { create } from 'zustand';
import { apiClient } from '../services/apiClient';

export interface MaintenanceDetails {
  is_active: boolean;
  title: string;
  message: string;
  scheduled_ends_at: string | null;
  activated_at?: string | null;
  activated_by?: number | null;
}

interface MaintenanceStoreState {
  maintenance: MaintenanceDetails;
  isLoading: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  fetchStatus: () => Promise<void>;
  toggleMaintenance: (data: {
    is_active: boolean;
    title?: string;
    message?: string;
    scheduled_ends_at?: string | null;
  }) => Promise<{ success: boolean; message?: string }>;
}

export const useMaintenanceStore = create<MaintenanceStoreState>((set, get) => ({
  maintenance: {
    is_active: false,
    title: 'أعمال صيانة وتطوير مجدولة 🛠️',
    message: 'نقوم حالياً بإجراء تحديثات دورية وتطويرات هامة على أنظمة منصة ردود لتعزيز استقرار البنية التحتية وتقديم تجربة ردود ذكية فائقة السرعة.',
    scheduled_ends_at: null,
  },
  isLoading: false,
  isModalOpen: false,

  setIsModalOpen: (open) => set({ isModalOpen: open }),

  fetchStatus: async () => {
    try {
      set({ isLoading: true });
      const res = await apiClient.get('/system/maintenance/status');
      if (res.data?.success && res.data?.data) {
        set({
          maintenance: {
            is_active: Boolean(res.data.data.is_active),
            title: res.data.data.title || 'أعمال صيانة وتطوير مجدولة 🛠️',
            message: res.data.data.message || '',
            scheduled_ends_at: res.data.data.scheduled_ends_at || null,
            activated_at: res.data.data.activated_at,
            activated_by: res.data.data.activated_by,
          }
        });
      }
    } catch (e) {
      console.error('Failed to fetch maintenance status', e);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleMaintenance: async (data) => {
    try {
      const res = await apiClient.post('/admin/maintenance/toggle', {
        is_active: data.is_active,
        title: data.title,
        message: data.message,
        scheduled_end: data.scheduled_ends_at,
        scheduled_ends_at: data.scheduled_ends_at,
      });

      if (res.data?.success) {
        set({
          maintenance: {
            ...get().maintenance,
            is_active: data.is_active,
            title: data.title || get().maintenance.title,
            message: data.message || get().maintenance.message,
            scheduled_ends_at: data.scheduled_ends_at ?? null,
          }
        });
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data?.message || 'حدث خطأ أثناء حفظ وضع الصيانة' };
    } catch (e: any) {
      const msg = e.response?.data?.message || 'تعذر تحديث إعدادات الصيانة';
      return { success: false, message: msg };
    }
  }
}));
