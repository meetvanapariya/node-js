import express from "express";
import { connectDB } from "./config/dbConnection.js";
// import routes
import authRoute from "./routes/userRoute.js";
import morgan from "morgan";
import bodyParser from "body-parser";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import { PORT } from "./config/environmentVariables.js";

// initializing our Express application here.
const app = express();

// database connection
connectDB();

//  middleware
app.use(bodyParser.json());
app.use(morgan("dev"));

// api calls
app.use("/api", authRoute);

// error handling
app.use(notFound);
app.use(errorHandler);

// define port number
const port = PORT;

// listening port
app.listen(port, () => {
  console.log(`server is up and running on port: ${port}.`);
});
