/**
 * FreshSaver Expiry Calculation Engine
 */
const Expiry = {
  /**
   * Calculate difference in days between target expiry date and today
   * @param {string} expiryDateStr YYYY-MM-DD
   * @returns {number} Days remaining (negative if expired)
   */
  getDaysLeft(expiryDateStr) {
    if (!expiryDateStr) return 0;

    const todayStr = Utils.getTodayString();
    const today = new Date(todayStr + 'T00:00:00');
    const expiry = new Date(expiryDateStr + 'T00:00:00');

    const diffTime = expiry.getTime() - today.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Determine status classification based on approved thresholds:
   * 🟢 Fresh: > 3 days remaining
   * 🟡 Warning: 1 - 3 days remaining
   * 🔴 Danger: 0 days remaining (expires today)
   * ⚫ Expired: < 0 days remaining
   * 
   * @param {string} expiryDateStr
   * @returns {Object} Status details
   */
  getStatusInfo(expiryDateStr) {
    const daysLeft = this.getDaysLeft(expiryDateStr);

    if (daysLeft > 3) {
      return {
        code: 'fresh',
        color: '#10B981', // Emerald green
        badgeClass: 'status-fresh',
        icon: '🟢',
        labelEn: 'Fresh',
        labelTh: 'สดใหม่',
        daysLeft: daysLeft
      };
    } else if (daysLeft >= 1 && daysLeft <= 3) {
      return {
        code: 'warning',
        color: '#F59E0B', // Amber warning
        badgeClass: 'status-warning',
        icon: '🟡',
        labelEn: 'Use Soon',
        labelTh: 'ควรใช้เร็วๆ นี้',
        daysLeft: daysLeft
      };
    } else if (daysLeft === 0) {
      return {
        code: 'danger',
        color: '#EF4444', // Red danger
        badgeClass: 'status-danger',
        icon: '🔴',
        labelEn: 'Expires Today',
        labelTh: 'หมดอายุวันนี้!',
        daysLeft: daysLeft
      };
    } else {
      return {
        code: 'expired',
        color: '#6B7280', // Gray expired
        badgeClass: 'status-expired',
        icon: '⚫',
        labelEn: 'Expired',
        labelTh: 'หมดอายุแล้ว',
        daysLeft: daysLeft
      };
    }
  },

  /**
   * Filter items that are expiring soon (<= 3 days remaining and not consumed/wasted)
   * @param {Array} items
   * @returns {Array}
   */
  getExpiringSoonItems(items) {
    return items.filter(item => {
      if (item.status !== 'active') return false;
      const daysLeft = this.getDaysLeft(item.expiryDate);
      return daysLeft >= 0 && daysLeft <= 3;
    });
  }
};
