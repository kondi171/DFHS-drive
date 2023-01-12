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
        }
      ]
    }
  ],
  sharedFiles: [
    {
      sharingUser: String,
      fileName: String,
      fileType: String,
      date: String,
      filePath: String,
      originalID: String,
    }
  ]
});

const User = mongoose.model('users', UserSchema, 'users');

module.exports = User;