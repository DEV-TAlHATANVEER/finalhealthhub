import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Box, Button, Grid, styled, Typography } from "@mui/material";
import InputBase from "@mui/material/InputBase";

const SearchHome = ({defaultLabel, setSearch, setKeyword, keyword ,data,style={}}) => {
  const [label,setLabel]=useState("")
  return (
    <>
      <Box style={{ display: "flex", gap:"10px", width: "100%",height:"35px" }}>
        <Box style={{ display: "flex", width: "99%" ,}}>
          <Paper
            sx={{
              p: "2px",
              display: "flex",
              alignItems: "center",
              width: style.width,
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1,height:"20px" }}
              placeholder={"Search by " + (label||defaultLabel)}
              onChange={({ currentTarget: input }) => setSearch(input.value)}
            />

          </Paper>
        </Box>
            <Select
              id="demo-simple-select"
              value={keyword}
              defaultValue=""
              sx={{height:"35px",borderStyle:"none"}}
         
              onChange={(event,value) => {
(event.target.value)? setLabel(value.props.children):setLabel("")
                setKeyword(event.target.value);
              }}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={""}>Default</MenuItem>
              {data.map(item=>(

              <MenuItem value={item.route}>{item.name}</MenuItem>
              ))}
            </Select>
       
      </Box>
    </>
  );
};

export default SearchHome;
