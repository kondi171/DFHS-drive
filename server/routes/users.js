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

app.post('/API/file/upload', upload.single('file'), userController.fileUpload);

app.delete('/API/file/delete', userController.deleteFile);

module.exports = app;
