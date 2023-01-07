import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const notify = message => {
    return toast.error(message, {
      theme: 'colored'
    });
  }

  const navigate = useNavigate();

  const [mailValue, setMailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const validateMail = () => {
    const mail = document.getElementById('mail').value;
    const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const mailValidate = mailRegex.test(mail);
    if (mailValidate) {
      return true;
    } else {
      notify('Mail must meet the conditions of name@domain.country_code');
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
      notify('Minimum eight characters, at least one letter, one number and one special character');
      return false;
    }
  }
  const validatePass2 = () => {
    const pass1 = document.getElementById('pass1').value;
    const pass2 = document.getElementById('pass2').value;
    if (pass1 === pass2) return true;
    else {
      notify('Passwords must be equal');
      return false;
    }
  }
  const handleRegister = e => {
    e.preventDefault();

    const pass2 = validatePass2();
    const pass1 = validatePass1();
    const mail = validateMail();

    if (mail && pass1 && pass2) {
      axios({
        method: 'PUT',
        url: `${process.env.REACT_APP_DB_CONNECT}API/users`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          mail: mailValue,
          password: passwordValue
        }
      }).then(data => {
        if (data.data === 'The specified user already exists!') notify('The specified user already exists!');
        else {
          navigate('/loading', { state: { infoMessage: 'Your Account has been created!', loadingMessage: 'Preparing your account repository', location: '/login' } });
        }
      })
        .catch(error => console.log(error));
    }
  }

  useEffect(() => {
    if (localStorage.getItem('mail')) navigate('/access/home');
  }, []);

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
      <ToastContainer position="bottom-right" />
    </div>
  );
}
export default Register;