import { Button, Dialog, DialogActions, DialogContent, DialogTitle,DialogContentText } from '@mui/material';
import React from 'react';
import { forwardRef, useEffect, useState } from "react";

import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { Box, Stack } from "@mui/system";

const MuiDialog = ({show,onHide,title,subTitle,Buttons}) => {
  console.log(onHide)
    return (
        <Dialog open={show} onClose={onHide}>
        {title&&<DialogTitle>{title}</DialogTitle>}
        <DialogContent>
          <p>{subTitle}</p>
        </DialogContent>
        <DialogActions>
     <Buttons />
        </DialogActions>
      </Dialog>
    );
};

export default MuiDialog;





const Transition = forwardRef(function Transition(props, ref) {
  return <Slide  sx={{minHeight:300}} direction="up" ref={ref} {...props} />;
});

export  function MuiPopup({ title, content, show,onHide,Buttons,style }) {



  return (
    <div>
      <Dialog
        open={show}
        Transitioncomponent={Transition}
        keepMounted
        onClose={onHide}
        aria-describedby="alert-dialog-slide-description"
        sx={{...{
           minHeight:300
          },...style}}
      >
        <DialogTitle>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box mr={2}>{title}</Box>
            <IconButton onClick={onHide}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
      {content&&  <DialogContent dividers>
          <DialogContentText id="alert-dialog-slide-description">
            {content}
          </DialogContentText>
        </DialogContent>}
        <DialogActions>
     <Buttons/>
        </DialogActions>
      </Dialog>
    </div>
  );
}