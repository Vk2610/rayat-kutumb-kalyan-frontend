import {
    Box, Typography, Stack, Divider, Button, Dialog,
    CircularProgress, Chip, Paper
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { updateFormStatus } from "../../services/form_services";

// ─── helpers ─────────────────────────────────────────────────────────────────
function SectionHeader({ title }) {
    return (
        <Typography variant="h6" sx={{
            mt: 3, mb: 1, fontSize: '1.05rem', fontWeight: "bold",
            color: '#1e293b', backgroundColor: '#f8fafc',
            padding: '8px 12px', borderLeft: '4px solid #3b82f6', borderRadius: '4px'
        }}>
            {title}
        </Typography>
    );
}

function DetailRow({ label, value }) {
    return (
        <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #f0f0f0', alignItems: 'flex-start' }}>
            <Typography sx={{ width: '40%', color: 'text.secondary', fontWeight: 600, fontSize: '0.875rem', flexShrink: 0 }}>
                {label}
            </Typography>
            <Typography sx={{ width: '60%', color: '#1e293b', fontSize: '0.9rem', wordBreak: 'break-word' }}>
                {value ?? "—"}
            </Typography>
        </Box>
    );
}

function DocButton({ label, url, onView }) {
    if (!url) return null;
    return (
        <Box display="flex" alignItems="center" justifyContent="space-between"
            sx={{ border: "1px solid #e2e8f0", borderRadius: 2, px: 2, py: 1, mb: 1, backgroundColor: "#f8fafc" }}>
            <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#334155" }}>{label}</Typography>
            <Button size="small" variant="outlined" onClick={() => onView(url)}>
                View Document 📄
            </Button>
        </Box>
    );
}

// ─── main ─────────────────────────────────────────────────────────────────────
export default function FormDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const [previewUrl, setPreviewUrl] = useState(null);
    const [approving, setApproving] = useState(false);

    const { requestId, form } = location.state || {};

    if (!requestId || !form) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="error" variant="h6">No form selected.</Typography>
                <Button sx={{ mt: 2 }} onClick={() => navigate("/admin/form-approval")}>← Back to Approvals</Button>
            </Box>
        );
    }

    const handleApprove = async () => {
        setApproving(true);
        const res = await updateFormStatus("Approved", requestId);
        setApproving(false);
        if (res) navigate("/admin/form-approval", { replace: true });
    };

    const handleReject = async () => {
        await updateFormStatus("Rejected", requestId);
        navigate("/admin/form-approval", { replace: true });
    };

    const docFields = [
        { label: "Discharge Certificate", key: "dischargeCertificate" },
        { label: "Doctor Prescription", key: "doctorPrescription" },
        { label: "Medicine Bills", key: "docsMedicineBills" },
        { label: "Diagnostic Reports", key: "diagnosticReports" },
        { label: "Other Document 1", key: "otherDoc1" },
        { label: "Other Document 2", key: "otherDoc2" },
        { label: "Other Document 3", key: "otherDoc3" },
        { label: "Other Document 4", key: "otherDoc4" },
        { label: "Other Document 5", key: "otherDoc5" },
    ];

    return (
        <Box sx={{ maxWidth: 860, margin: "30px auto", px: 2, pb: 6 }}>

            {/* Header bar */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Button variant="text" onClick={() => navigate("/admin/form-approval")} sx={{ color: "#64748b" }}>
                    ← Back
                </Button>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>
                    Application Details
                </Typography>
                <Chip
                    label={form.formStatus || "Pending"}
                    color={form.formStatus === "Approved" ? "success" : form.formStatus === "Rejected" ? "error" : "warning"}
                    sx={{ fontWeight: 700 }}
                />
            </Box>

            <Paper elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, p: 3 }}>

                {/* ── Applicant Info ── */}
                <SectionHeader title="Applicant Information" />
                <Stack>
                    <DetailRow label="HRMS No." value={form.hrmsNo} />
                    <DetailRow label="Applicant Name" value={form.applicantName} />
                    <DetailRow label="Branch Name" value={form.branchName} />
                    <DetailRow label="Joining Date" value={form.joiningDate ? new Date(form.joiningDate).toLocaleDateString("en-IN") : null} />
                    <DetailRow label="Designation" value={form.designation} />
                    <DetailRow label="Total Service" value={form.totalService} />
                    <DetailRow label="Monthly Salary" value={form.monthlySalary ? `₹ ${form.monthlySalary}` : null} />
                    <DetailRow label="Mobile No." value={form.mobileNo || form.mobile} />
                    <DetailRow label="Form Date" value={form.formDate} />
                </Stack>

                {/* ── Patient Info ── */}
                <SectionHeader title="Patient Information" />
                <Stack>
                    <DetailRow label="Patient Name" value={form.patientName} />
                    <DetailRow label="Relation to Applicant" value={form.relation} />
                    <DetailRow label="Nature of Illness" value={form.illnessNature} />
                    <DetailRow label="Duration of Illness" value={form.illnessDuration} />
                </Stack>

                {/* ── Medical Expenses ── */}
                <SectionHeader title="Medical Expenses" />
                <Stack>
                    <DetailRow label="Medicine Bill" value={form.medicineBill != null ? `₹ ${form.medicineBill}` : null} />
                    <DetailRow label="Doctor Bill" value={form.doctorBill != null ? `₹ ${form.doctorBill}` : null} />
                    <DetailRow label="Other Expenses" value={form.otherExpenses != null ? `₹ ${form.otherExpenses}` : null} />
                    <DetailRow label="Total Expenses" value={form.totalExpenses != null ? `₹ ${form.totalExpenses}` : null} />
                    <DetailRow label="Certificates Attached" value={form.certificatesAttached} />
                </Stack>

                {/* ── Previous Assistance ── */}
                <SectionHeader title="Previous Assistance" />
                <Stack>
                    <DetailRow label="Previously Received Help" value={form.previousHelp} />
                    <DetailRow label="Previous Help Details" value={form.previousHelpDetails} />
                    <DetailRow label="Annual Deductions Paid" value={form.annualDeductions} />
                </Stack>

                {/* ── Financial Request ── */}
                <SectionHeader title="Financial Request" />
                <Stack>
                    <DetailRow label="Requested Amount (Numbers)" value={form.requestedAmountNumbers != null ? `₹ ${form.requestedAmountNumbers}` : null} />
                    <DetailRow label="Requested Amount (Words)" value={form.requestedAmountWords} />
                    <DetailRow label="Branch for Deposit" value={form.branchNameForDeposit} />
                    <DetailRow label="Savings Account No." value={form.savingsAccountNo} />
                    <DetailRow label="Sanction Letter No." value={form.sanctionLetter} />
                </Stack>

                {/* ── Officer Recommendation ── */}
                <SectionHeader title="Officer's Recommendation" />
                <Stack>
                    <DetailRow label="Recommendation" value={form.officerRecommendation} />
                </Stack>

                {/* ── Applicant Signature ── */}
                {form.applicantSignature && (
                    <>
                        <SectionHeader title="Applicant Signature" />
                        <Box sx={{ mt: 1, mb: 2 }}>
                            <img
                                src={form.applicantSignature}
                                alt="Applicant Signature"
                                style={{ maxHeight: 100, objectFit: "contain", border: "1px solid #e2e8f0", borderRadius: 8, padding: 8 }}
                            />
                        </Box>
                    </>
                )}

                {/* ── Uploaded Documents ── */}
                <SectionHeader title="Uploaded Documents" />
                <Box mt={1}>
                    {docFields.filter(d => form[d.key]).length === 0 ? (
                        <Typography sx={{ color: "#94a3b8", fontSize: "0.875rem" }}>No documents uploaded.</Typography>
                    ) : (
                        docFields.map(d => (
                            <DocButton key={d.key} label={d.label} url={form[d.key]} onView={setPreviewUrl} />
                        ))
                    )}
                </Box>

            </Paper>

            {/* ── Action Buttons ── */}
            <Box mt={4} display="flex" justifyContent="center" gap={2}>
                <Button
                    variant="contained" color="success" onClick={handleApprove}
                    disabled={approving || form.formStatus === "Approved"}
                    sx={{ minWidth: 140, fontWeight: 700, py: 1.2 }}
                >
                    {approving ? <CircularProgress size={20} color="inherit" /> : "✓ Approve"}
                </Button>
                <Button
                    variant="contained" color="error" onClick={handleReject}
                    disabled={form.formStatus === "Rejected"}
                    sx={{ minWidth: 140, fontWeight: 700, py: 1.2 }}
                >
                    ✕ Reject
                </Button>
            </Box>

            {/* ── Embedded Doc Viewer ── */}
            <Dialog open={!!previewUrl} onClose={() => setPreviewUrl(null)} maxWidth="md" fullWidth>
                <Box sx={{ p: 1, position: "relative" }}>
                    <Button
                        onClick={() => setPreviewUrl(null)}
                        sx={{ position: "absolute", top: 8, right: 8, minWidth: "auto", zIndex: 1 }}
                        variant="contained" color="inherit" size="small"
                    >
                        ✕ Close
                    </Button>
                    {previewUrl && (
                        /\.(jpg|jpeg|png|webp|gif)$/i.test(previewUrl)
                            ? <img src={previewUrl} alt="Document" style={{ width: "100%", maxHeight: "80vh", objectFit: "contain", marginTop: 36 }} />
                            : <iframe src={previewUrl} title="Document" style={{ width: "100%", height: "80vh", border: "none", marginTop: 36 }} />
                    )}
                </Box>
            </Dialog>

        </Box>
    );
}
