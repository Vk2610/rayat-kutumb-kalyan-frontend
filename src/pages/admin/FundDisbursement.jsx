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
  Grid,
  Dialog,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { getSchemeTheme } from '../../utils/schemeTheme';
import RayatBill from '../../components/RayatBill';

const FundDisbursement = () => {
  const formType = localStorage.getItem('formType') || 'rkky';
  const schemeTheme = getSchemeTheme(formType);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search and Filter State
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Bill Dialog State
  const [selectedUser, setSelectedUser] = useState(null);

  // Form State
  const [meetingNo, setMeetingNo] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [chequeNo, setChequeNo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getYears = (start, end) => {
    try {
      if (!start || !end) return 0;
      const s = new Date(start);
      const e = new Date(end);
      if (isNaN(s) || isNaN(e)) return 0;
      return Math.max(0, (e - s) / (1000 * 60 * 60 * 24 * 365.25));
    } catch { return 0; }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://rayat-backend-1.onrender.com/admin/fund-disbursement-users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const rawUsers = res.data?.users || [];
      const computedUsers = rawUsers.map(u => {
        let bonus = 0;
        let fund = Number(u.totalPaid) || 0;
        if (u.schemeType === "Old Scheme" && fund >= 1200) bonus = 1200;
        if (u.schemeType === "New Scheme" && fund >= 5000) {
          const y = getYears(u.installment1Date || u.joiningDate, u.retirementDate);
          if (y >= 15) bonus = 5000;
          else if (y >= 10) bonus = 3000;
          else if (y >= 5) bonus = 2000;
        }
        return { ...u, computedBonus: bonus, computedTotal: fund + bonus, fund };
      });

      setUsers(computedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to fetch fund disbursement users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!meetingNo || !meetingDate || !chequeNo) {
      toast.warning('Please fill all the form fields.');
      return;
    }

    if (users.length === 0) {
      toast.warning('No users available for disbursement.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        meetingNo,
        meetingDate,
        chequeNo,
        usersData: users.map((u) => ({ hrmsNo: u.hrmsNo, totalPayableAmt: u.computedTotal, bonus: u.computedBonus })),
      };

      const res = await axios.post('https://rayat-backend-1.onrender.com/admin/approve-fund-disbursement', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Fund disbursement approved successfully.');
        setMeetingNo('');
        setMeetingDate('');
        setChequeNo('');
        fetchUsers(); // Refresh the list
      } else {
        toast.error(res.data.message || 'Failed to approve fund disbursement.');
      }
    } catch (err) {
      console.error('Error approving disbursement:', err);
      toast.error(err.response?.data?.message || 'Error occurred while approving disbursement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.employeeName || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.hrmsNo || '').toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'all') return true;

    const retirement = dayjs(u.retirementDate);
    const today = dayjs();

    if (filterType === '3months') {
      const diffDays = today.diff(retirement, 'day');
      return diffDays > 0 && diffDays <= 90;
    }

    if (filterType === '60days') {
      const diffDays = retirement.diff(today, 'day');
      return diffDays >= 0 && diffDays <= 60;
    }

    if (filterType === 'recentUnclaimed') {
      return retirement.isBefore(today) || retirement.isSame(today, 'day');
    }

    return true;
  });

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, py: 3, overflowX: 'hidden' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, maxWidth: 1300, mx: 'auto' }}>
        Fund Disbursement
      </Typography>

      <Card sx={{ p: { xs: 1, sm: 2 }, borderRadius: 3, boxShadow: 4, maxWidth: 1300, mx: 'auto', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Approve Disbursement
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                <TextField
                  fullWidth
                  label="Meeting No."
                  value={meetingNo}
                  onChange={(e) => setMeetingNo(e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                <TextField
                  fullWidth
                  label="Meeting Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                <TextField
                  fullWidth
                  label="Cheque Number"
                  value={chequeNo}
                  onChange={(e) => setChequeNo(e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={submitting || users.length === 0}
                  sx={{
                    height: '56px',
                    background: schemeTheme.primary,
                    '&:hover': {
                      background: schemeTheme.primary,
                      filter: 'brightness(0.92)',
                    },
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Approval'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Card sx={{ p: { xs: 1, sm: 2 }, borderRadius: 3, boxShadow: 4, maxWidth: 1300, mx: 'auto', overflowX: 'hidden' }}>
        <CardContent sx={{ p: { xs: 1, sm: 2 }, '&:last-child': { pb: 2 } }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Retired Users Awaiting Benefits ({filteredUsers.length})
          </Typography>

          {/* Filters & Search */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
            <ToggleButtonGroup
              value={filterType}
              exclusive
              onChange={(e, v) => {
                if (v) {
                  setFilterType(v);
                  setPage(0);
                }
              }}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.75,
                '& .MuiToggleButton-root': {
                  px: { xs: 1, sm: 1.5 },
                  py: 0.75,
                  fontSize: { xs: '0.72rem', sm: '0.78rem' },
                  lineHeight: 1.15,
                  whiteSpace: 'normal',
                },
              }}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="3months">3 Months Ago</ToggleButton>
              <ToggleButton value="60days">In 60 Days</ToggleButton>
              <ToggleButton value="recentUnclaimed">Recent Unclaimed</ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: '1 1 260px', maxWidth: { sm: '400px' } }}>
              <TextField
                fullWidth
                label="Search by Name or HRMS No"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                size="small"
              />
              <IconButton
                sx={{
                  background: schemeTheme.primary,
                  color: 'white',
                  borderRadius: 1,
                  height: '40px',
                  width: '40px',
                  '&:hover': {
                    background: schemeTheme.primary,
                    filter: 'brightness(0.92)',
                  },
                }}
              >
                <FaSearch />
              </IconButton>
            </Box>
          </Box>

          {loading ? (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
              Loading users...
            </Typography>
          ) : (
            <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
              <Table
                size="small"
                sx={{
                  minWidth: 1000,
                  '& .MuiTableCell-root': {
                    px: { xs: 1, sm: 1.5 },
                    py: 1.5,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    lineHeight: 1.25,
                  },
                }}
              >
                <TableHead>
                  <TableRow sx={{ background: '#f3f4f6' }}>
                    <TableCell sx={{ whiteSpace: 'nowrap', width: '5%' }}><b>Sr.No</b></TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}><b>HRMS No</b></TableCell>
                    <TableCell sx={{ minWidth: 150 }}><b>Name</b></TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', width: '12%' }}><b>Mobile No</b></TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', width: '12%' }}><b>Joining Date</b></TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', width: '12%' }}><b>Retirement Date</b></TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', width: '12%' }}><b>SchemeType</b></TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', width: '12%' }}><b>Total Amount</b></TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}><b>Actions</b></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => {
                      const joinDateStr = user.joiningDate ? dayjs(user.joiningDate).format('DD/MM/YYYY') : 'â€”';
                      const retDateStr = user.retirementDate ? dayjs(user.retirementDate).format('DD/MM/YYYY') : 'â€”';

                      return (
                        <TableRow key={user.hrmsNo} hover>
                          <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>{user.hrmsNo}</TableCell>
                          <TableCell>{user.employeeName}</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>{user.mobileNo}</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>{joinDateStr}</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>{retDateStr}</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>{user.schemeType}</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>â‚¹{user.computedTotal}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{
                                color: schemeTheme.primary,
                                borderColor: schemeTheme.primary,
                                '&:hover': {
                                  background: 'rgba(0,0,0,0.04)',
                                  borderColor: schemeTheme.primary,
                                },
                              }}
                              onClick={() => handleViewDetails(user)}
                            >
                              View Bill
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                        No retired users found awaiting benefits.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!loading && filteredUsers.length > 0 && (
            <TablePagination
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50]}
            />
          )}
        </CardContent>
      </Card>

      {/* Bill Dialog */}
      <Dialog
        fullScreen
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
      >
        {selectedUser && (
          <RayatBill
            data={{
              name: selectedUser.employeeName,
              hrms: selectedUser.hrmsNo,
              scheme: selectedUser.schemeType,
              mobile: selectedUser.mobileNo,
              meetingDate: meetingDate || 'â€”',
              checkNo: chequeNo || 'â€”',
              joining: selectedUser.joiningDate,
              installment1Date: selectedUser.installment1Date,
              retirement: selectedUser.retirementDate,
              fund: selectedUser.fund,
            }}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default FundDisbursement;

