import React, { useState, useEffect } from 'react';
import { highlightCode } from '../services/syntaxHighlighter';

const FragmentForm = ({ fragment, tags, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    tags: []
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize form data when fragment changes
  useEffect(() => {
    if (fragment) {
      setFormData({
        id: fragment.id,
        title: fragment.title || '',
        code: fragment.code || '',
        tags: fragment.tags || []
      });
      setIsEditing(!!fragment.id);
    } else {
      setFormData({
        title: '',
        code: '',
        tags: []
      });
      setIsEditing(false);
    }
  }, [fragment]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTagChange = (tagId) => {
    setFormData(prev => {
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.code) {
      alert('Title and code are required!');
      return;
    }
    
    onSave(formData);
  };
  
  const handleDelete = () => {
    if (isEditing && window.confirm('Are you sure you want to delete this fragment?')) {
      onDelete(formData.id);
    }
  };
  
  return (
    <div className="fragment-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
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
            value={formData.code}
            onChange={handleInputChange}
            placeholder="Enter your code here"
            rows="15"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Tags</label>
          <div className="tags-container">
            {tags && tags.map(tag => (
              <div key={tag.id} className="tag-checkbox">
                <input
                  type="checkbox"
                  id={`tag-${tag.id}`}
                  checked={formData.tags && formData.tags.includes(tag.id)}
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
      
      {formData.code && (
        <div className="preview-container">
          <h3>Preview</h3>
          <div className="code-preview">
            <pre>
              <code dangerouslySetInnerHTML={{ __html: highlightCode(formData.code) }} />
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FragmentForm;