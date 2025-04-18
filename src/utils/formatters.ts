/**
 * Formats a date string or Date object into a localized date string
 * @param date Date string or Date object
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Default options for date formatting
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options };
  
  return dateObj.toLocaleDateString(undefined, mergedOptions);
}

/**
 * Formats a number as a percentage
 * @param value Number to format
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Truncates a string to a specified length and adds ellipsis if needed
 * @param str String to truncate
 * @param length Maximum length before truncation
 * @returns Truncated string
 */
export function truncateString(str: string, length: number = 50): string {
  if (!str) return '';
  if (str.length <= length) return str;
  
  return `${str.substring(0, length)}...`;
}

/**
 * Formats a status string with appropriate capitalization
 * @param status Status string
 * @returns Formatted status string
 */
export function formatStatus(status: string): string {
  if (!status) return '';
  
  // Capitalize first letter
  return status.charAt(0).toUpperCase() + status.slice(1);
}
