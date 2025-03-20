const path = require("path");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const routes = require("./routes/index");
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
  }));
  
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

  app.options("*", cors());

app.use("/api/auth", routes.auth);
app.use("/api/posts", routes.posts);
app.use("/api/posts/:postId/comments", routes.comments);


app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));



 




