import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
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

export default()=> {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
        <div className='row'>
            <h3 className=' text-center col-md-3'>
            Differentiator
            </h3>
            <h3 className=' text-center col-md-3'>
            Traditional Method
            </h3>
            <h3 className=' text-center col-md-3'>
            Technology Based <br /> VMS
            </h3>
            <h3 className=' text-center col-md-3'>
            Managed Services <br /> (MSP)
            </h3>
        </div>
    <Box sx={{ flexGrow: 1, bgcolor: '#E5F3FB', display: 'flex', }}>
        
      <Tabs 
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ backgroundColor:"#F2F9FD", '& .MuiTab-root:hover': {
            color: '#ff7600',
          }, '& .Mui-selected': {
            backgroundColor: '#E5F3FB',
          },}}
      >
        <Tab className='' label="Services" {...a11yProps(0)} />
        <Tab className='' label="Point of Contact" {...a11yProps(1)} />
        <Tab className='' label="Contracts/Rates" {...a11yProps(2)} />
        <Tab className='' label="Orientation" {...a11yProps(3)} />
        <Tab className='' label="Management Supplemental Staff" {...a11yProps(4)} />
        <Tab className='' label="Quality Assurance" {...a11yProps(5)} />
        <Tab className='' label="Invoicing" {...a11yProps(6)} />
        <Tab className='' label="Reporting / Benchmarking" {...a11yProps(7)} />
        <Tab className='' label="Support Structure" {...a11yProps(8)} />

     
      </Tabs>
      <TabPanel value={value} index={0}>
        <Grid container spacing={16}>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Per diem/contract </p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p>Nursing </p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Allied staffing</p>
            </div>
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Technology</p>
            </div>  
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >
                Per diem/contract 

               </p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p > Nurse staffing </p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Allied staffing </p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p > Temp to perm/direct hire </p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Staf</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p > Float pool management </p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p > Technology  </p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p > On-site management</p>
            </div>
        </Grid>
       
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Grid container spacing={16}>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Phone calls/emails/ faxes to multiple vendors </p>
            </div>
        </Grid>
        <Grid item xs={12} md={4}> 
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Enter order into web portal which is then routed to vendors </p>
            </div>
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Enter order or phone order to dedicated person to make requests for staff, manage need(s), check order status/history, and manage account. </p>
            </div>
        </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Equipment processer</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Equipment repair technician</p>
            </div>
        </Grid>
        <Grid item xs={12} md={4}> 
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Facilities manager</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Maintenance worker</p>
            </div>
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Operator</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Systems operator</p>
            </div>
        </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Accountant</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Accounts payable clerk</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Accounts receivable clerk</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Billing specialist</p>
            </div>
        </Grid>
        <Grid item xs={12} md={4}>
           
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Claims processor</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Collections representative</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Business analyst</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Data analyst</p>
            </div>
            
        </Grid>
        <Grid item xs={12} md={4}>
        <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Finance clerk</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Medical biller</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Payroll coordinator</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Purchasing assistant</p>
            </div>
            
        </Grid>
       
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={4}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Cook</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Dietary aide</p>
            </div>
        </Grid>
        <Grid item xs={12} md={4}> 
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Dishwasher</p>
            </div>
            
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Nutritional</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >services aide</p>
            </div>
        </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={5}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Auditor</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Compliance coordinator</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Credential coordinator</p>
            </div>
        </Grid>
        <Grid item xs={12} md={4}> 
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Data entry clerk</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Health information specialist</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Medical coder</p>
            </div>
            
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Medical transcriptionist</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Medical scribe</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Project manager</p>
            </div>
        </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={6}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Benefits coordinator</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Compensation analyst</p>
            </div>
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Human resources assistant</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Recruiter</p>
            </div>
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Talent acquisition partner</p>
            </div>
           
        </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={7}>
      <Grid container spacing={3}>
       
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Application analyst</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Business analyst</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Data analyst</p>
            </div>
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Desktop support technician</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Developer</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Programmer</p>
            </div>
           
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Project assistant</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Project manager</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Systems administrator</p>
            </div>
        </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={8}>
      <Grid container spacing={3}>
       
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Lawyer</p>
            </div>
            
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Legal assistant</p>
            </div>
           
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Paralegal</p>
            </div>
           
        </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={9}>
      <Grid container spacing={3}>
       
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Driver</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Materials associate</p>
            </div>
            
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Patient transporter</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Supply clerk</p>
            </div>
           
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Warehouse aide</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Warehouse worker</p>
            </div>
           
        </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={10}>
      <Grid container spacing={3}>
       
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Communications coordinator</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Communications specialist</p>
            </div>
            
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Graphic designer</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Marketing coordinator</p>
            </div>
           
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Public relations</p>
            </div>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Social media coordinator</p>
            </div>
           
        </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={11}>
      <Grid container spacing={3}>
       
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Safety officer</p>
            </div>
           
            
        </Grid>
        <Grid item xs={12} md={4}>
            <div className='d-flex gap-3'>
                <StarIcon style={{color:"ff7600"}}/>
                <p >Security guard</p>
            </div>
           
           
        </Grid>
       
        </Grid>
      </TabPanel>
       </Box>
    </div>
  );
}