import * as React from "react";
import Button from "@mui/material/Button";

export default function AdminButton({ name,className ,size, style, type, disabled, fullWidth ,...otherProps}) {
 
  return (
   
    <Button
      sx={style}
      variant="contained"
      size={size}
      type={type}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
      {...otherProps}

    >
      {name}
    </Button>
  );
}
