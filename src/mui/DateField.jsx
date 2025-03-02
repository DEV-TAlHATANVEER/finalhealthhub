import React from 'react';
import { TextField } from '@mui/material';

const DateField = ({ label, value, onChange, minDate, ...props }) => {
  const handleChange = (event) => {
    const date = new Date(event.target.value);
    onChange(date);
  };

  return (
    <TextField
      type="date"
      label={label}
      value={value ? value.toISOString().split('T')[0] : ''}
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
      }}
      fullWidth
      {...props}
    />
  );
};

export default DateField;
