import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import MainPage from '../access_page/MainPage';
import Loading from '../features/Loading';


const Login = () => {

  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = e => {
    e.preventDefault();
    setLoading(true);
    setInterval(() => {
      setLogged(true);
    }, 2000);

  }

  return (
    <div className="start-page">
      <form>
        <h2>Sign In</h2>
        <input type="text" placeholder="Mail" />
        <input type="password" placeholder="Password" />
        <div className="sign-up">
          You don't have account? <Link to='/register'>Sign Up!</Link>
        </div>
        <button onClick={handleLogin}>Login</button>
        {loading && <Loading />}
        {logged && <Navigate to="/access/home" />}
      </form>
    </div>
  );
}
export default Login;