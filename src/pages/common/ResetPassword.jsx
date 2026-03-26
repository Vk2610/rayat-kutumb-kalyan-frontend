import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { 
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Container,
  Snackbar,
  Alert,
  InputAdornment
} from '@mui/material';
import { FaEnvelope, FaLock } from "react-icons/fa";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    Email_ID: "",
    password: "",
    confirmPassword: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    Email_ID: "",
    password: "",
    confirmPassword: ""
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validateForm = () => {
    let tempErrors = {
      Email_ID: "",
      password: "",
      confirmPassword: ""
    };
    let isValid = true;

    if (!formData.Email_ID) {
      tempErrors.Email_ID = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.Email_ID)) {
      tempErrors.Email_ID = "Email is invalid";
      isValid = false;
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.put("http://localhost:3000/auth/reset-password", {
        Email_ID: formData.Email_ID,
        password: formData.password
      });

      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: "Password has been reset successfully!",
          severity: "success"
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to reset password. Please try again.";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6'
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ 
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: 3,
          borderRadius: 2
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" sx={{ textAlign: 'center', mb: 4, color: 'text.primary', fontWeight: 600 }}>
              Reset Password
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}>
              Enter your email and new password to reset your account password.
            </Typography>
            
            <Box component="form" onSubmit={handleResetPassword} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                name="Email_ID"
                type="email"
                label="Email Address"
                placeholder="Enter your registered email"
                value={formData.Email_ID}
                onChange={handleChange}
                required
                variant="outlined"
                error={!!errors.Email_ID}
                helperText={errors.Email_ID}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaEnvelope style={{ color: '#4B5563' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                name="password"
                type="password"
                label="New Password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                required
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock style={{ color: '#4B5563' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                variant="outlined"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock style={{ color: '#4B5563' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#16a34a',
                  '&:hover': {
                    backgroundColor: '#15803d'
                  },
                  mt: 2
                }}
              >
                {isSubmitting ? "Resetting Password..." : "Reset Password"}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link
                  to="/login"
                  style={{ 
                    color: '#16a34a',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Back to Login
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetPassword;
