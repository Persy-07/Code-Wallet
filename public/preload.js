const { contextBridge, ipcRenderer } = require('electron');

// Exposition sécurisée des méthodes IPC via contextBridge
contextBridge.exposeInMainWorld('electronAPI', {
  // Méthodes pour la gestion des fragments
  getFragments: () => ipcRenderer.invoke('get-fragments'),
  saveFragment: (fragment) => ipcRenderer.invoke('save-fragment', fragment),
  deleteFragment: (id) => ipcRenderer.invoke('delete-fragment', id),

  // Méthodes pour la gestion des tags
  getTags: () => ipcRenderer.invoke('get-tags'),
  saveTag: (tag) => ipcRenderer.invoke('save-tag', tag),
  deleteTag: (id) => ipcRenderer.invoke('delete-tag', id),

  // Méthode pour copier dans le presse-papiers
  copyToClipboard: (text) => ipcRenderer.invoke('copy-to-clipboard', text),

  // Méthode pour obtenir le chemin de stockage
  getStoragePath: () => ipcRenderer.invoke('get-storage-path'),

  // Exemple de gestion d'événements en temps réel (optionnel)
  onFragmentUpdate: (callback) => {
    ipcRenderer.on('fragment-updated', (event, fragment) => {
      callback(fragment);
    });
  },

  // Permettre de désabonner des événements (bonne pratique)
  removeFragmentUpdateListener: () => {
    ipcRenderer.removeAllListeners('fragment-updated');
  }
});

// Gestion des erreurs et logs côté renderer
window.addEventListener('error', (event) => {
  console.error('Erreur non gérée:', event.error);
});