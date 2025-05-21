import axios from 'axios';

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Auto logout if 401 response returned from API
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh-token'),
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (data) => api.put('/users/change-password', data),
};

// Tickets API
export const ticketsAPI = {
  getAll: (params) => api.get('/tickets', { params }),
  getById: (id) => api.get(`/tickets/${id}`),
  create: (ticketData) => api.post('/tickets', ticketData),
  update: (id, ticketData) => api.put(`/tickets/${id}`, ticketData),
  delete: (id) => api.delete(`/tickets/${id}`),
  getMyTickets: (params) => api.get('/tickets/my-tickets', { params }),
  getAssignedTickets: (params) => api.get('/tickets/assigned', { params }),
  updateStatus: (id, status) => api.patch(`/tickets/${id}/status`, { status }),
  assignTo: (id, userId) => api.patch(`/tickets/${id}/assign`, { userId }),
  addComment: (id, comment) => api.post(`/tickets/${id}/comments`, { comment }),
  getComments: (id) => api.get(`/tickets/${id}/comments`),
  addAttachment: (id, formData) => {
    return api.post(`/tickets/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getAttachments: (id) => api.get(`/tickets/${id}/attachments`),
  deleteAttachment: (id, attachmentId) =>
    api.delete(`/tickets/${id}/attachments/${attachmentId}`),
};

// Categories API
export const categoriesAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getTicketStatus: () => api.get('/dashboard/ticket-status'),
  getTicketPriority: () => api.get('/dashboard/ticket-priority'),
  getRecentTickets: (limit = 5) => api.get(`/dashboard/recent-tickets?limit=${limit}`),
  getActivityLog: (limit = 10) => api.get(`/dashboard/activity-log?limit=${limit}`),
};

// Export the configured axios instance in case it's needed directly
export default api;