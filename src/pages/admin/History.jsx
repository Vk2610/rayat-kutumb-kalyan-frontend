
import { useState } from 'react';
import { TextField, Box, Typography, Card, Button, Stack, Pagination, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect } from 'react';
import axios from 'axios';

const History = () => {
  const [isLoading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalForms, setTotalForms] = useState(0);
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    setSearchQuery(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchQuery('');
  };

  const handlePageChange = (pg) => {
    console.log(pg);
    if (forms.length === 0 && page < pg) {
      return;
    }
    setPage(pg);
  }

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/get-users", {
        params: { page, limit, search: searchQuery }
      });

      setUsers(res.data.users?.users || []);
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
    <>
      <Box sx={{ p: 3 }}>
        <Box display="flex" gap={1}>
          <TextField
            variant="outlined"
            placeholder="Search by username or HMRS no"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearchClick(); }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleSearchClick}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ClearIcon />}
            onClick={handleClear}
          >
            Clear
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {
          isLoading
            ? <CircularProgress />
            : <></>
        }
        {
          users.length !== 0
            ? users.map((user) => (
              <Card key={user.hrmsNo} sx={{ mt: 1.5, mb: 1.5, borderRadius: 2, boxShadow: 3, p: 2 }}>
                <Stack spacing={1}>
                  <Typography variant="h6" color="text.primary">
                    Username: {user.applicantName}
                  </Typography>
                  <Typography variant="subtitle" color="text.secondary">
                    HMRS No: {user.hrmsNo}
                  </Typography>
                  <Button sx={{ maxWidth: 200 }} variant="contained" onClick={() => navigate("/admin/form-history", {
                    state: {
                      username: user.applicantName,
                      hrmsNo: user.hrmsNo
                    }
                  })}>
                    Click
                  </Button>
                </Stack>
              </Card>
            ))
            : <Typography>No users found.</Typography>
        }
      </Box>
      <Box display={"flex"} justifyContent={"center"} >
        <Pagination
          count={Math.ceil(totalForms / limit)}
          page={page}
          onChange={(event, value) => handlePageChange(value)}
          color="primary"
          sx={{ mt: 2 }}
        />
      </Box>
    </>
  );
};

export default History;