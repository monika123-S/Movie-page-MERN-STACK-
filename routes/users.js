import express from "express";
import Movie from "../models/movieModel.js";
const router = express.Router();

// GET all movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();  // Fetch all movies from MongoDB
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// GET a specific movie by id
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);  // Fetch movie by ID
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).send("Movie not found");
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// POST a new movie
router.post("/", async (req, res) => {
  const { Movie_Name, Description, Cast } = req.body;

  // Check for missing fields
  if (!Movie_Name || !Description || !Cast) {
    return res.status(400).json({ message: "Please provide Movie_Name, Description, and Cast" });
  }

  try {
    const newMovie = new Movie({Movie_Name, Description, Cast });
    await newMovie.save();
    res.status(201).json({ message: "New movie added", movie: newMovie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE a movie by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);  // Delete movie by ID
    if (deletedMovie) {
      res.send(`Movie deleted: ${deletedMovie.Movie_Name}`);
    } else {
      res.status(404).send("Movie not found");
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
//this is by monika for multiple delete before patch 
// DELETE multiple movies by IDs
// DELETE multiple movies by IDs
router.post("/bulk-delete", async (req, res) => {
  const { movieIds } = req.body; // Expect an array of movie IDs

  if (!Array.isArray(movieIds) || movieIds.length === 0) {
    return res.status(400).json({ message: "No movie IDs provided" });
  }


  try {
    const result = await Movie.deleteMany({ _id: { $in: movieIds } });
    res.status(200).json({ message: `${result.deletedCount} movies deleted` });
  } catch (error) {
    console.error("Error during bulk delete:", error);
    res.status(500).json({ message: "Error deleting movies" });
  }
});



// PATCH (update) a movie by id
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  
  // Validate if the provided id is a valid MongoDB ObjectId
  //if (!mongoose.Types.ObjectId.isValid(id)) {
  //  return res.status(400).json({ message: "Invalid Movie ID format" });
  //}

  try {
    const updates = req.body;
    const updatedMovie = await Movie.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({
      message: `Movie with ID: ${id} updated successfully`,
      movie: updatedMovie
    });
  } catch (error) {
    console.error("Error during PATCH operation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// PUT (replace) a movie by id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { Movie_Name, Description, Cast } = req.body;

  // Check for missing fields
  if (!Movie_Name || !Description || !Cast) {
    return res.status(400).json({ message: "Please provide Movie_Name, Description, and Cast" });
  }

  // Validate if the provided id is a valid MongoDB ObjectId
  //if (!mongoose.Types.ObjectId.isValid(id)) {
  //  return res.status(400).json({ message: "Invalid Movie ID format" });
  //}

  try {
    // Replace the entire movie document with the new data
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { Movie_Name, Description, Cast },
      { new: true, overwrite: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({
      message: `Movie with ID: ${id} replaced successfully`,
      movie: updatedMovie
    });
  } catch (error) {
    console.error("Error during PUT operation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



export default router;
