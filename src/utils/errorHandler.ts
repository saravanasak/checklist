/**
 * Error handler utility for consistent error handling throughout the application
 */

// Custom error class for application-specific errors
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Indicates if this is an operational error that we can handle

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handles API errors and returns a formatted error response
 * @param error Error object
 * @returns Formatted error object
 */
export function handleApiError(error: unknown): { message: string; statusCode: number } {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode
    };
  }

  // Handle Supabase errors
  if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
    const supabaseError = error as { code: string; message: string };
    return {
      message: supabaseError.message,
      statusCode: getStatusCodeFromSupabaseError(supabaseError.code)
    };
  }

  // Handle generic errors
  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    statusCode: 500
  };
}

/**
 * Maps Supabase error codes to HTTP status codes
 * @param errorCode Supabase error code
 * @returns HTTP status code
 */
function getStatusCodeFromSupabaseError(errorCode: string): number {
  switch (errorCode) {
    case 'PGRST116': // Not found
      return 404;
    case 'PGRST109': // Conflict
      return 409;
    case 'PGRST104': // Bad request
      return 400;
    case 'PGRST301': // Unauthorized
    case '42501': // Insufficient privileges
      return 403;
    default:
      return 500;
  }
}

/**
 * Logs errors to the console in development and could be extended to log to a service in production
 * @param error Error object
 * @param context Additional context about where the error occurred
 */
export function logError(error: unknown, context: string = ''): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error in ${context}:`, error);
  } else {
    // In production, we could log to a service like Sentry
    // Example: Sentry.captureException(error, { extra: { context } });
    console.error(`Error in ${context}:`, error instanceof Error ? error.message : 'Unknown error');
  }
}
