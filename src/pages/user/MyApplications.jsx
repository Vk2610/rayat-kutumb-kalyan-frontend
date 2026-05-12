import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";

const DetailRow = ({ label, value, isBold, isDoc, onDocClick }) => (
  <Box
    sx={{
      display: "flex",
      py: 1.5,
      borderBottom: "1px solid #f0f0f0",
      alignItems: "center",
      gap: 2,
    }}
  >
    <Typography sx={{ width: "40%", color: "text.secondary", fontWeight: 600 }}>
      {label}
    </Typography>
    {isDoc ? (
      <Button
        variant="contained"
        size="small"
        onClick={onDocClick}
        sx={{
          textTransform: "none",
          backgroundColor: "#e2e8f0",
          color: "#1e293b",
          boxShadow: "none",
          "&:hover": { backgroundColor: "#cbd5e1", boxShadow: "none" },
        }}
      >
        View Document
      </Button>
    ) : (
      <Typography
        sx={{
          width: "60%",
          fontWeight: isBold ? "bold" : "normal",
          color: isBold ? "primary.main" : "text.primary",
        }}
      >
        {value || "-"}
      </Typography>
    )}
  </Box>
);

const SectionHeader = ({ title }) => (
  <Typography
    variant="h6"
    sx={{
      mt: 3,
      mb: 1,
      fontSize: "1.15rem",
      fontWeight: "bold",
      color: "#1e293b",
      backgroundColor: "#f8fafc",
      padding: "8px 12px",
      borderLeft: "4px solid #16a34a",
      borderRadius: "4px",
    }}
  >
    {title}
  </Typography>
);

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numericValue);
};

const getStatusColor = (status) => {
  if (status === "Approved") return "rgb(7,170,23)";
  if (status === "Rejected") return "rgb(211,47,47)";
  return "rgb(255,152,0)";
};

export default function MyApplications() {
  const [isLoading, setLoading] = useState(true);
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [username, setUsername] = useState("");

  const stats = useMemo(() => {
    let approved = 0;
    let pending = 0;
    let rejected = 0;
    let totalRequested = 0;
    let totalApproved = 0;

    forms.forEach((form) => {
      if (form.formStatus === "Approved") approved += 1;
      else if (form.formStatus === "Pending") pending += 1;
      else rejected += 1;

      totalRequested += Number(form.requestedAmountNumbers || 0);
      totalApproved += Number(form.approvedAmount || 0);
    });

    return {
      approved,
      pending,
      rejected,
      totalRequested,
      totalApproved,
    };
  }, [forms]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const hrmsNo = decoded.hrmsNo;
        setUsername(decoded.employeeName || "");

        const response = await axios.get("https://rayat-backend-1.onrender.com/admin/get-user-forms", {
          params: { hrmsNo },
        });

        setForms(response.data.forms || []);
      } catch (error) {
        console.error("Error retrieving forms: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const statsArr = [
    { label: "Total Applications", value: forms.length, color: "#0f766e" },
    { label: "Approved", value: stats.approved, color: "rgb(7,170,23)" },
    { label: "Pending", value: stats.pending, color: "rgb(255,152,0)" },
    { label: "Rejected", value: stats.rejected, color: "rgb(211,47,47)" },
    { label: "Total Requested", value: formatCurrency(stats.totalRequested), color: "#1d4ed8" },
    { label: "Approved Amount", value: formatCurrency(stats.totalApproved), color: "#15803d" },
  ];

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography
        sx={{
          fontSize: 28,
          fontWeight: 800,
          mb: 1,
          color: "#0f172a",
        }}
      >
        My Applications
      </Typography>
      <Typography sx={{ color: "#64748b", mb: 3 }}>
        Track your past welfare applications, approval status, approved amount,
        and uploaded documents in one place.
      </Typography>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {statsArr.map((stat) => (
              <Grid item xs={12} sm={6} md={4} key={stat.label}>
                <Card
                  sx={{
                    borderRadius: 3,
                    p: 2.5,
                    height: "100%",
                    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#475569" }}>
                    {stat.label}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: 24,
                      fontWeight: 800,
                      color: stat.color,
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <TableContainer
            component={Paper}
            sx={{
              mt: 1,
              boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
              borderRadius: 3,
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Patient Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Relation</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Disease</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Requested Amount</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Approved Amount</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold", minWidth: 180 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {forms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      You have not submitted any applications yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  forms.map((form) => (
                    <TableRow key={form.requestId}>
                      <TableCell>{form.formDate}</TableCell>
                      <TableCell>{form.patientName}</TableCell>
                      <TableCell>{form.relation}</TableCell>
                      <TableCell>{form.illnessNature}</TableCell>
                      <TableCell>{formatCurrency(form.requestedAmountNumbers)}</TableCell>
                      <TableCell>{formatCurrency(form.approvedAmount)}</TableCell>
                      <TableCell sx={{ color: getStatusColor(form.formStatus), fontWeight: 700 }}>
                        {form.formStatus}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button variant="outlined" size="small" onClick={() => setSelectedForm(form)}>
                            View Details
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={!!selectedForm} onClose={() => setSelectedForm(null)} maxWidth="md" fullWidth>
            {selectedForm && (
              <>
                <DialogTitle
                  sx={{
                    backgroundColor: "#0f172a",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  Application Details
                  <span
                    style={{
                      fontSize: "0.95rem",
                      float: "right",
                      backgroundColor: getStatusColor(selectedForm.formStatus),
                      padding: "4px 12px",
                      borderRadius: "20px",
                    }}
                  >
                    {selectedForm.formStatus}
                  </span>
                </DialogTitle>
                <DialogContent sx={{ mt: 1, backgroundColor: "#ffffff" }}>
                  <SectionHeader title="Applicant Details" />
                  <DetailRow label="Applicant Name" value={selectedForm.applicantName || username} />
                  <DetailRow label="HRMS No" value={selectedForm.hrmsNo} />
                  <DetailRow label="Branch" value={selectedForm.branchName} />
                  <DetailRow label="Joining Date" value={selectedForm.joiningDate} />
                  <DetailRow label="Designation" value={selectedForm.designation} />
                  <DetailRow label="Mobile No" value={selectedForm.mobile} />

                  <SectionHeader title="Patient Details" />
                  <DetailRow label="Patient Name" value={selectedForm.patientName} />
                  <DetailRow label="Relation" value={selectedForm.relation} />
                  <DetailRow label="Illness Nature" value={selectedForm.illnessNature} />
                  <DetailRow label="Illness Duration" value={selectedForm.illnessDuration} />

                  <SectionHeader title="Expenses Details" />
                  <DetailRow label="Medicine Bill" value={formatCurrency(selectedForm.medicineBill)} />
                  <DetailRow label="Doctor Bill" value={formatCurrency(selectedForm.doctorBill)} />
                  <DetailRow label="Other Expenses" value={formatCurrency(selectedForm.otherExpenses)} />
                  <DetailRow label="Total Expenses" value={formatCurrency(selectedForm.totalExpenses)} isBold />

                  <SectionHeader title="Application Status" />
                  <DetailRow label="Requested Amount" value={formatCurrency(selectedForm.requestedAmountNumbers)} isBold />
                  <DetailRow label="Approved Amount" value={formatCurrency(selectedForm.approvedAmount)} isBold />
                  <DetailRow label="Status" value={selectedForm.formStatus} isBold />
                  <DetailRow label="Form Date" value={selectedForm.formDate} />

                  <SectionHeader title="Uploaded Documents" />
                  {[
                    { key: "dischargeCertificate", label: "Discharge Certificate" },
                    { key: "doctorPrescription", label: "Doctor Prescription" },
                    { key: "docsMedicineBills", label: "Medicine Bills" },
                    { key: "diagnosticReports", label: "Diagnostic Reports" },
                    { key: "otherDoc1", label: "Other Document 1" },
                    { key: "otherDoc2", label: "Other Document 2" },
                    { key: "otherDoc3", label: "Other Document 3" },
                    { key: "otherDoc4", label: "Other Document 4" },
                    { key: "otherDoc5", label: "Other Document 5" },
                  ].map((doc) => {
                    if (!selectedForm[doc.key]) return null;
                    return (
                      <DetailRow
                        key={doc.key}
                        label={doc.label}
                        isDoc
                        onDocClick={() => setSelectedDoc(selectedForm[doc.key])}
                      />
                    );
                  })}

                  <SectionHeader title="Applicant Signature" />
                  <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                    {selectedForm.applicantSignature ? (
                      <img
                        src={selectedForm.applicantSignature}
                        alt="Applicant Signature"
                        style={{
                          maxHeight: "150px",
                          maxWidth: "100%",
                          objectFit: "contain",
                          border: "1px dashed #ccc",
                          padding: "10px",
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No signature provided.
                      </Typography>
                    )}
                  </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, backgroundColor: "#f1f5f9" }}>
                  <Button
                    onClick={() => setSelectedForm(null)}
                    variant="outlined"
                    sx={{ color: "#0f172a", borderColor: "#cbd5e1" }}
                  >
                    Close
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>

          <Dialog open={!!selectedDoc} onClose={() => setSelectedDoc(null)} maxWidth="lg" fullWidth>
            <DialogTitle
              sx={{
                backgroundColor: "#0f172a",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              Document Viewer
              <Button onClick={() => setSelectedDoc(null)} sx={{ color: "#fff", minWidth: "auto", p: 1 }}>
                Close
              </Button>
            </DialogTitle>
            <DialogContent
              sx={{
                p: 0,
                height: "85vh",
                backgroundColor: "#e2e8f0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {selectedDoc && (
                <iframe
                  src={selectedDoc}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  title="Document Detail"
                />
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </Box>
  );
}

