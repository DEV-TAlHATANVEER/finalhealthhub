import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SelectOption = ({
  name,
  label,
  value,
  onChange,
  data,
  style,
  size,
  selectCss,
  labelStyle,
  onFocus,
  onScroll,
  fieldNames,
  ...props
}) => {
  if (data[0] && Object.keys(data[0])?.length >2) {
    const fieldWithLabel = Object.keys(data[0]).find(
      (field) => field === "title" || field === "name"
    );
    if (fieldWithLabel) {
      fieldNames = { value: "_id", name: fieldWithLabel };
    }
  }
  //console.log(data,"gfhj");
  return (
    <FormControl size={size} sx={style} >
      <InputLabel sx={labelStyle} id={name}>{label}</InputLabel>
      <Select
        labelId={name}
        id={name}
        value={value || ""}
        name={name}
        label={label}
        onChange={onChange}
        sx={selectCss}
        required
        onFocus={onFocus}
        {...props}
        


      >
      
        {fieldNames?
        data?.map((info, index) => {
          return (
            <MenuItem key={index} value={info[fieldNames.value]}>
              {info[fieldNames.name]}
            </MenuItem>
          );
        })
        :data?.map((info, index) => {
          const values = Object.values(info);
          return (
            <MenuItem key={index} value={values[0]}>
              {values[1]}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
const SelectOptionEdit = ({
  name,
  label,
  value,
  onChange,
  data,
  style,
  size,
  selectCss,
  labelStyle,
  onFocus,
  onScroll,
  defaultSelected,
  required,
  fieldNames,
  ...props
}) => {
  // ={value:"id",name:"name"}
  const [focus,setFocus]=useState(false)
  if (data[0] && Object.keys(data[0])?.length === 2) {
    const fieldWithLabel = Object.keys(data[0]).find(
      (field) => field === "title" || field === "name"
    );
    if (fieldWithLabel) {
      fieldNames = { value: "_id", name: fieldWithLabel };
    }
  }

  return (
    <FormControl size={size} sx={style} >
      <InputLabel sx={labelStyle} id={name}>{value||focus?label:defaultSelected}</InputLabel>
      <Select
      
        labelId={name}
        id={name}
        value={value || ""}
        name={name}
        label={label}
        onChange={onChange}
        sx={selectCss}
        onFocus={()=>{
          if(onFocus)
          onFocus()
          !value&& setFocus(true)
        }}
        onBlur={()=>!value&&setFocus(false)}
        
        {...props}
        


      >
     {fieldNames?
        data?.map((info, index) => {
          const values = Object.values(info);
          return (
            <MenuItem key={index} value={info[fieldNames.value]}>
              {info[fieldNames.name]}
            </MenuItem>
          );
        })
        :data?.map((info, index) => {
          const values = Object.values(info);
          return (
            <MenuItem key={index} value={values[0]}>
              {values[1]}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export {SelectOptionEdit}
export default SelectOption;
