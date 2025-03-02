import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import { LoadingOverlaySmall } from "./LoadingOverlay";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PopupFeedback({
  title,
  contentText,
  content,
  isOpen,
  yesName,
  yesClick,
  cancelName,
  cancelClick,
  loading,
  captcha
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(isOpen);
  }, [title, content, isOpen]);

  return (
    <div>
      <Dialog
        open={open}
        Transitioncomponent={Transition}
        keepMounted
        onClose={cancelClick}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {contentText}
          </DialogContentText>
          {content}
        </DialogContent>
        <DialogActions>
        {loading?<LoadingOverlaySmall open={loading}/>:<>  <Button onClick={cancelClick}>{cancelName}</Button>
          <Button disabled={captcha} type="submit" onClick={yesClick}>
            {yesName}
          </Button></>}
        </DialogActions>
      </Dialog>
    </div>
  );
}
