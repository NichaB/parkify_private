import React from 'react';

const LoginButton = ({onClick}) => {
  return (
    <button className="w-4/5 bg-black text-white py-3 my-2 rounded-lg" onClick={onClick}>
      Login
    </button>
  );
};

export default LoginButton;
