import React, { useState, useEffect } from 'react';
import MovieTable from './components/MovieTable';
import MovieForm from './components/MovieForm';
import SearchBar from './components/SearchBar';
import './styles.css';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  
  const [selectedMovies, setSelectedMovies] = useState([]); // Track selected movies for multi-delete

  // Fetch movies from backend
  useEffect(() => {
    fetch('http://localhost:5000/users') // Adjust the URL if needed
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        setFilteredMovies(data); // Initially set filteredMovies to all movies
      })
      .catch(err => console.error(err));
  }, []);

  // Function to add a new movie
  const addMovie = (newMovie) => {
    setMovies([...movies, newMovie]);
    setFilteredMovies([...movies, newMovie]);
    // Add API request to add movie to backend
  };

  // Function to delete a movie by id
  const deleteMovie = (id) => {
    setMovies(movies.filter(movie => movie._id !== id));
    setFilteredMovies(filteredMovies.filter(movie => movie._id !== id));
    // Add API request to delete movie from backend
  };

  // Function to edit a movie
  const editMovie = (updatedMovie) => {
    setMovies(movies.map(movie => (movie._id === updatedMovie._id ? updatedMovie : movie)));
    setFilteredMovies(filteredMovies.map(movie => (movie._id === updatedMovie._id ? updatedMovie : movie)));
    // Add API request to edit movie on the backend
  };

  // Function to handle search
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredMovies = movies.filter((movie) =>
      movie.Movie_Name.toLowerCase().includes(searchText) ||
      movie.Description.toLowerCase().includes(searchText) ||
      movie.Cast.toLowerCase().includes(searchText)
    );
    setFilteredMovies(filteredMovies);
  };

  // Function to toggle select/deselect a movie
  const toggleSelectMovie = (id) => {
    setSelectedMovies((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(movieId => movieId !== id); // Deselect if already selected
      } else {
        return [...prevSelected, id]; // Select if not selected
      }
    });
  };

  // Function to delete multiple selected movies
  const deleteSelectedMovies = () => {
    const remainingMovies = movies.filter(movie => !selectedMovies.includes(movie._id));
    setMovies(remainingMovies);
    setFilteredMovies(remainingMovies);
    setSelectedMovies([]); // Clear the selected movies after deletion
    // Add API request to delete selected movies from backend
    fetch('http://localhost:5000/movies/bulk-delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ movieIds: selectedMovies })
    })
    .then(response => response.json())
    .then(data => {
      console.log(`${data.deletedCount} movies deleted`);
    })
    .catch(err => console.error("Error deleting selected movies:", err));
  };

  return (
    <div className="app-container">
      <h1>Movie Database</h1>
      <SearchBar handleSearchChange={handleSearchChange} />
      
      <MovieTable
        movies={filteredMovies}
        deleteMovie={deleteMovie}
        editMovie={editMovie}
        toggleSelectMovie={toggleSelectMovie} // Pass the function to handle checkbox select/deselect
        selectedMovies={selectedMovies} // Pass the selectedMovies state to highlight selected rows
      />
      <MovieForm addMovie={addMovie} />
    </div>
  );
};

export default App;
