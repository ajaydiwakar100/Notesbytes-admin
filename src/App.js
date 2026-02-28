import './App.css';
import Header from './layouts/Header';
import Siderbar from './layouts/Siderbar'; // Corrected import statement
import Footer from './layouts/Footer';
import Dashboard from './pages/Dashboard';
import UserList from './pages/users/List';
import UserDetail from './pages/users/Detail';
import Login from './pages/Login';
import OTP from './pages/Otp';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useNavigate  } from 'react-router-dom'; // Import Routes instead of Route
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import GobalSettingList from './pages/golbalSettings/List';
import AddGlobalSettings from './pages/golbalSettings/Add';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import RoleList from './pages/rolesAndPermission/List';
import AddRole from './pages/rolesAndPermission/Add';
import EditRole from './pages/rolesAndPermission/Edit';
import SubAdminList from './pages/subAdmins/List'
import AddSubAdmin from './pages/subAdmins/Add'
import EmailTemplateList from './pages/emailTemplate/List';
import EditEmailTemplate from './pages/emailTemplate/Edit';
import Home from './pages/pages/Home';
import AboutUs from './pages/pages/AboutsUs';
import SellNotes from './pages/pages/SellNotes';
import TermsConditions from './pages/pages/Terms';
import Privacy from './pages/pages/Privacy';
import GlobalSettings from './pages/golbalSettings/GolbalSettings'
import 'bootstrap/dist/css/bootstrap.min.css';
import RefundCancellationPolicy from './pages/pages/RefundCancellationPolicy';
import PurchaseOrderList from './pages/documents/purchaseDocument/List';
import UploadDocumentList from './pages/documents/UploadedDocument/List';
import BlogList from './pages/blogs/List';
import BlogAdd from './pages/blogs/Add';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';



function App() {
  
  // Simulated authentication check
  const isAuthenticated = localStorage.getItem('isAuthenticated'); // Parse as boolean
 
  return (
    <div className="wrapper">
      <Router basename="/admin">
        <ToastContainer />
        <Routes>
          <Route path="/login" element={(isAuthenticated === 'true') ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/verification-code" element={(isAuthenticated === 'true') ? <Navigate to="/otp" /> : <OTP />} />
          <Route path="/forgot-password"  element={(isAuthenticated === 'true') ? <Navigate to="/forgot-password" /> : <ForgetPassword />} />
          <Route path="/reset-password"  element={(isAuthenticated === 'true') ? <Navigate to="/reset-password" /> : <ResetPassword />} />

          <Route path="/" element={<DashboardLayout  isAuthenticated={isAuthenticated} />}>
              <Route path="/dashboard" element={<Dashboard />} /> 
              <Route path="/profile" element={<Profile />} /> 
              <Route path="/change-password" element={<ChangePassword />} /> 
            
              <Route path="/users" element={<UserList />} /> 
              <Route path="/users/detail/:id" element={<UserDetail />} /> 
              {/* <Route path="/users/sellers" element={<UserList />} /> 
              <Route path="/users/refferals" element={<UserList />} />  */}
              
              <Route path="/global-setting" element={<GlobalSettings/>} /> 
            
              <Route path='/roles' element={<RoleList/>}/>
              <Route path='/roles/add' element={<AddRole/>}/>
              <Route path='/roles/edit/:id' element={<AddRole/>}/>

              <Route path='/sub-admins' element={<SubAdminList/>}/>
              <Route path='/sub-admins/add' element={<AddSubAdmin/>}/>
              <Route path='/sub-admins/edit/:id' element={<AddSubAdmin/>}/>

              <Route path='/email-template' element={<EmailTemplateList/>}/>
              <Route path='/email-template/edit/:id' element={<EditEmailTemplate/>} />

              <Route path='/pages/home' element={<Home/>} />
              <Route path='/pages/about-us' element={<AboutUs/>} />
              <Route path='/pages/sell-notes' element={<SellNotes/>} />
              <Route path='/pages/terms-conditions' element={<TermsConditions/>} />
              <Route path='/pages/privacy-policy' element={<Privacy/>} />
              <Route path='/pages/refund' element={<RefundCancellationPolicy/>}/>

              <Route path='/documents/purchase-orders' element={<PurchaseOrderList/>}/>
              <Route path='/documents/upload-documents' element={<UploadDocumentList/>}/>

              <Route path='/blogs' element={<BlogList/>}/>
              <Route path='/blogs/add' element={<BlogAdd/>}/>
              <Route path='/blogs/edit/:id' element={<BlogAdd/>}/>

              
        
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

function DashboardLayout() {
  const isAuthenticate = localStorage.getItem('isAuthenticated'); // Parse as boolean
  if (isAuthenticate === 'true') {
    return (
      <>
        <Header />
        <Siderbar />
        <Outlet /> {/* Renders child routes */}
        <Footer />
      </>
    );
  }else {
    return <Navigate to="/login" />;
  }
}
export default App;
