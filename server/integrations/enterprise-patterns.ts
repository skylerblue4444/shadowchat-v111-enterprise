/**
 * 🏢 ENTERPRISE INTEGRATION PATTERNS
 * 
 * Incorporates best practices from leading open-source projects:
 * - React (UI components, hooks, state management)
 * - Next.js (API routes, middleware, caching)
 * - NestJS (dependency injection, decorators, modules)
 * - Express (middleware, routing)
 * - TypeORM/Drizzle (database abstraction)
 * - tRPC (type-safe APIs)
 */

import { z } from "zod";

/**
 * PATTERN 1: Dependency Injection Container
 * Inspired by NestJS
 */
export class ServiceContainer {
  private services: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();

  register<T>(name: string, factory: () => T, options?: { singleton?: boolean }) {
    this.services.set(name, { factory, singleton: options?.singleton ?? true });
  }

  get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) throw new Error(`Service ${name} not found`);

    if (service.singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, service.factory());
      }
      return this.singletons.get(name);
    }

    return service.factory();
  }

  clear() {
    this.services.clear();
    this.singletons.clear();
  }
}

/**
 * PATTERN 2: Middleware Pipeline
 * Inspired by Express and Next.js
 */
export type Middleware<T = any> = (
  context: T,
  next: () => Promise<void>
) => Promise<void>;

export class MiddlewarePipeline<T = any> {
  private middlewares: Middleware<T>[] = [];

  use(middleware: Middleware<T>): this {
    this.middlewares.push(middleware);
    return this;
  }

  async execute(context: T): Promise<void> {
    let index = -1;

    const dispatch = async (i: number): Promise<void> => {
      if (i <= index) return;
      index = i;

      const middleware = this.middlewares[i];
      if (!middleware) return;

      await middleware(context, () => dispatch(i + 1));
    };

    await dispatch(0);
  }
}

/**
 * PATTERN 3: Repository Pattern
 * Inspired by TypeORM and enterprise architecture
 */
export interface IRepository<T> {
  find(criteria: Partial<T>): Promise<T[]>;
  findOne(id: string | number): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string | number, data: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<boolean>;
}

export abstract class BaseRepository<T extends { id: string | number }> implements IRepository<T> {
  abstract find(criteria: Partial<T>): Promise<T[]>;
  abstract findOne(id: string | number): Promise<T | null>;
  abstract create(data: Partial<T>): Promise<T>;
  abstract update(id: string | number, data: Partial<T>): Promise<T>;
  abstract delete(id: string | number): Promise<boolean>;
}

/**
 * PATTERN 4: Query Builder
 * Inspired by TypeORM and Drizzle
 */
export class QueryBuilder<T> {
  private filters: Array<(item: T) => boolean> = [];
  private sortBy: { field: keyof T; order: "asc" | "desc" } | null = null;
  private limit_: number | null = null;
  private offset_: number | null = null;

  where(predicate: (item: T) => boolean): this {
    this.filters.push(predicate);
    return this;
  }

  orderBy(field: keyof T, order: "asc" | "desc" = "asc"): this {
    this.sortBy = { field, order };
    return this;
  }

  limit(count: number): this {
    this.limit_ = count;
    return this;
  }

  offset(count: number): this {
    this.offset_ = count;
    return this;
  }

  async execute(data: T[]): Promise<T[]> {
    let result = data;

    // Apply filters
    for (const filter of this.filters) {
      result = result.filter(filter);
    }

    // Apply sorting
    if (this.sortBy) {
      result.sort((a, b) => {
        const aVal = a[this.sortBy!.field];
        const bVal = b[this.sortBy!.field];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return this.sortBy!.order === "asc" ? comparison : -comparison;
      });
    }

    // Apply offset and limit
    if (this.offset_) {
      result = result.slice(this.offset_);
    }
    if (this.limit_) {
      result = result.slice(0, this.limit_);
    }

    return result;
  }
}

/**
 * PATTERN 5: Event Emitter
 * Inspired by Node.js EventEmitter and React event system
 */
export type EventListener<T = any> = (data: T) => void | Promise<void>;

export class EventBus {
  private listeners: Map<string, EventListener[]> = new Map();

  on<T = any>(event: string, listener: EventListener<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);

    // Return unsubscribe function
    return () => {
      const list = this.listeners.get(event);
      if (list) {
        const index = list.indexOf(listener);
        if (index > -1) list.splice(index, 1);
      }
    };
  }

  async emit<T = any>(event: string, data?: T): Promise<void> {
    const listeners = this.listeners.get(event) || [];
    await Promise.all(listeners.map(listener => listener(data)));
  }

  off(event: string, listener: EventListener): void {
    const list = this.listeners.get(event);
    if (list) {
      const index = list.indexOf(listener);
      if (index > -1) list.splice(index, 1);
    }
  }

  clear(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

/**
 * PATTERN 6: Decorator Pattern
 * Inspired by TypeScript decorators and NestJS
 */
export function Cached(ttl: number = 60000) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = new Map<string, { data: any; expiry: number }>();

    descriptor.value = function (...args: any[]) {
      const key = JSON.stringify(args);
      const cached = cache.get(key);

      if (cached && cached.expiry > Date.now()) {
        return cached.data;
      }

      const result = originalMethod.apply(this, args);
      cache.set(key, { data: result, expiry: Date.now() + ttl });
      return result;
    };

    return descriptor;
  };
}

export function Validate(schema: z.ZodSchema) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const validated = await schema.parseAsync(args[0]);
      return originalMethod.call(this, validated, ...args.slice(1));
    };

    return descriptor;
  };
}

/**
 * PATTERN 7: Circuit Breaker
 * Inspired by resilience patterns
 */
export class CircuitBreaker {
  private state: "closed" | "open" | "half-open" = "closed";
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;

  constructor(
    private failureThreshold: number = 5,
    private successThreshold: number = 2,
    private timeout: number = 60000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = "half-open";
        this.successCount = 0;
      } else {
        throw new Error("Circuit breaker is open");
      }
    }

    try {
      const result = await fn();

      if (this.state === "half-open") {
        this.successCount++;
        if (this.successCount >= this.successThreshold) {
          this.state = "closed";
          this.failureCount = 0;
        }
      } else {
        this.failureCount = 0;
      }

      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();

      if (this.failureCount >= this.failureThreshold) {
        this.state = "open";
      }

      throw error;
    }
  }

  getState() {
    return { state: this.state, failureCount: this.failureCount };
  }
}

/**
 * PATTERN 8: Data Transfer Object (DTO)
 * Inspired by NestJS and enterprise patterns
 */
export function createDTO<T extends Record<string, any>>(schema: z.ZodSchema) {
  return class DTO {
    constructor(data: any) {
      const validated = schema.parse(data);
      Object.assign(this, validated);
    }

    static async validate(data: any): Promise<DTO> {
      await schema.parseAsync(data);
      return new DTO(data);
    }
  };
}

/**
 * PATTERN 9: Caching Strategy
 * Inspired by Redis and caching best practices
 */
export interface CacheStrategy {
  get(key: string): Promise<any | null>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

export class InMemoryCache implements CacheStrategy {
  private cache: Map<string, { value: any; expiry: number }> = new Map();

  async get(key: string): Promise<any | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    if (item.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: any, ttl: number = 60000): Promise<void> {
    this.cache.set(key, { value, expiry: Date.now() + ttl });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}

/**
 * PATTERN 10: Error Handling
 * Inspired by enterprise error handling patterns
 */
export class ApplicationError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "ApplicationError";
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, details?: Record<string, any>) {
    super("VALIDATION_ERROR", 400, message, details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends ApplicationError {
  constructor(resource: string, id: string | number) {
    super("NOT_FOUND", 404, `${resource} with id ${id} not found`);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message: string = "Unauthorized") {
    super("UNAUTHORIZED", 401, message);
    this.name = "UnauthorizedError";
  }
}

// Export singleton instances
export const serviceContainer = new ServiceContainer();
export const eventBus = new EventBus();
export const cache = new InMemoryCache();
