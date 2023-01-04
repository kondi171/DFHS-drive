const express = require("express");
const app = express();
const upload = require('../middleware/upload');
const userController = require('../controllers/users');

// Register User
app.put('/API/users', userController.addUser);

// Login User
app.post('/API/users', userController.loginUser);

// Get Specific User
app.get('/API/users/:id', userController.getSpecificUser);

app.post('/API/upload', upload.single('file'), userController.fileUpload);

app.get('/API/upload/:id', userController.getFiles);

app.get('/', userController.holdSession);
module.exports = app;