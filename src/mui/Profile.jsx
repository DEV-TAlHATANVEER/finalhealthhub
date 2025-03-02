import { Box, Button, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';

function Profile(props) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
     <Box>
          <Button
        id="basic-button"
        aria-haspopup="true"
        color='warning'
        onClick={handleClick}
      >Dashboards
      </Button>
          <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
     </Box>
    );
}

export default Profile;
