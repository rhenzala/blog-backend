const path = require("path");
const express = require("express");
const cors = require("cors");
const routes = require("./routes/index");
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
  }));
  
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

  app.options("*", cors());

app.use("/api/auth", routes.auth);
app.use("/api/posts", routes.posts);
app.use("/api/comments", routes.comments);


app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));



 




