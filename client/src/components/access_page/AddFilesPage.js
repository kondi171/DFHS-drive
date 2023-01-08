import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../AppContext";

const AddFilesPage = () => {
  const { loggedUser, setLoggedUser } = useContext(AppContext);
  const [activeFolder, setActiveFolder] = useState('Main');
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

  const setInfoAboutUploadedFile = () => { localStorage.setItem('infoAboutUploadedFile', true) }
  const handleSelectFolder = e => {
    const folders = document.querySelectorAll('.folder');
    folders.forEach(folder => folder.classList.remove('active'));
    console.log(e.target.dataset.id);
    e.target.parentElement.classList.add('active');
    setActiveFolder(e.target.dataset.id);
  }
  useEffect(() => {
    if (!loggedUser.mail) holdSession();
  }, [loggedUser.mail]);

  return (
    <main className="access-page add-files">
      <h2>Add to <span>{loggedUser.mail}</span> repository</h2>
      <form onSubmit={setInfoAboutUploadedFile} className="add-files-form" action={`${process.env.REACT_APP_DB_CONNECT}API/file`} encType="multipart/form-data" method="POST">
        <div className="folder-select">
          <h3>Select folder</h3>
          <div className="folders">
            {Object.keys(loggedUser).length !== 0 ? loggedUser.folders.map((folder, index) => {
              const { folderName } = folder;
              if (index === 0) return <div className="folder active" key={folderName}>
                <i data-id={folderName} onClick={e => handleSelectFolder(e)} className="fa fa-folder" aria-hidden="true"></i>
                <span>{folderName}</span>
              </div>
              return <div className="folder" key={folderName}>
                <i data-id={folderName} onClick={e => handleSelectFolder(e)} className="fa fa-folder" aria-hidden="true"></i>
                <span>{folderName}</span>
              </div>
            }) : <div className="no-files-message"><i className="fa fa-meh-o" aria-hidden="true"></i><span>There is no files uploaded!</span></div>}
          </div>
        </div>
        <input type="text" name="mail" value={loggedUser.mail} style={{ display: 'none' }} />
        <input type="text" name="folder" value={activeFolder} style={{ display: 'none' }} />
        <input type="file" name="file" accept="image/*" />
        <button >Upload files</button>
      </form>
    </main >
  );
}
export default AddFilesPage;