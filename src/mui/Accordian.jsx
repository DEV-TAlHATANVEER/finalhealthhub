import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



export default function Accordions() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <div className='' style={{ display: 'flex', alignItems: 'center' }}>
        <img src={require("../../assets/Founding-Icon-2022.png")} alt="Your Image" style={{ width: '8rem', marginRight: '1rem' }} />
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            >
            <Typography className='w-100 '>
                <b>
                Favorite Healthcare Staffing is Founded
                </b>
                <p className='font14px p-2'>
                Favorite was established in 1981 when we opened our very first branch office in Seattle, Washington.
                </p>
            </Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography className='font14px'>
             Favorite has branch offices that offer our clients a unique community-based approach with <br />
             the resources of a large national partner. Our mission is to be the nation’s premier provider <br />
              of healthcare professionals and managed solutions by exceeding the expectations of our <br />
             clients, associates and the individuals we serve.
            </Typography>
            </AccordionDetails>
        </Accordion>
        </div>


        <div className='mb-3' style={{ display: 'flex', alignItems: 'center' }}>
        <img src={require("../../assets/NOC-Icon-2022.png")} alt="Your Image" style={{ width: '8rem', marginRight: '1rem' }} />
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
      <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            >
            <Typography className=' w-100 '>
                <b>
                Favorite Opens National Operations Center
                </b>
                <p className='font14px p-2'>
                Our National Operations Center (NOC) keeps our agency open 24/7/365 and provide 
                seamles for our <br /> employee and clients after hours, on weekends, and in <br />
                 emergencies. 
                
                </p>
            </Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography className='font14px'>
            At Favorite, we know the lifesaving work of medical professionals doesn’t stop after 5 <br />
             o’clock or on the weekends. We are proud of our ability to offer full-time coverage and <br />
              services to our clients and employees in communities across the US. 
            </Typography>
            </AccordionDetails>
      </Accordion>
        </div>


        <div className='mb-3' style={{ display: 'flex', alignItems: 'center' }}>
        <img src={require("../../assets/Service-Icon-2022.png")} alt="Your Image" style={{ width: '8rem', marginRight: '1rem' }} />

        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
      <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            >
            <Typography className=' w-100 '>
                <b>
                Favorite Expands Lines of Business
                </b>
                <p className='font14px p-2'>
                As our agency grew, it was a natural step for us to offer our healthcare professionals and
                 clients more<br />opportunities and solutions to better serve them and our communities.
                
                </p>
            </Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography className='font14px py-3'>
            <span className='text-primary'>Travel Nursing (1991) – </span>  Travel nurses are an essential part of the healthcare <br /> 
            workforce as they help fill staffing needs at facilities across the nation. As an award-winning, <br />
             Joint Commission Certified travel nurse agency, we specialize in helping <br />
              nurses find the perfect travel nursing job offering great pay, awesome perks, and <br />
               opportunities to develop new skills along the way. 
            </Typography>

            <Typography className='font14px py-3' variant="" color="initial">
           <span className='text-primary'>Allied Health & Non-Clinical (2006) – </span>  Favorite knows that allied health professionals <br />
             are vital to keeping the healthcare industry running efficiently and that they provide <br />
              their own unique, essential service within the medical field. We created our Allied <br />
               division, a team solely devoted to filling allied and non-clinical staffing needs across the US. 
            </Typography>

            <div className='py-3'>
            <Typography className='font14px' variant="" color="initial">
           <span className='text-primary'>Managed Services (2006) – </span>  Favorite provides a comprehensive range of workforce <br />
            solutions including local per diem, travel, and permanent placement staffing options, <br />
             human capital management, financial savings, technology solutions, complete Vendor <br />
              Management Services (VMS) and Managed Service Provider (MSP) programs. As <br />
               one of the industry’s fastest growing staffing providers, our mission is to create jobs <br />
                and provide qualified and dependable talent to our clients whenever, wherever needed. 
            </Typography>
            </div>

            <div className='py-3'>
            <Typography className='font14px' variant="" color="initial">
           <b>Emergency Response Staffing (2007) – </b>  Our Emergency Response division is <br />
            dedicated to staffing crisis needs across the country. Amid the COVID-19 pandemic, <br />
             Favorite Healthcare Staffing has been challenged to be more responsive than ever. <br />
              Our technological innovations have allowed us to increase our speed to fill <br />
               emergency nursing, allied health, and non-clinical positions on a national level.  
            </Typography>
            </div>

            <div className='py-3'>
            <Typography className='font14px' variant="" color="initial">
            <span className='text-primary'>Permanent Placement (2010) – </span>  We provide top-notch healthcare staffing services to <br />
             place you in long-term medical jobs that offer stability, competitive pay, and <br />
              comprehensive benefits like retirement, insurance and vacation time. We provide full-time <br />
               job openings in a variety of settings, including nursing homes, hospitals, clinics, <br />
                schools, outpatient care facilities, research labs and more.  
            </Typography>
            </div>



            </AccordionDetails>
      </Accordion>
        </div>


      
        <div className='mb-3' style={{ display: 'flex', alignItems: 'center' }}>
        <img src={require("../../assets/Volunteer-Icon-2022.png")} alt="Your Image" style={{ width: '8rem', marginRight: '1rem' }} />
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
      <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            >
            <Typography className=' w-100 '>
                <b>
                Favorite Launches Volunteer Program
                </b>
                <p className='font14px p-2'>
                Favorite launched our volunteer program, Volunteering for a Brighter Tomorrow, in 2013
                 an opportunity <br /> for our employees to give back to their communities.
                
                </p>
            </Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography className='font14px'>
            Favorite employees have made an impact across the nation by volunteering at a variety of <br />
             organizations, including The Ronald McDonald House, Habitat for Humanity, Rose Brooks <br />
              Center, American Red Cross, and the Humane Society of Greater Kansas City. 
            </Typography>
            </AccordionDetails>
      </Accordion>
        </div>

         
        <div className='mb-3' style={{ display: 'flex', alignItems: 'center' }}>
        <img src={require("../../assets/Awards-Icon-2022.png")} alt="Your Image" style={{ width: '8rem', marginRight: '1rem' }} />
      <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
      <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            >
            <Typography className=' w-100 '>
                <b>
                Favorite Makes SIA's Largest Healthcare Staffing Firms List
                </b>
                <p className='font14px p-2'>
                Favorite has ranked on Staffing Industry Analysts’ List of Largest Healthcare Staffing Firms
                 since 2009 <br /> and has once again been named to the list for 2021.
                
                </p>
            </Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography className='font14px'>
            Favorite also made the Largest Travel Nurse, Per Diem Nurse and Allied Healthcare Staffing <br />
             Firms lists. For 2021 (based on 2020 revenue), Favorite Healthcare Staffing was named as <br />
              the: <br />
                8th Largest US Healthcare Staffing Firm (up from 22nd) <br />
                5th Largest US Travel Nurse Staffing Firm (up from 28th) <br />
                10th Largest US Per Diem Nurse Staffing Firm <br />
                17th Largest US Allied Healthcare Staffing Firm <br />
                35th Largest US Staffing Firm (up from 137th) <br />
                14th Fastest-Growing US Staffing Firm 

            </Typography>
            </AccordionDetails>
      </Accordion>
        </div>

        <div className='mb-3' style={{ display: 'flex', alignItems: 'center' }}>
        <img src={require("../../assets/Partnership-Icon-2022.png")} alt="Your Image" style={{ width: '8rem', marginRight: '1rem' }} />
      <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
      <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            >
            <Typography className=' w-100 '>
                <b>
                Favorite Healthcare Staffing Joins <br /> Acacium Group
                </b>
                <p className='font14px p-2'>
                By bringing the best of their combined staffing experiences across the US, Europe and
                 Australia <br /> Favorite Healthcare Staffing and Acacium Group will offer a  differentiated, tech-
                  enabled set of services.
                </p>
            </Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography className='font14px'>
            Favorite Healthcare Staffing was acquired by Acacium Group, Europe’s leading healthcare <br />
             solutions provider. Through this acquisition, Favorite and Acacium Group become the first <br />
              global healthcare staffing and workforce solutions specialist with operations in the US, <br />
               Europe, and Australia.

            </Typography>
            </AccordionDetails>
      </Accordion>
        </div>

    </div>
  );
}
