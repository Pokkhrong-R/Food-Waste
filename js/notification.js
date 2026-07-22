/**
 * FreshSaver Notification System
 * Handles In-App Toasts and Expiry Summary Banner
 */
const Notify = {
  /**
   * Display a floating Toast notification
   * @param {string} message
   * @param {string} type 'success' | 'warning' | 'error' | 'info'
   * @param {number} duration ms
   */
  toast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /**
   * Check daily expiry alert banner upon opening app
   */
  checkDailyExpiryAlert() {
    const settings = Storage.getSettings();
    const today = Utils.getTodayString();

    // Fetch active items expiring soon (<= 3 days)
    const allItems = Storage.getInventory();
    const expiringItems = Expiry.getExpiringSoonItems(allItems);

    const bannerContainer = document.getElementById('expiry-banner-container');
    if (!bannerContainer) return;

    if (expiringItems.length > 0) {
      const urgentCount = expiringItems.filter(i => Expiry.getDaysLeft(i.expiryDate) <= 1).length;
      
      bannerContainer.innerHTML = `
        <div class="expiry-banner">
          <div class="banner-content">
            <span class="banner-icon">⚠️</span>
            <div class="banner-text">
              <strong>Expiry Alert (แจ้งเตือนวัตถุดิบใกล้หมดอายุ)</strong>
              <p>คุณมีวัตถุดิบ <strong>${expiringItems.length} รายการ</strong> ที่ต้องรีบใช้! ${urgentCount > 0 ? `(หมดอายุภายในวันนี้/พรุ่งนี้ ${urgentCount} รายการ)` : ''}</p>
            </div>
          </div>
          <button class="btn-banner-close" onclick="Notify.closeBanner()">✕</button>
        </div>
      `;
      bannerContainer.style.display = 'block';

      // Record check date
      Storage.saveSettings({ lastNotificationDate: today });
    } else {
      bannerContainer.style.display = 'none';
      bannerContainer.innerHTML = '';
    }
  },

  /**
   * Dismiss notification banner
   */
  closeBanner() {
    const bannerContainer = document.getElementById('expiry-banner-container');
    if (bannerContainer) {
      bannerContainer.style.display = 'none';
    }
  }
};
