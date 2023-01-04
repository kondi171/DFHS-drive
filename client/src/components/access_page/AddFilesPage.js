import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../AppContext";

const AddFilesPage = () => {
  const { loggedUser, setLoggedUser } = useContext(AppContext);

  const holdSession = () => {
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_DB_CONNECT}API/users`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        mail: localStorage.getItem('mail'),
        password: localStorage.getItem('password'),
      }
    }).then(data => {
      const { mail, password } = data.data;
      localStorage.setItem('mail', mail);
      localStorage.setItem('password', password);
      setLoggedUser(data.data);
    })
      .catch(error => console.log(error));
  }

  const setInfoAboutUploadedFile = () => { localStorage.setItem('infoAboutUploadedFile', 'File was Uploaded!') }

  useEffect(() => {
    if (!loggedUser.mail) holdSession();
  }, [loggedUser.mail]);

  return (
    <main className="access-page add-files">
      <h2>Add to <span>{loggedUser.mail}</span> repository</h2>
      <form onSubmit={setInfoAboutUploadedFile} className="add-files-form" action={`${process.env.REACT_APP_DB_CONNECT}API/upload`} encType="multipart/form-data" method="POST">
        <input type="text" name="mail" value={loggedUser.mail} style={{ display: 'none' }} />
        <input type="file" name="file" accept="image/*" />
        <button >Upload files</button>
      </form>
    </main >
  );
}
export default AddFilesPage;