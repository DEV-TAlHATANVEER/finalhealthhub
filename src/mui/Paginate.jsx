import React from "react";
import { Box, Pagination } from "@mui/material";

const Paginate = ({ count,limit=10, onChange, defaultNumber }) => {
  if(count==0)
  return
  return (
    <Box display="flex" justifyContent="flex-end" mt={2}>
      <Pagination
        count={Math.ceil(count /limit)}
        style={{color:"#000"}}
        // color="primary"
        // variant="outlined"
        // shape="rounded"
        defaultPage={defaultNumber}
        onChange={ (event, value) => onChange(event, value)}
      />
    </Box>
  );
};
export default Paginate;
