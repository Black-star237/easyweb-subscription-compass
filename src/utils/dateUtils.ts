
/**
 * Calculate the number of days remaining until a given date
 * @param targetDate - The target date (next payment date)
 * @returns Number of days remaining (negative if overdue)
 */
export const calculateDaysRemaining = (targetDate: string): number => {
  const today = new Date();
  const target = new Date(targetDate);
  
  // Reset time to start of day for accurate day calculation
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Format remaining days for display
 * @param days - Number of days remaining
 * @returns Formatted string for display
 */
export const formatDaysRemaining = (days: number): string => {
  if (days > 0) {
    return `${days} jours restants`;
  } else if (days === 0) {
    return 'Expire aujourd\'hui';
  } else {
    return `En retard de ${Math.abs(days)} jours`;
  }
};
