import express from "express";
import dotenv from "dotenv";
import errorHandler from "./shared/middleware/error.middleware.js";


dotenv.config();
const app = express();




app.use(errorHandler)

app.listen(3001, () => {
  console.log("Server running on port 3001");
});