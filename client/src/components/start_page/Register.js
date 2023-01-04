import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
const Register = () => {

  const navigate = useNavigate();
  const messageBox = [
    {
      icon: <i className="fa fa-exclamation-circle" aria-hidden="true"></i>,
      message: 'Mail must meet the conditions of name@domain.country_code ',
      type: 'error'
    },
    {
      icon: <i className="fa fa-exclamation-circle" aria-hidden="true"></i>,
      message: 'Minimum eight characters, at least one letter, one number and one special character',
      type: 'error'
    },
    {
      icon: <i className="fa fa-exclamation-circle" aria-hidden="true"></i>,
      message: 'Passwords must be equal',
      type: 'error'
    },
    {
      icon: <i className="fa fa-exclamation-circle" aria-hidden="true"></i>,
      message: 'The specified user already exists!',
      type: 'error'
    },
  ];

  const [messageIndex, setMessageIndex] = useState(0);
  const [mailValue, setMailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const validateMail = () => {
    const mail = document.getElementById('mail').value;
    const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const mailValidate = mailRegex.test(mail);
    if (mailValidate) {
      return true;
    } else {
      setMessageIndex(0);
      return false;
    }
  }
  const validatePass1 = () => {
    const pass1 = document.getElementById('pass1').value;
    const pass1Regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const pass1Validate = pass1Regex.test(pass1);
    if (pass1Validate) {
      return true;
    } else {
      setMessageIndex(1);
      return false;
    }
  }
  const validatePass2 = () => {
    const pass1 = document.getElementById('pass1').value;
    const pass2 = document.getElementById('pass2').value;
    if (pass1 === pass2) return true;
    else {
      setMessageIndex(2);
      return false;
    }
  }
  const handleRegister = e => {
    e.preventDefault();
    const messageBox = document.querySelector('.message-box');
    messageBox.classList.add('fade');

    const pass2 = validatePass2();
    const pass1 = validatePass1();
    const mail = validateMail();

    setTimeout(() => {
      messageBox.classList.remove('fade');
    }, 3000);
    if (mail && pass1 && pass2) {
      axios({
        method: 'PUT',
        // url: `${process.env.API_DOMAIN}/API/users`,
        url: `${process.env.REACT_APP_DB_CONNECT}API/users`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          mail: mailValue,
          password: passwordValue
        }
      }).then(data => {
        if (data.data === 'The specified user already exists!') setMessageIndex(3);
        else {
          navigate('/loading', { state: { infoMessage: 'Your Account has been created!', loadingMessage: 'Preparing your account repository', location: '/login' } });
        }
      })
        .catch(error => console.log(error));
    }
  }

  return (
    <div className="start-page">
      <form>
        <h2>Sign Up</h2>
        <input onChange={e => setMailValue(e.target.value)} id='mail' type="text" placeholder="Mail" />
        <input id='pass1' type="password" placeholder="Password" />
        <input onChange={e => setPasswordValue(e.target.value)} id='pass2' type="password" placeholder="Repeat Password" />
        <div className="sign-up">
          You already have account? <Link to='/login'>Sign In!</Link>
        </div>
        <button onClick={handleRegister}>Register</button>
      </form>
      <div className={`message-box ${messageBox[messageIndex].type === 'error' ? 'error' : 'fade'}`}>{messageBox[messageIndex].icon}{messageBox[messageIndex].message}</div>
    </div>
  );
}
export default Register;