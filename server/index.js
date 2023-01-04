if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const PORT = process.env.PORT || 4000;
const app = express();
const usersRouter = require('./routes/users');
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(express.urlencoded({
  extended: true,
  limit: '50mb',
}));

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb',
}));

app.use('/uploads', express.static('uploads'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const username = "Webking";
const password = "WULkruXttcFwptGS";
const cluster = "cluster1.2aajp9s";
const dbname = "DFHS-drive";

mongoose.connect(`mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.use(usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});