import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  Movie_Name: { type: String, required: true },
  Description: { type: String, required: false },
  Cast: { type: String, required: false },
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
