/**
 * Authentication Type Definitions
 * Structures for the authentication system
 */

/**
 * Authentication credentials
 */
export interface AuthCredentials {
  username: string;
  password: string;
}

/**
 * User role in the system
 */
export type AuthRole = 'admin' | 'coordinator' | 'assessor';

/**
 * Authentication session
 */
export interface AuthSession {
  userId: string;
  username: string;
  role: AuthRole;
  expiresAt: Date;
  createdAt: Date;
}

/**
 * Authentication result
 */
export interface AuthResult {
  success: boolean;
  session?: AuthSession;
  error?: string;
}

/**
 * Role-based permissions
 */
export interface RolePermissions {
  canViewAdminMetrics: boolean;
  canViewCoordinatorMetrics: boolean;
  canViewAssessorMetrics: boolean;
  canExportData: boolean;
  canAccessRecommendations: boolean;
}

/**
 * Default permissions by role
 */
export const defaultPermissions: Record<AuthRole, RolePermissions> = {
  admin: {
    canViewAdminMetrics: true,
    canViewCoordinatorMetrics: true,
    canViewAssessorMetrics: true,
    canExportData: true,
    canAccessRecommendations: true
  },
  coordinator: {
    canViewAdminMetrics: false,
    canViewCoordinatorMetrics: true,
    canViewAssessorMetrics: true,
    canExportData: true,
    canAccessRecommendations: true
  },
  assessor: {
    canViewAdminMetrics: false,
    canViewCoordinatorMetrics: false,
    canViewAssessorMetrics: true,
    canExportData: false,
    canAccessRecommendations: true
  }
};