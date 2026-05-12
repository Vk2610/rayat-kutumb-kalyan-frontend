import { useState } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Alert,
  Card,
  CardContent,
  Chip,
  Typography,
  TextField,
  Button,
  Box,
  Container,
  Stack
} from '@mui/material';
import { FaUser, FaLock, FaShieldAlt, FaHandHoldingHeart } from "react-icons/fa";

const Login = () => {
  const [hrmsNo, setHrmsNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const formType = location.state || "welfare";

  const isRkky = formType === "rkky";
  const schemeConfig = isRkky
    ? {
      chip: "Rayat Kutumb Kalyan Yojana",
      title: "Scheme Access Login",
      subtitle:
        "Securely access the Kutumb Kalyan workflow, member records, and scheme operations from one verified portal.",
      accent: "#0f766e",
      accentSoft: "rgba(15,118,110,0.14)",
      icon: <FaShieldAlt />,
    }
    : {
      chip: "Rayat Welfare Form",
      title: "Welfare Portal Login",
      subtitle:
        "Sign in to submit welfare forms, review requests, and continue employee support workflows without friction.",
      accent: "#1d4ed8",
      accentSoft: "rgba(29,78,216,0.14)",
      icon: <FaHandHoldingHeart />,
    };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://rayat-backend-1.onrender.com/auth/login", {
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
        background:
          isRkky
            ? "radial-gradient(circle at top left, rgba(20,184,166,0.18), transparent 28%), linear-gradient(135deg, #052e2b 0%, #0f766e 50%, #dff7f3 100%)"
            : "radial-gradient(circle at top left, rgba(96,165,250,0.24), transparent 28%), linear-gradient(135deg, #172554 0%, #1d4ed8 45%, #eff6ff 100%)",
        px: 2,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Card
          sx={{
            overflow: "hidden",
            borderRadius: 5,
            boxShadow: "0 30px 80px rgba(15, 23, 42, 0.2)",
            bgcolor: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
            <Box
              sx={{
                flex: 1,
                p: { xs: 3, md: 5 },
                color: "#fff",
                background: isRkky
                  ? "linear-gradient(160deg, #052e2b 0%, #0f766e 50%, #14b8a6 100%)"
                  : "linear-gradient(160deg, #172554 0%, #1d4ed8 50%, #60a5fa 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: { md: 620 },
              }}
            >
              <Stack spacing={3}>
                <Chip
                  label={schemeConfig.chip}
                  sx={{
                    alignSelf: "flex-start",
                    bgcolor: "rgba(255,255,255,0.14)",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                />

                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: 4,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "rgba(255,255,255,0.14)",
                    fontSize: "1.75rem",
                  }}
                >
                  {schemeConfig.icon}
                </Box>

                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      lineHeight: 1.15,
                      mb: 2,
                      fontSize: { xs: "2rem", md: "2.7rem" },
                    }}
                  >
                    {schemeConfig.title}
                  </Typography>
                  <Typography
                    sx={{
                      maxWidth: 460,
                      color: "rgba(255,255,255,0.86)",
                      fontSize: "1rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {schemeConfig.subtitle}
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  mt: { xs: 4, md: 6 },
                  p: 2.5,
                  borderRadius: 4,
                  bgcolor: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <Typography sx={{ fontWeight: 700, mb: 1 }}>
                  Sign-in Guidance
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.84)", lineHeight: 1.7 }}>
                  Use your HRMS number as the username and your registered mobile
                  number as the password. After login, you will be redirected to
                  the dashboard based on your role.
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                p: { xs: 3, md: 5 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
              }}
            >
              <Box sx={{ width: "100%", maxWidth: 430 }}>
                <Typography
                  variant="h4"
                  sx={{ mb: 1, fontWeight: 800, color: "#0f172a" }}
                >
                  Welcome Back
                </Typography>
                <Typography sx={{ mb: 4, color: "#64748b", lineHeight: 1.7 }}>
                  Continue securely into the {isRkky ? "scheme" : "welfare"} workspace.
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleLogin}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: "#334155" }}>
                    <FaUser color={schemeConfig.accent} />
                    <Typography sx={{ fontWeight: 600 }}>HRMS Number</Typography>
                  </Box>

                  <TextField
                    fullWidth
                    placeholder="Enter HRMS No"
                    value={hrmsNo}
                    onChange={(e) => setHrmsNo(e.target.value)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        bgcolor: "#fff",
                      },
                    }}
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: "#334155" }}>
                    <FaLock color={schemeConfig.accent} />
                    <Typography sx={{ fontWeight: 600 }}>Password (Mobile No)</Typography>
                  </Box>

                  <TextField
                    fullWidth
                    type="password"
                    placeholder="Enter Mobile Number"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        bgcolor: "#fff",
                      },
                    }}
                  />

                  {error && (
                    <Alert severity="error" sx={{ borderRadius: 3 }}>
                      {error}
                    </Alert>
                  )}

                  <Box sx={{ textAlign: 'right', mt: 0.5 }}>
                    <Link
                      to="/resetPassword"
                      style={{
                        color: schemeConfig.accent,
                        textDecoration: 'none',
                        fontSize: '0.92rem',
                        fontWeight: 600,
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 1.5,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: "1rem",
                      backgroundColor: schemeConfig.accent,
                      boxShadow: "0 14px 28px rgba(15, 23, 42, 0.12)",
                      "&:hover": {
                        backgroundColor: schemeConfig.accent,
                        filter: "brightness(0.94)",
                      },
                    }}
                  >
                    Login
                  </Button>

                  <Box
                    sx={{
                      mt: 1,
                      p: 2,
                      borderRadius: 3,
                      background: schemeConfig.accentSoft,
                    }}
                  >
                    <Typography sx={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.7 }}>
                      Access is role-based. Admins, welfare reviewers, and users are
                      automatically redirected after successful sign-in.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;

