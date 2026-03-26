import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Grid,
    Divider,
    Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { updateFormStatus } from "../services/form_services";

export default function FormApprovalCard({ requestId, username, formDate, disease, patientName, relation, requestedAmount }) {

    const navigate = useNavigate();

    const handleApprove = async () => {
        const res = await updateFormStatus('Approved', requestId);
        if (res) navigate('/admin', {
            replace: true
        });
    }

    const handleReject = async () => {
        await updateFormStatus('Rejected', requestId);
    }

    return (
        <Card sx={{ m: 3, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
                <Grid container spacing={2}>
                    {/* Row 1 */}
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Username:
                            </Typography>
                            <Typography variant="h6" sx={{ fontSize: "1.25rem", fontWeight: 700 }}>
                                {username}
                            </Typography>
                        </Stack>
                    </Grid>

                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1} alignItems="flex-start">
                            <Typography variant="subtitle2" color="text.secondary">
                                Form Date:
                            </Typography>
                            <Typography variant="h6" sx={{ fontSize: "1.15rem" }}>
                                {formDate}
                            </Typography>
                        </Stack>
                    </Grid>

                    {/* Divider after row 1 */}
                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                    {/* Row 2 */}
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Disease:
                            </Typography>
                            <Typography variant="h6" sx={{ fontSize: "1.15rem" }}>
                                {disease}
                            </Typography>
                        </Stack>
                    </Grid>

                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Patient Name:
                            </Typography>
                            <Typography variant="h6" sx={{ fontSize: "1.15rem" }}>
                                {patientName}
                            </Typography>
                        </Stack>
                    </Grid>

                    {/* Divider after row 2 */}
                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Relation:
                            </Typography>
                            <Typography variant="h6" sx={{ fontSize: "1.15rem" }}>
                                {relation}
                            </Typography>
                        </Stack>
                    </Grid>

                    {/* Divider after row 2 */}
                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                    {/* Row 3 */}
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Requested Amount:
                            </Typography>
                            <Typography variant="h6" sx={{ fontSize: "1.15rem" }}>
                                {requestedAmount}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>

                <Box mt={3} display="flex" justifyContent="flex-start" gap={2}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleApprove}
                        sx={{ minWidth: 120, fontWeight: 700 }}
                    >
                        Approve
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleReject}
                        sx={{ minWidth: 120, fontWeight: 700 }}
                    >
                        Reject
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/admin/form-approval-details", {
                            state: {
                                requestId,
                                username,
                                formDate,
                                disease,
                                patientName,
                                relation,
                                requestedAmount
                            }
                        })}
                        sx={{ minWidth: 120, fontWeight: 700 }}
                    >
                        Show Details
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
