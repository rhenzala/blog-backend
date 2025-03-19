const path = require("path");
const express = require("express");
const session = require("express-session");
const routes = require("./routes/index");
const app = express();
const PORT = process.env.PORT || 3000;



app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", routes.auth);
app.use("/api/posts", routes.posts);
app.use("/api/comments", routes.comments);


app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));



 




