import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

export const createReview = async (payload) => {
  const { data } = await api.post('/reviews', payload);
  return data;
};

export const fetchReviews = async (params = {}) => {
  const { data } = await api.get('/reviews', { params });
  return data;
};

export const fetchReviewMetrics = async () => {
  const { data } = await api.get('/reviews/metrics');
  return data;
};

export const fetchReviewById = async (id) => {
  const { data } = await api.get(`/reviews/${id}`);
  return data;
};

export const deleteReview = async (id) => {
  const { data } = await api.delete(`/reviews/${id}`);
  return data;
};

export default api;
