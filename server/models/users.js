const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  mail: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  folders: [
    {
      folderName: String,
      files: [
        {
          fileName: String,
          fileType: String,
          date: String,
          filePath: String,
        }
      ]
    }
  ]
});

const User = mongoose.model('users', UserSchema, 'users');

module.exports = User;