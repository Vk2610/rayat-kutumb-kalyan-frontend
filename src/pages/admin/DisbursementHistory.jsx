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
  Dialog,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { getSchemeTheme } from '../../utils/schemeTheme';
import RayatBill from '../../components/RayatBill';

const DisbursementHistory = () => {
  const formType = localStorage.getItem('formType') || 'rkky';
  const schemeTheme = getSchemeTheme(formType);

  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search State
  const [search, setSearch] = useState('');

  // Bill Dialog State
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Backend expects 1-indexed page
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/disbursement-history?page=${page + 1}&limit=${rowsPerPage}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data?.users || []);
      setTotalCount(res.data?.total || 0);
    } catch (err) {
      console.error('Error fetching disbursement history:', err);
      toast.error('Failed to fetch disbursement history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, py: 3, overflowX: 'hidden' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, maxWidth: 1300, mx: 'auto' }}>
        Disbursement History
      </Typography>

      <Card sx={{ p: { xs: 1, sm: 2 }, borderRadius: 3, boxShadow: 4, maxWidth: 1300, mx: 'auto', overflowX: 'hidden' }}>
        <CardContent sx={{ p: { xs: 1, sm: 2 }, '&:last-child': { pb: 2 } }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Claimed Benefits History
          </Typography>

          {/* Search Bar */}
          <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, maxWidth: '400px' }}>
            <TextField
              fullWidth
              label="Search by Name or HRMS No"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
            />
            <IconButton
              type="submit"
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

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 3, gap: 2, mb: 2 }}>
              <CircularProgress size={30} sx={{ color: schemeTheme.primary }} />
              <Typography variant="body1" color="text.secondary">Fetching history...</Typography>
            </Box>
          )}

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
                  <TableCell sx={{ whiteSpace: 'nowrap', width: '12%' }}><b>Scheme Type</b></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', width: '10%' }}><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  Array.from(new Array(5)).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell><Skeleton variant="text" width="40%" /></TableCell>
                      <TableCell><Skeleton variant="text" width="70%" /></TableCell>
                      <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                      <TableCell><Skeleton variant="text" width="70%" /></TableCell>
                      <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                      <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                      <TableCell><Skeleton variant="text" width="50%" /></TableCell>
                      <TableCell><Skeleton variant="rectangular" width={80} height={30} sx={{ borderRadius: 1 }} /></TableCell>
                    </TableRow>
                  ))
                ) : users.length > 0 ? (
                  users.map((user, index) => {
                    const joinDateStr = user.joiningDate ? dayjs(user.joiningDate).format('DD/MM/YYYY') : '—';
                    const retDateStr = user.retirementDate ? dayjs(user.retirementDate).format('DD/MM/YYYY') : '—';

                    return (
                      <TableRow key={user.hrmsNo} hover>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{user.hrmsNo}</TableCell>
                        <TableCell>{user.employeeName}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{user.mobileNo}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{joinDateStr}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{retDateStr}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{user.schemeType}</TableCell>
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
                    <TableCell colSpan={8} align="center" sx={{ py: 4, fontWeight: 'medium', color: 'text.secondary' }}>
                      There are no users claimed amount yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {!loading && users.length > 0 && (
            <TablePagination
              component="div"
              count={totalCount}
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
              meetingDate: selectedUser.meetingDate || '—',
              checkNo: selectedUser.checkNo || '—',
              joining: selectedUser.joiningDate,
              installment1Date: selectedUser.installment1Date,
              retirement: selectedUser.retirementDate,
              fund: selectedUser.totalPaid,
            }}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default DisbursementHistory;
