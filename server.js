import express from "express";
// import routes
import authRoute from "./routes/auth.js";

// initializing our Express application here.
const app = express();

//  middleware
app.use("/api", authRoute);

// define port number
const PORT = 8000;

// listening port
app.listen(PORT, () => {
  console.log("server is up and running!");
});
