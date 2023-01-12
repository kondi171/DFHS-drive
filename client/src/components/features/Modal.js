import axios from 'axios';
const Modal = ({ notify, holdSession, operation, setOperation, clickedFileName, setClickedFileName, file, setFile }) => {

  const handleAddFolder = e => {
    const folderName = e.target.previousSibling.value;
    if (folderName.length === 0) notify('Folder name is empty!', 'error');
    else if (folderName.length > 12) notify('Folder name is longer than 12 characters!', 'error');
    else if (folderName.length < 2) notify('Folder name is shorter than 2 characters!', 'error');
    else {
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_DB_CONNECT}API/folder`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          mail: localStorage.getItem('mail'),
          folderName: folderName
        }
      })
        .then(data => {
          if (data.data === true) {
            const overlay = document.querySelector('.overlay');
            const modal = document.querySelector('.modal');
            overlay.style.opacity = 0;
            overlay.style.zIndex = -15;
            modal.style.transform = 'scale(0) translate(-50%, -50%)';
            notify(`Folder ${folderName} was created!`);
            e.target.previousSibling.value = '';
            holdSession();
          } else {
            notify('That folder already exists!', 'error');
          }
        })
        .catch(error => console.log(error));
    }
  }

  const handleRenameFolder = e => {
    const folderName = e.target.previousSibling.value;
    if (folderName.length === 0) notify('Folder name is empty!', 'error');
    else if (folderName.length > 12) notify('Folder name is longer than 12 characters!', 'error');
    else if (folderName.length < 2) notify('Folder name is shorter than 2 characters!', 'error');
    else {
      axios({
        method: 'PATCH',
        url: `${process.env.REACT_APP_DB_CONNECT}API/folder`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          mail: localStorage.getItem('mail'),
          newFolderName: folderName,
          oldFolderName: clickedFileName
        }
      })
        .then(data => {
          if (data.data === true) {
            const overlay = document.querySelector('.overlay');
            const modal = document.querySelector('.modal');
            overlay.style.opacity = 0;
            overlay.style.zIndex = -15;
            modal.style.transform = 'scale(0) translate(-50%, -50%)';
            notify(`${clickedFileName} folder was renamed to ${folderName}!`);
            e.target.previousSibling.value = '';
            holdSession();
          } else {
            notify('That folder already exists!', 'error');
          }
        })
        .catch(error => console.log(error));
    }
  }

  const handleRemoveFolder = () => {
    axios({
      method: 'DELETE',
      url: `${process.env.REACT_APP_DB_CONNECT}API/folder`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        mail: localStorage.getItem('mail'),
        folderName: clickedFileName
      }
    })
      .then(data => {
        if (data.data === true) {
          const overlay = document.querySelector('.overlay');
          const modal = document.querySelector('.modal');
          overlay.style.opacity = 0;
          overlay.style.zIndex = -15;
          modal.style.transform = 'scale(0) translate(-50%, -50%)';
          notify(`Folder ${clickedFileName} was deleted!`);
          holdSession();
        } else {
          notify('That folder already exists!', 'error');
        }
      })
      .catch(error => console.log(error));
  }

  const handleModal = (e, open = true) => {
    const overlay = document.querySelector('.overlay');
    const modal = document.querySelector('.modal');
    if (open) {
      overlay.style.opacity = 1;
      overlay.style.zIndex = 15;
      modal.style.transform = 'scale(1) translate(-50%, -50%)';
    } else {
      overlay.style.opacity = 0;
      overlay.style.zIndex = -15;
      modal.style.transform = 'scale(0) translate(-50%, -50%)';
      setOperation('');
      setClickedFileName('');
    }
  }

  const handleShareFile = e => {
    const userMail = e.target.previousSibling.value;
    if (userMail.length === 0) notify('User mail is empty!', 'error');
    else {
      axios({
        method: 'PATCH',
        url: `${process.env.REACT_APP_DB_CONNECT}API/file`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          mail: localStorage.getItem('mail'),
          shareToUser: userMail,
          file: file
        }
      })
        .then(data => {
          console.log(data);
          if (data.data === 'Shared') {
            const overlay = document.querySelector('.overlay');
            const modal = document.querySelector('.modal');
            overlay.style.opacity = 0;
            overlay.style.zIndex = -15;
            modal.style.transform = 'scale(0) translate(-50%, -50%)';
            notify(`File ${clickedFileName} was shared to ${userMail}!`);
            holdSession();
          } else {
            notify(`${data.data}`, 'error');
          }
        })
        .catch(error => console.log(error));
    }
  }

  return (
    <div className="overlay">
      <div className="modal">
        {operation === "ADD" && <>
          <h3>Create folder</h3>
          <input name='folderName' type="text" placeholder="Type folder name..." />
          <button onClick={e => handleAddFolder(e)}>Add folder</button>
          <i onClick={e => handleModal(e, false)} className="fa fa-times" aria-hidden="true"></i>
        </>}
        {operation === "RENAME" && <>
          <h3>Rename <strong>{clickedFileName}</strong> folder</h3>
          <input name='folderName' type="text" placeholder="Type new folder name..." />
          <button onClick={e => handleRenameFolder(e)}>Rename folder</button>
          <i onClick={e => handleModal(e, false)} className="fa fa-times" aria-hidden="true"></i>
        </>}
        {operation === "DELETE" && <>
          <h3>Delete <strong>{clickedFileName}</strong> folder</h3>
          <h4>Are you sure?</h4>
          <button onClick={handleRemoveFolder}>Remove folder</button>
          <i onClick={e => handleModal(e, false)} className="fa fa-times" aria-hidden="true"></i>
        </>}
        {operation === "SHARE" && <>
          <h3>Share <strong>{clickedFileName}</strong> file</h3>
          <label htmlFor="fileName">Write the email of the user you want to share the file with:</label>
          <input name='fileName' type="text" placeholder="Type user mail..." />
          <button onClick={e => handleShareFile(e)}>Share file</button>
          <i onClick={e => handleModal(e, false)} className="fa fa-times" aria-hidden="true"></i>
        </>}
      </div>
    </div>
  );
}

export const handleModal = (e, open = true) => {
  const overlay = document.querySelector('.overlay');
  const modal = document.querySelector('.modal');
  if (open) {
    overlay.style.opacity = 1;
    overlay.style.zIndex = 15;
    modal.style.transform = 'scale(1) translate(-50%, -50%)';
  } else {
    overlay.style.opacity = 0;
    overlay.style.zIndex = -15;
    modal.style.transform = 'scale(0) translate(-50%, -50%)';
  }
};

export default Modal;