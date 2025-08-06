import { pgTable, varchar, text, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
import { z } from "zod";

// Session storage table (required for authentication)
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Users table with healthcare-specific roles
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  employeeId: varchar("employee_id").unique(),
  department: text("department"), // Cardiology, Emergency, Billing, etc.
  jobTitle: text("job_title"),
  phoneNumber: varchar("phone_number"),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Roles for healthcare staff
export const roles = pgTable("roles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(), // Administrator, Clinical Manager, Billing Specialist, etc.
  displayName: text("display_name").notNull(),
  description: text("description"),
  level: integer("level").notNull(), // 1=Admin, 2=Manager, 3=Specialist, 4=Viewer
  department: text("department"), // null for cross-department roles
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User role assignments
export const userRoles = pgTable("user_roles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  roleId: varchar("role_id").notNull(),
  assignedBy: varchar("assigned_by"),
  assignedAt: timestamp("assigned_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // null for permanent assignments
  isActive: boolean("is_active").default(true),
});

// Permissions for specific features
export const permissions = pgTable("permissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(), // denials.view, ar.edit, collections.manage, etc.
  displayName: text("display_name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // Denials, AR Management, Collections, etc.
  level: text("level").$type<"view" | "edit" | "manage" | "admin">().notNull(),
  isActive: boolean("is_active").default(true),
});

// Role permissions mapping
export const rolePermissions = pgTable("role_permissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roleId: varchar("role_id").notNull(),
  permissionId: varchar("permission_id").notNull(),
  grantedBy: varchar("granted_by"),
  grantedAt: timestamp("granted_at").defaultNow(),
});

// User sessions and activity tracking
export const userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sessionId: varchar("session_id").notNull(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  loginAt: timestamp("login_at").defaultNow(),
  logoutAt: timestamp("logout_at"),
  isActive: boolean("is_active").default(true),
});

// Audit trail for sensitive actions
export const auditLog = pgTable("audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  action: text("action").notNull(), // login, logout, view_denial, edit_claim, etc.
  resource: text("resource"), // denial_id, claim_id, etc.
  resourceType: text("resource_type"), // denial, claim, patient, etc.
  details: jsonb("details"), // additional context
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Department access restrictions
export const departmentAccess = pgTable("department_access", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  department: text("department").notNull(),
  accessLevel: text("access_level").$type<"full" | "limited" | "read_only">().notNull(),
  grantedBy: varchar("granted_by"),
  grantedAt: timestamp("granted_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Insert schemas
export const insertUsersSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRolesSchema = createInsertSchema(roles).omit({
  id: true,
  createdAt: true,
});

export const insertUserRolesSchema = createInsertSchema(userRoles).omit({
  id: true,
  assignedAt: true,
});

export const insertPermissionsSchema = createInsertSchema(permissions).omit({
  id: true,
});

export const insertRolePermissionsSchema = createInsertSchema(rolePermissions).omit({
  id: true,
  grantedAt: true,
});

export const insertUserSessionsSchema = createInsertSchema(userSessions).omit({
  id: true,
  loginAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLog).omit({
  id: true,
  timestamp: true,
});

export const insertDepartmentAccessSchema = createInsertSchema(departmentAccess).omit({
  id: true,
  grantedAt: true,
});

// UpsertUser for authentication
export const upsertUserSchema = insertUsersSchema.extend({
  id: z.string().optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUsersSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type Role = typeof roles.$inferSelect;
export type InsertRole = z.infer<typeof insertRolesSchema>;
export type UserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = z.infer<typeof insertUserRolesSchema>;
export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = z.infer<typeof insertPermissionsSchema>;
export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = z.infer<typeof insertRolePermissionsSchema>;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionsSchema>;
export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type DepartmentAccess = typeof departmentAccess.$inferSelect;
export type InsertDepartmentAccess = z.infer<typeof insertDepartmentAccessSchema>;