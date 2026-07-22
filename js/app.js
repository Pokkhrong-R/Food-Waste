/**
 * FreshSaver Main Controller
 * Entry point & event listener bindings
 */
const App = {
  /**
   * Application Initialization
   */
  async init() {
    console.log('Initializing FreshSaver Prototype...');

    // 1. Apply Theme Preference
    const settings = Storage.getSettings();
    document.documentElement.setAttribute('data-theme', settings.theme || 'dark');

    // 2. Load presets data
    await Presets.load();

    // 3. Setup event listeners
    this.bindEvents();

    // 4. Initial view & notifications
    UI.showView('view-fridge');
    Notify.checkDailyExpiryAlert();
  },

  /**
   * Bind event listeners across the application
   */
  bindEvents() {
    // Navigation bar links
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const viewId = e.currentTarget.dataset.view;
        if (viewId) UI.showView(viewId);
      });
    });

    // Theme toggle button
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Search input with debounce
    const searchInput = document.getElementById('fridge-search');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        UI.currentSearchQuery = e.target.value;
        UI.renderFridgeView();
      }, 200));
    }

    // Status filter buttons
    document.querySelectorAll('.filter-btn[data-status]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn[data-status]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        UI.currentFilterStatus = e.currentTarget.dataset.status;
        UI.renderFridgeView();
      });
    });

    // Custom Add Form submit
    const customForm = document.getElementById('custom-add-form');
    if (customForm) {
      customForm.addEventListener('submit', (e) => this.handleCustomAdd(e));
    }

    // Edit Form submit
    const editForm = document.getElementById('edit-item-form');
    if (editForm) {
      editForm.addEventListener('submit', (e) => this.handleEditSave(e));
    }

    // Settings Form submit
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => this.handleSaveSettings(e));
    }

    // Auto-calculate expiry date on custom add form when category or purchase date changes
    const categorySelect = document.getElementById('custom-category');
    const purchaseDateInput = document.getElementById('custom-purchase-date');
    const expiryDateInput = document.getElementById('custom-expiry-date');

    const updateDefaultExpiry = () => {
      const catId = categorySelect.value;
      const purchaseDate = purchaseDateInput.value || Utils.getTodayString();
      const cat = Presets.getCategoryById(catId);
      const days = cat ? cat.defaultShelfLifeDays : 3;
      expiryDateInput.value = Utils.addDays(purchaseDate, days);
    };

    if (categorySelect && purchaseDateInput && expiryDateInput) {
      categorySelect.addEventListener('change', updateDefaultExpiry);
      purchaseDateInput.addEventListener('change', updateDefaultExpiry);
    }
  },

  /**
   * Toggle between Dark and Light mode
   */
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    Storage.saveSettings({ theme: newTheme });

    const icon = newTheme === 'dark' ? '🌙' : '☀️';
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.innerText = icon;

    Notify.toast(`Switched to ${newTheme} mode`, 'info');
  },

  /**
   * One-Tap Quick Add Handler
   * @param {string} presetId
   */
  handleOneTapAdd(presetId) {
    const item = Inventory.addFromPreset(presetId, 1);
    if (item) {
      Notify.toast(`Added ${item.name} (+1 ${item.unit}) to Fridge!`, 'success');
      UI.showView('view-fridge');
    }
  },

  /**
   * Custom Item Form Add Handler
   * @param {Event} e
   */
  handleCustomAdd(e) {
    e.preventDefault();
    const formData = {
      name: document.getElementById('custom-name').value,
      categoryId: document.getElementById('custom-category').value,
      quantity: document.getElementById('custom-quantity').value,
      unit: document.getElementById('custom-unit').value,
      purchaseDate: document.getElementById('custom-purchase-date').value,
      expiryDate: document.getElementById('custom-expiry-date').value,
      storageLocation: document.getElementById('custom-storage').value
    };

    if (!formData.name.trim()) {
      Notify.toast('Please enter ingredient name (กรุณาระบุชื่อวัตถุดิบ)', 'error');
      return;
    }

    const item = Inventory.addCustom(formData);
    if (item) {
      Notify.toast(`Successfully added ${item.name}`, 'success');
      document.getElementById('custom-add-form').reset();
      UI.showView('view-fridge');
    }
  },

  /**
   * Edit Item Save Handler
   * @param {Event} e
   */
  handleEditSave(e) {
    e.preventDefault();
    const id = document.getElementById('edit-item-id').value;
    const updates = {
      name: document.getElementById('edit-name').value,
      categoryId: document.getElementById('edit-category').value,
      quantity: Number(document.getElementById('edit-quantity').value),
      unit: document.getElementById('edit-unit').value,
      purchaseDate: document.getElementById('edit-purchase-date').value,
      expiryDate: document.getElementById('edit-expiry-date').value,
      storageLocation: document.getElementById('edit-storage').value
    };

    const updated = Inventory.update(id, updates);
    if (updated) {
      Notify.toast(`Updated ${updated.name} successfully`, 'success');
      UI.showView('view-fridge');
    }
  },

  /**
   * Item Status Update Handler (Consumed / Wasted / Restored)
   * @param {string} id
   * @param {string} status 'active' | 'consumed' | 'wasted'
   */
  handleUpdateStatus(id, status) {
    const item = Inventory.getById(id);
    if (!item) return;

    Inventory.updateStatus(id, status);
    
    let msg = `Marked ${item.name} as consumed (กินแล้ว) 😋`;
    if (status === 'wasted') msg = `Marked ${item.name} as wasted (ทิ้ง) 🗑️`;
    if (status === 'active') msg = `Restored ${item.name} back to Fridge 🧊`;

    Notify.toast(msg, 'info');
    UI.renderFridgeView();
  },

  /**
   * Item Delete Handler with confirmation dialog
   * @param {string} id
   */
  handleDeleteItem(id) {
    const item = Inventory.getById(id);
    if (!item) return;

    UI.showConfirmModal(
      'Delete Ingredient (ยืนยันการลบ)',
      `คุณต้องการลบ "${item.name}" ออกจากตู้เย็นถาวรใช่หรือไม่?`,
      () => {
        Inventory.delete(id);
        Notify.toast(`Deleted ${item.name}`, 'warning');
        UI.renderFridgeView();
      }
    );
  },

  /**
   * Save Settings Handler
   * @param {Event} e
   */
  handleSaveSettings(e) {
    e.preventDefault();
    const notificationTime = document.getElementById('setting-notif-time').value;
    Storage.saveSettings({ notificationTime });
    Notify.toast('Settings saved successfully', 'success');
    UI.showView('view-fridge');
  }
};

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
