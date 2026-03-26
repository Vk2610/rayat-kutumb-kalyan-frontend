import { useState } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { 
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Container
} from '@mui/material';
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [hrmsNo, setHrmsNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const formType = location.state;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        hrmsNo,
        password,
        formType
      });

      const { token } = response.data;
      const decoded = jwtDecode(token);
      const role = decoded.role;
      
      localStorage.setItem("formType", formType);

      localStorage.setItem("token", token);

      navigate(`/${role}`);
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, fontWeight: 600 }}>
              {formType == 'rkky' ? `Admin Login` : 'Login'}
            </Typography>

            <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaUser /> <Typography>HRMS Number</Typography>
              </Box>

              <TextField
                fullWidth
                placeholder="Enter HRMS No"
                value={hrmsNo}
                onChange={(e) => setHrmsNo(e.target.value)}
                required
              />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaLock /> <Typography>Password (Mobile No)</Typography>
              </Box>

              <TextField
                fullWidth
                type="password"
                placeholder="Enter Mobile Number"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}

              <Box sx={{ textAlign: 'right', mt: 1 }}>
                <Link
                  to="/resetPassword"
                  style={{
                    color: '#1565C0',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ backgroundColor: '#16a34a', mt: 2 }}
              >
                Login
              </Button>

            </Box>

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
