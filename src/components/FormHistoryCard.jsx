import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    Grid,
    Stack
} from "@mui/material";
import FormDialog from "./FormDialog";

function FormHistoryCard({ statusColor, data, handleUpdate }) {
    return (
        <Box key={data.requestId} sx={{ display: "flex", mb: 5 }}>

            <Card
                sx={{
                    flex: 1,
                    borderRadius: 2,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    borderLeft: "4px solid " + statusColor,
                }}
            >
                <CardContent>
                    <Grid container spacing={2} mb={1}>
                        <Grid data xs={12} sm={6}>
                            <Stack spacing={1}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Patient Name:
                                </Typography>
                                <Typography variant="h6" sx={{ fontSize: "1.15rem" }}>
                                    {data.patientName}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                        <Grid data xs={12} sm={6}>
                            <Stack spacing={1}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Relation:
                                </Typography>
                                <Typography variant="h6" sx={{ fontSize: "1.15rem" }}>
                                    {data.relation}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                        <Grid data xs={12} sm={6}>
                            <Stack spacing={1} alignItems="flex-start">
                                <Typography variant="subtitle2" color="text.secondary">
                                    Form Date:
                                </Typography>
                                <Typography variant="h6" sx={{ fontSize: "1.15rem" }}>
                                    {data.formDate}
                                </Typography>
                            </Stack>
                        </Grid>

                        {/* Divider after row 1 */}
                        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                        {/* Row 2 */}
                        <Grid data xs={12} sm={6}>
                            <Stack spacing={1}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Disease:
                                </Typography>
                                <Typography variant="h6" sx={{ fontSize: "1.15rem" }}>
                                    {data.illnessNature}
                                </Typography>
                            </Stack>
                        </Grid>

                        {/* Divider after row 2 */}
                        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                        {/* Row 3 */}
                        <Grid data xs={12} sm={6}>
                            <Stack spacing={1}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Requested Amount:
                                </Typography>
                                <Typography variant="h6" sx={{ fontSize: "1.15rem" }}>
                                    {data.requestedAmountNumbers}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                        <Grid data xs={12} sm={6}>
                            <Stack spacing={1}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Approved Amount:
                                </Typography>
                                <Typography variant="h6" sx={{ fontSize: "1.15rem" }}>
                                    {data.approvedAmount}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Typography
                        sx={{
                            fontSize: 16,
                            mt: 0.5,
                            color: statusColor,
                            fontWeight: 600,
                        }}
                    >
                        {data.formStatus}
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    <Box mt={2} display="flex" justifyContent="flex-start" gap={2}>
                        <FormDialog
                            handleUpdate={handleUpdate}
                            data={{ requestId: data.requestId, title: "Status", type: "dropdown", options: ["Approved", "Rejected", "Pending"] }}
                            isDisabled={data.formStatus !== 'Pending'}
                        />
                        <FormDialog
                            data={{
                                requestId: data.requestId,
                                title: "Approved Amount",
                                type: "number"
                            }}
                            handleUpdate={handleUpdate}
                            isDisabled={data.formStatus !== 'Pending'}
                        />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}

export default FormHistoryCard;