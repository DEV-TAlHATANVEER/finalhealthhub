import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 'auto' }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="Travel" icon={<FlightTakeoffIcon sx={{fontSize:"4rem"}} />} {...a11yProps(0)}  sx={{ flexDirection: "row", fontSize:"1rem", gap:"1rem", alignItems: "center" }} />
        <Tab label="Per Diem" icon={<MonetizationOnIcon sx={{fontSize:"4rem"}}  />} {...a11yProps(1)} sx={{ flexDirection: "row", fontSize:"1rem", gap:"1rem", alignItems: "center" }} />
        <Tab  label={<>Permanent <br /> Placement</>} icon={<BusinessCenterIcon sx={{fontSize:"4rem"}}  />} {...a11yProps(2)} sx={{ flexDirection: "row", fontSize:"1", gap:"1rem", alignItems: "center" }} />
        <Tab label={<> Managed <br/> Services</>} icon={<BuildIcon sx={{fontSize:"4rem"}}  />} {...a11yProps(3)} sx={{ flexDirection: "row", fontSize:"1rem", gap:"1rem", alignItems: "center" }} />
        <Tab label={<>Project <br /> Staffing</>} icon={<AssignmentIcon sx={{fontSize:"4rem"}}  />} {...a11yProps(4)} sx={{ flexDirection: "row", fontSize:"1rem", gap:"1rem", alignItems: "center" }} />

      </Tabs>
      <TabPanel value={value} index={0}>
      <Typography variant="body2" fontWeight="bold" >Need to fill a travel assignment?</Typography>
      <Typography variant="body2" color="initial" sx={{p:1}}>Favorite can help fill local or national travel assignments.</Typography>
      <Typography variant="body2" color="initial" fontWeight="bold">
      Our customers include…
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <Typography variant="body2" color="initial">
          Hospitals, long-term care and assisted living
        </Typography>
        <Typography variant="body2" color="initial">
          Home care and hospice clinics and laboratory services
        </Typography>
        <Typography variant="body2" color="initial">
          Pharmaceutical and medical products wellness services and clinics
        </Typography>
    </Box>

    <Typography variant="body2" fontWeight="bold" color="initial" sx={{margin:1}}>
    Candidates thrive with benefits from Favorite.
    </Typography>
      <Typography variant="body2" color="initial">
        Once we’ve found the best fit for our candidates, we ensure they thrive in their <br />
        positions through an extensive list of benefits: 401(k) retirement <br />
        plan, completion bonuses, continuing education reimbursement and <br />
        paid liability insurance and workers’ compensation coverage, just to <br />
        name a few.
      </Typography>

      </TabPanel>
      
      <TabPanel value={value} index={1}>
      <Typography variant="body2" fontWeight="bold" >Need to fill a travel assignment?</Typography>
      <Typography variant="body2" color="initial" sx={{p:1}}>
      Favorite can help your company fill day-to-day temporary assignments <br />
      or short term local contracts.
        </Typography>
      <Typography variant="body2" color="initial" fontWeight="bold">
      Our customers include…
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <Typography variant="body2" color="initial">
          Hospitals, long-term care and assisted living
        </Typography>
        <Typography variant="body2" color="initial">
          Home care and hospice clinics and laboratory services
        </Typography>
        <Typography variant="body2" color="initial">
          Pharmaceutical and medical products wellness services and clinics
        </Typography>
    </Box>

    <Typography variant="body2" fontWeight="bold" color="initial" sx={{margin:1}}>
    Candidates thrive with benefits from Favorite.
    </Typography>
      <Typography variant="body2" color="initial">
        Once we’ve found the best fit for our candidates, we ensure they thrive in their <br />
        positions through an extensive list of benefits: 401(k) retirement <br />
        plan, completion bonuses, continuing education reimbursement and <br />
        paid liability insurance and workers’ compensation coverage, just to <br />
        name a few.
      </Typography>
      </TabPanel>
      
      <TabPanel value={value} index={2}>
      <Typography variant="body2" fontWeight="bold" >We do permanent placement too.</Typography>
      <Typography variant="body2" color="initial" sx={{p:1}}>
      Need to fill a permanent placement assignment, also known as Direct <br />
       Hire? Contact Favorite Healthcare Staffing, our National Operations <br />
        Center is open 24/7.
        </Typography>
      <Typography variant="body2" color="initial" fontWeight="bold">
      Our customers include…
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <Typography variant="body2" color="initial">
          Hospitals, long-term care and assisted living
        </Typography>
        <Typography variant="body2" color="initial">
          Home care and hospice clinics and laboratory services
        </Typography>
        <Typography variant="body2" color="initial">
          Pharmaceutical and medical products wellness services and clinics
        </Typography>
        <Typography variant="body2" color="initial">
        Physician’s Offices
        </Typography>
    </Box>
      </TabPanel>
      <TabPanel value={value} index={3}>
      <Typography className='text-muted' variant="body2" fontWeight="bold" >Favorite is a Managed Services Provider (MSP)</Typography>
      
      <Typography variant="body2" color="initial" sx={{ p: 1 }}>
        <b>A new approach to your staffing and workforce needs.</b> We’ll help
        <br />
        make sure your company is staffed and managed so that you can finally
        <br />
        take your mind off of the contingent staff issues holding you back and
        <br />
        focus on something new.
      </Typography>

      <Typography variant="body2" color="initial" sx={{ p: 1 }}>
        <b>General Consulting.</b> We can manage the time sheets of all your
        <br />
        vendors and route timecards accordingly to ensure timely
        <br />
        compensation to the employee and fast, reconciled invoicing to you.
        <br />
      </Typography>
      <Typography variant="body2" color="initial" sx={{ p: 1 }}>
        <b>General Consulting.</b> We can manage the time sheets of all your
        <br />
        vendors and route timecards accordingly to ensure timely
        <br />
        compensation to the employee and fast, reconciled invoicing to you.
        <br />
      </Typography>

      <Typography variant="body1" sx={{ p: 1 }}>
       <b> Human Capital Management.</b> Application management, certification <br />
      records, immunization tracking, OSHA requirements, facility specific <br />
      training — we can handle these on boarding processes and more.
    </Typography>

      <Typography variant="body1" sx={{ p: 1 }}>
      <b>Financial Cost Savings.</b>  Need someone to effectively predict, plan, and <br />
       manage expenditures? Yes, we can do that too.
    </Typography>
      <Typography variant="body1" sx={{ p: 1 }}>
      <b>Technology.</b> We lessen the burden of multiple phones calls, multiple <br />
      invoices, multiple employee files and consolidate them in a centralized  <br />
      platform.
    </Typography>
      <Typography variant="body1" sx={{ p: 1 }}>
      <b>Complete Vendor Management.</b>  Favorite will oversee and contract, <br />
       invoice and manage all your contingent staff, regardless of the vendor <br />
        they come from.
      </Typography>

      
      </TabPanel>
      <TabPanel value={value} index={4}>
      <Typography variant="body1" sx={{ p: 1 }}>
      <Box sx={{ fontWeight: 'bold', pb: 1 }}>You need more than a brand ambassador.</Box>  <br />
      A highly-educated, presentable and enthusiastic healthcare professional <br />
      from Favorite is ready for product promotions, retail and corporate <br />
       wellness/flu clinics, event support, first-aid assistance, community <br />
       health education, and more.
       </Typography>

      <Typography variant="body1" sx={{ p: 1 }}>
      <Box sx={{ fontWeight: 'bold', pb: 1 }}>
    When Favorite staffs your next event…
         </Box>  <br />
      You can depend on educated professionals representing your company <br />
       because Favorite provides you with complete profiles on all employees <br />
        scheduled to work your event. With Favorite as your single point of <br />
         contact for all staffing issues, you can rest assured your event will go <br />
          smoothly from start to finish.
       </Typography>

      <Typography variant="body1" sx={{ p: 1 }}>
      <Box sx={{ fontWeight: 'bold', pb: 1 }}>
      Contact us today for promotional staffing.
         </Box>  <br />
         We have the promotional staffing solutions you’ve been looking for. <br />
          Contact us at by phone at (866) 877-0539 or by email at <br />
           FMS@FavoriteStaffing.com.
       </Typography>
        
      </TabPanel>
    </Box>
  );
}
