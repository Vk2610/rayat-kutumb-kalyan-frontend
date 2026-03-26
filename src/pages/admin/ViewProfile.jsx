import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

/* --------------------------- Date Formatter --------------------------- */
const formatDate = (date) => {
  if (!date) return "—";
  return dayjs(date).format("DD/MM/YYYY");
};

export default function ViewProfile() {
  console.log('ViewProfile called');
  // const { hrmsNo } = useParams();   // <-- read from URL
  const location = useLocation();
  console.log(location)
  const [user, setUser] = useState(location.state?.user || null);
  const hrmsNo = user.hrmsNo;
  console.log(user)
  console.log(hrmsNo)
  

  // const [user, setUser] = useState(location.state?.user || null);
  const [installments, setInstallments] = useState([
    { date: null, amount: 0, paid: false },
    { date: null, amount: 0, paid: false },
    { date: null, amount: 0, paid: false },
    { date: null, amount: 0, paid: false },
    { date: null, amount: 0, paid: false },
  ]);

  const handleMarkPaid = async (index) => {
    setInstallments(prev => {
      const updated = [...prev];

      const raw = updated[index]?.amountInput ?? updated[index]?.amount ?? "";
      const parsed = parseFloat(String(raw).trim());

      if (!parsed || Number.isNaN(parsed) || parsed <= 0) {
        alert("Please enter a valid amount (> 0) before marking as paid.");
        return prev;
      }

      updated[index] = {
        ...updated[index],
        amount: parsed,
        amountInput: String(parsed),
        date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        paid: true,
      };

      (async () => {
        try {

          const formatMySQL = (d) =>
            d ? dayjs(d).format("YYYY-MM-DD HH:mm:ss") : null;

          const payload = {
            installment1: updated[0].amount,
            installment1Date: formatMySQL(updated[0].date),

            installment2: updated[1].amount,
            installment2Date: formatMySQL(updated[1].date),

            installment3: updated[2].amount,
            installment3Date: formatMySQL(updated[2].date),

            installment4: updated[3].amount,
            installment4Date: formatMySQL(updated[3].date),

            installment5: updated[4].amount,
            installment5Date: formatMySQL(updated[4].date),

            claimedFullAmount: updated.every(i => i.paid),
          };


          console.log("📤 Sending payload:", payload);

          await axios.put(
            `http://localhost:3000/funds/upd-ints/${user.hrmsNo}`,
            payload
          );

        } catch (err) {
          console.error("Failed to update payments:", err);
          alert("Failed to update installment on server. Reverting change.");

          setInstallments(prev2 => {
            const revert = [...prev2];
            revert[index] = {
              ...revert[index],
              paid: false,
              date: null,
              amount: 0,
              amountInput: ""
            };
            return revert;
          });
        }
      })();

      return updated;
    });
  };


  /* -------------------------- Fetch User If Needed -------------------------- */
  useEffect(() => {
    if (!user) {
      axios
        .get(`http://localhost:3000/employees/get-emp-prf/${hrmsNo}`)
        .then((res) => {
          setUser(res.data);
          if (res.data.welfarePayments) {
            setInstallments(res.data.welfarePayments);
          }
        })
        .catch((err) => console.error("Error fetching user:", err));
    } else {
      if (user.welfarePayments) {
        setInstallments(user.welfarePayments);
      }
    }
  }, [hrmsNo]);


  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:3000/funds/${user.hrmsNo}`)
        .then(res => {
          const f = res.data;
          setInstallments([
            {
              amount: f.installment1,
              date: f.installment1Date,
              paid: f.installment1 > 0,
              amountInput: f.installment1 ? String(f.installment1) : ""
            },
            {
              amount: f.installment2,
              date: f.installment2Date,
              paid: f.installment2 > 0,
              amountInput: f.installment2 ? String(f.installment2) : ""
            },
            {
              amount: f.installment3,
              date: f.installment3Date,
              paid: f.installment3 > 0,
              amountInput: f.installment3 ? String(f.installment3) : ""
            },
            {
              amount: f.installment4,
              date: f.installment4Date,
              paid: f.installment4 > 0,
              amountInput: f.installment4 ? String(f.installment4) : ""
            },
            {
              amount: f.installment5,
              date: f.installment5Date,
              paid: f.installment5 > 0,
              amountInput: f.installment5 ? String(f.installment5) : ""
            }
          ]);
        })
    }
  }, [user]);



  useEffect(() => {
    if (user?.welfarePayments) {
      setInstallments(user.welfarePayments.map(i => ({
        date: i.date || null,
        amount: i.amount || 0,
        amountInput: i.amount ? String(i.amount) : "",
        paid: !!i.paid,
      })));
    }
  }, [user]);

  if (!user) return <p>Loading...</p>;

  const data = user;
  const totalPaid = installments.reduce(
    (sum, inst) => sum + (inst.paid ? Number(inst.amount || 0) : 0),
    0
  );

  const remainingAmount = 5000 - totalPaid;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        User Profile
      </Typography>

      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>

          {/* HEADER */}
          <Box display="flex" alignItems="center" gap={3} sx={{ mb: 4 }}>
            <Avatar
              sx={{ bgcolor: deepPurple[500], width: 80, height: 80, fontSize: 32 }}
            >
              {(data.employeeName || "U").charAt(0)}
            </Avatar>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {data.employeeName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {data.designation} • {data.department}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                HRMS No: {data.hrmsNo}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* SECTION 1 — PERSONAL */}
          <Section title="Personal Information">
            <InfoItem label="Gender" value={data.gender} />
            <InfoItem label="Marital Status" value={data.maritalStatus} />
            <InfoItem label="Email" value={data.emailId} />
            <InfoItem label="Phone" value={data.mobileNo} />
            <InfoItem label="PAN Number" value={data.panNo} />
            <InfoItem label="Date of Birth" value={formatDate(data.dob)} />
            <InfoItem label="Present Address" value={data.presentAddress} full />
            <InfoItem label="Permanent Address" value={data.permanentAddress} full />
          </Section>

          {/* SECTION 2 — EMPLOYMENT */}
          <Section title="Employment Details">
            <InfoItem label="Designation" value={data.designation} />
            <InfoItem label="Department" value={data.department} />
            <InfoItem label="Status" value={data.status} />
            <InfoItem label="Role" value={data.role} />
          </Section>

          {/* SECTION 3 — APPOINTMENT */}
          <Section title="Appointment Details">
            <InfoItem label="Current Appointment Date" value={formatDate(data.currentAppointmentDate)} />
            <InfoItem label="Current Appointment Type" value={data.currentAppointmentType} />
            <InfoItem label="First Appointment Date" value={formatDate(data.firstAppointmentDate)} />
            <InfoItem label="First Joining Date" value={formatDate(data.firstJoiningDate)} />
            <InfoItem label="First Appointment Type" value={data.firstAppointmentType} />
            <InfoItem label="Employee Type" value={data.employeeType} />
            <InfoItem label="Appointment Nature" value={data.appointmentNature} />
            <InfoItem label="Qualifications" value={data.qualifications} full />
          </Section>

          {/* SECTION 4 — ADMIN */}
          <Section title="Administrative Details">
            <InfoItem label="Approval Ref No" value={data.approvalRefNo} />
            <InfoItem label="Approval Letter Date" value={formatDate(data.approvalLetterDate)} />
            <InfoItem label="Retirement Date" value={formatDate(data.retirementDate)} />
          </Section>

          {/* SECTION 5 — BRANCH */}
          <Section title="Branch Details">
            <InfoItem label="Branch Name" value={data.branchName} />
            <InfoItem label="Branch Region" value={data.branchRegionName} />
            <InfoItem label="Branch Type" value={data.branchType} />
            <InfoItem label="Branch Joining Date" value={formatDate(data.branchJoiningDate)} />
          </Section>

          {/* SECTION 6 — BANK */}
          <Section title="Bank Details">
            <InfoItem label="Bank Name" value={data.bankName} />
            <InfoItem label="Account Number" value={data.accountNo} />
            <InfoItem label="IFSC Code" value={data.ifsc} />
          </Section>

          {/* SECTION 7 — NOMINEE */}
          <Section title="Nominee Details">
            <InfoItem label="Nominee Name" value={data.nomineeName} />
            <InfoItem label="Nominee Relation" value={data.nomineeRelation} />
          </Section>

          {/* SECTION 8 — WELFARE FUND */}
          <Section title="Welfare Fund Contribution (5 Installments)">
            <Grid item xs={12}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 3,
                  width: 1340,
                  maxWidth: "100%",
                  mx: "auto",
                  overflowX: "auto",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                  <TableContainer sx={{ maxWidth: 900, width: "100%" }}>
                    <Table sx={{ minWidth: 600 }}>
                      <TableHead>
                        <TableRow sx={{ background: "#f3f4f6" }}>
                          <TableCell align="center"><b>#</b></TableCell>
                          <TableCell align="center"><b>Date Paid</b></TableCell>
                          <TableCell align="center"><b>Amount</b></TableCell>
                          <TableCell align="center"><b>Status</b></TableCell>
                          <TableCell align="center"><b>Action</b></TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {installments.map((inst, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">{index + 1}</TableCell>

                            <TableCell align="center">
                              {inst.date ? formatDate(inst.date) : "—"}
                            </TableCell>

                            <TableCell align="center">
                              {inst.paid ? (
                                <span>₹ {inst.amount}</span>
                              ) : (
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="Amount"
                                  value={inst.amountInput ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setInstallments(prev => {
                                      const updated = [...prev];
                                      updated[index] = {
                                        ...updated[index],
                                        amountInput: val,
                                      };
                                      return updated;
                                    });
                                  }}
                                  style={{
                                    width: "100px",
                                    padding: "6px",
                                    textAlign: "center",
                                    border: "1px solid #ccc",
                                    borderRadius: "6px",
                                  }}
                                />
                              )}
                            </TableCell>

                            <TableCell align="center">
                              {inst.paid ? (
                                <span style={{ color: "green", fontWeight: "bold" }}>
                                  Paid
                                </span>
                              ) : (
                                <span style={{ color: "red", fontWeight: "bold" }}>
                                  Pending
                                </span>
                              )}
                            </TableCell>

                            <TableCell align="center">
                              {!inst.paid && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  sx={{ background: "#16a34a" }}
                                  onClick={() => handleMarkPaid(index)}
                                >
                                  Mark Paid
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}

                        {/* TOTAL PAID */}
                        <TableRow sx={{ background: "#e8f5e9" }}>
                          <TableCell align="center" colSpan={2}>
                            <b>Total Paid</b>
                          </TableCell>
                          <TableCell align="center">
                            <b style={{ color: "#16a34a" }}>₹ {totalPaid}</b>
                          </TableCell>
                          <TableCell align="center" colSpan={2}></TableCell>
                        </TableRow>

                        {/* REMAINING */}
                        <TableRow sx={{ background: "#fff3e0" }}>
                          <TableCell align="center" colSpan={2}>
                            <b>Remaining Amount</b>
                          </TableCell>
                          <TableCell align="center">
                            <b style={{ color: "#d32f2f" }}>₹ {remainingAmount}</b>
                          </TableCell>
                          <TableCell align="center" colSpan={2}></TableCell>
                        </TableRow>


                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Card>
            </Grid>
          </Section>

          <Divider sx={{ my: 3 }} />

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined">Back</Button>
            <Button variant="contained" sx={{ background: "#16a34a" }}>
              Edit Profile
            </Button>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}

/* ----------------------- Helper UI Components ----------------------- */

const Section = ({ title, children }) => (
  <>
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
      {title}
    </Typography>
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {children}
    </Grid>
    <Divider sx={{ mb: 3 }} />
  </>
);

const InfoItem = ({ label, value, full }) => (
  <Grid item xs={12} sm={full ? 12 : 6}>
    <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{label}</Typography>
    <Typography sx={{ color: "text.secondary" }}>{value || "—"}</Typography>
  </Grid>
);
