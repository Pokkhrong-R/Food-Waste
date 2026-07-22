/**
 * FreshSaver Presets Manager
 * Handles fetching and querying preset item definitions
 */
const Presets = {
  data: {
    categories: [],
    presets: []
  },
  isLoaded: false,

  /**
   * Fetch presets.json and populate internal cache
   * @returns {Promise<boolean>}
   */
  async load() {
    try {
      const res = await fetch('data/presets.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.data = await res.json();
      this.isLoaded = true;
      return true;
    } catch (err) {
      console.error('Failed to load presets.json:', err);
      // Fallback empty structure
      this.data = { categories: [], presets: [] };
      return false;
    }
  },

  /**
   * Get all categories
   * @returns {Array}
   */
  getCategories() {
    return this.data.categories || [];
  },

  /**
   * Get category by ID
   * @param {string} categoryId
   * @returns {Object|null}
   */
  getCategoryById(categoryId) {
    return this.data.categories.find(c => c.id === categoryId) || null;
  },

  /**
   * Get all presets
   * @returns {Array}
   */
  getAll() {
    return this.data.presets || [];
  },

  /**
   * Get preset by ID
   * @param {string} presetId
   * @returns {Object|null}
   */
  getById(presetId) {
    return this.data.presets.find(p => p.id === presetId) || null;
  },

  /**
   * Get presets by category ID
   * @param {string} categoryId ('all' returns all)
   * @returns {Array}
   */
  getByCategory(categoryId) {
    if (!categoryId || categoryId === 'all') return this.getAll();
    return this.data.presets.filter(p => p.categoryId === categoryId);
  },

  /**
   * Search presets by name query
   * @param {string} query
   * @returns {Array}
   */
  search(query) {
    if (!query) return this.getAll();
    const q = query.toLowerCase().trim();
    return this.data.presets.filter(p => p.name.toLowerCase().includes(q));
  }
};
