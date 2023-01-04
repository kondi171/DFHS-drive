import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";

import axios from 'axios';
import ContextMenu from "../features/ContextMenu";

const MainPage = () => {

  const { loggedUser, setLoggedUser, infoAboutUploadedFile, setInfoAboutUploadedFile } = useContext(AppContext);

  const [login, setLogin] = useState('');
  const [contextMenuScope, setContextMenuScope] = useState(null);
  const formats = [
    {
      format: 'audio',
      className: 'music',
      extensions: [
        '.aif',
        '.cda',
        '.mid',
        '.midi',
        '.mp3',
        '.mpa',
        '.ogg',
        '.wav',
        '.wma',
        '.wpl'
      ]
    },
    {
      format: 'compressed',
      className: 'archive',
      extensions: [
        '.7z',
        '.arj',
        '.deb',
        '.pkg',
        '.rar',
        '.rpm',
        '.z',
        '.zip'
      ]
    },
    {
      format: 'disc',
      className: 'bullseye',
      extensions: [
        '.bin',
        '.dmg',
        '.iso',
        '.toast',
        '.vcd'
      ]
    },
    {
      format: 'database',
      className: 'database',
      extensions: [
        '.csv',
        '.dat',
        '.db',
        '.dbf',
        '.log',
        '.mdb',
        '.sav',
        '.sql',
        '.tar',
        '.json',
        '.xml'
      ]
    },
    {
      format: 'e-mail',
      className: 'envelope',
      extensions: [
        '.email',
        '.eml',
        '.emlx',
        '.msg',
        '.oft',
        '.ost',
        '.pst',
        '.vcf'
      ]
    },
    {
      format: 'executable',
      className: 'cogs',
      extensions: [
        '.apk',
        '.bat',
        '.bin',
        '.cgi',
        '.pl',
        '.com',
        '.exe',
        '.gadget',
        '.jar',
        '.msi',
        '.wsf'
      ]
    },
    {
      format: 'font',
      className: 'font',
      extensions: [
        '.fnt',
        '.fon',
        '.otf',
        '.ttf'
      ]
    },
    {
      format: 'image',
      className: 'image',
      extensions: [
        '.ai',
        '.bmp',
        '.gif',
        '.ico',
        '.jpeg',
        '.jpg',
        '.png',
        '.ps',
        '.psd',
        '.svg',
        '.tif',
        '.tiff'
      ]
    },
    {
      format: 'programming',
      className: 'file-code-o',
      extensions: [
        '.html',
        '.htm',
        '.js',
        '.css',
        '.scss',
        '.sass',
        '.php',
        '.jsp',
        '.java',
        '.py',
        '.c',
        '.cpp',
        '.cs',
        '.h',
        '.sh',
        '.class',
        '.swift',
        '.vb'
      ]
    },
    {
      format: 'presentation',
      className: 'file-powerpoint-o',
      extensions: [
        '.key',
        '.odp',
        '.pps',
        '.ppt',
        '.pptx'
      ]
    },
    {
      format: 'spreadsheet',
      className: 'file-excel-o',
      extensions: [
        '.ods',
        '.xls',
        '.xlsm',
        '.xlsx'
      ]
    },
    {
      format: 'video',
      className: 'film',
      extensions: [
        '.3g2',
        '.3gp',
        '.avi',
        '.flv',
        '.h264',
        '.m4v',
        '.mkv',
        '.mov',
        '.mp4',
        '.mpg',
        '.mpeg',
        '.rm',
        '.swf',
        '.vob',
        '.wmv'
      ]
    },
    {
      format: 'word/text',
      className: 'file-text-o',
      extensions: [
        '.doc',
        '.docx',
        '.odt',
        '.pdf',
        '.rtf',
        '.tex',
        '.txt',
        '.wpd'
      ]
    },
  ];

  const checkFileType = type => {
    const fileFormat = formats.map(format => {
      const fileExt = format.extensions.map(ext => {
        if (ext === type) return format.className;
        else return null;
      });
      const excludeNulls = fileExt.filter(element => element !== null);
      return excludeNulls[0];
    });
    const excludeUndefined = fileFormat.filter(element => element !== undefined);
    return excludeUndefined[0];
  }
  const handleContextMenu = (e, file) => {
    console.log(file);
    console.log(e.target.dataset.id);
    // const fileMenuScope = document.querySelector(`[data-id='${e.target.dataset.id]`);
    // console.log(fileMenuScope);
    // setContextMenuScope(document.);
  }
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

  useEffect(() => {
    if (loggedUser.mail) {
      const atIndex = loggedUser.mail.indexOf('@');
      setLogin(loggedUser.mail.slice(0, atIndex));
    } else holdSession();
    // document.addEventListener('contextmenu', event => event.preventDefault());
  }, [loggedUser.mail]);

  useEffect(() => {
    const messageBox = document.querySelector('.message-box');
    if (localStorage.getItem('infoAboutUploadedFile') === 'File was Uploaded!') {
      messageBox.classList.add('fade');
      setTimeout(() => {
        messageBox.classList.remove('fade');
        localStorage.removeItem('infoAboutUploadedFile');
      }, 3000);
    }
  }, [infoAboutUploadedFile]);

  return (
    <main className="access-page">
      <h2><span>{login}</span> repository</h2>
      <div className="breadcrumbs">
        <span>main</span>
        <span>•</span>
        <span>subfolder</span>
        <span>•</span>
        <span>file1</span>
      </div>
      <div className="files">
        {Object.keys(loggedUser).length !== 0 ? loggedUser.files.map(file => {
          const { fileName, fileType, date, filePath } = file;
          let id = filePath.slice(8, filePath.length);
          const fileClassName = checkFileType(fileType);
          return <div key={fileName} className="data">
            <span className="date">{date}</span>
            <a href={`${process.env.REACT_APP_DB_CONNECT}${filePath}`} target="_blank" rel="noreferrer">
              <i data-id={id} onContextMenu={e => handleContextMenu(e, file)} className={`fa fa-${fileClassName}`} aria-hidden="true"></i>
            </a>
            <span className="title">{fileName}</span>

          </div>
        }) : <div className="no-files-message"><i className="fa fa-meh-o" aria-hidden="true"></i><span>There is no files uploaded!</span></div>}
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
      {/* <ContextMenu scope={contextMenuScope} /> */}
      <div className='message-box'><i className="fa fa-check-circle" aria-hidden="true"></i>File was uploaded!</div>
    </main >
  );
}
export default MainPage;