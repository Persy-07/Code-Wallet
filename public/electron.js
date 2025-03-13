const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Déterminer automatiquement la racine du projet pour le stockage
let STORAGE_PATH;

if (isDev) {
  // En développement, utiliser le répertoire de travail actuel
  STORAGE_PATH = process.cwd();
  console.log('Chemin de stockage (dev):', STORAGE_PATH);
} else {
  // En production, utiliser un dossier dans les données utilisateur
  STORAGE_PATH = path.join(app.getPath('userData'), 'data');
  
  // S'assurer que le dossier existe
  if (!fs.existsSync(STORAGE_PATH)) {
    fs.mkdirSync(STORAGE_PATH, { recursive: true });
  }
  console.log('Chemin de stockage (prod):', STORAGE_PATH);
}

// Chemins de fichiers pour le stockage
const FRAGMENTS_FILE = path.join(STORAGE_PATH, 'fragments.json');
const TAGS_FILE = path.join(STORAGE_PATH, 'tags.json');

console.log('Fichier fragments sera à:', FRAGMENTS_FILE);
console.log('Fichier tags sera à:', TAGS_FILE);

// Vérifier/créer les fichiers lors du démarrage
try {
  if (!fs.existsSync(FRAGMENTS_FILE)) {
    fs.writeFileSync(FRAGMENTS_FILE, JSON.stringify([]));
    console.log('Fichier fragments.json créé avec succès');
  }
  if (!fs.existsSync(TAGS_FILE)) {
    fs.writeFileSync(TAGS_FILE, JSON.stringify([]));
    console.log('Fichier tags.json créé avec succès');
  }
} catch (error) {
  console.error('Erreur lors de la création des fichiers JSON:', error);
}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, 'index.html')}`
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Gestion des fragments
function loadFragments() {
  try {
    if (!fs.existsSync(FRAGMENTS_FILE)) {
      fs.writeFileSync(FRAGMENTS_FILE, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(FRAGMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lors du chargement des fragments:', error);
    return [];
  }
}

function saveFragments(fragments) {
  try {
    fs.writeFileSync(FRAGMENTS_FILE, JSON.stringify(fragments, null, 2));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des fragments:', error);
    return false;
  }
}

// Gestion des tags
function loadTags() {
  try {
    if (!fs.existsSync(TAGS_FILE)) {
      fs.writeFileSync(TAGS_FILE, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(TAGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lors du chargement des tags:', error);
    return [];
  }
}

function saveTags(tags) {
  try {
    fs.writeFileSync(TAGS_FILE, JSON.stringify(tags, null, 2));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des tags:', error);
    return false;
  }
}

// Configuration des gestionnaires IPC
function setupIpcHandlers() {
  // Gestion des fragments
  ipcMain.handle('get-fragments', async () => {
    return loadFragments();
  });

  ipcMain.handle('save-fragment', async (event, fragment) => {
    const fragments = loadFragments();
    
    if (fragment.id) {
      // Mettre à jour un fragment existant
      const index = fragments.findIndex(f => f.id === fragment.id);
      if (index !== -1) {
        fragments[index] = fragment;
      }
    } else {
      // Ajouter un nouveau fragment
      fragment.id = Date.now().toString();
      fragments.push(fragment);
    }
    
    saveFragments(fragments);
    return fragment;
  });

  ipcMain.handle('delete-fragment', async (event, id) => {
    const fragments = loadFragments();
    const updatedFragments = fragments.filter(f => f.id !== id);
    saveFragments(updatedFragments);
    return true;
  });

  // Gestion des tags
  ipcMain.handle('get-tags', async () => {
    return loadTags();
  });

  ipcMain.handle('save-tag', async (event, tag) => {
    const tags = loadTags();
    
    if (tag.id) {
      // Mettre à jour un tag existant
      const index = tags.findIndex(t => t.id === tag.id);
      if (index !== -1) {
        tags[index] = tag;
      }
    } else {
      // Ajouter un nouveau tag
      tag.id = Date.now().toString();
      tags.push(tag);
    }
    
    saveTags(tags);
    return tag;
  });

  ipcMain.handle('delete-tag', async (event, id) => {
    const tags = loadTags();
    const updatedTags = tags.filter(t => t.id !== id);
    saveTags(updatedTags);
    return true;
  });

  // Copie dans le presse-papiers
  ipcMain.handle('copy-to-clipboard', async (event, text) => {
    clipboard.writeText(text);
    return true;
  });

  // Obtenir le chemin de stockage
  ipcMain.handle('get-storage-path', () => {
    return STORAGE_PATH;
  });
}

// Initialisation de l'application
app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Gestion de la fermeture de l'application
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('Erreur non capturée:', error);
  
  // Fermeture propre de l'application en cas d'erreur
  if (mainWindow) {
    mainWindow.close();
  }
  app.quit();
});