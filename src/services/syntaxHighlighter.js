import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import 'highlight.js/styles/atom-one-light.css';

// Initialize highlight.js
hljs.configure({
  languages: [
    'javascript', 
    'typescript', 
    'python', 
    'ruby', 
    'java', 
    'html', 
    'css', 
    'php',
    'c',
    'cpp',
    'csharp',
    'go',
    'shell'
  ]
});

// Highlight code with language detection
export const highlightCode = (code) => {
  if (!code) return '';
  
  try {
    return hljs.highlightAuto(code).value;
  } catch (error) {
    console.error('Syntax highlighting error:', error);
    return code;
  }
};

// Get all supported languages
export const getSupportedLanguages = () => {
  return hljs.listLanguages();
};

// Get appropriate CSS class for dark/light mode
export const getHighlightThemeClass = (isDarkMode) => {
  return isDarkMode ? 'atom-one-dark' : 'atom-one-light';
};

export default { highlightCode, getSupportedLanguages, getHighlightThemeClass };