import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from './pages/common/Login.jsx';
import ResetPassword from './pages/common/ResetPassword.jsx';
import HomePage from './pages/common/HomePage.jsx';
import ManageFunds from './pages/admin/ManageFunds';
import UserProfile from './pages/user/UserProfile.jsx';
import AdminProfile from './pages/admin/AdminProfile.jsx';
import DataEntry from './pages/admin/DataEntry.jsx';
import History from './pages/admin/History.jsx';
import FormApproval from './pages/admin/FormApproval.jsx';
import FormDetails from './pages/admin/FormDetails.jsx';
import FormHistory from './pages/admin/FormHistory.jsx';
import SevakWelfareForm from './pages/user/WelfareForm.jsx';
import LandingPage from './pages/common/LandingPage.jsx';
import NewUser from './pages/admin/NewUser.jsx';
import { jwtDecode } from 'jwt-decode';
import UpdateUser from './pages/admin/UpdateUser.jsx';
import ViewProfile from './pages/admin/ViewProfile.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');

  // No token → allow only public pages
  if (!token) {
    return <Navigate to="/" replace />;
  }

  let decoded;
  try {
    decoded = jwtDecode(token);
  } catch (err) {
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }

  const role = decoded.role;

  // Get URL role (after first slash)
  const urlRole = window.location.pathname.split('/')[1]; // "user" or "admin"

  // If URL role mismatches → redirect to correct role root
  if (urlRole && urlRole !== role) {
    return <Navigate to={`/${role}`} replace />;
  }

  // If route requires specific roles
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        {/* Protected Routes */}
        {/* User Routes */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <HomePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="wf-form" element={<SevakWelfareForm />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <HomePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="rkky-profile" replace />} />
          <Route path="new-user" element={<NewUser />} />
          <Route path="update-user" element={<UpdateUser />} />
          <Route path="view-profile" element={<ViewProfile />} />
          <Route path="rkky-profile" element={<AdminProfile />} />
          <Route path="welfare-profile" element={<UserProfile />} />
          <Route path="manage-funds" element={<ManageFunds />} />
          <Route path="data-entry" element={<DataEntry />} />
          <Route path="wf-form" element={<SevakWelfareForm />} />
          <Route path="history" element={<History />} />
          <Route path="form-approval" element={<FormApproval />} />
          <Route path="form-approval-details" element={<FormDetails />} />
          <Route path="form-history" element={<FormHistory />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
