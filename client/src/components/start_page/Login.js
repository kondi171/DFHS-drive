import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';

const Login = () => {

  const navigate = useNavigate();
  const { loggedUser, setLoggedUser } = useContext(AppContext);

  const messageBox = [
    {
      icon: <i className="fa fa-exclamation-circle" aria-hidden="true"></i>,
      message: 'Incorect Data!',
      type: 'error'
    },
    {
      icon: <i className="fa fa-check-circle" aria-hidden="true"></i>,
      message: 'Logged!',
      type: 'success'
    }
  ];
  const [messageIndex, setMessageIndex] = useState(0)

  const [mailValue, setMailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const handleLogin = e => {
    const messageBox = document.querySelector('.message-box');
    messageBox.classList.add('fade');
    setTimeout(() => {
      messageBox.classList.remove('fade');
    }, 3000);
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
      if (data.data === 'Incorrect data!') setMessageIndex(0);
      else {
        navigate('/loading', { state: { infoMessage: 'Logged!', loadingMessage: 'Preparing your files', location: '/access/home' } });
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
      <div className={`message-box ${messageBox[messageIndex].type === 'error' ? 'error' : 'fade'}`}>{messageBox[messageIndex].icon}{messageBox[messageIndex].message}</div>

    </div>
  );
}
export default Login;