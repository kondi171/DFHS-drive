import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Loading = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const messageBox = document.querySelector('.message-box');
    messageBox.classList.add('fade');
    setTimeout(() => {
      messageBox.classList.remove('fade');
    }, 20);
    setTimeout(() => {
      navigate(location.state.location);
    }, 30);
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
      <div className='message-box fade'>
        <i className="fa fa-check-circle" aria-hidden="true"></i>
        <span>{location.state.infoMessage}</span>
      </div>
    </div>
  );
};

export default Loading;
