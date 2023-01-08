import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../AppContext";
import axios from 'axios';
import FolderModal, { handleFolderModal } from "./FolderModal";
import VanillaContextMenu from 'vanilla-context-menu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const MainPage = () => {

  const { loggedUser, setLoggedUser } = useContext(AppContext);
  const [login, setLogin] = useState('');
  const [formats, setFormats] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [contextMenuScope, setContextMenuScope] = useState(null);
  const [folderIndex, setFolderIndex] = useState(0);
  const [folderOperation, setFolderOperation] = useState('');
  const [clickedFolderName, setClickedFolderName] = useState('');
  const notify = (message, type) => {
    switch (type) {
      case 'error':
        return toast.error(message, {
          theme: 'colored',
          autoClose: 2500,
        });
      default:
        return toast.success(message, {
          theme: 'colored',
          autoClose: 2500,
        });
    }
  }

  const checkFileType = type => {
    if (!formats) return;
    const fileFormat = formats.map(format => {
      const fileExt = format.extensions.map(ext => {
        if (ext === type) return format.className;
        else return null;
      });
      const excludeNulls = fileExt.filter(element => element !== null);
      return excludeNulls[0];
    });
    const excludeUndefined = fileFormat.filter(element => element !== undefined);
    if (excludeUndefined.length === 0) return 'file-o';
    else return excludeUndefined[0];
  }

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

  const vanillaContextMenu = menuItems => {
    const contextMenu = new VanillaContextMenu({
      scope: document.querySelector('main'),
      customThemeClass: 'context-menu',
      transitionDuration: 300,
      menuItems: menuItems
    });
    setContextMenu(contextMenu);
  }

  const handleContextMenuOnBody = () => {
    const fileMenuScope = document.querySelector('.files');
    setContextMenuScope(fileMenuScope);
    const menuItems = [
      {
        label: 'Create folder',
        iconClass: 'fa fa-folder-open',
        callback: () => {
          handleFolderModal();
          setFolderOperation('ADD');
        }
      }
    ];
    vanillaContextMenu(menuItems);
  }

  const handleContextMenuOnFile = (e, file) => {
    const fileMenuScope = document.querySelector(`[data-id='${e.target.dataset.id}'`).parentElement.parentElement;
    setContextMenuScope(fileMenuScope);
    const menuItems = [
      {
        label: 'Download',
        callback: () => {
          if (file.fileType === '.png') {
            var link = document.createElement('a');
            link.href = contextMenuScope.firstChild.nextSibling.getAttribute('href');
            link.download = 'Download.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          // else contextMenuScope.firstChild.nextSibling.click()
        },
        iconClass: 'fa fa-cloud-download'
      },
      'hr',
      {
        label: 'Share',
        callback: () => console.log('Share'),
        iconClass: 'fa fa-share-alt'
      },
      'hr',
      {
        label: 'Delete',
        callback: () => {
          console.log(contextMenuScope.dataset.id);
          axios({
            method: 'DELETE',
            url: `${process.env.REACT_APP_DB_CONNECT}API/file`,
            headers: { 'Content-Type': 'application/json' },
            data: {
              mail: localStorage.getItem('mail'),
              fileID: contextMenuScope.dataset.id
            }
          })
            .catch(error => console.log(error));
          const deletedFileIndex = loggedUser.files.findIndex(file => file._id === contextMenuScope.dataset.id);
          loggedUser.files.splice(deletedFileIndex, 1);
          notify('File was deleted');
        },
        iconClass: 'fa fa-trash'
      },
    ];
    if (file.fileType === '.png') {
      menuItems.unshift('hr');
      menuItems.unshift({
        label: 'Preview',
        callback: () => {
          contextMenuScope.firstChild.nextSibling.click();
        },
        iconClass: 'fa fa-eye'
      });
    }
    vanillaContextMenu(menuItems);
    setContextMenu(contextMenu);
  }

  const handleContextMenuOnFolder = (e, folder) => {
    const fileMenuScope = document.querySelector('.files');
    setContextMenuScope(fileMenuScope);
    setClickedFolderName(folder.folderName);
    const menuItems = [
      {
        label: 'Rename folder',
        iconClass: 'fa fa-refresh',
        callback: () => {
          handleFolderModal();
          setFolderOperation('RENAME');
        }
      },
      'hr',
      {
        label: 'Delete folder',
        iconClass: 'fa fa-trash',
        callback: () => {
          handleFolderModal();
          setFolderOperation('DELETE');
        }
      }

    ];
    vanillaContextMenu(menuItems);
  }

  const handleOpenFolder = e => {
    const folderName = e.target.parentElement.dataset.name;
    const folderIndex = loggedUser.folders.findIndex(folder => folder.folderName === folderName);
    setFolderIndex(folderIndex);
    // const folder = loggedUser.folders.findIndex()
  }
  const handleAddFolder = () => {
    handleFolderModal();
    setFolderOperation('ADD');
  }
  useEffect(() => {
    if (localStorage.getItem('infoAboutUploadedFile')) {
      notify('File was uploaded');
      localStorage.removeItem('infoAboutUploadedFile');
    }
    axios('../json/formats.json')
      .then(data => setFormats(data.data))
      .catch(error => console.log(error));
    const contextMenu = new VanillaContextMenu({
      scope: document.querySelector('main'),
      customThemeClass: 'context-menu',
      transitionDuration: 300,
      menuItems: [
        {
          label: 'Create folder',
          iconClass: 'fa fa-folder-open',
          callback: () => {
            handleFolderModal();
            setFolderOperation('ADD');
          }
        }
      ]
    });
    setContextMenu(contextMenu);
  }, []);

  useEffect(() => {
    if (loggedUser.mail) {
      const atIndex = loggedUser.mail.indexOf('@');
      setLogin(loggedUser.mail.slice(0, atIndex));
    } else holdSession();
  }, [loggedUser.mail]);
  useEffect(() => {
    console.log(folderOperation);
  }, [folderOperation]);


  return (
    <main className="access-page">
      <h2><span>{login}</span> repository</h2>
      {folderIndex !== 0 &&
        <div className="breadcrumbs">
          <span onClick={() => setFolderIndex(0)}>Main</span>
          <span>&gt;</span>
          <span>{loggedUser.folders[folderIndex].folderName}</span>
        </div>
      }
      <div className="files">
        {folderIndex === 0 && <>
          {Object.keys(loggedUser).length !== 0 && loggedUser.folders.map((folder, index) => {
            const { folderName } = folder;
            if (index === 0) return null;
            return <div className="data" data-name={folderName} key={folderName}>
              <i onClick={handleOpenFolder} onMouseEnter={e => handleContextMenuOnFolder(e, folder)} onMouseLeave={handleContextMenuOnBody} className="fa fa-folder" aria-hidden="true"></i>
              <span>{folderName}</span>
            </div>
          })}</>}
        {Object.keys(loggedUser).length !== 0 ? <>
          {loggedUser.folders[folderIndex].files.length > 0 ? loggedUser.folders[folderIndex].files.map(file => {
            const { _id, fileName, fileType, date, filePath } = file;
            let id = filePath.slice(8, filePath.length);
            const fileClassName = checkFileType(fileType);
            return <div data-id={_id} key={fileName} className="data">
              <span className="date">{date}</span>
              <a href={`${process.env.REACT_APP_DB_CONNECT}${filePath}`} target="_blank" rel="noreferrer">
                <i data-id={id} onMouseEnter={e => handleContextMenuOnFile(e, file)} onMouseLeave={handleContextMenuOnBody} className={`fa fa-${fileClassName}`} aria-hidden="true"></i>
              </a>
              <span className="title">{fileName}</span>

            </div>
          }) : <>
            {(loggedUser.folders[folderIndex].files.length <= 0 && loggedUser.folders.length <= 0) && <div className="no-files-message"><i className="fa fa-meh-o" aria-hidden="true"></i><span>There is no files in <strong>{loggedUser.folders[folderIndex].folderName}</strong> folder</span></div>}
          </>}
        </> : <div className="no-files-message"><i className="fa fa-meh-o" aria-hidden="true"></i><span>There is no files uploaded!</span></div>}
        {/* Show all icons */}
        {/* <div className="data">
          <i className="fa fa-folder" aria-hidden="true"></i>
          <span>Folder</span>
        </div>
        {formats.map(format => {
          return (
            <div className="data">
              <i className={`fa fa-${format.className}`} aria-hidden="true"></i>
              <span>{format.format}</span>
            </div>);
        })} */}
      </div>
      {folderIndex === 0 &&
        <FolderModal
          notify={notify}
          holdSession={holdSession}
          folderOperation={folderOperation}
          setFolderOperation={setFolderOperation}
          clickedFolderName={clickedFolderName}
          setClickedFolderName={setClickedFolderName}
        />}
      <div className='tooltip'>
        <i onClick={handleAddFolder} className="fa fa-plus-square add-folder tooltip__icon" aria-hidden="true"></i>
        <span className="tooltip__text">Add folder</span>
      </div>
      <ToastContainer position="bottom-right" />
    </main >
  );
}
export default MainPage;