import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';
const Nav = () => {
  const navigate = useNavigate();
  const { setLoggedUser } = useContext(AppContext);
  const [logged, setLogged] = useState(true);

  const handleLogout = () => {
    setLoggedUser(null);
    setLogged(false);
    localStorage.removeItem('mail');
    localStorage.removeItem('password');
    localStorage.setItem('logoutMessage', 'You have successfully logged out!');
  }
  return (
    <nav className='navigation'>
      <i className="fa fa-angle-double-left" aria-hidden="true"></i>
      <NavLink id='home' className='navlink tooltip' to='/access/home'>
        <i className='fa fa-home' aria-hidden="true"></i>
        <span className="tooltip-text">Home</span>
      </NavLink>
      <NavLink className='navlink tooltip' to='/access/add'>
        <i className="fa fa-plus-circle" aria-hidden="true"></i>
        <span className="tooltip-text">Add files</span>
      </NavLink>
      <NavLink className='navlink tooltip' to='/access/shared'>
        <i className="fa fa-share-square-o" aria-hidden="true"></i>
        <span className="tooltip-text">Shared</span>
      </NavLink>
      <NavLink onClick={handleLogout} className='navlink tooltip' to='/'>
        <i className="fa fa-sign-out" aria-hidden="true"></i>
        <span className="tooltip-text">Logout</span>
      </NavLink>
      {!logged && navigate('/')}
    </nav>
  );
}

export default Nav;