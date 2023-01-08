import axios from 'axios';
const FolderModal = ({ notify, holdSession, folderOperation, setFolderOperation, clickedFolderName, setClickedFolderName }) => {

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
            const overlay = document.querySelector('.folder-overlay');
            const modal = document.querySelector('.folder-modal');
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
          oldFolderName: clickedFolderName
        }
      })
        .then(data => {
          if (data.data === true) {
            const overlay = document.querySelector('.folder-overlay');
            const modal = document.querySelector('.folder-modal');
            overlay.style.opacity = 0;
            overlay.style.zIndex = -15;
            modal.style.transform = 'scale(0) translate(-50%, -50%)';
            notify(`${clickedFolderName} folder was renamed to ${folderName}!`);
            e.target.previousSibling.value = '';
            holdSession();
          } else {
            notify('That folder already exists!', 'error');
          }
        })
        .catch(error => console.log(error));
    }
  }
  const handleRemoveFolder = e => {
    axios({
      method: 'DELETE',
      url: `${process.env.REACT_APP_DB_CONNECT}API/folder`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        mail: localStorage.getItem('mail'),
        folderName: clickedFolderName
      }
    })
      .then(data => {
        if (data.data === true) {
          const overlay = document.querySelector('.folder-overlay');
          const modal = document.querySelector('.folder-modal');
          overlay.style.opacity = 0;
          overlay.style.zIndex = -15;
          modal.style.transform = 'scale(0) translate(-50%, -50%)';
          notify(`Folder ${clickedFolderName} was deleted!`);
          holdSession();
        } else {
          notify('That folder already exists!', 'error');
        }
      })
      .catch(error => console.log(error));
  }
  const handleFolderModal = (e, open = true) => {
    const overlay = document.querySelector('.folder-overlay');
    const modal = document.querySelector('.folder-modal');
    if (open) {
      overlay.style.opacity = 1;
      overlay.style.zIndex = 15;
      modal.style.transform = 'scale(1) translate(-50%, -50%)';
    } else {
      overlay.style.opacity = 0;
      overlay.style.zIndex = -15;
      modal.style.transform = 'scale(0) translate(-50%, -50%)';
      setFolderOperation('');
      setClickedFolderName('');
    }
  };
  return (
    <div className="folder-overlay">
      <div className="folder-modal">
        {folderOperation === "ADD" && <>
          <h3>Create folder</h3>
          <input name='folderName' type="text" placeholder="Type folder name..." />
          <button onClick={e => handleAddFolder(e)}>Add folder</button>
          <i onClick={e => handleFolderModal(e, false)} className="fa fa-times" aria-hidden="true"></i>
        </>}
        {folderOperation === "RENAME" && <>
          <h3>Rename <strong>{clickedFolderName}</strong> folder</h3>
          <input name='folderName' type="text" placeholder="Type new folder name..." />
          <button onClick={e => handleRenameFolder(e)}>Rename folder</button>
          <i onClick={e => handleFolderModal(e, false)} className="fa fa-times" aria-hidden="true"></i>
        </>}
        {folderOperation === "DELETE" && <>
          <h3>Delete <strong>{clickedFolderName}</strong> folder</h3>
          <h4>Are you sure?</h4>
          <button onClick={e => handleRemoveFolder(e)}>Remove folder</button>
          <i onClick={e => handleFolderModal(e, false)} className="fa fa-times" aria-hidden="true"></i>
        </>}
      </div>
    </div>
  );
}

export const handleFolderModal = (e, open = true) => {
  const overlay = document.querySelector('.folder-overlay');
  const modal = document.querySelector('.folder-modal');
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

export default FolderModal;