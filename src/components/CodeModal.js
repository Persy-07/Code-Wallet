import React from 'react';
import DataStore from '../services/dataStore';
import { highlightCode } from '../services/syntaxHighlighter';
import '../pages/assets/styles/CodeModal.css';

const CodeModal = ({ fragment, onClose, darkMode }) => {
  const handleCopyClick = async () => {
    if (fragment && fragment.code) {
      await DataStore.copyToClipboard(fragment.code);
      // Show a brief success message
      const copyButton = document.querySelector('.copy-button');
      const originalText = copyButton.textContent;
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = originalText;
      }, 1500);
    }
  };
  
  if (!fragment) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="code-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{fragment.title}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className={`code-container ${darkMode ? 'dark' : 'light'}`}>
          <pre>
            <code 
              dangerouslySetInnerHTML={{ 
                __html: highlightCode(fragment.code) 
              }} 
            />
          </pre>
        </div>
        
        <div className="modal-footer">
          <button className="copy-button" onClick={handleCopyClick}>
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeModal;