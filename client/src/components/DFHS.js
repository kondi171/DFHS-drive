import "./../assets/scss/main.scss";
import { Routes, Route } from 'react-router-dom';
import Login from "./start_page/Login";
import Register from "./start_page/Register";

const DFHS = () => {
  return (
    <div className="drive">
      <header className="header"><span>DFHS</span> Drive</header>
      <main className="main">
        <Routes>
          <Route path='*' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

        </Routes>
      </main>
    </div>
  );
}
export default DFHS;