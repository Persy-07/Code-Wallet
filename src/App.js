import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './pages/assets/styles/App.css'; 

// Import des pages
import FragmentsPage from './pages/FragmentsPage';
import FragmentFormPage from './pages/FragmentFormPage';
import TagsPage from './pages/TagsPage';
import InfoPage from './pages/InfoPage';

// Import du nouveau DataStore
import DataStore from './services/dataStore';

function App() {
  const [fragments, setFragments] = useState([]);
  const [tags, setTags] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const loadedFragments = await DataStore.getFragments();
        const loadedTags = await DataStore.getTags();
        
        setFragments(loadedFragments || []);
        setTags(loadedTags || []);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    
    loadInitialData();
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <FragmentsPage 
                fragments={fragments} 
                tags={tags}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            } 
          />
          <Route 
            path="/fragment/new" 
            element={
              <FragmentFormPage 
                fragments={fragments} 
                setFragments={setFragments}
                tags={tags}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            } 
          />
          <Route 
            path="/fragment/:id" 
            element={
              <FragmentFormPage 
                fragments={fragments} 
                setFragments={setFragments}
                tags={tags}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            } 
          />
          <Route 
            path="/tags" 
            element={
              <TagsPage 
                tags={tags} 
                setTags={setTags}
                fragments={fragments}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            } 
          />
          <Route 
            path="/info" 
            element={
              <InfoPage
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;