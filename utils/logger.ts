/**
 * Centralized logging utility for consistent logging across the application
 * This can be extended to send logs to external services in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 100;

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      this.log('debug', message, data);
      console.log(`[DEBUG] ${message}`, data || '');
    }
  }

  /**
   * Log an informational message
   */
  info(message: string, data?: unknown): void {
    this.log('info', message, data);
    console.log(`[INFO] ${message}`, data || '');
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
    console.warn(`[WARN] ${message}`, data || '');
  }

  /**
   * Log an error message
   */
  error(message: string, error?: unknown): void {
    this.log('error', message, error);
    console.error(`[ERROR] ${message}`, error || '');
  }

  /**
   * Store log entry in history
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };

    this.logHistory.push(entry);

    // Keep history size manageable
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  /**
   * Get recent log entries
   */
  getHistory(count?: number): LogEntry[] {
    if (count) {
      return this.logHistory.slice(-count);
    }
    return [...this.logHistory];
  }

  /**
   * Clear log history
   */
  clearHistory(): void {
    this.logHistory = [];
  }

  /**
   * Export logs for debugging
   */
  exportLogs(): string {
    return JSON.stringify(this.logHistory, null, 2);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export types
export type { LogLevel, LogEntry };
