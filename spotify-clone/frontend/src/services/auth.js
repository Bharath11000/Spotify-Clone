import api from './api';

export const authService = {
  async register({ email, username, password, password2 }) {
    const { data } = await api.post('/auth/register/', { email, username, password, password2 });
    return data;
  },

  async login({ email, password }) {
    const { data } = await api.post('/auth/login/', { email, password });
    return data;
  },

  async logout(refreshToken) {
    await api.post('/auth/logout/', { refresh: refreshToken });
  },

  async getProfile() {
    const { data } = await api.get('/auth/profile/');
    return data;
  },

  async updateProfile(formData) {
    const { data } = await api.patch('/auth/profile/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};