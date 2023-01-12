const mongoose = require('mongoose');

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
          permissions: []
        }
      ]
    }
  ],
  sharedFiles: [
    {
      primaryUser: String,
      fileName: String,
      fileType: String,
      date: String,
      filePath: String,
    }
  ]
});

const User = mongoose.model('users', UserSchema, 'users');

module.exports = User;