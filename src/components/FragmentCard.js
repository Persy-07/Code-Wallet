import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/assets/styles/FragmentCard.css'; 

const FragmentCard = ({ fragment, tags = [], onViewCode }) => {
  const navigate = useNavigate();
  
  // Find tag objects for this fragment
  const fragmentTags = tags.filter(tag => 
    fragment.tags && fragment.tags.includes(tag.id)
  );
  
  const handleCardClick = () => {
    navigate(`/fragment/${fragment.id}`);
  };
  
  const handleViewCodeClick = (e) => {
    e.stopPropagation(); // Prevent card click
    onViewCode(fragment);
  };
  
  return (
    <div className="fragment-card" onClick={handleCardClick}>
      <div className="fragment-card-content">
        <h3 className="fragment-title">{fragment.title}</h3>
        
        <div className="fragment-card-footer">
          <div className="fragment-tags">
            {fragmentTags.map(tag => (
              <span key={tag.id} className="tag">{tag.name}</span>
            ))}
          </div>
          
          <button 
            className="view-code-button"
            onClick={handleViewCodeClick}
            aria-label="View code"
          >
            👁️
          </button>
        </div>
      </div>
    </div>
  );
};

export default FragmentCard;