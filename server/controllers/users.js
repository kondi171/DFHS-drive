const bcrypt = require("bcryptjs");
const fs = require('fs');
const userModel = require('../models/users');

exports.addUser = async (req, res) => {
  const { mail, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const isIn = await userModel.findOne({ mail: mail })
  if (isIn) res.send('The specified user already exists!');
  else {
    try {
      const user = new userModel({ mail: mail.toLowerCase(), password: hashedPassword, folders: { folderName: "Main", files: [] } });
      await user.save();
      res.send("Registered");
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

exports.loginUser = async (req, res) => {
  const { mail, password } = req.body;
  const user = await userModel.find({ mail: mail.toLowerCase() });
  if (user.length > 0) {
    if (await bcrypt.compare(password, user[0].password)) res.send(user[0])
  } else res.send('Incorrect data!');
}

exports.holdSession = async (req, res) => {
  const { mail } = req.body;
  const user = await userModel.find({ mail: mail });
  res.send(user[0]);
}

exports.fileUpload = async (req, res) => {
  const mail = req.body.mail;
  const folderName = req.body.folder;
  const file = req.file;
  const fileType = cutFileType(file.originalname);
  const fileName = file.originalname.replace(cutFileType(fileType), '');
  const user = await userModel.findOne({ mail: mail });
  const findFile = user.folders[0].files.filter(file => file.fileName === fileName);
  if (findFile.length > 0) {
    res.redirect('http://localhost:3000/access/home/?success=false');
  } else {
    const today = new Date();
    const date = `${today.getDate() > 10 ? today.getDate() : '0' + today.getDate()}.${today.getMonth() + 1 > 10 ? today.getMonth() + 1 : '0' + (today.getMonth() + 1)}.${today.getFullYear()} ${today.getHours() > 10 ? today.getHours() : '0' + today.getHours()}:${today.getMinutes() > 10 ? today.getMinutes() : '0' + today.getMinutes()}`
    const newFile = await userModel.updateOne(
      { mail: mail, 'folders.folderName': folderName },
      { $push: { 'folders.$.files': { fileName: fileName, fileType: fileType, date: date, filePath: file.path } } }
    )
    res.redirect('http://localhost:3000/access/home/?success=true');
  }
}

exports.deleteFile = async (req, res) => {
  const { mail, fileID } = req.body;
  const path = `uploads\\${fileID}`;
  await userModel.updateMany({},
    { $pull: { sharedFiles: { filePath: path } } }
  );
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  await userModel.updateOne(
    { mail: mail, "folders.files.filePath": path },
    { $pull: { "folders.$.files": { filePath: path } } }
  );
  try {
    res.send('File was deleted');
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.shareFile = async (req, res) => {
  const { mail, shareToUser, file } = req.body;
  const { fileName, fileType, date, filePath, _id } = file;
  const findUser = await userModel.findOne({ mail: shareToUser });
  const sharedFile = {
    originalID: _id,
    fileName: fileName,
    fileType: fileType,
    date: date,
    filePath: filePath,
    sharingUser: mail
  }
  let announcement = '';
  if (findUser) {
    const sameFile = findUser.sharedFiles.filter(file => file.originalID === sharedFile.originalID);
    if (sameFile.length > 0) announcement = "This file was shared to this user!";
    else {
      if (findUser.mail === mail) announcement = "You can't share files with yourself!";
      else announcement = "Shared";
    }
  } else announcement = "User with given mail address not found!";
  if (announcement === "Shared") {
    await userModel.updateOne(
      { mail: shareToUser },
      { $push: { sharedFiles: sharedFile } }
    );
  }
  try {
    res.send(announcement);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.deleteSharedFile = async (req, res) => {
  const { mail, fileID } = req.body;
  await userModel.updateOne(
    { mail: mail, 'sharedFiles.$.originalID': fileID },
    { $pull: { sharedFiles: { originalID: fileID } } }
  );
  try {
    res.send("delete");
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.addFolder = async (req, res) => {
  const { mail, folderName } = req.body;
  const user = await userModel.findOne({ mail: mail });
  const folders = user.folders.filter(folder => folder.folderName === folderName);

  if (folders.length === 0) {
    await userModel.updateOne(
      { mail: mail },
      {
        $push: {
          folders: {
            folderName: folderName,
            files: []
          }
        }
      });
    res.send(true);
  }
  else res.send(false);
}

exports.renameFolder = async (req, res) => {
  const { mail, oldFolderName, newFolderName } = req.body;
  const user = await userModel.findOne({ mail: mail });
  const folders = user.folders.filter(folder => folder.folderName === newFolderName);
  if (folders.length === 0) {
    await userModel.updateOne(
      { mail: mail, 'folders.folderName': oldFolderName },
      { $set: { 'folders.$.folderName': newFolderName } });
    res.send(true);
  } else res.send(false);
}
exports.deleteFolder = async (req, res) => {
  const { mail, folderName } = req.body;
  await userModel.updateOne(
    { mail: mail },
    { $pull: { folders: { folderName: folderName } } }
  );
  res.send(true);
}

exports.chargeServer = async (req, res) => {
  let i = 0;
  while (true) {
    i++;
    console.log(`Server is in Charge: ${i}`);
  }
}

const cutFileType = filename => {
  const fileTypeReverse = filename.split("").reverse().join("");
  const atIndex = fileTypeReverse.indexOf('.');
  const fileType = '.' + fileTypeReverse.slice(0, atIndex).split("").reverse().join("");
  return fileType;
}

