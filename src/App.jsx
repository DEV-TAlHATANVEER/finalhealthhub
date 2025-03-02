import './App.css';
import 'leaflet/dist/leaflet.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Auth/Login';
import ForgetPassword from './Auth/ForgetPassword';
import ResetPassword from './Auth/ResetPassword';
import Otp from './Auth/Otp';
import Signup from './Auth/SignUp';
import SignupForLab from './Lab/SignupForLab';
import AdminDashboardSideNav from './SidenavAdmindasboard/Dashboard';
import AdminDashboard from './Admin/AdminDashboard';
import Patient from './Admin/Patient';
import Doctors from './Admin/Doctors';
import BloodBank from './Admin/BloodBank';
import Labs from './Admin/Labs';
import Payment from './Admin/Payment';
import EHR from './Admin/EHR';
// import Payment from './Admin/Payment';
import Blog from './Admin/Blog';
import SelectRole from './Auth/SelectRole';
import DoctorDashboardSideNav from './SidenavDoctordasboard/Dashboard';
import Profile from './Doctor/Profile';
import Availbility from './Doctor/Availbility';
import ManageAvailability from './Doctor/ManageAvailability';
import Appointment from './Doctor/Appointment';
import Patientdoc from './Doctor/Patient';
import DashboardDoctor from './Doctor/DashboardDoctor';
import VideoConsultation from './Doctor/VideoConsultation';
import DashboardLab from './Lab/DashboardLab';
import LabDashboardSideNav from './SidenavLabdasboard/Dashboard';
import TestRequests from './Lab/TestRequests';
import TestManagement from './Lab/TestManagement';
import Reports from './Lab/Reports';
import LabProfile from './Lab/Profile';
import LabPayment from './Lab/Payment';
import Staff from './Lab/Staff';

import { LabelSharp } from '@mui/icons-material';
import GeneratePrecription from './Doctor/GeneratePrecription';
import PaymentInvoice from './Admin/PaymentInvoice';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SelectRole />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-lab" element={<SignupForLab />} />
        <Route path="/otp" element={<Otp />} />
        <Route path='/login' element={<Login />}/>


        <Route element={<AdminDashboardSideNav />}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
  <Route path="/admin/patients" element={<Patient />} />
  <Route path="/admin/doctors" element={<Doctors />} />
  <Route path="/admin/bloodbank" element={<BloodBank />} />
  
  {/* <Route path="/admin/ehr" element={<EHR />} /> */}
  <Route path="/admin/payments" element={<Payment />} />
  <Route path="invoice/:paymentId" element={<PaymentInvoice />} />
  <Route path="/admin/lab" element={<Labs />} />
  <Route path="/admin/blogs" element={<Blog />} />
  
</Route>
<Route path='/doctor/appointment/video-consultation/:id' element={<VideoConsultation />} />
<Route element={<DoctorDashboardSideNav />}>


<Route path='/doctor/dashboard' element={<DashboardDoctor /> } />
<Route path='/doctor/profile' element={<Profile /> } />
<Route path='/doctor/availbility' element={<Availbility />} />
<Route path='/doctor/manage-availability' element={<ManageAvailability />} />
<Route path='/doctor/appointment' element={<Appointment />} />
{/* <Route path='/doctor/video-consultation/:id' element={<VideoConsultation />} /> */}
<Route path='/doctor/patients' element={<Patientdoc />} />
<Route path='/doctor/payments' element={<Payment />} />
<Route path='/doctor/generate-prescription' element={<GeneratePrecription />} />

</Route>

<Route element={<LabDashboardSideNav />}>
  <Route path="/lab/dashboard" element={<DashboardLab />} />
  <Route path="/lab/test-requests" element={<TestRequests />} />
  <Route path="/lab/test-management" element={<TestManagement />} />
  <Route path="/lab/reports" element={<Reports />} />
  <Route path="/lab/staff" element={<Staff />} />
  <Route path="/lab/profile" element={<LabProfile />} />
  <Route path="/lab/payments" element={<LabPayment />} />

</Route>

      </Routes>


    </Router>
  );
}

export default App;
