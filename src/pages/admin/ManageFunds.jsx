import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const ManageFunds = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);   // ← fetched users
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [filterType, setFilterType] = useState("all");

  // -------------------------------
  // 🔹 FETCH USERS FROM BACKEND
  // -------------------------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/employees/get-all-emp");

        console.log("API RESPONSE:", res.data);

        // Extract array safely
        const data =
          Array.isArray(res.data)
            ? res.data
            : res.data?.employees ||
            res.data?.users ||
            res.data?.data ||
            [];

        const processed = data.map((u) => {
          const retirement = dayjs(u.retirementDate);
          const today = dayjs();

          return {
            ...u,
            retirementDateFormatted: retirement.format("DD/MM/YYYY"),
            status: retirement.isAfter(today) ? "Active" : "Retired",
          };
        });

        setUsers(processed);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  // -------------------------------
  // 🔹 Retiring in 60 Days Logic
  // -------------------------------
  const retiringIn60 = (date) => {
    const today = dayjs();
    const diff = dayjs(date).diff(today, "day");
    return diff >= 0 && diff <= 60;
  };

  // -------------------------------
  // 🔹 Search + Filter Logic
  // -------------------------------
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.employeeName || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      u.hrmsNo.includes(search);

    if (filterType === "all") return matchesSearch;

    if (filterType === "retiring")
      return matchesSearch && retiringIn60(u.retirementDate);

    if (filterType === "claimed")
      return matchesSearch && u.claimedFullAmount === 1;

    // ✅ Remaining people (NOT claimed full amount)
    if (filterType === "lowInstallment")
      return matchesSearch && u.claimedFullAmount === 0;

    return matchesSearch;
  });


  if (loading) {
    return (
      <Typography variant="h5" sx={{ textAlign: "center", mt: 5 }}>
        Loading users...
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 600, maxWidth: 1300, mx: "auto" }}
      >
        Manage Funds
      </Typography>

      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4, maxWidth: 1300, mx: "auto" }}>
        <CardContent>

          {/* 🔹 TOP FILTER BUTTONS */}
          {/* <ToggleButtonGroup
            value={filterType}
            exclusive
            onChange={(e, v) => v && setFilterType(v)}
            sx={{ mb: 3 }}
          >
            <ToggleButton value="all">All Users</ToggleButton>
            <ToggleButton value="retiring">Retiring in 60 Days</ToggleButton>
            <ToggleButton value="claimed">Claimed All Benefits</ToggleButton>
            <ToggleButton value="lowInstallment">Paid &lt; ₹5000</ToggleButton>
          </ToggleButtonGroup> */}
          <ToggleButtonGroup
            value={filterType}
            exclusive
            onChange={async (e, v) => {
              if (!v) return;

              setFilterType(v);
              setPage(0);

              // ✅ ONLY claimed filter hits API
              if (v === "claimed") {
                try {
                  setLoading(true);

                  const token = localStorage.getItem("token");

                  const res = await axios.get(
                    "http://localhost:3000/admin/funds-users?type=claimed",
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  const data = res.data?.users || [];

                  const processed = data.map((u) => ({
                    ...u,
                    retirementDateFormatted: u.retirementDate
                      ? dayjs(u.retirementDate).format("DD/MM/YYYY")
                      : "—",
                  }));

                  setUsers(processed);
                } catch (err) {
                  console.error("Error fetching claimed users:", err);
                } finally {
                  setLoading(false);
                }
              }

              // ✅ Paid < ₹5000 (Pending)
              if (v === "lowInstallment") {
                try {
                  setLoading(true);

                  const token = localStorage.getItem("token");

                  const res = await axios.get(
                    "http://localhost:3000/admin/funds-users?type=lowPaid",
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  const data = res.data?.users || [];

                  const processed = data.map((u) => ({
                    ...u,
                    retirementDateFormatted: u.retirementDate
                      ? dayjs(u.retirementDate).format("DD/MM/YYYY")
                      : "—",
                  }));

                  setUsers(processed);
                } catch (err) {
                  console.error("Error fetching pending users:", err);
                } finally {
                  setLoading(false);
                }
              }

              // ✅ When switching back to ALL users
              if (v === "all") {
                try {
                  setLoading(true);

                  const res = await axios.get(
                    "http://localhost:3000/employees/get-all-emp"
                  );

                  const data =
                    Array.isArray(res.data)
                      ? res.data
                      : res.data?.employees ||
                      res.data?.users ||
                      res.data?.data ||
                      [];

                  const processed = data.map((u) => ({
                    ...u,
                    retirementDateFormatted: u.retirementDate
                      ? dayjs(u.retirementDate).format("DD/MM/YYYY")
                      : "—",
                  }));

                  setUsers(processed);
                } catch (err) {
                  console.error("Error fetching all users:", err);
                } finally {
                  setLoading(false);
                }
              }
            }}
            sx={{ mb: 3 }}
          >
            <ToggleButton value="all">All Users</ToggleButton>
            <ToggleButton value="retiring">Retiring in 60 Days</ToggleButton>
            <ToggleButton value="claimed">Claimed All Benefits</ToggleButton>
            <ToggleButton value="lowInstallment">Paid &lt; ₹5000</ToggleButton>
          </ToggleButtonGroup>


          {/* 🔹 SEARCH BAR */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              label="Search by Name or HRMS No"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IconButton sx={{ background: "#16a34a", color: "white" }}>
              <FaSearch />
            </IconButton>
          </Box>

          {/* 🔹 USERS TABLE */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f3f4f6" }}>
                  <TableCell><b>HRMS No</b></TableCell>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Department</b></TableCell>
                  <TableCell><b>Phone Number</b></TableCell>
                  <TableCell><b>Retirement Date</b></TableCell>
                  <TableCell><b>Full Benefits?</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.hrmsNo}>
                      <TableCell>{user.hrmsNo}</TableCell>
                      <TableCell>{user.employeeName}</TableCell>
                      <TableCell>{user.branchName}</TableCell>
                      {/* New status based on retirement date */}
                      <TableCell>{user.mobileNo}</TableCell>
                      {/* Converted date */}
                      <TableCell>{user.retirementDateFormatted}</TableCell>
                      <TableCell>{user.claimedFullAmount ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          sx={{
                            background: "#2563eb",
                            "&:hover": { background: "#1d4ed8" },
                          }}
                          onClick={() =>
                            navigate(`/admin/view-profile`, { state: { user } })
                          }
                        >
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 🔹 Pagination */}
          <TablePagination
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ManageFunds;
