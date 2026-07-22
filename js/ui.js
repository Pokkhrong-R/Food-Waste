/**
 * FreshSaver UI Renderer Component
 * Manages view switching and dynamic DOM rendering
 */
const UI = {
  activeView: 'view-fridge',
  currentFilterStatus: 'active',
  currentCategoryFilter: 'all',
  currentSearchQuery: '',

  /**
   * Switch visible view panel
   * @param {string} viewId 'view-fridge' | 'view-add' | 'view-edit' | 'view-settings'
   */
  showView(viewId) {
    this.activeView = viewId;

    // Hide all views
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.style.display = 'none';
    });

    // Show target view
    const target = document.getElementById(viewId);
    if (target) target.style.display = 'block';

    // Update navbar active state
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    // Trigger re-render depending on view
    if (viewId === 'view-fridge') {
      this.renderFridgeView();
    } else if (viewId === 'view-add') {
      this.renderAddView();
    } else if (viewId === 'view-settings') {
      this.renderSettingsView();
    }
  },

  /**
   * Render Main Fridge Inventory View
   */
  renderFridgeView() {
    // 1. Render Summary Bar
    const summary = Inventory.getSummary();
    const summaryContainer = document.getElementById('summary-bar-container');
    if (summaryContainer) {
      summaryContainer.innerHTML = `
        <div class="summary-card">
          <div class="summary-info">
            <span>Total Items (ทั้งหมด)</span>
            <h3>${summary.total}</h3>
          </div>
          <div class="summary-badge">🧊</div>
        </div>
        <div class="summary-card">
          <div class="summary-info">
            <span>Fresh (สดใหม่)</span>
            <h3>${summary.fresh}</h3>
          </div>
          <div class="summary-badge">🟢</div>
        </div>
        <div class="summary-card">
          <div class="summary-info">
            <span>Use Soon (ควรใช้เร็วๆ นี้)</span>
            <h3>${summary.warning}</h3>
          </div>
          <div class="summary-badge">🟡</div>
        </div>
        <div class="summary-card">
          <div class="summary-info">
            <span>Expires Today (หมดอายุวันนี้)</span>
            <h3>${summary.danger}</h3>
          </div>
          <div class="summary-badge">🔴</div>
        </div>
        <div class="summary-card">
          <div class="summary-info">
            <span>Expired (หมดอายุแล้ว)</span>
            <h3>${summary.expired}</h3>
          </div>
          <div class="summary-badge">⚫</div>
        </div>
      `;
    }

    // 2. Fetch filtered inventory
    const items = Inventory.getAll({
      status: this.currentFilterStatus,
      categoryId: this.currentCategoryFilter,
      search: this.currentSearchQuery
    });

    // 3. Render Item Grid
    const gridContainer = document.getElementById('fridge-items-grid');
    if (!gridContainer) return;

    if (items.length === 0) {
      gridContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🥦</div>
          <h3>No items found (ไม่พบรายการวัตถุดิบ)</h3>
          <p>ตู้เย็นของคุณยังไม่มีรายการวัตถุดิบในหมวดหมู่นี้ กดปุ่ม "Add Item" ด้านบนเพื่อเริ่มบันทึก!</p>
          <button class="btn-primary" onclick="UI.showView('view-add')">➕ Add Ingredient (เพิ่มวัตถุดิบ)</button>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = items.map(item => {
      const statusInfo = Expiry.getStatusInfo(item.expiryDate);
      const relativeDateText = Utils.formatRelativeDate(statusInfo.daysLeft);
      const formattedDate = Utils.formatDateThai(item.expiryDate);

      // Freshness progress bar calculation (0-100%)
      let progressPercent = 100;
      if (statusInfo.daysLeft <= 0) {
        progressPercent = 0;
      } else if (statusInfo.daysLeft <= 7) {
        progressPercent = Math.max(10, Math.round((statusInfo.daysLeft / 7) * 100));
      }

      return `
        <div class="item-card ${statusInfo.badgeClass}" id="item-${item.id}">
          <div class="item-header">
            <div class="item-title-group">
              <span class="item-icon">${item.icon || '📦'}</span>
              <div>
                <div class="item-name">${item.name}</div>
                <div class="item-qty">Quantity: <strong>${item.quantity} ${item.unit}</strong></div>
              </div>
            </div>
            <span class="status-badge ${statusInfo.badgeClass}">
              ${statusInfo.icon} ${statusInfo.labelEn}
            </span>
          </div>

          <!-- Freshness Progress Bar -->
          <div class="freshness-bar-container">
            <div class="freshness-bar-label">
              <span>Freshness Level (ความสด)</span>
              <span>${statusInfo.daysLeft > 0 ? `${statusInfo.daysLeft}d left` : 'Expired'}</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill ${statusInfo.badgeClass}" style="width: ${progressPercent}%;"></div>
            </div>
          </div>

          <div class="item-details">
            <div class="detail-row">
              <span>Expiry Date (วันหมดอายุ):</span>
              <strong>${formattedDate}</strong>
            </div>
            <div class="detail-row">
              <span>Timeline:</span>
              <strong>${relativeDateText}</strong>
            </div>
            <div class="detail-row">
              <span>Storage (จัดเก็บ):</span>
              <span style="text-transform: capitalize;">${item.storageLocation}</span>
            </div>
          </div>

          <div class="item-actions">
            ${this.currentFilterStatus === 'active' ? `
              <button class="btn-action btn-consume" onclick="App.handleUpdateStatus('${item.id}', 'consumed')">
                ✅ Consumed
              </button>
              <button class="btn-action btn-waste" onclick="App.handleUpdateStatus('${item.id}', 'wasted')">
                🗑️ Wasted
              </button>
              <button class="btn-action" onclick="UI.openEditForm('${item.id}')">
                ✏️ Edit
              </button>
            ` : `
              <button class="btn-action" onclick="App.handleUpdateStatus('${item.id}', 'active')">
                ↩️ Restore
              </button>
            `}
            <button class="btn-action" style="color: var(--status-danger);" onclick="App.handleDeleteItem('${item.id}')">
              ❌ Delete
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Render One-Tap Presets Add View
   */
  renderAddView() {
    const categories = Presets.getCategories();
    
    // Render Category Tab buttons for presets
    const categoryTabsContainer = document.getElementById('preset-category-tabs');
    if (categoryTabsContainer) {
      categoryTabsContainer.innerHTML = `
        <button class="filter-btn active" data-preset-cat="all" onclick="UI.filterPresetsCategory('all')">All (ทั้งหมด)</button>
        ${categories.map(cat => `
          <button class="filter-btn" data-preset-cat="${cat.id}" onclick="UI.filterPresetsCategory('${cat.id}')">
            ${cat.icon} ${cat.name}
          </button>
        `).join('')}
      `;
    }

    // Render Preset buttons grid
    this.renderPresetButtons('all');

    // Populate category dropdown for Custom Form
    const customCatSelect = document.getElementById('custom-category');
    if (customCatSelect && customCatSelect.options.length <= 1) {
      customCatSelect.innerHTML = categories.map(cat => `
        <option value="${cat.id}">${cat.icon} ${cat.name}</option>
      `).join('');
    }

    // Default dates in custom form
    const customPurchaseInput = document.getElementById('custom-purchase-date');
    if (customPurchaseInput && !customPurchaseInput.value) {
      customPurchaseInput.value = Utils.getTodayString();
    }
  },

  /**
   * Filter preset items by category tab
   * @param {string} catId
   */
  filterPresetsCategory(catId) {
    document.querySelectorAll('#preset-category-tabs .filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.presetCat === catId);
    });
    this.renderPresetButtons(catId);
  },

  /**
   * Render grid of Quick Preset buttons
   * @param {string} categoryId
   */
  renderPresetButtons(categoryId) {
    const presets = Presets.getByCategory(categoryId);
    const container = document.getElementById('preset-grid-container');
    if (!container) return;

    container.innerHTML = presets.map(p => `
      <div class="preset-btn" data-cat="${p.categoryId}" onclick="App.handleOneTapAdd('${p.id}')" title="กดปุ่มเพื่อบันทึกทันที (+1 ${p.defaultUnit})">
        <span class="preset-icon">${p.icon}</span>
        <span class="preset-name">${p.name}</span>
        <span class="preset-shelf">⏳ ${p.defaultShelfLifeDays} วัน</span>
      </div>
    `).join('');
  },

  /**
   * Open edit form for a specific item
   * @param {string} id
   */
  openEditForm(id) {
    const item = Inventory.getById(id);
    if (!item) return;

    this.showView('view-edit');

    document.getElementById('edit-item-id').value = item.id;
    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-quantity').value = item.quantity;
    document.getElementById('edit-unit').value = item.unit;
    document.getElementById('edit-purchase-date').value = item.purchaseDate;
    document.getElementById('edit-expiry-date').value = item.expiryDate;
    document.getElementById('edit-storage').value = item.storageLocation;

    const categories = Presets.getCategories();
    const editCatSelect = document.getElementById('edit-category');
    if (editCatSelect) {
      editCatSelect.innerHTML = categories.map(cat => `
        <option value="${cat.id}" ${cat.id === item.categoryId ? 'selected' : ''}>${cat.icon} ${cat.name}</option>
      `).join('');
    }
  },

  /**
   * Render settings view values
   */
  renderSettingsView() {
    const settings = Storage.getSettings();
    const themeSelect = document.getElementById('setting-theme');
    if (themeSelect) themeSelect.value = settings.theme;

    const timeInput = document.getElementById('setting-notif-time');
    if (timeInput) timeInput.value = settings.notificationTime;
  },

  /**
   * Show confirmation modal dialog
   * @param {string} title
   * @param {string} message
   * @param {Function} onConfirm
   */
  showConfirmModal(title, message, onConfirm) {
    const backdrop = document.getElementById('confirm-modal');
    if (!backdrop) return;

    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = message;

    const confirmBtn = document.getElementById('modal-confirm-btn');
    confirmBtn.onclick = () => {
      onConfirm();
      this.closeConfirmModal();
    };

    backdrop.classList.add('show');
  },

  /**
   * Close confirmation modal dialog
   */
  closeConfirmModal() {
    const backdrop = document.getElementById('confirm-modal');
    if (backdrop) backdrop.classList.remove('show');
  }
};
