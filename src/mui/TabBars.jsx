import React, { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TabBars({ Titles, CustomTitles, Contents }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
        variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          
          {Titles?.map((item, index) => (
            <Tab label={item} {...a11yProps(index)} />
          ))}
          {CustomTitles?.map((item, index) => (
            <Tab
              icon={item.icon}
              iconPosition={"bottom"}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>
      {Contents?.map((Item, index) => (
        <TabPanel value={value} index={index}>
          {Item}
        </TabPanel>
      ))}
    </Box>
  );
}
