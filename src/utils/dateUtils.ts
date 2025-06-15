
/**
 * Calculate the number of days remaining until a given date
 * @param targetDate - The target date (next payment date)
 * @returns Number of days remaining (negative if overdue)
 */
export const calculateDaysRemaining = (targetDate: string): number => {
  try {
    const today = new Date();
    const target = new Date(targetDate);
    
    // Validate the target date
    if (isNaN(target.getTime())) {
      console.warn('Invalid target date provided:', targetDate);
      return -999; // Return a large negative number for invalid dates
    }
    
    // Reset time to start of day for accurate day calculation
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error('Error calculating days remaining:', error, 'for date:', targetDate);
    return -999; // Return a safe fallback value
  }
};

/**
 * Format remaining days for display
 * @param days - Number of days remaining
 * @returns Formatted string for display
 */
export const formatDaysRemaining = (days: number): string => {
  try {
    if (days === -999) {
      return 'Date invalide';
    }
    
    if (days > 0) {
      return `${days} jours restants`;
    } else if (days === 0) {
      return 'Expire aujourd\'hui';
    } else {
      return `En retard de ${Math.abs(days)} jours`;
    }
  } catch (error) {
    console.error('Error formatting days remaining:', error);
    return 'Erreur de calcul';
  }
};

/**
 * Check if a date string is valid
 * @param dateString - The date string to validate
 * @returns Boolean indicating if the date is valid
 */
export const isValidDate = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString.trim().length > 0;
  } catch {
    return false;
  }
};

/**
 * Format a date for display in French locale
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export const formatDisplayDate = (dateString: string): string => {
  try {
    if (!isValidDate(dateString)) {
      return 'Date invalide';
    }
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  } catch (error) {
    console.error('Error formatting display date:', error);
    return 'Erreur de format';
  }
};
