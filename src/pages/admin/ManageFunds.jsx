import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  ToggleButtonGroup,
} from '@mui/material';
import { FaSearch, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { getSchemeTheme } from '../../utils/schemeTheme';

const ManageFunds = () => {
  const navigate = useNavigate();
  const formType = localStorage.getItem('formType') || 'welfare';
  const schemeTheme = getSchemeTheme(formType);

  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [filterType, setFilterType] = useState('all');

  const processUsers = (data) =>
    data.map((u) => {
      const retirement = dayjs(u.retirementDate);
      const today = dayjs();

      return {
        ...u,
        retirementDateFormatted: u.retirementDate
          ? retirement.format('DD/MM/YYYY')
          : '—',
        status:
          retirement.isValid() && retirement.isAfter(today)
            ? 'Active'
            : 'Retired',
      };
    });

  const fetchAllUsers = async () => {
    const res = await axios.get('http://localhost:3000/employees/get-all-emp');

    const data = Array.isArray(res.data)
      ? res.data
      : res.data?.employees || res.data?.users || res.data?.data || [];

    const processed = processUsers(data);
    setAllUsers(processed);
    setUsers(processed);
  };

  // -------------------------------
  // 🔹 FETCH USERS FROM BACKEND
  // -------------------------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await fetchAllUsers();
      } catch (err) {
        console.error('Error fetching users:', err);
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
    const diff = dayjs(date).diff(today, 'day');
    return diff >= 0 && diff <= 60;
  };

  // -------------------------------
  // 🔹 EXPORT LOGIC
  // -------------------------------
  const handleExportPDF = () => {
    const retiringUsers = filteredUsers;
    if (retiringUsers.length === 0) {
      alert('No users to export.');
      return;
    }

    const doc = new jsPDF();
    doc.text('Retiring Employees', 14, 15);

    const tableColumn = [
      'HRMS No',
      'Name',
      'Department',
      'Phone',
      'Retirement Date',
      'Full Amount Paid',
    ];
    const tableRows = [];

    retiringUsers.forEach((user) => {
      const userData = [
        user.hrmsNo,
        user.employeeName,
        user.branchName,
        user.mobileNo,
        user.retirementDateFormatted,
        user.claimedFullAmount ? 'Yes' : 'No',
      ];
      tableRows.push(userData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('Retiring_Employees.pdf');
  };

  const handleExportExcel = () => {
    const retiringUsers = filteredUsers;
    if (retiringUsers.length === 0) {
      alert('No users to export.');
      return;
    }

    const exportData = retiringUsers.map((user) => ({
      'HRMS No': user.hrmsNo,
      Name: user.employeeName,
      Department: user.branchName,
      'Phone Number': user.mobileNo,
      'Retirement Date': user.retirementDateFormatted,
      'Full Amount Paid': user.claimedFullAmount ? 'Yes' : 'No',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Retiring Users');

    XLSX.writeFile(workbook, 'Retiring_Employees.xlsx');
  };

  // -------------------------------
  // 🔹 Search + Filter Logic
  // -------------------------------

  const sourceUsers =
    filterType === 'claimed' ||
    filterType === 'lowInstallment' ||
    filterType === 'retiredUsers'
      ? users
      : allUsers;

  const filteredUsers = sourceUsers.filter((u) => {
    const matchesSearch =
      (u.employeeName || '').toLowerCase().includes(search.toLowerCase()) ||
      u.hrmsNo.includes(search);

    if (
      filterType === 'all' ||
      filterType === 'claimed' ||
      filterType === 'lowInstallment'
    )
      return matchesSearch;

    if (filterType === 'retiring')
      return matchesSearch && retiringIn60(u.retirementDate);

    if (filterType === 'retiredUsers')
      return matchesSearch && u.status === 'Retired';

    return matchesSearch;
  });

  if (loading) {
    return (
      <Typography variant="h5" sx={{ textAlign: 'center', mt: 5 }}>
        Loading users...
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 600, maxWidth: 1300, mx: 'auto' }}
      >
        Manage Funds
      </Typography>

      <Card
        sx={{ p: 3, borderRadius: 3, boxShadow: 4, maxWidth: 1300, mx: 'auto' }}
      >
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
              if (v === 'claimed') {
                try {
                  setLoading(true);
                  const token = localStorage.getItem('token');
                  const res = await axios.get(
                    'http://localhost:3000/admin/funds-users?type=claimed',
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  );
                  const data = res.data?.users || [];
                  setUsers(processUsers(data));
                } catch (err) {
                  console.error('Error fetching claimed users:', err);
                } finally {
                  setLoading(false);
                }
              }

              // ✅ Paid < ₹5000 (Pending)
              if (v === 'lowInstallment') {
                try {
                  setLoading(true);
                  const token = localStorage.getItem('token');
                  const res = await axios.get(
                    'http://localhost:3000/admin/funds-users?type=lowPaid',
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  );
                  const data = res.data?.users || [];
                  setUsers(processUsers(data));
                } catch (err) {
                  console.error('Error fetching lowPaid users:', err);
                } finally {
                  setLoading(false);
                }
              }

              // ✅ Retired Users (local filter)
              if (v === 'retiredUsers') {
                // No API call needed, just filter locally
                setUsers(processUsers(allUsers));
              }

              // ✅ When switching back to ALL users
              if (v === 'all') {
                try {
                  setLoading(true);
                  await fetchAllUsers();
                } catch (err) {
                  console.error('Error fetching all users:', err);
                } finally {
                  setLoading(false);
                }
              }
            }}
            sx={{ mb: 3 }}
          >
            <ToggleButton value="all">All Users</ToggleButton>
            <ToggleButton value="retiring">Retiring in 60 Days</ToggleButton>
            <ToggleButton value="claimed">Fully Paid</ToggleButton>
            <ToggleButton value="lowInstallment">Paid &lt; ₹5000</ToggleButton>
            <ToggleButton value="retiredUsers">Retired Users</ToggleButton>
          </ToggleButtonGroup>

          {/* 🔹 SEARCH BAR */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 3,
              flexWrap: 'wrap',
            }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}
            >
              <TextField
                fullWidth
                label="Search by Name or HRMS No"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <IconButton
                sx={{
                  background: schemeTheme.primary,
                  color: 'white',
                  '&:hover': {
                    background: schemeTheme.primary,
                    filter: 'brightness(0.92)',
                  },
                }}
              >
                <FaSearch />
              </IconButton>
            </Box>

            {filterType === 'retiring' && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<FaFilePdf />}
                  onClick={handleExportPDF}
                  sx={{
                    background: '#dc2626',
                    '&:hover': { background: '#b91c1c' },
                  }}
                >
                  Export PDF
                </Button>
                <Button
                  variant="contained"
                  startIcon={<FaFileExcel />}
                  onClick={handleExportExcel}
                  sx={{
                    background: '#16a34a',
                    '&:hover': { background: '#15803d' },
                  }}
                >
                  Export Excel
                </Button>
              </Box>
            )}
          </Box>

          {/* 🔹 USERS TABLE */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#f3f4f6' }}>
                  <TableCell>
                    <b>HRMS No</b>
                  </TableCell>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Department</b>
                  </TableCell>
                  <TableCell>
                    <b>Phone Number</b>
                  </TableCell>
                  <TableCell>
                    <b>Retirement Date</b>
                  </TableCell>
                  <TableCell>
                    <b>Full Amount Paid</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
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
                      <TableCell>
                        {user.claimedFullAmount ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          sx={{
                            background: schemeTheme.primary,
                            '&:hover': {
                              background: schemeTheme.primary,
                              filter: 'brightness(0.92)',
                            },
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
