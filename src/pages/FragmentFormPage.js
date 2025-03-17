import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import DataStore from '../services/dataStore';
import { highlightCode } from '../services/syntaxHighlighter';
import './assets/styles/FragmentFormPage.css'; 

const FragmentFormPage = ({ fragments, setFragments, tags, darkMode, toggleDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [fragment, setFragment] = useState({
    title: '',
    code: '',
    tags: []
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Load fragment data if editing an existing one
  useEffect(() => {
    if (id && id !== 'new') {
      const fragmentToEdit = fragments.find(f => f.id === id);
      if (fragmentToEdit) {
        setFragment(fragmentToEdit);
        setIsEditing(true);
      } else {
        // Fragment not found, redirect to new fragment form
        navigate('/fragment/new');
      }
    }
  }, [id, fragments, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFragment(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTagChange = (tagId) => {
    setFragment(prev => {
      const currentTags = prev.tags || [];
      
      // If tag is already selected, remove it
      if (currentTags.includes(tagId)) {
        return {
          ...prev,
          tags: currentTags.filter(id => id !== tagId)
        };
      }
      
      // Otherwise, add it
      return {
        ...prev,
        tags: [...currentTags, tagId]
      };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fragment.title || !fragment.code) {
      alert('Title and code are required!');
      return;
    }
    
    try {
      const savedFragment = await DataStore.saveFragment(fragment);
      
      // Update fragments state with new/updated fragment
      setFragments(prev => {
        if (isEditing) {
          return prev.map(f => f.id === savedFragment.id ? savedFragment : f);
        } else {
          return [...prev, savedFragment];
        }
      });
      
      // Redirect to fragments page
      navigate('/');
    } catch (error) {
      console.error('Error saving fragment:', error);
      alert('Failed to save fragment. Please try again.');
    }
  };
  
  const handleDelete = async () => {
    if (!isEditing) return;
    
    if (window.confirm('Are you sure you want to delete this fragment?')) {
      try {
        await DataStore.deleteFragment(fragment.id);
        
        // Update fragments state
        setFragments(prev => prev.filter(f => f.id !== fragment.id));
        
        // Redirect to fragments page
        navigate('/');
      } catch (error) {
        console.error('Error deleting fragment:', error);
        alert('Failed to delete fragment. Please try again.');
      }
    }
  };
  
  return (
    <div className="fragment-form-page">
      <Header 
        toggleDarkMode={toggleDarkMode} 
        darkMode={darkMode} 
      />
      
      <main className="content">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={fragment.title}
                onChange={handleInputChange}
                placeholder="Enter fragment title"
                autoFocus
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="code">Code</label>
              <textarea
                id="code"
                name="code"
                value={fragment.code}
                onChange={handleInputChange}
                placeholder="Enter your code here"
                rows="15"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Tags</label>
              <div className="tags-container">
                {tags.map(tag => (
                  <div key={tag.id} className="tag-checkbox">
                    <input
                      type="checkbox"
                      id={`tag-${tag.id}`}
                      checked={fragment.tags && fragment.tags.includes(tag.id)}
                      onChange={() => handleTagChange(tag.id)}
                    />
                    <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-actions">
              {isEditing && (
                <button 
                  type="button" 
                  className="delete-button"
                  onClick={handleDelete}
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
        
        {fragment.code && (
          <div className="preview-container">
            <h3>Preview</h3>
            <div className={`code-preview ${darkMode ? 'dark' : 'light'}`}>
              <pre>
                <code dangerouslySetInnerHTML={{ __html: highlightCode(fragment.code) }} />
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FragmentFormPage;