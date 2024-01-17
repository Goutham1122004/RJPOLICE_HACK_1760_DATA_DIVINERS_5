import '@fortawesome/fontawesome-free/css/all.css';
import React, { useState } from 'react';
import './StarRating.css';

const StarRating = () => {
  const [rating, setRating] = useState(null);

  const handleStarClick = (value) => {
    setRating(value);
  };

  return (
    <div className="star-rating">
      {[5, 4, 3, 2, 1].map((value) => (
        <React.Fragment key={value}>
          <input
            id={`star-${value}`}
            type="radio"
            name="rating"
            value={`star-${value}`}
            onClick={() => handleStarClick(value)}
          />
          <label htmlFor={`star-${value}`} title={`${value} stars`}>
            <i className={`active fas fa-star${rating === value ? ' selected' : ''}`} aria-hidden="true"></i>
          </label>
        </React.Fragment>
      ))}
      {rating && <p>You selected {rating} stars!</p>}
    </div>
  );
};

export default StarRating;
