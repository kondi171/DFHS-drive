import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const Register = () => {
  const messageBox = [
    {
      icon: <i className="fa fa-exclamation-circle" aria-hidden="true"></i>,
      message: 'Mail must meet the conditions of name@domain.country_code ',
      type: 'error',
    },
    {
      icon: <i className="fa fa-exclamation-circle" aria-hidden="true"></i>,
      message: 'Minimum eight characters, at least one letter, one number and one special character',
      type: 'error',
    },
    {
      icon: <i className="fa fa-exclamation-circle" aria-hidden="true"></i>,
      message: 'Passwords must be equal',
      type: 'error',
    },
    {
      icon: <i className="fa fa-check-circle" aria-hidden="true"></i>,
      message: 'Your Account has been created!',
      type: 'success',
    }
  ];
  const [correctData, setCorrectData] = useState({
    mail: null,
    pass1: null,
  });
  const [messageIndex, setMessageIndex] = useState(0)
  const validateMail = () => {
    const mail = document.getElementById('mail').value;
    const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const mailValidate = mailRegex.test(mail);
    if (mailValidate) {
      setCorrectData(user => ({ ...user, mail: mail }));
      return true;
    } else {
      setCorrectData(user => ({ ...user, mail: null }));
      setMessageIndex(0);
      return false;
    }
  }
  const validatePass1 = () => {
    const pass1 = document.getElementById('pass1').value;
    const pass1Regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const pass1Validate = pass1Regex.test(pass1);
    if (pass1Validate) {
      setCorrectData(user => ({ ...user, pass1: pass1 }));
      return true;
    } else {
      setCorrectData(user => ({ ...user, pass1: null }));
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
      console.log('registered!');
      setMessageIndex(3);
    }
  }
  return (
    <div className="start-page">
      <form>
        <h2>Sign Up</h2>
        <input id='mail' type="text" placeholder="Mail" />
        <input id='pass1' type="password" placeholder="Password" />
        <input id='pass2' type="password" placeholder="Repeat Password" />
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