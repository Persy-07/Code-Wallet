import React, { useState } from 'react';
import Header from '../components/Header';
import DataStore from '../services/dataStore';
import './assets/styles/TagsPage.css';

const TagsPage = ({ tags, setTags, fragments, darkMode, toggleDarkMode }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentTag, setCurrentTag] = useState({ name: '' });
  const [isEditing, setIsEditing] = useState(false);
  
  const openTagModal = (tag = null) => {
    if (tag) {
      setCurrentTag(tag);
      setIsEditing(true);
    } else {
      setCurrentTag({ name: '' });
      setIsEditing(false);
    }
    setShowModal(true);
  };
  
  const closeTagModal = () => {
    setShowModal(false);
  };
  
  const handleTagSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentTag.name.trim()) {
      alert('Tag name is required!');
      return;
    }
    
    try {
      const savedTag = await DataStore.saveTag(currentTag);
      
      // Update tags state
      setTags(prev => {
        if (isEditing) {
          return prev.map(t => t.id === savedTag.id ? savedTag : t);
        } else {
          return [...prev, savedTag];
        }
      });
      
      // Close modal
      closeTagModal();
    } catch (error) {
      console.error('Error saving tag:', error);
      alert('Failed to save tag. Please try again.');
    }
  };
  
  const handleTagDelete = async (tagId) => {
    // Check if tag is used in any fragments
    const isTagUsed = fragments.some(fragment => 
      fragment.tags && fragment.tags.includes(tagId)
    );
    
    if (isTagUsed) {
      alert('This tag is used in one or more fragments. Remove it from all fragments before deleting.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        await DataStore.deleteTag(tagId);
        
        // Update tags state
        setTags(prev => prev.filter(t => t.id !== tagId));
        
        // Close modal if open
        if (showModal && currentTag.id === tagId) {
          closeTagModal();
        }
      } catch (error) {
        console.error('Error deleting tag:', error);
        alert('Failed to delete tag. Please try again.');
      }
    }
  };
  
  return (
    <div className="tags-page">
      <Header 
        toggleDarkMode={toggleDarkMode} 
        darkMode={darkMode} 
      />
      
      <main className="content">
        <div className="tags-header">
          <h2>Tags</h2>
          <button 
            className="new-tag-button"
            onClick={() => openTagModal()}
          >
            New
          </button>
        </div>
        
        {tags.length === 0 ? (
          <div className="no-tags">
            <p>No tags found. Create a new one to start organizing your fragments.</p>
          </div>
        ) : (
          <div className="tags-grid">
            {tags.map(tag => (
              <div key={tag.id} className="tag-card" onClick={() => openTagModal(tag)}>
                <span className="tag-name">{tag.name}</span>
                
                {/* Count fragments using this tag */}
                <span className="tag-count">
                  {fragments.filter(f => f.tags && f.tags.includes(tag.id)).length} fragments
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Tag Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeTagModal}>
          <div className="tag-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditing ? 'Edit Tag' : 'New Tag'}</h3>
              <button className="close-button" onClick={closeTagModal}>×</button>
            </div>
            
            <form onSubmit={handleTagSubmit}>
              <div className="form-group">
                <label htmlFor="tag-name">Tag Name</label>
                <input
                  type="text"
                  id="tag-name"
                  value={currentTag.name}
                  onChange={(e) => setCurrentTag({ ...currentTag, name: e.target.value })}
                  placeholder="Enter tag name"
                  autoFocus
                  required
                />
              </div>
              
              <div className="modal-actions">
                {isEditing && (
                  <button 
                    type="button" 
                    className="delete-button"
                    onClick={() => handleTagDelete(currentTag.id)}
                  >
                    Delete
                  </button>
                )}
                
                <button type="submit" className="save-button">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsPage;