import { useEffect, useState } from "react";

const SharedPage = () => {
  const [user, setUser] = useState('');
  const mail = 'patryk.kaczmarski98@wp.pl';
  useEffect(() => {
    const atIndex = mail.indexOf('@');
    setUser(mail.slice(0, atIndex));
    // document.addEventListener('contextmenu', event => event.preventDefault());
  }, []);

  return (
    <main className="access-page">
      <h2>Shared to <span>{user}</span></h2>
      <div className="breadcrumbs">
        <span>main</span>
        <span>•</span>
        <span>subfolder</span>
        <span>•</span>
        <span>file1</span>
      </div>
      <div className="files">
        <div className="data">
          <i className="fa fa-folder" aria-hidden="true"></i>
          <span>Folder / <span>wk.k.nowak</span></span>
        </div>
        <div className="data">
          <i className="fa fa-folder" aria-hidden="true"></i>
          <span>Folder / <span>wk.k.nowak</span></span>
        </div>
        <div className="data">
          <i className="fa fa-file-text-o" aria-hidden="true"></i>
          <span>File / <span>maciej.k</span></span>
        </div>
        <div className="data">
          <i className="fa fa-folder" aria-hidden="true"></i>
          <span>Folder / <span>a.wcislo</span></span>
        </div>
        <div className="data">
          <i className="fa fa-archive" aria-hidden="true"></i>
          <span>Archive / <span>k.stopa</span></span>
        </div>
        <div className="data">
          <i className="fa fa-file-text-o" aria-hidden="true"></i>
          <span>File / <span>ww.wojtyna</span></span>
        </div>
      </div>
    </main >
  );
}
export default SharedPage;