/**
 * FreshSaver Storage Service
 * Manages localStorage for inventory items and user settings
 */
const Storage = {
  KEYS: {
    INVENTORY: 'freshsaver_inventory',
    SETTINGS: 'freshsaver_settings'
  },

  /**
   * Get all inventory items from localStorage
   * @returns {Array} List of inventory items
   */
  getInventory() {
    try {
      const data = localStorage.getItem(this.KEYS.INVENTORY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('Failed to read inventory from localStorage:', err);
      return [];
    }
  },

  /**
   * Save entire inventory items array to localStorage
   * @param {Array} items
   * @returns {boolean} Success status
   */
  saveInventory(items) {
    try {
      localStorage.setItem(this.KEYS.INVENTORY, JSON.stringify(items));
      return true;
    } catch (err) {
      console.error('Failed to save inventory to localStorage:', err);
      return false;
    }
  },

  /**
   * Get application settings
   * @returns {Object} Settings object
   */
  getSettings() {
    const defaultSettings = {
      theme: 'dark', // 'dark' | 'light'
      notificationTime: '17:00',
      lastNotificationDate: ''
    };
    try {
      const data = localStorage.getItem(this.KEYS.SETTINGS);
      return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    } catch (err) {
      console.error('Failed to read settings from localStorage:', err);
      return defaultSettings;
    }
  },

  /**
   * Save application settings
   * @param {Object} settings
   * @returns {boolean} Success status
   */
  saveSettings(settings) {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(updated));
      return true;
    } catch (err) {
      console.error('Failed to save settings to localStorage:', err);
      return false;
    }
  },

  /**
   * Clear all app data from localStorage
   */
  clearAll() {
    try {
      localStorage.removeItem(this.KEYS.INVENTORY);
      localStorage.removeItem(this.KEYS.SETTINGS);
    } catch (err) {
      console.error('Failed to clear localStorage:', err);
    }
  }
};
