// Экспортируем все API модули
export { default as apiClient } from './client';
export { default as authAPI } from './auth';
export { default as usersAPI } from './users';
export { default as contentAPI, newsAPI, grantsAPI, scholarshipsAPI, competitionsAPI, innovationsAPI, internshipsAPI, jobsAPI, teamAPI } from './content';
export { default as commentsAPI } from './comments';
export { default as analyticsAPI } from './analytics';
export { applicationsAPI } from './applications';
export { adminsAPI } from './admins';

// Экспортируем типы
export type { LoginCredentials, AdminUser as AuthUser, LoginResponse } from './auth';
export type { User, UsersListResponse, CreateUserData } from './users';
export type {
  News,
  Grant,
  Scholarship,
  Competition,
  Innovation,
  Internship,
  Job,
  TeamMember,
  NewsFormData,
  ListResponse,
  ListParams,
} from './content';
export type { Comment, CommentModerationData, CommentsParams } from './comments';
export type { Application, ApplicationStats } from './applications';
export type { AdminUser as AdminUserType, MenuItem, CreateAdminData, UpdateAdminData } from './admins';
export type {
  DashboardStats,
  DailyVisitor,
  PageAnalytics,
  TopContent,
  DeviceStats,
  TrafficSource,
  UserActivityStats,
  AnalyticsParams,
} from './analytics';

