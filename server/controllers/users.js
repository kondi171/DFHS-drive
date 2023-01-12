const bcrypt = require("bcryptjs");
const userModel = require('../models/users');

exports.addUser = async (req, res) => {
  const { mail, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const isIn = await userModel.findOne({ mail: mail })
  if (isIn) res.send('The specified user already exists!');
  else {
    try {
      const user = new userModel({ mail: mail, password: hashedPassword, folders: { folderName: "Main", files: [] } });
      await user.save();
      res.send("Registered");
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

exports.loginUser = async (req, res) => {
  const { mail, password } = req.body;
  const user = await userModel.find({ mail: mail });
  if (user.length > 0) {
    if (await bcrypt.compare(password, user[0].password)) res.send(user[0])
  } else res.send('Incorrect data!');
}

exports.holdSession = async (req, res) => {
  const { mail } = req.body;
  const user = await userModel.find({ mail: mail });
  res.send(user[0]);
}

exports.getSpecificUser = async (req, res) => {

}

exports.fileUpload = async (req, res) => {
  const mail = req.body.mail;
  const folderName = req.body.folder;
  const file = req.file;
  const fileType = cutFileType(file.originalname);
  const fileName = file.originalname.replace(cutFileType(fileType), '')
  const today = new Date();
  const date = `${today.getDate() > 10 ? today.getDate() : '0' + today.getDate()}.${today.getMonth() + 1 > 10 ? today.getMonth() + 1 : '0' + (today.getMonth() + 1)}.${today.getFullYear()} ${today.getHours() > 10 ? today.getHours() : '0' + today.getHours()}:${today.getMinutes() > 10 ? today.getMinutes() : '0' + today.getMinutes()}`
  const user = await userModel.updateOne(
    { mail: mail, 'folders.folderName': folderName },
    { $push: { 'folders.$.files': { fileName: fileName, fileType: fileType, date: date, filePath: file.path, permissions: [] } } }
  )

  res.redirect('http://localhost:3000/access/home');
}

exports.deleteFile = async (req, res) => {
  const { mail, fileID } = req.body;
  const originalName = `uploads\\${fileID}`;
  const userFile = await userModel.updateOne(
    { mail: mail, "folders.files.filePath": originalName },
    { $pull: { "folders.$.files": { filePath: originalName } } }
  );
  try {
    res.send(userFile);
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.addFolder = async (req, res) => {
  const { mail, folderName } = req.body;
  const user = await userModel.findOne({ mail: mail });
  const folders = user.folders.filter(folder => folder.folderName === folderName);

  if (folders.length === 0) {
    const user = await userModel.updateOne(
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
    const renameFolder = await userModel.updateOne(
      { mail: mail, 'folders.folderName': oldFolderName },
      { $set: { 'folders.$.folderName': newFolderName } });
    res.send(true);
  } else res.send(false);
}
exports.deleteFolder = async (req, res) => {
  const { mail, folderName } = req.body;
  const deleteFolder = await userModel.updateOne(
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

