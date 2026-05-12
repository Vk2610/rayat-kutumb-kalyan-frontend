import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FaArrowRight,
  FaClipboardCheck,
  FaRegClock,
  FaUserShield,
  FaUsers,
  FaWallet,
} from "react-icons/fa";
import { getSchemeTheme } from "../../utils/schemeTheme";

const quickActions = [
  {
    title: "Form Approval",
    description: "Review pending welfare applications and approve requests faster.",
    path: "/admin/form-approval",
  },
  {
    title: "Approved Applications",
    description: "Update approved amounts and export clean reports in PDF.",
    path: "/admin/approved-applications",
  },
  {
    title: "Manage Funds",
    description: "Track installments, retiring members, and payment completion status.",
    path: "/admin/manage-funds",
  },
];

const formatJoinDate = (value) => {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const AdminProfile = () => {
  const navigate = useNavigate();
  const formType = localStorage.getItem("formType") || "welfare";
  const schemeTheme = getSchemeTheme(formType);
  const dashboardGradients = [
    schemeTheme.topbarBackground,
    "linear-gradient(135deg, #334155 0%, #64748b 100%)",
    "linear-gradient(135deg, #b45309 0%, #f59e0b 100%)",
  ];
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    retiringSoon: 0,
    fullyBenefited: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const hrmsNo = decoded.hrmsNo;

      const [profileResponse, statsResponse] = await Promise.all([
        axios.get(`https://rayat-backend.onrender.com/employees/get-emp-prf/${hrmsNo}`),
        axios.get("https://rayat-backend.onrender.com/employees/stats"),
      ]);

      setAdmin(profileResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      console.error("Failed to load admin dashboard", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = useMemo(
    () => [
      {
        title: "Total Users",
        value: stats.totalUsers,
        note: "Employees currently tracked in the system",
        icon: <FaUsers />,
      },
      {
        title: "Retiring in 60 Days",
        value: stats.retiringSoon,
        note: "Users who may need action soon",
        icon: <FaRegClock />,
      },
      {
        title: "Full Amount Paid Users",
        value: stats.fullyBenefited,
        note: "Users who have completed the full amount payment",
        icon: <FaClipboardCheck />,
      },
    ],
    [stats]
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!admin) {
    return (
      <Typography sx={{ p: 4, textAlign: "center" }}>
        Unable to load dashboard data.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100%",
        p: { xs: 2, md: 4 },
        background: schemeTheme.shellBackground,
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Card
          sx={{
            mb: 4,
            borderRadius: 5,
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
            background: schemeTheme.topbarBackground,
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 }, color: "#fff" }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} lg={8}>
                <Stack spacing={2}>
                  <Chip
                    label="Admin Control Center"
                    sx={{
                      alignSelf: "flex-start",
                      bgcolor: "rgba(255,255,255,0.14)",
                      color: "#fff",
                      fontWeight: 700,
                      borderRadius: 999,
                    }}
                  />
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      lineHeight: 1.15,
                      fontSize: { xs: "2rem", md: "2.8rem" },
                    }}
                  >
                    Welcome back, {admin.employeeName}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      maxWidth: 720,
                      color: "rgba(255,255,255,0.88)",
                      fontSize: { xs: "0.95rem", md: "1.05rem" },
                    }}
                  >
                    Monitor welfare operations, keep fund activity under control,
                    and move approvals forward from one clean professional dashboard.
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Card
                  sx={{
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    boxShadow: "none",
                    color: "#fff",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={1.5}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                        <FaUserShield />
                        <Typography sx={{ fontWeight: 700 }}>Admin Summary</Typography>
                      </Box>
                      <Typography><strong>HRMS:</strong> {admin.hrmsNo}</Typography>
                      <Typography><strong>Email:</strong> {admin.emailId || "-"}</Typography>
                      <Typography><strong>Branch:</strong> {admin.branchName || "-"}</Typography>
                      <Typography><strong>Role:</strong> {admin.role || "admin"}</Typography>
                      <Typography><strong>Joined:</strong> {formatJoinDate(admin.branchJoiningDate)}</Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((card, index) => (
            <Grid item xs={12} md={4} key={card.title}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  color: "#fff",
                  background: dashboardGradients[index],
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.1)",
                }}
              >
                <CardContent sx={{ p: 3.25 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography sx={{ opacity: 0.86, fontWeight: 600, mb: 1 }}>
                        {card.title}
                      </Typography>
                      <Typography sx={{ fontSize: "2.4rem", fontWeight: 800, lineHeight: 1 }}>
                        {card.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "rgba(255,255,255,0.16)",
                        fontSize: "1.1rem",
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Stack>
                  <Typography sx={{ mt: 2.2, opacity: 0.85, fontSize: "0.9rem" }}>
                    {card.note}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  {quickActions.map((action) => (
                    <Box
                      key={action.title}
                      sx={{
                        p: 2.2,
                        borderRadius: 3,
                        border: `1px solid ${schemeTheme.sidebarBorder}`,
                        background: schemeTheme.softBackground,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: 2,
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                          {action.title}
                        </Typography>
                        <Typography sx={{ color: "#64748b", fontSize: "0.93rem" }}>
                          {action.description}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => navigate(action.path)}
                        endIcon={<FaArrowRight />}
                        sx={{
                          whiteSpace: "nowrap",
                          borderRadius: 999,
                          px: 2.2,
                          bgcolor: schemeTheme.primary,
                          "&:hover": { bgcolor: schemeTheme.primary, filter: "brightness(0.92)" },
                        }}
                      >
                        Open
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>
                  Admin Snapshot
                </Typography>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      p: 2.2,
                      borderRadius: 3,
                      background: schemeTheme.softBackground,
                      border: `1px solid ${schemeTheme.softBorder}`,
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, color: schemeTheme.primary, mb: 0.5 }}>
                      User Base
                    </Typography>
                    <Typography sx={{ color: "#334155" }}>
                      {stats.totalUsers} employees are currently available for admin tracking and operations.
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 2.2,
                      borderRadius: 3,
                      background: "#fff7ed",
                      border: "1px solid #fed7aa",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, color: "#c2410c", mb: 0.5 }}>
                      Upcoming Attention
                    </Typography>
                    <Typography sx={{ color: "#334155" }}>
                      {stats.retiringSoon} users are retiring in the next 60 days and may need timely fund review.
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 2.2,
                      borderRadius: 3,
                      background: schemeTheme.softBackground,
                      border: `1px solid ${schemeTheme.softBorder}`,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <FaWallet color={schemeTheme.primary} />
                      <Typography sx={{ fontWeight: 700, color: schemeTheme.primary }}>
                        Full Amount Paid
                      </Typography>
                    </Box>
                    <Typography sx={{ color: "#334155" }}>
                      {stats.fullyBenefited} users have already completed the full amount payment tracked by the system.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminProfile;

