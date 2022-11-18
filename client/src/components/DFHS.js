import "./../assets/scss/main.scss";
import { Routes, Route } from 'react-router-dom';
import Login from "./start_page/Login";
import Register from "./start_page/Register";
import MainPage from "./access_page/MainPage";
import NavOutlet from "./access_page/NavOutlet";
import SharedPage from "./access_page/SharedPage";

const DFHS = () => {
  return (
    <div className="drive">
      <header className="header"><span>DFHS</span> Drive</header>
      <main className="main">
        <Routes>
          <Route path='*' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/access' exact element={<NavOutlet />} >
            <Route path='/access/home' element={<MainPage />} />
            <Route path='/access/shared' element={<SharedPage />} />
            <Route path='/access/*' element={<MainPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}
export default DFHS;