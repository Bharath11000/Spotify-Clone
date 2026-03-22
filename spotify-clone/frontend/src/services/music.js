import api from './api';

export const musicService = {
  // Tracks
  async getTracks() {
    const { data } = await api.get('/music/tracks/?page_size=10000');
    return data;
  },

  async getTrack(id) {
    const { data } = await api.get(`/music/tracks/${id}/`);
    return data;
  },

  async incrementPlay(id) {
    const { data } = await api.post(`/music/tracks/${id}/play/`);
    return data;
  },

  async toggleLike(id) {
    const { data } = await api.post(`/music/tracks/${id}/like/`);
    return data;
  },

  async getLikedTracks() {
    const { data } = await api.get('/music/liked/');
    return data;
  },

  // Albums
  async getAlbums() {
    const { data } = await api.get('/music/albums/');
    return data;
  },

  async getAlbum(id) {
    const { data } = await api.get(`/music/albums/${id}/`);
    return data;
  },

  // Artists
  async getArtists() {
    const { data } = await api.get('/music/artists/');
    return data;
  },

  async getArtist(id) {
    const { data } = await api.get(`/music/artists/${id}/`);
    return data;
  },

  // Search
  async search(query) {
    const { data } = await api.get(`/music/search/?q=${encodeURIComponent(query)}`);
    return data;
  },
};