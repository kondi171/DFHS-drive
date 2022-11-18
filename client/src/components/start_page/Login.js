import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

const Login = () => {

  const [logged, setLogged] = useState(false);
  const handleLogin = e => {
    e.preventDefault();
    setLogged(true);
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
        {logged && <Navigate to="/access/home" />}
      </form>
    </div>
  );
}
export default Login;