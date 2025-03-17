// Vérifier si nous sommes dans Electron
let electronAPI;
try {
  electronAPI = window.electronAPI || null;
} catch (error) {
  console.log('Not running in Electron, using mock data');
  electronAPI = null;
}

// Créer un mock pour les données en mode développement web
const mockData = {
  fragments: [],
  tags: []
};

// Gestionnaire de stockage avec fallback mock
class DataStore {
  // Fragment Operations
  static async getFragments() {
    if (electronAPI) {
      return await electronAPI.getFragments();
    } else {
      return mockData.fragments;
    }
  }

  static async saveFragment(fragment) {
    if (electronAPI) {
      return await electronAPI.saveFragment(fragment);
    } else {
      // Mock implementation
      if (fragment.id) {
        // Update existing fragment
        const index = mockData.fragments.findIndex(f => f.id === fragment.id);
        if (index !== -1) {
          mockData.fragments[index] = { ...fragment };
        }
      } else {
        // Add new fragment
        fragment.id = Date.now().toString();
        mockData.fragments.push({ ...fragment });
      }
      return fragment;
    }
  }

  static async deleteFragment(id) {
    if (electronAPI) {
      return await electronAPI.deleteFragment(id);
    } else {
      // Mock implementation
      mockData.fragments = mockData.fragments.filter(f => f.id !== id);
      return true;
    }
  }

  // Tag Operations
  static async getTags() {
    if (electronAPI) {
      return await electronAPI.getTags();
    } else {
      return mockData.tags;
    }
  }

  static async saveTag(tag) {
    if (electronAPI) {
      return await electronAPI.saveTag(tag);
    } else {
      // Mock implementation
      if (tag.id) {
        // Update existing tag
        const index = mockData.tags.findIndex(t => t.id === tag.id);
        if (index !== -1) {
          mockData.tags[index] = { ...tag };
        }
      } else {
        // Add new tag
        tag.id = Date.now().toString();
        mockData.tags.push({ ...tag });
      }
      return tag;
    }
  }

  static async deleteTag(id) {
    if (electronAPI) {
      return await electronAPI.deleteTag(id);
    } else {
      // Mock implementation
      mockData.tags = mockData.tags.filter(t => t.id !== id);
      return true;
    }
  }

  // Clipboard Operations
  static async copyToClipboard(text) {
    if (electronAPI) {
      return await electronAPI.copyToClipboard(text);
    } else {
      // Use browser API for clipboard
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
      }
    }
  }

  // Utility Methods
  static filterFragmentsByTag(fragments, tagId) {
    if (!tagId) return fragments;
    return fragments.filter(fragment => 
      fragment.tags && fragment.tags.includes(tagId)
    );
  }

  static getTagsForFragment(allTags, fragment) {
    if (!fragment.tags || !allTags) return [];
    return allTags.filter(tag => fragment.tags.includes(tag.id));
  }

  // Optional: Get Storage Path (if in Electron)
  static async getStoragePath() {
    if (electronAPI && electronAPI.getStoragePath) {
      return await electronAPI.getStoragePath();
    }
    return null;
  }
}

export default DataStore;