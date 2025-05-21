export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  
  // Default API request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    ME: '/auth/me',
  },
  
  // User endpoints
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
  },
  
  // Ticket endpoints
  TICKETS: {
    BASE: '/tickets',
    MY_TICKETS: '/tickets/my-tickets',
    ASSIGNED_TICKETS: '/tickets/assigned',
    STATUS: (id) => `/tickets/${id}/status`,
    ASSIGN: (id) => `/tickets/${id}/assign`,
    COMMENTS: (id) => `/tickets/${id}/comments`,
    ATTACHMENTS: (id) => `/tickets/${id}/attachments`,
  },
  
  // Category endpoints
  CATEGORIES: {
    BASE: '/categories',
  },
  
  // Dashboard endpoints
  DASHBOARD: {
    STATS: '/dashboard/stats',
    TICKET_STATUS: '/dashboard/ticket-status',
    TICKET_PRIORITY: '/dashboard/ticket-priority',
    RECENT_TICKETS: '/dashboard/recent-tickets',
    ACTIVITY_LOG: '/dashboard/activity-log',
  },
};

// Application settings
export const APP_CONFIG = {
  // Default pagination settings
  PAGINATION: {
    PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  },
  
  // Default date format
  DATE_FORMAT: 'yyyy-MM-dd',
  DATE_TIME_FORMAT: 'yyyy-MM-dd HH:mm',
  
  // Maximum file size for uploads (5MB)
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  
  // Allowed file types for uploads
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
};

// Application routes
export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Protected routes
  DASHBOARD: '/',
  TICKETS: '/tickets',
  TICKET_DETAILS: (id = ':id') => `/tickets/${id}`,
  NEW_TICKET: '/tickets/new',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Admin routes
  ADMIN: {
    USERS: '/admin/users',
    CATEGORIES: '/admin/categories',
    REPORTS: '/admin/reports',
  },
};

// Application constants
export const CONSTANTS = {
  // Ticket statuses
  TICKET_STATUS: {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    RESOLVED: 'resolved',
    CLOSED: 'closed',
    REOPENED: 'reopened',
  },
  
  // Ticket priorities
  TICKET_PRIORITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
  },
  
  // User roles
  ROLES: {
    ADMIN: 'admin',
    SUPPORT: 'support',
    USER: 'user',
  },
};

// Helper functions
export const helpers = {
  // Format date
  formatDate: (date, format = APP_CONFIG.DATE_FORMAT) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      ...(format === APP_CONFIG.DATE_TIME_FORMAT && {
        hour: '2-digit',
        minute: '2-digit',
      })
    });
  },
  
  // Get user role display name
  getRoleDisplayName: (role) => {
    const roleNames = {
      [CONSTANTS.ROLES.ADMIN]: 'Administrator',
      [CONSTANTS.ROLES.SUPPORT]: 'Support Staff',
      [CONSTANTS.ROLES.USER]: 'User',
    };
    return roleNames[role] || role;
  },
  
  // Get ticket status display name
  getTicketStatusDisplayName: (status) => {
    const statusNames = {
      [CONSTANTS.TICKET_STATUS.OPEN]: 'Open',
      [CONSTANTS.TICKET_STATUS.IN_PROGRESS]: 'In Progress',
      [CONSTANTS.TICKET_STATUS.RESOLVED]: 'Resolved',
      [CONSTANTS.TICKET_STATUS.CLOSED]: 'Closed',
      [CONSTANTS.TICKET_STATUS.REOPENED]: 'Reopened',
    };
    return statusNames[status] || status;
  },
  
  // Get ticket priority display name
  getTicketPriorityDisplayName: (priority) => {
    const priorityNames = {
      [CONSTANTS.TICKET_PRIORITY.LOW]: 'Low',
      [CONSTANTS.TICKET_PRIORITY.MEDIUM]: 'Medium',
      [CONSTANTS.TICKET_PRIORITY.HIGH]: 'High',
      [CONSTANTS.TICKET_PRIORITY.CRITICAL]: 'Critical',
    };
    return priorityNames[priority] || priority;
  },
  
  // Get ticket priority color
  getTicketPriorityColor: (priority) => {
    const colors = {
      [CONSTANTS.TICKET_PRIORITY.LOW]: 'success',
      [CONSTANTS.TICKET_PRIORITY.MEDIUM]: 'info',
      [CONSTANTS.TICKET_PRIORITY.HIGH]: 'warning',
      [CONSTANTS.TICKET_PRIORITY.CRITICAL]: 'error',
    };
    return colors[priority] || 'default';
  },
  
  // Get ticket status color
  getTicketStatusColor: (status) => {
    const colors = {
      [CONSTANTS.TICKET_STATUS.OPEN]: 'primary',
      [CONSTANTS.TICKET_STATUS.IN_PROGRESS]: 'info',
      [CONSTANTS.TICKET_STATUS.RESOLVED]: 'success',
      [CONSTANTS.TICKET_STATUS.CLOSED]: 'default',
      [CONSTANTS.TICKET_STATUS.REOPENED]: 'warning',
    };
    return colors[status] || 'default';
  },
};
