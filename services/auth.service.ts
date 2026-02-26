import { apiClient, TOKEN_KEYS } from './api';

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    hospitalId?: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data: res } = await apiClient.post<{ success: boolean; data: LoginResponse }>('/auth/login', { email, password });
    const data = res.data; // unwrap { success, data, timestamp } envelope
    localStorage.setItem(TOKEN_KEYS.ACCESS, data.tokens.accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH, data.tokens.refreshToken);
    localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(data.user));
    return data;
  },

  logout(): void {
    Object.values(TOKEN_KEYS).forEach((key) => localStorage.removeItem(key));
  },

  getStoredUser(): LoginResponse['user'] | null {
    const stored = localStorage.getItem(TOKEN_KEYS.USER);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEYS.ACCESS);
  },

  async updateProfile(data: { name: string }): Promise<LoginResponse['user']> {
    const { data: res } = await apiClient.patch<{ success: boolean; data: LoginResponse['user'] }>('/users/me', data);
    const updated = res.data;
    const stored = this.getStoredUser();
    if (stored) {
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify({ ...stored, ...updated }));
    }
    return updated;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', { currentPassword, newPassword });
  },
};
