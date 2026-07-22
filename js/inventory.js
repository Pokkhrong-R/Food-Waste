/**
 * FreshSaver Inventory Business Engine
 * Core CRUD & filter logic interacting with Storage & Expiry
 */
const Inventory = {
  /**
   * Get filtered list of inventory items
   * @param {Object} options { status, categoryId, search, sortBy }
   * @returns {Array}
   */
  getAll(options = {}) {
    const {
      status = 'active',     // 'active' | 'consumed' | 'wasted' | 'all'
      categoryId = 'all',
      search = '',
      sortBy = 'expiry'      // 'expiry' | 'name' | 'created'
    } = options;

    let items = Storage.getInventory();

    // 1. Filter by Status
    if (status !== 'all') {
      items = items.filter(item => item.status === status);
    }

    // 2. Filter by Category
    if (categoryId !== 'all') {
      items = items.filter(item => item.categoryId === categoryId);
    }

    // 3. Search by Name
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(item => item.name.toLowerCase().includes(q));
    }

    // 4. Sort Items
    items.sort((a, b) => {
      if (sortBy === 'expiry') {
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name, 'th');
      } else if (sortBy === 'created') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    return items;
  },

  /**
   * Get single item by ID
   * @param {string} id
   * @returns {Object|null}
   */
  getById(id) {
    const items = Storage.getInventory();
    return items.find(item => item.id === id) || null;
  },

  /**
   * One-Tap Add item directly from a Preset
   * Auto fills default shelf life, category, unit, storage location
   * @param {string} presetId
   * @param {number} quantity
   * @returns {Object|null} Created item
   */
  addFromPreset(presetId, quantity = 1) {
    const preset = Presets.getById(presetId);
    if (!preset) return null;

    const purchaseDate = Utils.getTodayString();
    const expiryDate = Utils.addDays(purchaseDate, preset.defaultShelfLifeDays);

    const newItem = {
      id: Utils.generateId(),
      name: preset.name,
      categoryId: preset.categoryId,
      quantity: Number(quantity),
      unit: preset.defaultUnit || 'ชิ้น',
      purchaseDate: purchaseDate,
      expiryDate: expiryDate,
      storageLocation: preset.storageType || 'chilled',
      status: 'active',
      icon: preset.icon || '📦',
      createdAt: new Date().toISOString()
    };

    const items = Storage.getInventory();
    items.unshift(newItem);
    Storage.saveInventory(items);

    return newItem;
  },

  /**
   * Add custom inventory item
   * @param {Object} formData
   * @returns {Object} Created item
   */
  addCustom(formData) {
    const purchaseDate = formData.purchaseDate || Utils.getTodayString();
    let expiryDate = formData.expiryDate;

    // If expiry date not set, calculate using category default shelf life
    if (!expiryDate) {
      const category = Presets.getCategoryById(formData.categoryId);
      const days = category ? category.defaultShelfLifeDays : 3;
      expiryDate = Utils.addDays(purchaseDate, days);
    }

    const newItem = {
      id: Utils.generateId(),
      name: formData.name.trim(),
      categoryId: formData.categoryId || 'vegetable',
      quantity: Number(formData.quantity) || 1,
      unit: formData.unit.trim() || 'ชิ้น',
      purchaseDate: purchaseDate,
      expiryDate: expiryDate,
      storageLocation: formData.storageLocation || 'chilled',
      status: 'active',
      icon: formData.icon || '📦',
      createdAt: new Date().toISOString()
    };

    const items = Storage.getInventory();
    items.unshift(newItem);
    Storage.saveInventory(items);

    return newItem;
  },

  /**
   * Update existing inventory item
   * @param {string} id
   * @param {Object} updates
   * @returns {Object|null} Updated item
   */
  update(id, updates) {
    const items = Storage.getInventory();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    Storage.saveInventory(items);
    return items[index];
  },

  /**
   * Change item status (e.g., 'active' -> 'consumed' or 'wasted')
   * @param {string} id
   * @param {string} status 'active' | 'consumed' | 'wasted'
   * @returns {Object|null}
   */
  updateStatus(id, status) {
    return this.update(id, { status });
  },

  /**
   * Permanently delete item
   * @param {string} id
   * @returns {boolean}
   */
  delete(id) {
    let items = Storage.getInventory();
    const initialLen = items.length;
    items = items.filter(item => item.id !== id);

    if (items.length !== initialLen) {
      Storage.saveInventory(items);
      return true;
    }
    return false;
  },

  /**
   * Get summary dashboard statistics for active items
   * @returns {Object} { total, fresh, warning, danger, expired, consumed, wasted }
   */
  getSummary() {
    const allItems = Storage.getInventory();
    const summary = {
      total: 0,
      fresh: 0,
      warning: 0,
      danger: 0,
      expired: 0,
      consumed: 0,
      wasted: 0
    };

    allItems.forEach(item => {
      if (item.status === 'consumed') {
        summary.consumed++;
      } else if (item.status === 'wasted') {
        summary.wasted++;
      } else if (item.status === 'active') {
        summary.total++;
        const statusInfo = Expiry.getStatusInfo(item.expiryDate);
        if (statusInfo.code === 'fresh') summary.fresh++;
        else if (statusInfo.code === 'warning') summary.warning++;
        else if (statusInfo.code === 'danger') summary.danger++;
        else if (statusInfo.code === 'expired') summary.expired++;
      }
    });

    return summary;
  }
};
