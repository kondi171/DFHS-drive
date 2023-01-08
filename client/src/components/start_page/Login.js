import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {

  const navigate = useNavigate();
  const { setLoggedUser } = useContext(AppContext);

  const notify = (message, type) => {
    switch (type) {
      case 'success':
        return toast.success(message, {
          theme: 'colored'
        });
      default:
        return toast.error(message, {
          theme: 'colored'
        });
    }
  }
  const [mailValue, setMailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const handleLogin = e => {

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_DB_CONNECT}API/users`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        mail: mailValue,
        password: passwordValue
      }
    }).then(data => {
      const { mail, password } = data.data;
      if (data.data === 'Incorrect data!') notify('Incorect data!');
      else {
        navigate('/loading', { state: { infoMessage: 'You have successfully logged in!', loadingMessage: 'Preparing your files', location: '/access/home' } });
        localStorage.setItem('mail', mail);
        localStorage.setItem('password', password);
        setLoggedUser(data.data)
      }
    })
      .catch(error => console.log(error));
    e.preventDefault();
  }

  useEffect(() => {
    if (localStorage.getItem('mail')) navigate('/access/home');
    if (localStorage.getItem('logoutMessage')) {
      notify(localStorage.getItem('logoutMessage'), 'success');
      localStorage.removeItem('logoutMessage');
    }
  }, []);

  return (
    <div className="start-page">
      <form>
        <h2>Sign In</h2>
        <input onChange={e => setMailValue(e.target.value)} type="text" placeholder="Mail" />
        <input onChange={e => setPasswordValue(e.target.value)} type="password" placeholder="Password" />
        <div className="sign-up">
          You don't have account? <Link to='/register'>Sign Up!</Link>
        </div>
        <button onClick={handleLogin}>Login</button>
      </form>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
export default Login;