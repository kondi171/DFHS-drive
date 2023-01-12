import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Loading = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dots, setDots] = useState('');
  const [init, setInit] = useState(false);
  const notify = message => {
    return toast.success(message, {
      theme: 'colored',
      autoClose: 2500,
    });
  }

  useEffect(() => {
    if (init) notify(location.state.infoMessage, 'success');
  }, [init, location]);
  useEffect(() => {
    setInit(true);
    setTimeout(() => {
      navigate(location.state.location);
    }, 3000);
  }, [navigate, location]);

  useEffect(() => {
    const dotsTimeout = setTimeout(() => {
      if (dots.length === 3) setDots('');
      else setDots(dots + '.');
    }, 200);
    return () => {
      clearTimeout(dotsTimeout);
    }
  }, [dots]);

  return (
    <div className='loading'>
      <div className='loading__spinner--one'></div>
      <div className='loading__spinner--two'></div>
      <div className='loading__spinner--three'></div>
      <div className='loading__text'>{location.state.loadingMessage}<span>{dots}</span></div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Loading;
