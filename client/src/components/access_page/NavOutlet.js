import { Outlet } from 'react-router-dom';
import Nav from './Nav';

const NavOutlet = () => {
  return (
    <>
      <Nav />
      <Outlet />
    </>

  );
}
export default NavOutlet;