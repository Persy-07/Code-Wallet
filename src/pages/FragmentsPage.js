import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import FragmentCard from '../components/FragmentCard';
import CodeModal from '../components/CodeModal';
import './assets/styles/FragmentsPage.css'; 

const FragmentsPage = ({ fragments, tags, darkMode, toggleDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFragments, setFilteredFragments] = useState([]);
  const [selectedFragment, setSelectedFragment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Update filtered fragments when search term or fragments change
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFragments(fragments);
      return;
    }
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = fragments.filter(fragment => {
      // Search in title
      if (fragment.title.toLowerCase().includes(lowerCaseSearch)) {
        return true;
      }
      
      // Search in code
      if (fragment.code.toLowerCase().includes(lowerCaseSearch)) {
        return true;
      }
      
      // Search in tags
      if (fragment.tags) {
        const fragmentTags = tags.filter(tag => fragment.tags.includes(tag.id));
        return fragmentTags.some(tag => 
          tag.name.toLowerCase().includes(lowerCaseSearch)
        );
      }
      
      return false;
    });
    
    setFilteredFragments(filtered);
  }, [searchTerm, fragments, tags]);
  
  const handleViewCode = (fragment) => {
    setSelectedFragment(fragment);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  // Handle the drag and drop for creating fragments from files
  const handleDrop = (event) => {
    event.preventDefault();
    
    // Get the dropped files
    const files = event.dataTransfer.files;
    
    if (files.length > 0) {
      // Read the first file
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const fileName = files[0].name;
        
        // Create a new fragment with the file content
        const newFragment = {
          title: fileName,
          code: content,
          tags: []
        };
        
        // Navigate to the fragment form page with this data
        // For simplicity we'll just alert here - in a real app you'd use a router
        alert(`File detected: ${fileName}\nYou'd be redirected to the fragment form to save this code.`);
        console.log('New fragment from file:', newFragment);
      };
      
      reader.readAsText(files[0]);
    }
  };
  
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  
  return (
    <div className="fragments-page">
      <Header 
        toggleDarkMode={toggleDarkMode} 
        darkMode={darkMode} 
      />
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search fragments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      {filteredFragments.length === 0 ? (
        <div className="no-fragments">
          <p>No fragments found. Create a new one or adjust your search.</p>
        </div>
      ) : (
        <div className="fragments-grid">
          {filteredFragments.map(fragment => (
            <FragmentCard
              key={fragment.id}
              fragment={fragment}
              tags={tags}
              onViewCode={handleViewCode}
            />
          ))}
        </div>
      )}
  
      {/* Ajoutez cette partie */}
      {showModal && (
        <CodeModal 
          fragment={selectedFragment} 
          onClose={closeModal}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default FragmentsPage;