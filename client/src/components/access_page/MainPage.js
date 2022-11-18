import { useEffect, useState } from "react";

const MainPage = () => {
  const [user, setUser] = useState('');
  const mail = 'patryk.kaczmarski98@wp.pl';
  useEffect(() => {
    const atIndex = mail.indexOf('@');
    setUser(mail.slice(0, atIndex));
    // document.addEventListener('contextmenu', event => event.preventDefault());
  }, []);

  return (
    <main className="main-page">
      <h2><span>{user}</span> repository</h2>
      <div className="breadcrumbs">main - subfolder - file1</div>
      <div className="files">
        <div className="data">
          <i className="fa fa-folder" aria-hidden="true"></i>
          <span>Folder</span>
        </div>
        <div className="data">
          <i className="fa fa-folder" aria-hidden="true"></i>
          <span>Folder</span>
        </div>
        <div className="data">
          <i className="fa fa-file-text-o" aria-hidden="true"></i>
          <span>File</span>
        </div>
        <div className="data">
          <i className="fa fa-folder" aria-hidden="true"></i>
          <span>Folder</span>
        </div>
        <div className="data">
          <i className="fa fa-archive" aria-hidden="true"></i>
          <span>Archive</span>
        </div>
        <div className="data">
          <i className="fa fa-file-text-o" aria-hidden="true"></i>
          <span>File</span>
        </div>
      </div>
    </main >
  );
}
export default MainPage;