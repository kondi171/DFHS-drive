const express = require("express");
const app = express();
const upload = require('../middleware/upload');
const userController = require('../controllers/users');

app.post('/API', userController.chargeServer); // Charge Server

app.put('/API/users', userController.addUser); // Register User

app.post('/API/users', userController.loginUser); // Login User

app.get('/API/users/:id', userController.getSpecificUser); // Get Specific User

app.post('/API/user', userController.holdSession); // Hold logged user Session until logout

app.post('/API/file', upload.single('file'), userController.fileUpload); // Upload File

app.delete('/API/file', userController.deleteFile); // Delete File

app.post('/API/folder', userController.addFolder); // Add Folder

app.patch('/API/folder', userController.renameFolder); // Rename Folder

app.delete('/API/folder', userController.deleteFolder); // Delete Folder



module.exports = app;
