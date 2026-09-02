// Custom error classes for consistent error handling across the app.

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode: number = 500, code: string = "INTERNAL_ERROR") {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "You must be logged in") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "You don't have permission to do this") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class ValidationError extends AppError {
  public readonly fieldErrors: Record<string, string[]>;

  constructor(message: string = "Validation failed", fieldErrors: Record<string, string[]> = {}) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists") {
    super(message, 409, "CONFLICT");
    this.name = "ConflictError";
  }
}

// Utility to handle Prisma errors and convert them to AppErrors
export function handlePrismaError(error: unknown): never {
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as { code: string; meta?: Record<string, unknown> };

    switch (prismaError.code) {
      case "P2002": {
        const field = (prismaError.meta?.target as string[])?.join(", ") || "field";
        throw new ConflictError(`A record with this ${field} already exists`);
      }
      case "P2025":
        throw new NotFoundError();
      case "P2003":
        throw new ValidationError("Related record not found");
      default:
        throw new AppError(`Database error: ${prismaError.code}`, 500, "DATABASE_ERROR");
    }
  }

  throw new AppError("An unexpected error occurred", 500, "INTERNAL_ERROR");
}

// Utility to safely execute database operations
export async function safeDbOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    handlePrismaError(error);
  }
}

// API response helpers
export function successResponse<T>(data: T, status: number = 200) {
  return Response.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status: number = 500, code?: string) {
  return Response.json({ success: false, error: { message, code } }, { status });
}
