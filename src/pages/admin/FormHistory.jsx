import {
  Box,
  Typography,
  Card,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FormDialog from '../../components/FormDialog';
import { deleteFormEntry } from '../../services/form_services';

export default function FormHistory() {
  const [isLoading, setLoading] = useState(true);
  const [forms, setForms] = useState([]);
  const [update, setUpdate] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const location = useLocation();
  const { username, hrmsNo } = location.state;

  const DetailRow = ({ label, value, isBold, isDoc, onDocClick }) => (
    <Box
      sx={{
        display: 'flex',
        py: 1.5,
        borderBottom: '1px solid #f0f0f0',
        alignItems: 'center',
      }}
    >
      <Typography
        sx={{ width: '40%', color: 'text.secondary', fontWeight: 600 }}
      >
        {label}
      </Typography>
      {isDoc ? (
        <Button
          variant="contained"
          size="small"
          onClick={onDocClick}
          sx={{
            textTransform: 'none',
            backgroundColor: '#e2e8f0',
            color: '#1e293b',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#cbd5e1', boxShadow: 'none' },
          }}
        >
          View Document ðŸ“„
        </Button>
      ) : (
        <Typography
          sx={{
            width: '60%',
            fontWeight: isBold ? 'bold' : 'normal',
            color: isBold ? 'primary.main' : 'text.primary',
          }}
        >
          {value || '-'}
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
        fontSize: '1.15rem',
        fontWeight: 'bold',
        color: '#1e293b',
        backgroundColor: '#f8fafc',
        padding: '8px 12px',
        borderLeft: '4px solid #3b82f6',
        borderRadius: '4px',
      }}
    >
      {title}
    </Typography>
  );

  const [stats, setStats] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
    totalReqAmt: 0.0,
    totalApprAmt: 0.0,
    remBalance: 0.0,
  });

  const { approved, pending, rejected, totalReqAmt, totalApprAmt, remBalance } =
    stats;

  const statsArr = [
    { label: 'Total', value: forms.length, color: 'rgb(7,170,23)' },
    { label: 'Approved', value: approved, color: 'rgb(7,170,23)' },
    { label: 'Pending', value: pending, color: 'rgb(255,152,0)' },
    { label: 'Rejected', value: rejected, color: 'rgb(211,47,47)' },
    { label: 'Total Requested Amt', value: totalReqAmt, color: '#223f89ff' },
    {
      label: 'Total Approved Amt',
      value: totalApprAmt,
      color: 'rgb(7,170,23)',
    },
    { label: 'Balance Remaining', value: remBalance, color: '#223f89ff' },
  ];

  const getStatusColor = (status) => {
    if (status === 'Approved') return 'rgb(7,170,23)';
    if (status === 'Rejected') return 'rgb(211,47,47)';
    return 'rgb(255,152,0)';
  };

  const handleUpdate = () => {
    setUpdate(!update);
  };

  const handleDelete = async (requestId) => {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this application entry?',
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteFormEntry(requestId);
      const updatedForms = forms.filter((form) => form.requestId !== requestId);
      setForms(updatedForms);
      getStats(updatedForms);

      if (selectedForm?.requestId === requestId) {
        setSelectedForm(null);
      }
    } catch (error) {
      console.error('Error deleting form entry:', error);
      alert('Failed to delete form entry');
    }
  };

  const getStats = (data) => {
    console.log('getStats called ', data);

    let approved = 0;
    let pending = 0;
    let rejected = 0;
    let totalReqAmt = 0;
    let totalApprAmt = 0;
    data.forEach((form) => {
      if (form.formStatus === 'Approved') {
        approved++;
      } else if (form.formStatus === 'Pending') {
        pending++;
      } else {
        rejected++;
      }

      totalReqAmt += Number(form.requestedAmountNumbers);
      totalApprAmt += Number(form.approvedAmount);
    });

    const temp = {
      approved,
      pending,
      rejected,
      totalReqAmt,
      totalApprAmt,
      remBalance: 100000 - totalApprAmt,
    };

    setStats(temp);
  };

  const fetchForms = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/get-user-forms`,
        {
          params: { hrmsNo: hrmsNo },
        },
      );

      const data = response.data;
      console.log(data.forms);
      getStats(data.forms || []);
      setForms(data.forms || []);
      setLoading(false);
    } catch (error) {
      console.error('Error retrieving forms: ', error);
      alert('Error retrieving forms');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [update]);

  return (
    <Box
      sx={{
        width: '100%',
        p: 3,
      }}
    >
      {/* Title */}
      <Typography
        sx={{
          fontSize: 25,
          fontWeight: 700,
          mb: 3,
          color: '#333',
        }}
        textAlign={'center'}
      >
        {username}'s Application History
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Stats Section */}
          <Grid
            container
            spacing={2}
            sx={{ mb: 4 }}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            {statsArr.map((stat, i) => (
              <Grid item xs={3} key={i}>
                <Card
                  sx={{
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    bgcolor: '#f7fff9',
                    border: '1px solid rgba(7,170,23,0.2)',
                  }}
                >
                  <Typography
                    sx={{ fontSize: 14, fontWeight: 600, color: '#333333ff' }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: 22,
                      fontWeight: 700,
                      color: stat.color,
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Table Section */}
          <TableContainer
            component={Paper}
            sx={{
              mt: 1,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              borderRadius: 2,
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    Patient Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Relation</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Disease</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Req Amt</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Appr Amt</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: '350px' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.requestId}>
                    <TableCell>{form.patientName}</TableCell>
                    <TableCell>{form.relation}</TableCell>
                    <TableCell>{form.formDate}</TableCell>
                    <TableCell>{form.illnessNature}</TableCell>
                    <TableCell>{form.requestedAmountNumbers}</TableCell>
                    <TableCell>{form.approvedAmount}</TableCell>
                    <TableCell
                      sx={{
                        color: getStatusColor(form.formStatus),
                        fontWeight: 600,
                      }}
                    >
                      {form.formStatus}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setSelectedForm(form)}
                        >
                          View Details
                        </Button>
                        <FormDialog
                          handleUpdate={handleUpdate}
                          data={{
                            requestId: form.requestId,
                            title: 'Status',
                            type: 'dropdown',
                            options: ['Approved', 'Rejected', 'Pending'],
                          }}
                          isDisabled={form.formStatus !== 'Pending'}
                        />
                        <FormDialog
                          data={{
                            requestId: form.requestId,
                            title: 'Approved Amount',
                            type: 'number',
                          }}
                          handleUpdate={handleUpdate}
                          isDisabled={form.formStatus !== 'Pending'}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(form.requestId)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* View Details Dialog */}
          <Dialog
            open={!!selectedForm}
            onClose={() => setSelectedForm(null)}
            maxWidth="md"
            fullWidth
          >
            {selectedForm && (
              <>
                <DialogTitle
                  sx={{
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1.3rem',
                  }}
                >
                  Application Details{' '}
                  <span
                    style={{
                      fontSize: '1rem',
                      float: 'right',
                      backgroundColor: getStatusColor(selectedForm.formStatus),
                      padding: '4px 12px',
                      borderRadius: '20px',
                    }}
                  >
                    {selectedForm.formStatus}
                  </span>
                </DialogTitle>
                <DialogContent sx={{ mt: 1, backgroundColor: '#ffffff' }}>
                  <SectionHeader title="Applicant Details" />
                  <DetailRow label="HRMS No" value={selectedForm.hrmsNo} />
                  <DetailRow label="Name" value={selectedForm.applicantName} />
                  <DetailRow label="Branch" value={selectedForm.branchName} />
                  <DetailRow
                    label="Joining Date"
                    value={selectedForm.joiningDate}
                  />
                  <DetailRow
                    label="Designation"
                    value={selectedForm.designation}
                  />
                  <DetailRow
                    label="Total Service"
                    value={selectedForm.totalService}
                  />
                  <DetailRow
                    label="Monthly Salary"
                    value={selectedForm.monthlySalary}
                  />
                  <DetailRow label="Mobile No" value={selectedForm.mobile} />

                  <SectionHeader title="Patient Details" />
                  <DetailRow
                    label="Patient Name"
                    value={selectedForm.patientName}
                  />
                  <DetailRow label="Relation" value={selectedForm.relation} />
                  <DetailRow
                    label="Illness Nature"
                    value={selectedForm.illnessNature}
                  />
                  <DetailRow
                    label="Illness Duration"
                    value={selectedForm.illnessDuration}
                  />

                  <SectionHeader title="Expenses Details" />
                  <DetailRow
                    label="Medicine Bill"
                    value={`â‚¹${selectedForm.medicineBill}`}
                  />
                  <DetailRow
                    label="Doctor Bill"
                    value={`â‚¹${selectedForm.doctorBill}`}
                  />
                  <DetailRow
                    label="Other Expenses"
                    value={`â‚¹${selectedForm.otherExpenses}`}
                  />
                  <DetailRow
                    label="Total Expenses"
                    value={`â‚¹${selectedForm.totalExpenses}`}
                    isBold={true}
                  />
                  <DetailRow
                    label="Certificates Attached"
                    value={selectedForm.certificatesAttached}
                  />

                  <SectionHeader title="Previous Funds & Deductions" />
                  <DetailRow
                    label="Previous Help Recv."
                    value={selectedForm.previousHelp}
                  />
                  {selectedForm.previousHelp === 'होय' && (
                    <DetailRow
                      label="Previous Help Details"
                      value={selectedForm.previousHelpDetails}
                    />
                  )}
                  <DetailRow
                    label="Annual Deductions Agreement"
                    value={selectedForm.annualDeductions}
                  />

                  <SectionHeader title="Bank & Request Details" />
                  <DetailRow
                    label="Deposit Branch"
                    value={selectedForm.branchNameForDeposit}
                  />
                  <DetailRow
                    label="Savings Account No"
                    value={selectedForm.savingsAccountNo}
                  />
                  <DetailRow
                    label="Officer Recommendation"
                    value={selectedForm.officerRecommendation}
                  />
                  <DetailRow
                    label="Requested Amount (Num)"
                    value={`â‚¹${selectedForm.requestedAmountNumbers}`}
                    isBold={true}
                  />
                  <DetailRow
                    label="Requested Amount (Words)"
                    value={selectedForm.requestedAmountWords}
                  />
                  <DetailRow
                    label="Approved Amount"
                    value={`â‚¹${selectedForm.approvedAmount}`}
                    isBold={true}
                  />

                  <SectionHeader title="Uploaded Documents" />
                  {[
                    {
                      key: 'dischargeCertificate',
                      label: 'Discharge Certificate',
                    },
                    { key: 'doctorPrescription', label: 'Doctor Prescription' },
                    { key: 'docsMedicineBills', label: 'Medicine Bills' },
                    { key: 'diagnosticReports', label: 'Diagnostic Reports' },
                    { key: 'otherDoc1', label: 'Other Document 1' },
                    { key: 'otherDoc2', label: 'Other Document 2' },
                    { key: 'otherDoc3', label: 'Other Document 3' },
                    { key: 'otherDoc4', label: 'Other Document 4' },
                    { key: 'otherDoc5', label: 'Other Document 5' },
                  ].map((doc) => {
                    if (!selectedForm[doc.key]) return null;
                    return (
                      <DetailRow
                        key={doc.key}
                        label={doc.label}
                        isDoc={true}
                        onDocClick={() => setSelectedDoc(selectedForm[doc.key])}
                      />
                    );
                  })}

                  <SectionHeader title="Applicant Signature" />
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    {selectedForm.applicantSignature ? (
                      <img
                        src={selectedForm.applicantSignature}
                        alt="Applicant Signature"
                        style={{
                          maxHeight: '150px',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          border: '1px dashed #ccc',
                          padding: '10px',
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No signature provided.
                      </Typography>
                    )}
                  </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, backgroundColor: '#f1f5f9' }}>
                  <Button
                    onClick={() => setSelectedForm(null)}
                    variant="outlined"
                    sx={{
                      color: '#0f172a',
                      borderColor: '#cbd5e1',
                      '&:hover': { backgroundColor: '#e2e8f0' },
                    }}
                  >
                    Close Form
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>

          {/* Document Viewer Dialog */}
          <Dialog
            open={!!selectedDoc}
            onClose={() => setSelectedDoc(null)}
            maxWidth="lg"
            fullWidth
            sx={{ zIndex: 1400 }}
          >
            <DialogTitle
              sx={{
                backgroundColor: '#0f172a',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              Document Viewer
              <Button
                onClick={() => setSelectedDoc(null)}
                sx={{ color: '#fff', minWidth: 'auto', p: 1 }}
              >
                Close Modal âœ•
              </Button>
            </DialogTitle>
            <DialogContent
              sx={{
                p: 0,
                height: '85vh',
                backgroundColor: '#e2e8f0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {selectedDoc && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                  <iframe
                    src={selectedDoc}
                    width="80%"
                    height="80%"
                    style={{ border: 'none', display: 'block', margin: 'auto' }}
                    title="Document Detail"
                  />
                </Box>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </Box>
  );
}

