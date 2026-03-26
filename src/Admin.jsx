import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/common/HomePage";
import Login from "./pages/common/Login";
import ResetPassword from "./pages/common/ResetPassword";

import AdminProfile from "./pages/admin/AdminProfile";
import ManageFunds from "./pages/admin/ManageFunds";
import NewUser from "./pages/admin/NewUser";
import UpdateUser from "./pages/admin/UpdateUser";
import ViewProfile from "./pages/admin/ViewProfile";

export default function Admin() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/resetPassword" element={<ResetPassword />} />

        {/* Admin Routes (no protection) */}
        <Route path="/admin/*" element={<HomePage />}>
          <Route index element={<HomePage />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="manage-funds" element={<ManageFunds />} />
          <Route path="new-user" element={<NewUser />} />
          <Route path="update-user" element={<UpdateUser />} />
          <Route path="manage-funds/view" element={<ViewProfile />} />
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
