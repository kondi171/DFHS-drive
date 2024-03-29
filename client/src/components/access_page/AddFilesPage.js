import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AppContext } from "../AppContext";

const AddFilesPage = () => {
  const { loggedUser, setLoggedUser } = useContext(AppContext);
  const [login, setLogin] = useState('');
  const [activeFolder, setActiveFolder] = useState('Main');

  const holdSession = () => {
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_DB_CONNECT}API/user`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        mail: localStorage.getItem('mail'),
      }
    }).then(data => {
      const { mail } = data.data;
      localStorage.setItem('mail', mail);
      setLoggedUser(data.data);
    })
      .catch(error => console.log(error));
  }

  const setInfoAboutUploadedFile = () => { localStorage.setItem('infoAboutUploadedFile', true) }
  const handleSelectFolder = e => {
    const folders = document.querySelectorAll('.folder');
    folders.forEach(folder => folder.classList.remove('active'));
    e.target.parentElement.classList.add('active');
    setActiveFolder(e.target.dataset.id);
  }

  useEffect(() => {
    if (loggedUser.mail) {
      const atIndex = loggedUser.mail.indexOf('@');
      setLogin(loggedUser.mail.slice(0, atIndex));
    } else holdSession();
  }, [loggedUser.mail]);

  return (
    <main id="addFilesPage" className="access-page add-files">
      <h2>Add to <span>{login}</span> repository</h2>
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
        <input readOnly type="text" name="mail" value={loggedUser.mail} style={{ display: 'none' }} />
        <input readOnly type="text" name="folder" value={activeFolder} style={{ display: 'none' }} />
        <input id="fileInput" type="file" name="file" />
        <button>Upload file</button>
      </form>
    </main >
  );
}
export default AddFilesPage;