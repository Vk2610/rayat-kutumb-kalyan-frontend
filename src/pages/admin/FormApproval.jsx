import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Box,
    Button,
    CircularProgress,
    InputAdornment,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaInbox, FaSearch } from "react-icons/fa";
import { deleteFormEntry, updateFormStatus } from "../../services/form_services";

function FormApproval() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
    const [forms, setForms] = useState([]);
    const [allForms, setAllForms] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalForms, setTotalForms] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    const isSearchActive = trimmedSearchTerm.length > 0;

    const fetchPaginatedForms = async (currentPage) => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/admin/get-all-forms", {
                params: { page: currentPage, limit }
            });

            const data = response.data;
            setForms(data.forms.forms || []);
            setTotalForms(data.forms.total || 0);
        } catch (error) {
            console.error("Error fetching forms: ", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllForms = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/admin/get-all-forms", {
                params: {
                    page: 1,
                    limit: totalForms || 1000,
                }
            });

            const data = response.data;
            const fetchedForms = data.forms.forms || [];
            setAllForms(fetchedForms);
            setTotalForms(data.forms.total || fetchedForms.length);
        } catch (error) {
            console.error("Error fetching forms for search: ", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredForms = useMemo(() => {
        if (!isSearchActive) {
            return [];
        }

        return allForms.filter((form) => {
            const searchableValues = [
                form.applicantName,
                form.patientName,
                form.requestId,
                form.hrmsNo,
                form.branchName,
                form.illnessNature,
                form.relation,
            ];

            return searchableValues.some((value) =>
                String(value || "").toLowerCase().includes(trimmedSearchTerm)
            );
        });
    }, [allForms, isSearchActive, trimmedSearchTerm]);

    const displayedForms = useMemo(() => {
        if (!isSearchActive) {
            return forms;
        }

        const startIndex = (page - 1) * limit;
        return filteredForms.slice(startIndex, startIndex + limit);
    }, [filteredForms, forms, isSearchActive, limit, page]);

    const totalPages = useMemo(() => {
        if (isSearchActive) {
            return Math.max(1, Math.ceil(filteredForms.length / limit));
        }

        return Math.max(1, Math.ceil(totalForms / limit));
    }, [filteredForms.length, isSearchActive, limit, totalForms]);

    const handleRefresh = async () => {
        if (isSearchActive) {
            await fetchAllForms();
            return;
        }

        await fetchPaginatedForms(page);
    };

    const handleStatusChange = async (status, requestId) => {
        const isUpdated = await updateFormStatus(status, requestId);
        if (isUpdated) {
            await handleRefresh();
        }
    };

    const handleDelete = async (requestId) => {
        const shouldDelete = window.confirm(
            "Are you sure you want to delete this form entry? This action will remove it from admin and user history."
        );

        if (!shouldDelete) {
            return;
        }

        try {
            await deleteFormEntry(requestId);
            setForms((currentForms) => currentForms.filter((form) => form.requestId !== requestId));
            setAllForms((currentForms) => currentForms.filter((form) => form.requestId !== requestId));
            setTotalForms((currentTotal) => Math.max(0, currentTotal - 1));
        } catch (error) {
            console.error("Error deleting form entry:", error);
            alert("Failed to delete form entry");
        }
    };

    const handlePageChange = (_, value) => {
        setPage(value);
    };

    useEffect(() => {
        if (isSearchActive) {
            fetchAllForms();
            return;
        }

        fetchPaginatedForms(page);
    }, [isSearchActive, page]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    return (
        <Box sx={{ px: { xs: 1, sm: 2 }, py: 2 }}>
            <Box
                sx={{
                    mb: 3,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "center" },
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                        Pending Form Approvals
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, color: "#64748b" }}>
                        Review, search, and take action on pending welfare applications.
                    </Typography>
                </Box>

                <TextField
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by applicant, patient, HRMS no, branch..."
                    size="small"
                    sx={{
                        minWidth: { xs: "100%", sm: 340 },
                        backgroundColor: "#fff",
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FaSearch style={{ color: "#64748b" }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {isLoading ? (
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress />
                </Box>
            ) : displayedForms.length !== 0 ? (
                <>
                    <TableContainer
                        component={Paper}
                        sx={{
                            borderRadius: 3,
                            boxShadow: "0 8px 30px rgba(15, 23, 42, 0.08)",
                            overflow: "hidden",
                        }}
                    >
                        <Table>
                            <TableHead sx={{ backgroundColor: "#f8fafc" }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Applicant</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Patient</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Relation</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Disease</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Form Date</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Requested Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 700, minWidth: 260 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedForms.map((form) => (
                                    <TableRow
                                        key={form.requestId}
                                        hover
                                        sx={{
                                            "&:last-child td, &:last-child th": { border: 0 },
                                        }}
                                    >
                                        <TableCell>
                                            <Typography sx={{ fontWeight: 600, color: "#0f172a" }}>
                                                {form.applicantName || "-"}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#64748b" }}>
                                                {form.hrmsNo || form.requestId}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{form.patientName || "-"}</TableCell>
                                        <TableCell>{form.relation || "-"}</TableCell>
                                        <TableCell>{form.illnessNature || "-"}</TableCell>
                                        <TableCell>{form.formDate || "-"}</TableCell>
                                        <TableCell>{form.requestedAmountNumbers || "-"}</TableCell>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 1,
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() => handleStatusChange("Approved", form.requestId)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleStatusChange("Rejected", form.requestId)}
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() =>
                                                        navigate("/admin/form-approval-details", {
                                                            state: {
                                                                requestId: form.requestId,
                                                                form,
                                                                returnTo: "/admin/form-approval",
                                                            }
                                                        })
                                                    }
                                                >
                                                    Show Details
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDelete(form.requestId)}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box
                        sx={{
                            mt: 2,
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                            {isSearchActive
                                ? `Showing ${displayedForms.length} of ${filteredForms.length} matching applications`
                                : `Showing page ${page} of ${totalPages} pending applications`}
                        </Typography>

                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </>
            ) : (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ mt: 10, mb: 10 }}>
                    <FaInbox size={80} color="#cbd5e1" />
                    <Typography variant="h5" sx={{ mt: 2, fontWeight: 600, color: "#64748b" }}>
                        {isSearchActive ? "No Matching Applications" : "No Pending Applications"}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, color: "#94a3b8", textAlign: "center" }}>
                        {isSearchActive
                            ? "Try a different search term to find the application you are looking for."
                            : "There are currently no welfare forms waiting for your approval."}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default FormApproval;
