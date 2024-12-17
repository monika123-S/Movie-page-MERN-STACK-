import express from 'express';
import bodyParser from 'body-parser';
import connectDB from "./routes/db.js";
import cors from "cors";

import routes from "./routes/users.js"

const app = express();
const PORT=5000;
connectDB()
app.use(cors({
    orgin:"http://localhost:3001"
}
))
app.use(express.json());

app.use(bodyParser.json());

app.use("/users",routes);

app.listen(PORT, ()=>{console.log("server is running")});