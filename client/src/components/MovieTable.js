import React from "react";

const MovieTable = ({ movies, handleEdit, handleDelete }) => {
  return (
    <table className="movie-table">
      <thead>
        <tr>
          <th>Movie Name</th>
          <th>Description</th>
          <th>Cast</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {movies.map((movie) => (
          <tr key={movie._id}>
            <td>{movie.Movie_Name}</td>
            <td>{movie.Description}</td>
            <td>{movie.Cast}</td>
            <td>
              <button className="edit-btn" onClick={() => handleEdit(movie)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(movie._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MovieTable;
