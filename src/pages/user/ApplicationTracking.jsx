import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Grid,
} from "@mui/material";

// Dummy Data
export const applicationHistoryDummy = [
  {
    id: "APP-001",
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    date: "2025-01-05 • 11:20 AM",
    status: "Approved",
  },
  {
    id: "APP-002",
    name: "Ayushman Bharat Health Card",
    date: "2025-01-12 • 04:45 PM",
    status: "Under Review",
  },
  {
    id: "APP-003",
    name: "PM Kisan Samman Nidhi",
    date: "2025-01-18 • 09:10 AM",
    status: "Pending Verification",
  },
  {
    id: "APP-004",
    name: "E-Shram Card Registration",
    date: "2025-01-22 • 02:15 PM",
    status: "Rejected",
  },
  {
    id: "APP-005",
    name: "Scholarship – National Means Merit Scheme",
    date: "2025-01-28 • 01:05 PM",
    status: "Approved",
  },
];

// Stats
const statsData = {
  totalApplications: 5,
  approved: 2,
  pending: 2,  
  rejected: 1
};

export default function ApplicationTracking({
  events = applicationHistoryDummy,
  stats = statsData,
  onClear,
}) {
  const { totalApplications, approved, pending, rejected } = stats;

  const getStatusColor = (status) => {
    if (status === "Approved") return "rgb(7,170,23)";
    if (status === "Rejected") return "rgb(211,47,47)";
    return "rgb(255,152,0)";
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
        bgcolor: "#fff",
        borderRadius: 3,
        boxShadow: "0px 3px 10px rgba(0,0,0,0.08)",
      }}
    >
      {/* Title */}
      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 700,
          mb: 3,
          color: "#333",
        }}
      >
        Application History
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: "Total", value: totalApplications, color: "rgb(7,170,23)" },
          { label: "Approved", value: approved, color: "rgb(7,170,23)" },
          { label: "Pending", value: pending, color: "rgb(255,152,0)" },
          { label: "Rejected", value: rejected, color: "rgb(211,47,47)" },
        ].map((stat, i) => (
          <Grid item xs={3} key={i}>
            <Card
              sx={{
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                bgcolor: "#f7fff9",
                border: "1px solid rgba(7,170,23,0.2)",
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#333" }}>
                {stat.label}
              </Typography>
              <Typography
                sx={{
                  mt: 1,
                  fontSize: 22,
                  fontWeight: 700,
                  color: stat.color,
                }}
              >
                {stat.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Timeline Section */}
      <Box sx={{ width: "100%", mt: 1 }}>
        {events.map((item, index) => (
          <Box key={item.id} sx={{ display: "flex", mb: 3 }}>
            
            {/* Dot + Connector */}
            <Box
              sx={{
                width: "30px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pt: 1,
              }}
            >
              {/* Dot */}
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: getStatusColor(item.status),
                }}
              />

              {/* Connector Line */}
              {index !== events.length - 1 && (
                <Box
                  sx={{
                    width: "2px",
                    flex: 1,
                    bgcolor: "rgba(0,0,0,0.2)",
                    mt: 0.5,
                  }}
                />
              )}
            </Box>

            {/* Card Content */}
            <Card
              sx={{
                flex: 1,
                borderRadius: 2,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                borderLeft: "4px solid " + getStatusColor(item.status),
              }}
            >
              <CardContent>
                <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                  {item.name}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    mt: 0.5,
                    color: getStatusColor(item.status),
                    fontWeight: 600,
                  }}
                >
                  {item.status}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Typography sx={{ fontSize: 12, color: "gray" }}>
                  {item.date}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Clear Button */}
      {events.length > 0 && (
        <Button
          variant="outlined"
          color="error"
          sx={{ borderRadius: 2, mt: 2 }}
          onClick={onClear}
        >
          Clear History
        </Button>
      )}
    </Box>
  );
}
