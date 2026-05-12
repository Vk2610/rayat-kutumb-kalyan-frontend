import { useState } from 'react';
import {
  TextField,
  Box,
  Typography,
  Card,
  Button,
  Stack,
  Pagination,
  CircularProgress,
  InputAdornment,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect } from 'react';
import axios from 'axios';
import { getSchemeTheme } from '../../utils/schemeTheme';

const History = () => {
  const [isLoading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalForms, setTotalForms] = useState(0);
  const navigate = useNavigate();
  const formType = localStorage.getItem('formType') || 'welfare';
  const schemeTheme = getSchemeTheme(formType);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    setSearchQuery(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchQuery('');
    setPage(1);
  };

  const handlePageChange = (pg) => {
    if (users.length === 0 && page < pg) {
      return;
    }
    setPage(pg);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://rayat-backend-1.onrender.com/admin/get-users", {
        params: { page, limit, search: searchQuery }
      });

      setUsers(res.data.users?.users || []);
      setTotalForms(res.data.users?.total || 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert('Failed fetching users');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, page]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
          border: `1px solid ${schemeTheme.panelBorder}`,
          background: 'rgba(255,255,255,0.92)',
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 24, md: 30 },
            fontWeight: 800,
            color: '#0f172a',
            mb: 1,
          }}
        >
          Application History
        </Typography>
        <Typography sx={{ color: '#64748b', mb: 3 }}>
          Search employees and open their welfare application history with one click.
        </Typography>

        <Box
          display="flex"
          gap={1.5}
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <TextField
            variant="outlined"
            placeholder="Search by username or HRMS no"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            size="medium"
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearchClick(); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: schemeTheme.primary }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#fff',
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearchClick}
            sx={{
              minWidth: 140,
              height: 56,
              borderRadius: 3,
              fontWeight: 700,
              backgroundColor: schemeTheme.primary,
              '&:hover': {
                backgroundColor: schemeTheme.primary,
                filter: 'brightness(0.92)',
              },
            }}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClear}
            sx={{
              minWidth: 120,
              height: 56,
              borderRadius: 3,
              fontWeight: 700,
              borderColor: schemeTheme.softBorder,
              color: schemeTheme.primary,
              backgroundColor: schemeTheme.softBackground,
              '&:hover': {
                borderColor: schemeTheme.primary,
                backgroundColor: schemeTheme.softBackground,
              },
            }}
          >
            Clear
          </Button>
        </Box>
      </Paper>

      <Box sx={{ px: { xs: 0, md: 1 } }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : users.length !== 0 ? (
          <Stack spacing={2}>
            {users.map((user) => (
              <Card
                key={user.hrmsNo}
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 12px 28px rgba(15, 23, 42, 0.07)',
                  p: 2.5,
                  border: `1px solid ${schemeTheme.panelBorder}`,
                  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  flexDirection={{ xs: 'column', md: 'row' }}
                  gap={2}
                >
                  <Stack spacing={0.6}>
                    <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 700 }}>
                      {user.applicantName}
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.95rem' }}>
                      HRMS No: {user.hrmsNo}
                    </Typography>
                  </Stack>

                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate("/admin/form-history", {
                        state: {
                          username: user.applicantName,
                          hrmsNo: user.hrmsNo,
                        },
                      })
                    }
                    sx={{
                      minWidth: 190,
                      borderRadius: 999,
                      px: 2.5,
                      py: 1.1,
                      fontWeight: 700,
                      backgroundColor: schemeTheme.primary,
                      '&:hover': {
                        backgroundColor: schemeTheme.primary,
                        filter: 'brightness(0.92)',
                      },
                    }}
                  >
                    View Application History
                  </Button>
                </Box>
              </Card>
            ))}
          </Stack>
        ) : (
          <Paper
            sx={{
              p: 5,
              textAlign: 'center',
              borderRadius: 4,
              border: `1px solid ${schemeTheme.panelBorder}`,
              background: '#fff',
            }}
          >
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#0f172a', mb: 1 }}>
              No users found
            </Typography>
            <Typography sx={{ color: '#64748b' }}>
              Try searching with a different username or HRMS number.
            </Typography>
          </Paper>
        )}
      </Box>

      <Box display={"flex"} justifyContent={"center"}>
        <Pagination
          count={Math.ceil(totalForms / limit)}
          page={page}
          onChange={(event, value) => handlePageChange(value)}
          color="primary"
          sx={{
            mt: 3,
            '& .MuiPaginationItem-root.Mui-selected': {
              backgroundColor: schemeTheme.primary,
              color: '#fff',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default History;

