import { useContext, useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
const Nav = () => {
  const [logged, setLogged] = useState(true);

  return (
    <nav className='navigation'>
      <i className="fa fa-angle-double-left" aria-hidden="true"></i>
      <NavLink id='home' className='navlink tooltip' to='/access/home'>
        <i className='fa fa-home' aria-hidden="true"></i>
        <span className="tooltip-text">Home</span>
      </NavLink>
      <NavLink className='navlink tooltip' to='/access/shared'>
        <i className="fa fa-share-square-o" aria-hidden="true"></i>
        <span className="tooltip-text">Shared</span>
      </NavLink>
      <NavLink onClick={() => setLogged(false)} className='navlink tooltip' to="/access/logout">
        <i className="fa fa-sign-out" aria-hidden="true"></i>
        <span className="tooltip-text">Logout</span>
      </NavLink>
      {!logged && <Navigate to="/" />}
    </nav>
  );
}

export default Nav;