// import React from "react";
// import { Box, Card, CardContent, Typography, List, ListItem, ListItemButton, Divider, Grid } from "@mui/material";

// export const applicationHistoryDummy = [
//   {
//     id: "APP-001",
//     name: "Pradhan Mantri Awas Yojana (PMAY)",
//     date: "2025-01-05 • 11:20 AM",
//     status: "Approved",
//   },
//   {
//     id: "APP-002",
//     name: "Ayushman Bharat Health Card",
//     date: "2025-01-12 • 04:45 PM",
//     status: "Under Review",
//   },
//   {
//     id: "APP-003",
//     name: "PM Kisan Samman Nidhi",
//     date: "2025-01-18 • 09:10 AM",
//     status: "Pending Verification",
//   },
//   {
//     id: "APP-004",
//     name: "E-Shram Card Registration",
//     date: "2025-01-22 • 02:15 PM",
//     status: "Rejected",
//   },
//   {
//     id: "APP-005",
//     name: "Scholarship – National Means Merit Scheme",
//     date: "2025-01-28 • 01:05 PM",
//     status: "Approved",
//   }
// ];

// // props: applications, onSelect(id)
// export default function UserHistory({ applications = applicationHistoryDummy, onSelect }) {

//   // Generate Stats
//   const total = applications.length;
//   const approved = applications.filter(a => a.status === "Approved").length;
//   const rejected = applications.filter(a => a.status === "Rejected").length;
//   const pending = applications.filter(
//     a => a.status === "Under Review" || a.status === "Pending Verification"
//   ).length;

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         p: 2,
//         bgcolor: "#fff",
//         borderRadius: 2,
//         boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
//       }}
//     >
//       <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
//         Application History
//       </Typography>

//       {/* Stats Section */}
//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid item xs={3}>
//           <Card sx={{ p: 2, bgcolor: "rgba(7,170,23,0.06)", borderRadius: 2, textAlign: "center" }}>
//             <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Total</Typography>
//             <Typography sx={{ fontSize: 20, fontWeight: 700, color: "rgb(7,170,23)" }}>
//               {total}
//             </Typography>
//           </Card>
//         </Grid>

//         <Grid item xs={3}>
//           <Card sx={{ p: 2, bgcolor: "rgba(7,170,23,0.06)", borderRadius: 2, textAlign: "center" }}>
//             <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Approved</Typography>
//             <Typography sx={{ fontSize: 20, fontWeight: 700, color: "rgb(7,170,23)" }}>
//               {approved}
//             </Typography>
//           </Card>
//         </Grid>

//         <Grid item xs={3}>
//           <Card sx={{ p: 2, bgcolor: "rgba(7,170,23,0.06)", borderRadius: 2, textAlign: "center" }}>
//             <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Pending</Typography>
//             <Typography sx={{ fontSize: 20, fontWeight: 700, color: "rgb(255,152,0)" }}>
//               {pending}
//             </Typography>
//           </Card>
//         </Grid>

//         <Grid item xs={3}>
//           <Card sx={{ p: 2, bgcolor: "rgba(7,170,23,0.06)", borderRadius: 2, textAlign: "center" }}>
//             <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Rejected</Typography>
//             <Typography sx={{ fontSize: 20, fontWeight: 700, color: "rgb(211,47,47)" }}>
//               {rejected}
//             </Typography>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Application List */}
//       {applications.length === 0 ? (
//         <Typography>No previous applications found.</Typography>
//       ) : (
//         <List>
//           {applications.map((item) => (
//             <React.Fragment key={item.id}>
//               <ListItem disablePadding>
//                 <ListItemButton
//                   onClick={() => onSelect(item.id)}
//                   sx={{
//                     borderRadius: 2,
//                     px: 2,
//                     py: 1,
//                     "&:hover": { bgcolor: "rgba(7,170,23,0.06)" },
//                   }}
//                 >
//                   <Card
//                     sx={{
//                       width: "100%",
//                       borderRadius: 2,
//                       boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
//                     }}
//                   >
//                     <CardContent>
//                       <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
//                         {item.name}
//                       </Typography>

//                       <Typography sx={{ fontSize: 14, color: "#333", mt: 0.5 }}>
//                         Status: {item.status}
//                       </Typography>

//                       <Typography sx={{ fontSize: 12, color: "gray", mt: 1 }}>
//                         {item.date}
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </ListItemButton>
//               </ListItem>
//               <Divider sx={{ my: 1 }} />
//             </React.Fragment>
//           ))}
//         </List>
//       )}
//     </Box>
//   );
// }

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Grid,
} from "@mui/material";


export const applicationHistoryDummy = [
  {
    id: "APP-001",
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    date: "2025-01-05 • 11:20 AM",
    status: "Approved",
    amountApproved: 250000,
    amountReceived: 150000,
    amountPending: 100000,
  },
  {
    id: "APP-002",
    name: "Ayushman Bharat Health Card",
    date: "2025-01-12 • 04:45 PM",
    status: "Under Review",
    amountApproved: 50000,
    amountReceived: 0,
    amountPending: 50000,
  },
  {
    id: "APP-003",
    name: "PM Kisan Samman Nidhi",
    date: "2025-01-18 • 09:10 AM",
    status: "Pending Verification",
    amountApproved: 6000,
    amountReceived: 0,
    amountPending: 6000,
  },
  {
    id: "APP-004",
    name: "E-Shram Card Registration",
    date: "2025-01-22 • 02:15 PM",
    status: "Rejected",
    amountApproved: 0,
    amountReceived: 0,
    amountPending: 0,
  },
  {
    id: "APP-005",
    name: "Scholarship – National Means Merit Scheme",
    date: "2025-01-28 • 01:05 PM",
    status: "Approved",
    amountApproved: 12000,
    amountReceived: 12000,
    amountPending: 0,
  },
];

export default function UserHistory({
  applications = applicationHistoryDummy,
  onSelect,
}) {
  // Basic Counts
  const total = applications.length;
  const approved = applications.filter(a => a.status === "Approved").length;
  const rejected = applications.filter(a => a.status === "Rejected").length;
  const pending = applications.filter(
    a => a.status === "Under Review" || a.status === "Pending Verification"
  ).length;

  // Amount Stats
  const totalApprovedAmount = applications.reduce((sum, a) => a.amountApproved <= 100000 ? sum + a.amountApproved : 0, 0);
  const totalReceivedAmount = applications.reduce((sum, a) => a.amountApproved <= 100000 ? sum + a.amountReceived : 0, 0);
  const totalPendingAmount = applications.reduce((sum, a) => a.amountApproved <= 100000 ? sum + a.amountPending : 0, 0);

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        bgcolor: "#fff",
        borderRadius: 2,
        boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Application History
      </Typography>

      {/* AMOUNT STATS SECTION */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Card sx={{ p: 2, bgcolor: "#F1FFF4", borderRadius: 2, textAlign: "center" }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Approved Amount</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: "rgb(7,170,23)" }}>
              ₹ {totalApprovedAmount.toLocaleString()}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Card sx={{ p: 2, bgcolor: "#F1FFF4", borderRadius: 2, textAlign: "center" }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Received Amount</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: "rgb(33,150,243)" }}>
              ₹ {totalReceivedAmount.toLocaleString()}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Card sx={{ p: 2, bgcolor: "#FFF5F5", borderRadius: 2, textAlign: "center" }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Pending Amount</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: "rgb(211,47,47)" }}>
              ₹ {totalPendingAmount.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Application List */}
      <List>
        {applications.map((item) => {
          if (item.amountApproved <= 100000) {
            return (
              <React.Fragment key={item.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => onSelect && onSelect(item.id)}
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      "&:hover": { bgcolor: "rgba(7,170,23,0.06)" },
                    }}
                  >
                    <Card
                      sx={{
                        width: "100%",
                        borderRadius: 2,
                        boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <CardContent>
                        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                          {item.name}
                        </Typography>

                        <Typography sx={{ fontSize: 14, color: "#333", mt: 0.5 }}>
                          Status: {item.status}
                        </Typography>

                        <Typography sx={{ fontSize: 12, color: "gray", mt: 1 }}>
                          {item.date}
                        </Typography>

                        <Divider sx={{ my: 1 }} />

                        {/* Amounts */}
                        <Grid container>
                          <Grid item xs={4}>
                            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Approved:</Typography>
                            <Typography sx={{ fontSize: 13, color: "rgb(7,170,23)" }}>
                              ₹ {item.amountApproved.toLocaleString()}
                            </Typography>
                          </Grid>

                          <Grid item xs={4}>
                            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Received:</Typography>
                            <Typography sx={{ fontSize: 13, color: "rgb(33,150,243)" }}>
                              ₹ {item.amountReceived.toLocaleString()}
                            </Typography>
                          </Grid>

                          <Grid item xs={4}>
                            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Pending:</Typography>
                            <Typography sx={{ fontSize: 13, color: "rgb(211,47,47)" }}>
                              ₹ {item.amountPending.toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </ListItemButton>
                </ListItem>

                <Divider sx={{ my: 1 }} />
              </React.Fragment>
            )
          }
        })}
      </List>
    </Box>
  );
}
