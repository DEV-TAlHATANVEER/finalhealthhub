import React from 'react';
import { TextField } from '@mui/material';

const TimeField = ({ label, value, onChange, ...props }) => {
  const handleChange = (event) => {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    onChange(date);
  };

  const formatTime = (date) => {
    if (!date) return '';
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <TextField
      type="time"
      label={label}
      value={value ? formatTime(value) : ''}
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
      }}
      fullWidth
      {...props}
    />
  );
};

export default TimeField;
