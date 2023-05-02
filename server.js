const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let users = [];

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Please provide both username and password.");
  }

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = {
    id: Date.now(),
    username: username,
    password: hashedPassword,
  };

  users.push(newUser);

  res.status(201).json({
    message: "User created successfully.",
    user: newUser,
  });
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Please provide both username and password.");
  }

  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).send("Invalid username or password.");
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);

  if (!passwordMatch) {
    return res.status(401).send("Invalid username or password.");
  }

  res.status(200).json({
    message: "User signed in successfully.",
    user: user,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
