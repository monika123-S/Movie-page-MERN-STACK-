import React, { useState } from 'react';

const MovieForm = ({ addMovie }) => {
  const [newMovie, setNewMovie] = useState({ Movie_Name: '', Description: '', Cast: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addMovie(newMovie);
    setNewMovie({ Movie_Name: '', Description: '', Cast: '' });
  };

  return (
    <div className="movie-form">
     
    </div>
  );
};

export default MovieForm;
