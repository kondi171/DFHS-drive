import React, { useEffect, useState } from 'react';
const Loading = () => {
  const [dots, setDots] = useState('');
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
      <div className='loading__text'>Preparing your files<span>{dots}</span></div>
    </div>
  );
};

export default Loading;
