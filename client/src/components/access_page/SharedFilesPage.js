import { useEffect, useState, useContext } from "react";
import { AppContext } from "../AppContext";
import VanillaContextMenu from 'vanilla-context-menu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const SharedFilesPage = () => {

  const { loggedUser, setLoggedUser } = useContext(AppContext);
  const [formats, setFormats] = useState(null);
  const [login, setLogin] = useState('');

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

  const handleContextMenuOnFile = (e, file) => {
    const { _id, fileType } = file;
    const scope = document.querySelector(`div.data[data-id='${_id}'] i`);
    const previewAvailable = checkForPreview(fileType);
    const menuItems = [
      {
        label: 'Delete',
        callback: () => {
          axios({
            method: 'DELETE',
            url: `${process.env.REACT_APP_DB_CONNECT}API/share`,
            headers: { 'Content-Type': 'application/json' },
            data: {
              mail: localStorage.getItem('mail'),
              fileID: e.target.dataset.id
            }
          })
            .catch(error => console.log(error));
          localStorage.setItem('infoAboutDeletedFile', true);
          window.location.reload();
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

  useEffect(() => {
    if (loggedUser.mail) {
      const atIndex = loggedUser.mail.indexOf('@');
      setLogin(loggedUser.mail.slice(0, atIndex));
    } else holdSession();
  }, [loggedUser.mail]);


  useEffect(() => {
    if (localStorage.getItem('infoAboutDeletedFile')) {
      notify(`File was deleted!`);
      localStorage.removeItem('infoAboutDeletedFile');
    }
    axios('../json/formats.json')
      .then(data => setFormats(data.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <main className="access-page">
      <h2>Shared to <span>{login}</span></h2>
      <div className="files">
        {Object.keys(loggedUser).length !== 0 && <>
          {loggedUser?.sharedFiles.length > 0 ? loggedUser.sharedFiles.map(file => {
            const { _id, fileName, fileType, date, filePath, sharingUser, originalID } = file;
            const fileClassName = checkFileType(fileType);
            return <div data-id={_id} key={_id} className="data">
              <span className="date">{date}</span>
              <a href={`${process.env.REACT_APP_DB_CONNECT}${filePath}`} target="_blank" rel="noreferrer">
                <i data-id={originalID} onMouseEnter={e => handleContextMenuOnFile(e, file)} className={`fa fa-${fileClassName}`} aria-hidden="true"></i>
              </a>
              <span className="title">{fileName} <br /> <span>{sharingUser}</span></span>
            </div>
          }) : <div className="no-files-message"><i className="fa fa-meh-o" aria-hidden="true"></i><span>No Shared Files!</span></div>}
        </>}
        <ToastContainer position="bottom-right" />
      </div>
    </main >
  );
}
export default SharedFilesPage;