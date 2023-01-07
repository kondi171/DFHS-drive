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
      folderName: {
        type: String,
        default: 'Main',
        required: true,
      },
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

// UserSchema.pre("save", function (next) {
//   const user = this;
//   if (this.isModified("password") || this.isNew) {
//     bcrypt.genSalt(10, function (saltError, salt) {
//       if (saltError) return next(saltError);
//       else {
//         bcrypt.hash(user.password, salt, function (hashError, hash) {
//           if (hashError) return next(hashError);
//           user.password = hash;
//           next();
//         });
//       }
//     });
//   } else return next()
// });

const User = mongoose.model('users', UserSchema, 'users');

module.exports = User;