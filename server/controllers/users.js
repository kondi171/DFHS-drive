const bcrypt = require("bcryptjs");
const userModel = require('../models/users');
const passport = require('passport');
const initializePassport = require('./../config/passport-config');
const user = {
  mail: null,
  password: null
}

initializePassport(passport,
  user.mail);

exports.addUser = async (req, res) => {
  const { mail, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const isIn = await userModel.findOne({ mail: mail })
  if (isIn) res.send('The specified user already exists!');
  else {
    try {
      const user = new userModel({ mail: mail, password: hashedPassword });
      await user.save();
      res.send("Registered");
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

exports.loginUser = async (req, res) => {
  const { mail, password } = req.body;
  const user = await userModel.find({ mail: mail, password: password });
  user.mail = req.session.mail = mail;
  if (user.length > 0) res.send(user[0]);
  else res.send('Incorrect data!');
  // Hashed password login
  // const user = await userModel.find({ mail: mail });
  // if (user.length > 0) {
  //   if (await bcrypt.compare(password, user[0].password)) res.send(user[0])
  // } else res.send('Incorrect data!');
}

exports.holdSession = async (req, res) => {

}

exports.getSpecificUser = async (req, res) => {

}

exports.fileUpload = async (req, res) => {
  const mail = req.body.mail;
  const file = req.file;
  const fileType = cutFileType(file.originalname);
  const fileName = file.originalname.replace(cutFileType(fileType), '')
  const today = new Date();
  const date = `${today.getDate() > 10 ? today.getDate() : '0' + today.getDate()}.${today.getMonth() + 1 > 10 ? today.getMonth() + 1 : '0' + (today.getMonth() + 1)}.${today.getFullYear()} ${today.getHours() > 10 ? today.getHours() : '0' + today.getHours()}:${today.getMinutes() > 10 ? today.getMinutes() : '0' + today.getMinutes()}`
  const user = await userModel.updateOne(
    { mail: mail },
    {
      $push: {
        files: {
          fileName: fileName,
          fileType: fileType,
          date: date,
          filePath: file.path
        }
      }
    }
  );
  res.redirect('http://localhost:3000/access/home');
  try {
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.getFiles = async (req, res) => {
  const mail = req.body.mail;
  const files = await userModel.find({ mail: mail });
  console.log(files.files);
}

const cutFileType = filename => {
  const fileTypeReverse = filename.split("").reverse().join("");
  const atIndex = fileTypeReverse.indexOf('.');
  const fileType = '.' + fileTypeReverse.slice(0, atIndex).split("").reverse().join("");
  return fileType;
}
