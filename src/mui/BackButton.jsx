import React from 'react';
import IconButton from '@mui/material/IconButton';
// import BackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for routing

const BackButton = ({ to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to); // Redirect to the specified URL
  };

  return (
    <button
      style={{
        backgroundColor: '#3E4755',
        color: 'white',
        borderRadius: '4px',
        fontSize: '1rem',
        padding: '5px',
      }}
      aria-label="Back"
      onClick={handleClick}
    >
      {/* <BackIcon />
       */}

       back
    </button>
  );
};

export default BackButton;
