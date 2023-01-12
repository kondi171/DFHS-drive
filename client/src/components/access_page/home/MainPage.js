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
  const [emptyRepositoryMessage, setEmptyRepositoryMessage] = useState(true);
  const [formats, setFormats] = useState(null);
  const [folderIndex, setFolderIndex] = useState(0);
  const [folderOperation, setFolderOperation] = useState('');
  const [clickedFolderName, setClickedFolderName] = useState('');
  const [developerMode, setDeveloperMode] = useState(true);
  const [reload, setReload] = useState(false);
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
  const checkForPreview = format => {
    const databaseFormats = formats.filter(format => format.format === "database").map(format => format.extensions);
    const imageFormats = formats.filter(format => format.format === "image").map(format => format.extensions);
    const audioFormats = formats.filter(format => format.format === "audio").map(format => format.extensions);
    const videoFormats = formats.filter(format => format.format === "video").map(format => format.extensions);
    const programmingFormats = formats.filter(format => format.format === "programming").map(format => format.extensions);

    const previewFormats = [...databaseFormats[0], ...imageFormats[0], ...audioFormats[0], ...videoFormats[0], ...programmingFormats[0]];
    const checkCompatibility = previewFormats.filter(element => element === format);
    if (checkCompatibility.length > 0) return true;
    else return false;
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

  const vanillaContextMenu = (menuItems, scope) => {
    new VanillaContextMenu({
      scope: scope,
      customThemeClass: 'context-menu',
      transitionDuration: 300,
      menuItems: menuItems
    });
  }

  const handleContextMenuOnBody = () => {
    const scope = document.getElementById('mainPage');
    const menuItems = [];
    vanillaContextMenu(menuItems, scope);
  }

  const handleContextMenuOnFilesContainer = () => {
    const scope = document.querySelector('.files');
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
    vanillaContextMenu(menuItems, scope);
  }

  const handleContextMenuOnFile = (e, file) => {
    const { _id, fileType, fileName } = file;
    const scope = document.querySelector(`div.data[data-id='${_id}'] i`);
    const previewAvailable = checkForPreview(fileType);
    const menuItems = [
      {
        label: 'Share',
        callback: () => console.log('Share'),
        iconClass: 'fa fa-share-alt'
      },
      'hr',
      {
        label: 'Delete',
        callback: () => {
          axios({
            method: 'DELETE',
            url: `${process.env.REACT_APP_DB_CONNECT}API/file`,
            headers: { 'Content-Type': 'application/json' },
            data: {
              mail: localStorage.getItem('mail'),
              fileID: e.target.dataset.id
            }
          })
            .catch(error => console.log(error));

          // const indexOf = loggedUser.folders[folderIndex].files.findIndex(file => file.fileName === fileName);
          // loggedUser.folders[folderIndex].files.splice(indexOf, 1);
          // setLoggedUser(loggedUser);
          setReload(!reload);
          // Reload state here!
          notify(`File ${fileName}${fileType} was deleted!`);
        },
        iconClass: 'fa fa-trash'
      },
    ];
    if (previewAvailable) {
      menuItems.unshift('hr');
      menuItems.unshift({
        label: 'Preview',
        callback: () => {
          scope.click();
        },
        iconClass: 'fa fa-eye'
      });
    } else {
      menuItems.unshift('hr');
      menuItems.unshift({
        label: 'Download',
        callback: () => {
          scope.click();
        },
        iconClass: 'fa fa-cloud-download'
      });

    }
    vanillaContextMenu(menuItems, scope);
  }

  const handleContextMenuOnFolder = (e, folder) => {
    const scope = document.querySelector(`div.data[data-name='${folder.folderName}']>i`);
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
    vanillaContextMenu(menuItems, scope);
  }

  const handleOpenFolder = e => {
    const folderName = e.target.parentElement.dataset.name;
    const folderIndex = loggedUser.folders.findIndex(folder => folder.folderName === folderName);
    setFolderIndex(folderIndex);
  }
  const handleAddFolder = () => {
    handleFolderModal();
    setFolderOperation('ADD');
  }
  useEffect(() => {
    if (localStorage.getItem('infoAboutUploadedFile')) {
      notify('File was uploaded!');
      localStorage.removeItem('infoAboutUploadedFile');
    }
    axios('../json/formats.json')
      .then(data => setFormats(data.data))
      .catch(error => console.log(error));
    handleContextMenuOnBody();
  }, []);
  const chargeServer = () => {
    console.log('Server is in charge');
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_DB_CONNECT}API`,
      headers: { 'Content-Type': 'application/json' }
    })
      .catch(error => console.log(error));
  }
  useEffect(() => {
    if (loggedUser.mail) {
      const atIndex = loggedUser.mail.indexOf('@');
      setLogin(loggedUser.mail.slice(0, atIndex));
    } else holdSession();
  }, [loggedUser.mail]);

  useEffect(() => {
    if (Object.keys(loggedUser).length !== 0) {
      if (folderIndex === 0) {
        if (loggedUser?.folders.length === 1 && loggedUser?.folders[folderIndex].files.length < 1) setEmptyRepositoryMessage(true);
        else setEmptyRepositoryMessage(false);
      } else {
        if (loggedUser?.folders[folderIndex].files.length <= 0) setEmptyRepositoryMessage(true);
        else setEmptyRepositoryMessage(false);
      }
    }
  }, [loggedUser, folderIndex]);
  useEffect(() => {
    setLoggedUser(loggedUser);
  }, [reload]);
  return (
    <main onMouseEnter={handleContextMenuOnBody} id="mainPage" className="access-page">
      <h2><span>{login}</span> repository</h2>
      {folderIndex !== 0 &&
        <div className="breadcrumbs">
          <span onClick={() => setFolderIndex(0)}>Main</span>
          <span>&gt;</span>
          <span>{loggedUser.folders[folderIndex].folderName}</span>
        </div>
      }
      <div onMouseEnter={handleContextMenuOnFilesContainer} id="files" className="files">
        {folderIndex === 0 && <>
          {Object.keys(loggedUser).length !== 0 && loggedUser.folders.map((folder, index) => {
            const { folderName } = folder;
            if (index === 0) return null;
            return <div className="data" data-name={folderName} key={folderName}>
              <i onClick={handleOpenFolder} onMouseEnter={e => handleContextMenuOnFolder(e, folder)} className="fa fa-folder" aria-hidden="true"></i>
              <span>{folderName}</span>
            </div>
          })}</>}
        {Object.keys(loggedUser).length !== 0 && <>
          {loggedUser?.folders[folderIndex]?.files.length > 0 && loggedUser.folders[folderIndex].files.map(file => {
            const { _id, fileName, fileType, date, filePath } = file;
            let id = filePath.slice(8, filePath.length);
            const fileClassName = checkFileType(fileType);
            return <div data-id={_id} key={_id} className="data">
              <span className="date">{date}</span>
              <a href={`${process.env.REACT_APP_DB_CONNECT}${filePath}`} target="_blank" rel="noreferrer">
                <i data-id={id} onMouseEnter={e => handleContextMenuOnFile(e, file)} className={`fa fa-${fileClassName}`} aria-hidden="true"></i>
              </a>
              <span className="title">{fileName}</span>
            </div>
          })}
        </>}
        {emptyRepositoryMessage && <div className="no-files-message"><i className="fa fa-meh-o" aria-hidden="true"></i><span>There is no files in <strong>{Object.keys(loggedUser).length !== 0 && loggedUser?.folders[folderIndex]?.folderName}</strong> folder</span></div>}
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
      {
        folderIndex === 0 &&
        <FolderModal
          notify={notify}
          holdSession={holdSession}
          folderOperation={folderOperation}
          setFolderOperation={setFolderOperation}
          clickedFolderName={clickedFolderName}
          setClickedFolderName={setClickedFolderName}
        />
      }
      {
        folderIndex === 0 && <div className='add-folder tooltip'>
          <i onClick={handleAddFolder} className="fa fa-plus-square add-folder tooltip__icon" aria-hidden="true"></i>
          <span className="tooltip__text">Add folder</span>
        </div>
      }
      {developerMode && <div className='charge-server'>
        <i onClick={chargeServer} className="fa fa-database tooltip__icon" aria-hidden="true"></i>
        <span className="tooltip__text">Charge server</span>
      </div>}
      <ToastContainer position="bottom-right" />
    </main >
  );
}
export default MainPage;