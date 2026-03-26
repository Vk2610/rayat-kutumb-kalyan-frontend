import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { MdEdit, MdCheck } from "react-icons/md";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Create a green theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#16a34a", // green-600
      light: "#4ade80", // green-400
      dark: "#15803d", // green-700
    },
  },
});

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [editFields, setEditFields] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setSnackbar({
            open: true,
            message: "User not logged in.",
            severity: "error",
          });
          return;
        }

        const decoded = jwtDecode(token);
        const hrmsNo = decoded.hrmsNo;
        console.log('profile hrms ', hrmsNo);

        const res = await axios.get(`http://localhost:3000/employees/get-emp-prf/${hrmsNo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Map backend response to frontend fields
        const userData = res.data || {};
        setUser({
          hrmsNo: userData.hrmsNo || "",
          employeeName: userData.employeeName || "",
          emailId: userData.emailId || "",
          gender: userData.gender || "",
          mobileNo: userData.mobileNo || "",
          branchName: userData.branchName || "",
          branchRegionName: userData.branchRegionName || "",
          designation: userData.designation || "",
          branchType: userData.branchType || "",
          qualifications: userData.qualifications || "",
          profileType: userData.profileType || "",
          maritalStatus: userData.maritalStatus || "",
          panNo: userData.panNo || "",
          presentAddress: userData.presentAddress || "",
          permanentAddress: userData.permanentAddress || "",
          branchJoiningDate: userData.branchJoiningDate
            ? userData.branchJoiningDate.split("T")[0]
            : "",
          retirementDate: userData.retirementDate
            ? userData.retirementDate.split("T")[0]
            : "",
          currentAppointmentDate: userData.currentAppointmentDate
            ? userData.currentAppointmentDate.split("T")[0]
            : "",
          currentAppointmentType: userData.currentAppointmentType || "",
          firstAppointmentDate: userData.firstAppointmentDate
            ? userData.firstAppointmentDate.split("T")[0]
            : "",
          firstJoiningDate: userData.firstJoiningDate
            ? userData.firstJoiningDate.split("T")[0]
            : "",
          firstAppointmentType: userData.firstAppointmentType || "",
          employeeType: userData.employeeType || "",
          approvalRefNo: userData.approvalRefNo || "",
          approvalLetterDate: userData.approvalLetterDate
            ? userData.approvalLetterDate.split("T")[0]
            : "",
          appointmentNature: userData.appointmentNature || "",
        });
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Failed to load user details.",
          severity: "error",
        });
      }
    };

    fetchUser();
  }, []);

  const handleChange = (key, value) =>
    setUser((prev) => ({ ...prev, [key]: value }));

  const toggleEdit = (field) =>
    setEditFields((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleKeyPress = (e, field) => {
    if (e.key === "Enter") {
      toggleEdit(field);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSnackbar({
          open: true,
          message: "User not logged in.",
          severity: "error",
        });
        return;
      }

      const decoded = jwtDecode(token);
      const hrmsNo = decoded.hrmsNo;

      const response = await axios.put(
        `http://localhost:3000/employees/upd-emp/${hrmsNo}`,
        user,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Profile updated successfully!",
          severity: "success",
        });
        setEditFields({});
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Update failed. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const ProfileField = ({ label, field, type = "text" }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        pb: 2,
        borderBottom: "1px solid #dcfce7",
        transition: "all 0.3s",
        borderRadius: 1,
        px: 2,
        "&:hover": {
          backgroundColor: "#f0fdf4",
        },
      }}
    >
      <Typography
        sx={{
          color: "#15803d",
          fontWeight: 600,
          width: "35%",
          fontSize: "0.95rem",
        }}
      >
        {label}:
      </Typography>
      <Box sx={{ width: "55%", display: "flex", alignItems: "center" }}>
        {editFields[field] ? (
          <TextField
            type={type}
            value={user[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, field)}
            fullWidth
            autoFocus
            size="small"
            InputLabelProps={type === "date" ? { shrink: true } : {}}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#16a34a",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#16a34a",
                },
              },
            }}
          />
        ) : (
          <Typography sx={{ px: 2, py: 1, color: "#374151", fontSize: "0.9rem" }}>
            {user[field] || "-"}
          </Typography>
        )}
      </Box>
      <IconButton
        onClick={() => toggleEdit(field)}
        sx={{
          color: "white",
          backgroundColor: "#16a34a",
          "&:hover": {
            backgroundColor: "#15803d",
          },
          transition: "all 0.2s",
          width: 36,
          height: 36,
        }}
        size="small"
      >
        {editFields[field] ? <MdCheck /> : <MdEdit />}
      </IconButton>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ my: 5 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            border: "1px solid #bbf7d0",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: "linear-gradient(to right, #16a34a, #4ade80)",
              color: "white",
              textAlign: "center",
              py: 3,
              borderRadius: 3,
              mb: 4,
              boxShadow: 1,
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              User Profile
            </Typography>
            <Typography variant="body1" sx={{ color: "#dcfce7" }}>
              Manage and update your personal details
            </Typography>
          </Box>

          {/* Profile Fields */}
          <Box>
            {/* Personal Information Section */}
            <Typography
              variant="h6"
              sx={{
                color: "#16a34a",
                fontWeight: 700,
                mb: 3,
                pb: 1,
                borderBottom: "2px solid #16a34a",
              }}
            >
              Personal Information
            </Typography>
            <Box sx={{ mb: 5 }}>
              <ProfileField label="HRMS No" field="hrmsNo" />
              <ProfileField label="Employee Name" field="employeeName" />
              <ProfileField label="Email ID" field="emailId" type="email" />
              <ProfileField label="Mobile No" field="mobileNo" />
              <ProfileField label="Gender" field="gender" />
              <ProfileField label="Marital Status" field="maritalStatus" />
              <ProfileField label="PAN No" field="panNo" />
              <ProfileField label="Present Address" field="presentAddress" />
              <ProfileField label="Permanent Address" field="permanentAddress" />
            </Box>

            {/* Professional Information Section */}
            <Typography
              variant="h6"
              sx={{
                color: "#16a34a",
                fontWeight: 700,
                mb: 3,
                pb: 1,
                borderBottom: "2px solid #16a34a",
              }}
            >
              Professional Information
            </Typography>
            <Box sx={{ mb: 5 }}>
              <ProfileField label="Profile Type" field="profileType" />
              <ProfileField label="Designation" field="designation" />
              <ProfileField label="Qualifications" field="qualifications" />
              <ProfileField label="Branch Name" field="branchName" />
              <ProfileField label="Branch Region" field="branchRegionName" />
              <ProfileField label="Branch Type" field="branchType" />
              <ProfileField label="Employee Type" field="employeeType" />
              <ProfileField label="Appointment Nature" field="appointmentNature" />
              <ProfileField label="Approval Ref No" field="approvalRefNo" />
            </Box>

            {/* Appointment & Dates Section */}
            <Typography
              variant="h6"
              sx={{
                color: "#16a34a",
                fontWeight: 700,
                mb: 3,
                pb: 1,
                borderBottom: "2px solid #16a34a",
              }}
            >
              Appointment & Important Dates
            </Typography>
            <Box>
              <ProfileField
                label="Branch Joining Date"
                field="branchJoiningDate"
                type="date"
              />
              <ProfileField
                label="First Joining Date"
                field="firstJoiningDate"
                type="date"
              />
              <ProfileField
                label="First Appointment Date"
                field="firstAppointmentDate"
                type="date"
              />
              <ProfileField
                label="First Appointment Type"
                field="firstAppointmentType"
              />
              <ProfileField
                label="Current Appointment Date"
                field="currentAppointmentDate"
                type="date"
              />
              <ProfileField
                label="Current Appointment Type"
                field="currentAppointmentType"
              />
              <ProfileField
                label="Approval Letter Date"
                field="approvalLetterDate"
                type="date"
              />
              <ProfileField
                label="Retirement Date"
                field="retirementDate"
                type="date"
              />
            </Box>
          </Box>

          {/* Save Changes Button */}
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              sx={{
                px: 6,
                py: 1.5,
                fontWeight: 600,
                fontSize: "1.1rem",
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 4,
                },
                transition: "all 0.3s",
              }}
            >
              Save All Changes
            </Button>
          </Box>
        </Paper>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default UserProfile;