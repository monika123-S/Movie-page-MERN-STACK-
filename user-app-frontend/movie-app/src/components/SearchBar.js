import React from 'react';

const SearchBar = ({ setSearchTerm }) => {
  const handleInputChange = ({ target: { value } }) => {
    setSearchTerm(value);
  };

  return (
    <div className="search-bar">
     
      
    </div>
  );
};

export default SearchBar;
