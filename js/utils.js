/**
 * FreshSaver Utility Functions
 */
const Utils = {
  /**
   * Generate unique identifier for items
   * @returns {string}
   */
  generateId() {
    return 'inv_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
  },

  /**
   * Get current date in YYYY-MM-DD format
   * @returns {string}
   */
  getTodayString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Add days to a given YYYY-MM-DD date
   * @param {string} dateStr YYYY-MM-DD
   * @param {number} days
   * @returns {string} YYYY-MM-DD
   */
  addDays(dateStr, days) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + Number(days));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Format YYYY-MM-DD string to Thai readable format
   * @param {string} dateStr
   * @returns {string} e.g. "25 ก.ค. 2026"
   */
  formatDateThai(dateStr) {
    if (!dateStr) return '';
    const monthsThai = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    return `${day} ${monthsThai[monthIndex]} ${year}`;
  },

  /**
   * Format relative days remaining description
   * @param {number} daysLeft
   * @returns {string}
   */
  formatRelativeDate(daysLeft) {
    if (daysLeft < 0) {
      const positiveDays = Math.abs(daysLeft);
      return `Expired ${positiveDays} day${positiveDays > 1 ? 's' : ''} ago (หมดอายุแล้ว ${positiveDays} วัน)`;
    } else if (daysLeft === 0) {
      return 'Expires today (หมดอายุวันนี้!)';
    } else if (daysLeft === 1) {
      return '1 day left (เหลืออีก 1 วัน)';
    } else {
      return `${daysLeft} days left (เหลืออีก ${daysLeft} วัน)`;
    }
  },

  /**
   * Simple debounce helper for search inputs
   * @param {Function} fn
   * @param {number} delay
   * @returns {Function}
   */
  debounce(fn, delay = 250) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
};
