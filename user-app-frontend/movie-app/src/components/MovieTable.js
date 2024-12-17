import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import XLSX to handle Excel files
import "../styles.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    Movie_Name: "",
    Description: "",
    Cast: "",
  });
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [excelData, setExcelData] = useState([]); // To hold the parsed Excel data

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const response = await axios.get("http://localhost:5000/users");
    setMovies(response.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/users/${id}`);
    fetchMovies();
  };

  const handleEdit = (movie) => {
    setEditingMovieId(movie._id);
    setNewMovie({
      Movie_Name: movie.Movie_Name,
      Description: movie.Description,
      Cast: movie.Cast,
    });
  };

  const handleSaveEdit = async () => {
    await axios.patch(`http://localhost:5000/users/${editingMovieId}`, newMovie);
    setEditingMovieId(null);
    setNewMovie({
      Movie_Name: "",
      Description: "",
      Cast: "",
    });
    fetchMovies();
  };

  const handleAddMovie = async (movie) => {
    await axios.post("http://localhost:5000/users", movie);
    fetchMovies();
  };

  // Handle Excel file upload
  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming data is in the first sheet
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedData = XLSX.utils.sheet_to_json(worksheet);

      setExcelData(parsedData); // Set parsed Excel data to state
      console.log(parsedData); // Check the parsed data
    };

    reader.readAsArrayBuffer(file);
  };

  // Add movies from Excel data to the MongoDB database
  const handleUploadMovies = async () => {
    try {
      for (let movie of excelData) {
        // Assuming movie data has the correct structure
        const newMovie = {
          Movie_Name: movie.Movie_Name || "",
          Description: movie.Description || "",
          Cast: movie.Cast || "",
        };
        await handleAddMovie(newMovie); // Add each movie to the database
      }
      setExcelData([]); // Clear after upload
    } catch (error) {
      console.error("Error uploading movies:", error);
    }
  };

  // Handle selecting and deselecting movies with checkboxes
  const toggleSelectMovie = (id) => {
    if (selectedMovies.includes(id)) {
      setSelectedMovies(selectedMovies.filter((movieId) => movieId !== id));
    } else {
      setSelectedMovies([...selectedMovies, id]);
    }
  };

  // Delete multiple selected movies
  const deleteSelectedMovies = async () => {
    try {
      await axios.post(
        "http://localhost:5000/users/bulk-delete",
        { movieIds: selectedMovies }, // Send selected movie IDs in request body
      );
      setSelectedMovies([]); // Clear selected movies after deletion
      fetchMovies(); // Refresh the movie list
    } catch (err) {
      console.error("Error deleting selected movies:", err);
    }
  };

  return (
    <div className="app-container">
      {/* File input for Excel upload */}
      <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} />
      
      {/* Button to upload the parsed Excel data */}
      <button onClick={handleUploadMovies} disabled={excelData.length === 0}>
        Upload Movies from Excel
      </button>

      {/* Movie Table */}
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Movie Name</th>
            <th>Description</th>
            <th>Cast</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedMovies.includes(movie._id)} // Handle checkbox selection
                  onChange={() => toggleSelectMovie(movie._id)} // Toggle select/deselect
                />
              </td>
              <td>{movie.Movie_Name}</td>
              <td>{movie.Description}</td>
              <td>{movie.Cast}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(movie)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(movie._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Selected Movies Button */}
      <button
        className="delete-selected-btn"
        onClick={deleteSelectedMovies}
        disabled={selectedMovies.length === 0} // Disable button if no movie is selected
      >
        Delete Selected Movies
      </button>

      {/* Add/Edit Movie Form */}
      <div className="movie-form">
        <h2>{editingMovieId ? "Edit Movie" : "Add New Movie"}</h2>
        <input
          type="text"
          placeholder="Movie Name"
          value={newMovie.Movie_Name}
          onChange={(e) => setNewMovie({ ...newMovie, Movie_Name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newMovie.Description}
          onChange={(e) => setNewMovie({ ...newMovie, Description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Cast"
          value={newMovie.Cast}
          onChange={(e) => setNewMovie({ ...newMovie, Cast: e.target.value })}
        />
        <button className="save-btn" onClick={editingMovieId ? handleSaveEdit : () => handleAddMovie(newMovie)}>
          {editingMovieId ? "Save Changes" : "Add Movie"}
        </button>
      </div>
    </div>
  );
}

export default App;
