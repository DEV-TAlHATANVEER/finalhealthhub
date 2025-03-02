import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';

function LoadingOverlay({open,handleClose=()=>{}}) {
    return (
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
}

function LoadingOverlaySmall({open,handleClose=()=>{}}) {
  return (


<div style={{
  position: "relative",
  width: '100%',
  height: 50,
}}>
  <Backdrop style={{
  position: "absolute",
  backgroundColor:'transparent'
}}
open={open}
onClick={handleClose}
>
    <CircularProgress color="inherit" />
  </Backdrop>
</div>
  );
}

export {LoadingOverlaySmall}
export default LoadingOverlay;
