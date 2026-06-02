/**
 * 🔐 ENTERPRISE SECURITY PATTERNS
 * 
 * Incorporates security best practices from:
 * - OWASP Top 10
 * - Node.js security best practices
 * - Auth0, Firebase authentication patterns
 * - Industry-standard encryption
 */

import { z } from "zod";
import crypto from "crypto";

/**
 * PATTERN 1: Input Validation & Sanitization
 */
export class InputValidator {
  static email(value: string): string {
    const schema = z.string().email();
    return schema.parse(value);
  }

  static password(value: string): string {
    const schema = z.string()
      .min(12, "Password must be at least 12 characters")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[a-z]/, "Must contain lowercase letter")
      .regex(/[0-9]/, "Must contain number")
      .regex(/[!@#$%^&*]/, "Must contain special character");
    return schema.parse(value);
  }

  static username(value: string): string {
    const schema = z.string()
      .min(3)
      .max(32)
      .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain alphanumeric, underscore, and hyphen");
    return schema.parse(value);
  }

  static url(value: string): string {
    const schema = z.string().url();
    return schema.parse(value);
  }

  static sanitize(value: string): string {
    return value
      .replace(/[<>]/g, "") // Remove angle brackets
      .replace(/javascript:/gi, "") // Remove javascript protocol
      .replace(/on\w+\s*=/gi, ""); // Remove event handlers
  }
}

/**
 * PATTERN 2: Rate Limiting
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    let record = this.attempts.get(identifier);

    if (!record || record.resetTime < now) {
      record = { count: 0, resetTime: now + this.windowMs };
      this.attempts.set(identifier, record);
    }

    const allowed = record.count < this.maxAttempts;
    record.count++;

    return {
      allowed,
      remaining: Math.max(0, this.maxAttempts - record.count),
      resetTime: record.resetTime,
    };
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  clear(): void {
    this.attempts.clear();
  }
}

/**
 * PATTERN 3: Encryption & Hashing
 */
export class CryptoService {
  private algorithm = "aes-256-gcm";
  private keyLength = 32; // 256 bits

  /**
   * Hash password with salt
   */
  static hashPassword(password: string, saltRounds: number = 10): string {
    const salt = crypto.randomBytes(16);
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512");
    return `${salt.toString("hex")}:${hash.toString("hex")}`;
  }

  /**
   * Verify password
   */
  static verifyPassword(password: string, hash: string): boolean {
    const [saltHex, hashHex] = hash.split(":");
    const salt = Buffer.from(saltHex, "hex");
    const computedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512");
    return computedHash.toString("hex") === hashHex;
  }

  /**
   * Encrypt data
   */
  encrypt(data: string, key: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(key, "hex"), iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
  }

  /**
   * Decrypt data
   */
  decrypt(encryptedData: string, key: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(key, "hex"), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  /**
   * Generate secure random token
   */
  static generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }

  /**
   * Generate HMAC signature
   */
  static hmacSign(data: string, secret: string): string {
    return crypto.createHmac("sha256", secret).update(data).digest("hex");
  }

  /**
   * Verify HMAC signature
   */
  static hmacVerify(data: string, signature: string, secret: string): boolean {
    const expectedSignature = this.hmacSign(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
}

/**
 * PATTERN 4: JWT Token Management
 */
export interface JWTPayload {
  userId: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}

export class JWTService {
  constructor(private secret: string) {}

  /**
   * Create JWT token
   */
  sign(payload: Omit<JWTPayload, "iat" | "exp">, expiresIn: number = 3600000): string {
    const now = Math.floor(Date.now() / 1000);
    const token = {
      ...payload,
      iat: now,
      exp: now + Math.floor(expiresIn / 1000),
    };

    const header = this.base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = this.base64url(JSON.stringify(token));
    const signature = this.base64url(
      CryptoService.hmacSign(`${header}.${body}`, this.secret)
    );

    return `${header}.${body}.${signature}`;
  }

  /**
   * Verify and decode JWT token
   */
  verify(token: string): JWTPayload | null {
    try {
      const [header, body, signature] = token.split(".");
      const expectedSignature = this.base64url(
        CryptoService.hmacSign(`${header}.${body}`, this.secret)
      );

      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        return null;
      }

      const payload = JSON.parse(this.base64urlDecode(body));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp < now) {
        return null; // Token expired
      }

      return payload;
    } catch {
      return null;
    }
  }

  private base64url(str: string): string {
    return Buffer.from(str).toString("base64").replace(/[=+/]/g, (m) => {
      return { "=": "", "+": "-", "/": "_" }[m] || m;
    });
  }

  private base64urlDecode(str: string): string {
    str += "===".slice((str.length + 3) % 4);
    return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString();
  }
}

/**
 * PATTERN 5: CORS & Security Headers
 */
export interface SecurityHeaders {
  "content-security-policy": string;
  "x-content-type-options": string;
  "x-frame-options": string;
  "x-xss-protection": string;
  "strict-transport-security": string;
  "referrer-policy": string;
}

export class SecurityHeadersService {
  static getHeaders(origin?: string): SecurityHeaders {
    return {
      "content-security-policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
      "x-xss-protection": "1; mode=block",
      "strict-transport-security": "max-age=31536000; includeSubDomains",
      "referrer-policy": "strict-origin-when-cross-origin",
    };
  }

  static validateOrigin(origin: string, allowedOrigins: string[]): boolean {
    return allowedOrigins.includes(origin) || allowedOrigins.includes("*");
  }
}

/**
 * PATTERN 6: SQL Injection Prevention
 */
export class SQLSafeQuery {
  static escape(value: any): string {
    if (value === null || value === undefined) return "NULL";
    if (typeof value === "number") return String(value);
    if (typeof value === "boolean") return value ? "1" : "0";
    if (typeof value === "string") {
      return `'${value.replace(/'/g, "''")}'`;
    }
    return "NULL";
  }

  static buildQuery(query: string, params: any[]): string {
    let index = 0;
    return query.replace(/\?/g, () => this.escape(params[index++]));
  }
}

/**
 * PATTERN 7: Permission & Role-Based Access Control
 */
export interface Permission {
  resource: string;
  action: string;
}

export interface Role {
  name: string;
  permissions: Permission[];
}

export class RBAC {
  private roles: Map<string, Role> = new Map();
  private userRoles: Map<string, string[]> = new Map();

  registerRole(role: Role): void {
    this.roles.set(role.name, role);
  }

  assignRole(userId: string, roleName: string): void {
    if (!this.roles.has(roleName)) {
      throw new Error(`Role ${roleName} not found`);
    }
    const userRoles = this.userRoles.get(userId) || [];
    if (!userRoles.includes(roleName)) {
      userRoles.push(roleName);
      this.userRoles.set(userId, userRoles);
    }
  }

  hasPermission(userId: string, resource: string, action: string): boolean {
    const userRoles = this.userRoles.get(userId) || [];
    return userRoles.some(roleName => {
      const role = this.roles.get(roleName);
      return role?.permissions.some(p => p.resource === resource && p.action === action);
    });
  }

  getPermissions(userId: string): Permission[] {
    const userRoles = this.userRoles.get(userId) || [];
    const permissions: Permission[] = [];
    userRoles.forEach(roleName => {
      const role = this.roles.get(roleName);
      if (role) permissions.push(...role.permissions);
    });
    return permissions;
  }
}

/**
 * PATTERN 8: Audit Logging
 */
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  changes: Record<string, any>;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditLogger {
  private logs: AuditLog[] = [];

  log(entry: Omit<AuditLog, "id" | "timestamp">): void {
    const auditLog: AuditLog = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    this.logs.push(auditLog);
  }

  getLogs(userId?: string, limit: number = 100): AuditLog[] {
    let filtered = this.logs;
    if (userId) {
      filtered = filtered.filter(log => log.userId === userId);
    }
    return filtered.slice(-limit);
  }

  clear(): void {
    this.logs = [];
  }
}

// Export singleton instances
export const cryptoService = new CryptoService();
export const jwtService = new JWTService(process.env.JWT_SECRET || "default-secret");
export const rbac = new RBAC();
export const auditLogger = new AuditLogger();
