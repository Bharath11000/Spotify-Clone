import api from './api';

export const playlistService = {
  async getPlaylists() {
    const { data } = await api.get('/playlists/');
    return data;
  },

  async getPlaylist(id) {
    const { data } = await api.get(`/playlists/${id}/`);
    return data;
  },

  async createPlaylist({ name, description = '', is_public = true }) {
    const { data } = await api.post('/playlists/', { name, description, is_public });
    return data;
  },

  async updatePlaylist(id, updates) {
    const { data } = await api.patch(`/playlists/${id}/`, updates);
    return data;
  },

  async deletePlaylist(id) {
    await api.delete(`/playlists/${id}/`);
  },

  async addTrack(playlistId, trackId) {
    const { data } = await api.post(`/playlists/${playlistId}/tracks/`, { track_id: trackId });
    return data;
  },

  async removeTrack(playlistId, trackId) {
    const { data } = await api.delete(`/playlists/${playlistId}/tracks/${trackId}/`);
    return data;
  },
};