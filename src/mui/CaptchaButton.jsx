import React, { useState } from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import { Button, Grid } from "@mui/material";
import { useSelector } from 'react-redux';
function CaptchaButton({ name,className ,size, style, type, disabled, fullWidth ,...otherProps}) {
    const [captcha, setCaptucha] = React.useState(false);
   const {debugMode}=useSelector(state=>state.auth)

    function onChange(value) {
      setCaptucha(true)
    }
    const key= process.env.REACT_APP_CAPTCHA_KEY
    return (
      <>
      <Grid container mt={2}>
 {!debugMode&&       <Grid item xs={12} sx={{display:"flex",justifyContent:"center"}}>
        <ReCAPTCHA
                    sitekey={key}
                    onChange={onChange}
                  />
        </Grid>}
        <Grid item xs={12} sx={{display:"flex",justifyContent:"center"}}>
      
      <Button
        sx={style}
        variant="contained"
        size={size}
        type={type}
        disabled={!captcha&&!debugMode}
        fullWidth={fullWidth}
        className={className}
        {...otherProps}
  
      >
        {name}
      </Button>
      
      </Grid>
      </Grid>
      </>
    );
  }

export default CaptchaButton