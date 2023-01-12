const express = require("express");
const app = express();
const upload = require('../middleware/upload');
const userController = require('../controllers/users');

app.post('/API', userController.chargeServer); // Charge Server

app.put('/API/users', userController.addUser); // Register User

app.post('/API/users', userController.loginUser); // Login User

app.post('/API/user', userController.holdSession); // Hold logged user Session until logout

app.delete('/API/share', userController.deleteSharedFile); // Delete Shared File

app.post('/API/file', upload.single('file'), userController.fileUpload); // Upload File

app.delete('/API/file', userController.deleteFile); // Delete File

app.patch('/API/file', userController.shareFile); // Share File

app.post('/API/folder', userController.addFolder); // Add Folder

app.patch('/API/folder', userController.renameFolder); // Rename Folder

app.delete('/API/folder', userController.deleteFolder); // Delete Folder



module.exports = app;
