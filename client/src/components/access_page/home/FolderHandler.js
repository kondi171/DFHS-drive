import axios from 'axios';
const FolderHandler = ({ notify, holdSession }) => {

  const handleAddFolder = e => {
    const folderName = e.target.previousSibling.value;
    if (folderName.length === 0) notify('Folder name is empty!', 'error');
    else if (folderName.length > 12) notify('Folder name is longer than 12 characters!', 'error');
    else if (folderName.length < 2) notify('Folder name is shorter than 2 characters!', 'error');
    else {
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_DB_CONNECT}API/folder/add`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          mail: localStorage.getItem('mail'),
          folderName: folderName
        }
      })
        .then(data => {
          if (data.data === true) {
            const overlay = document.querySelector('.add-folder-overlay');
            const modal = document.querySelector('.add-folder-modal');
            overlay.style.opacity = 0;
            overlay.style.zIndex = -15;
            modal.style.transform = 'scale(0) translate(-50%, -50%)';
            notify('Folder was created!');
            e.target.previousSibling.value = '';
            holdSession();
          } else {
            notify('That folder already exists!', 'error');
          }
        })
        .catch(error => console.log(error));
    }
  }
  return (
    <>
      <div className="add-folder-overlay">
        <div className="add-folder-modal">
          <h3>Create folder</h3>
          <input name='folderName' type="text" placeholder="Type folder name..." />
          <button onClick={e => handleAddFolder(e)}>Add folder</button>
          <i onClick={e => handleFolderModal(e, false)} className="fa fa-times" aria-hidden="true"></i>
        </div>
      </div>
      <div className='tooltip'>
        <i onClick={handleFolderModal} className="fa fa-plus-square add-folder tooltip__icon" aria-hidden="true"></i>
        <span className="tooltip__text">Add folder</span>
      </div>
    </>
  );
}

export const handleFolderModal = (e, open = true) => {
  const overlay = document.querySelector('.add-folder-overlay');
  const modal = document.querySelector('.add-folder-modal');
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

export default FolderHandler;