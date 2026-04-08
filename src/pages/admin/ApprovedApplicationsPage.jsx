import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
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
import {
  FaDownload,
  FaPrint,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import {
  getApprovedApplications,
  updateApprovedApplicationAmount,
} from "../../services/form_services";

const DEFAULT_SORT = {
  sortBy: "formDate",
  sortOrder: "desc",
};

const formatCurrency = (value) => {
  const numericValue = Number(value || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numericValue);
};

const formatPdfCurrency = (value) => {
  const numericValue = Number(value || 0);
  return `Rs. ${numericValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function ApprovedApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [draftAmounts, setDraftAmounts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(DEFAULT_SORT);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  const fetchApprovedApplications = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await getApprovedApplications({
        status: "approved",
        approvedAmountMax: 0,
        search: searchTerm.trim(),
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
      });

      const records = response.applications || [];
      setApplications(records);
      setDraftAmounts(
        records.reduce((accumulator, application) => {
          accumulator[application.id] = String(application.approvedAmount ?? "");
          return accumulator;
        }, {})
      );
    } catch (fetchError) {
      console.error("Error fetching approved applications:", fetchError);
      setError("Failed to load approved applications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedApplications();
  }, [searchTerm, sortConfig.sortBy, sortConfig.sortOrder]);

  const totalExpenditure = useMemo(() => {
    return applications.reduce(
      (sum, application) => sum + Number(application.totalExpenditure || 0),
      0
    );
  }, [applications]);

  const handleSort = (column) => {
    setSortConfig((previous) => {
      if (previous.sortBy === column) {
        return {
          sortBy: column,
          sortOrder: previous.sortOrder === "asc" ? "desc" : "asc",
        };
      }

      return {
        sortBy: column,
        sortOrder: "asc",
      };
    });
  };

  const validateApprovedAmount = (value, requestedAmount) => {
    if (value === "") {
      return "Approved amount is required.";
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return "Approved amount must be numeric.";
    }

    if (numericValue < 0) {
      return "Approved amount cannot be negative.";
    }

    if (numericValue > Number(requestedAmount || 0)) {
      return "Approved amount cannot exceed requested amount.";
    }

    return "";
  };

  const handleApprovedAmountChange = (id, value) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setDraftAmounts((previous) => ({
        ...previous,
        [id]: value,
      }));
    }
  };

  const handleApprovedAmountSave = async (application) => {
    const nextValue = draftAmounts[application.id] ?? "";
    const validationMessage = validateApprovedAmount(
      nextValue,
      application.requestedAmount
    );

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSavingId(application.id);
    setError("");

    try {
      const updated = await updateApprovedApplicationAmount(application.id, {
        approvedAmount: Number(nextValue),
      });

      const updatedApprovedAmount =
        updated.application?.approvedAmount ?? Number(nextValue);

      setApplications((previous) =>
        previous
          .map((item) =>
            item.id === application.id
              ? {
                  ...item,
                  approvedAmount: updatedApprovedAmount,
                }
              : item
          )
          .filter((item) => Number(item.approvedAmount || 0) <= 0)
      );

      setDraftAmounts((previous) => {
        const nextDrafts = { ...previous };

        if (Number(updatedApprovedAmount) > 0) {
          delete nextDrafts[application.id];
        } else {
          nextDrafts[application.id] = String(updatedApprovedAmount);
        }

        return nextDrafts;
      });
    } catch (saveError) {
      console.error("Error updating approved amount:", saveError);
      setError(
        saveError?.response?.data?.message ||
          "Failed to update approved amount. Please try again."
      );
    } finally {
      setSavingId("");
    }
  };

  const handleAmountBlur = async (application) => {
    if (
      String(application.approvedAmount ?? "") ===
      String(draftAmounts[application.id] ?? "")
    ) {
      return;
    }

    await handleApprovedAmountSave(application);
  };

  const buildPdfDocument = () => {
    const document = new jsPDF("landscape");
    const pageHeight = document.internal.pageSize.height;
    const pageWidth = document.internal.pageSize.width;
    const reportDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    document.setFontSize(16);
    document.text("Approved Applications Report", 14, 18);
    document.setFontSize(10);
    document.text(`Generated on: ${reportDate}`, 14, 26);

    autoTable(document, {
      startY: 32,
      head: [[
        "Sr. No",
        "HRMS No",
        "Username",
        "Mobile No",
        "Total Expenditure",
        "Requested Amount",
        "Approved Amount",
        "Date",
      ]],
      body: applications.map((application, index) => [
        index + 1,
        application.hrmsNo,
        application.username,
        application.mobileNo || "-",
        formatPdfCurrency(application.totalExpenditure),
        formatPdfCurrency(application.requestedAmount),
        formatPdfCurrency(application.approvedAmount),
        formatDate(application.formDate),
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: "linebreak",
      },
      margin: { top: 32, left: 14, right: 14, bottom: 20 },
      didDrawPage: () => {
        const currentPage = document.getNumberOfPages();
        document.setFontSize(9);
        document.setTextColor(100, 116, 139);
        document.text(`Page ${currentPage}`, pageWidth - 24, pageHeight - 8, {
          align: "right",
        });
      },
    });

    const finalY = document.lastAutoTable?.finalY || 32;
    let summaryY = finalY + 12;

    if (summaryY > pageHeight - 20) {
      document.addPage();
      summaryY = 20;
    }

    document.setTextColor(15, 23, 42);
    document.setDrawColor(203, 213, 225);
    document.line(14, summaryY - 5, pageWidth - 14, summaryY - 5);
    document.setFontSize(11);
    document.setFont(undefined, "bold");
    document.text(
      `Total Expenditure Sum: ${formatPdfCurrency(totalExpenditure)}`,
      14,
      summaryY
    );
    document.setFont(undefined, "normal");

    return document;
  };

  const downloadPdf = () => {
    setIsExporting(true);

    try {
      const document = buildPdfDocument();
      document.save("approved-applications-report.pdf");
    } finally {
      setIsExporting(false);
    }
  };

  const printPdf = () => {
    setIsPrinting(true);

    try {
      const document = buildPdfDocument();
      const pdfBlob = document.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(blobUrl, "_blank");

      if (!printWindow) {
        setError("Unable to open print preview. Please allow pop-ups and try again.");
        URL.revokeObjectURL(blobUrl);
        return;
      }

      printWindow.addEventListener("load", () => {
        printWindow.focus();
        printWindow.print();
      });

      const revokeUrl = () => URL.revokeObjectURL(blobUrl);
      printWindow.addEventListener("afterprint", revokeUrl, { once: true });
      printWindow.addEventListener("beforeunload", revokeUrl, { once: true });
    } finally {
      setIsPrinting(false);
    }
  };

  const sortIcon =
    sortConfig.sortOrder === "asc" ? (
      <FaSortAmountUp size={12} />
    ) : (
      <FaSortAmountDown size={12} />
    );

  return (
    <Box sx={{ width: "100%", p: { xs: 1, sm: 2 } }}>
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          boxShadow: "0 10px 35px rgba(15, 23, 42, 0.08)",
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: "space-between",
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f172a" }}>
              Approved Applications
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: "#64748b" }}>
              Review approved requests, update approved amounts, and export the
              report as PDF.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.5,
              alignItems: { xs: "stretch", sm: "center" },
            }}
          >
            <TextField
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by username or HRMS no"
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 280 }, backgroundColor: "#fff" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch style={{ color: "#64748b" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              onClick={downloadPdf}
              disabled={isExporting || isPrinting || applications.length === 0}
              startIcon={<FaDownload />}
              sx={{
                minWidth: 170,
                width: 170,
                height: 40,
                fontWeight: 600,
                fontSize: "0.82rem",
              }}
            >
              {isExporting ? "Preparing PDF..." : "Download PDF"}
            </Button>

            <Button
              variant="outlined"
              onClick={printPdf}
              disabled={isPrinting || isExporting || applications.length === 0}
              startIcon={<FaPrint />}
              sx={{
                minWidth: 170,
                width: 170,
                height: 40,
                fontWeight: 600,
              }}
            >
              {isPrinting ? "Opening Print..." : "Print PDF"}
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 1,
            mb: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "#475569" }}>
            Total approved records: {applications.length}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f766e" }}>
            Total expenditure sum: {formatCurrency(totalExpenditure)}
          </Typography>
        </Box>

        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : applications.length === 0 ? (
          <Alert severity="info">
            No approved applications found for the selected filters.
          </Alert>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              maxHeight: "70vh",
              overflow: "auto",
              border: "1px solid #e2e8f0",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Sr. No</TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, cursor: "pointer" }}
                    onClick={() => handleSort("hrmsNo")}
                  >
                    HRMS No {sortConfig.sortBy === "hrmsNo" ? sortIcon : null}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, cursor: "pointer" }}
                    onClick={() => handleSort("username")}
                  >
                    Username {sortConfig.sortBy === "username" ? sortIcon : null}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Mobile No</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Total Expenditure</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Requested Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700, minWidth: 180 }}>
                    Approved Amount
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, cursor: "pointer" }}
                    onClick={() => handleSort("formDate")}
                  >
                    Date {sortConfig.sortBy === "formDate" ? sortIcon : null}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.map((application, index) => (
                  <TableRow key={application.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{application.hrmsNo}</TableCell>
                    <TableCell>{application.username}</TableCell>
                    <TableCell>{application.mobileNo || "-"}</TableCell>
                    <TableCell>
                      {formatCurrency(application.totalExpenditure)}
                    </TableCell>
                    <TableCell>{formatCurrency(application.requestedAmount)}</TableCell>
                    <TableCell>
                      <TextField
                        value={draftAmounts[application.id] ?? ""}
                        onChange={(event) =>
                          handleApprovedAmountChange(
                            application.id,
                            event.target.value
                          )
                        }
                        onBlur={() => handleAmountBlur(application)}
                        onKeyDown={async (event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            await handleApprovedAmountSave(application);
                          }
                        }}
                        size="small"
                        disabled={savingId === application.id}
                        error={
                          !!validateApprovedAmount(
                            draftAmounts[application.id] ?? "",
                            application.requestedAmount
                          ) &&
                          draftAmounts[application.id] !==
                            String(application.approvedAmount ?? "")
                        }
                        helperText={
                          savingId === application.id
                            ? "Saving..."
                            : validateApprovedAmount(
                                draftAmounts[application.id] ?? "",
                                application.requestedAmount
                              ) &&
                              draftAmounts[application.id] !==
                                String(application.approvedAmount ?? "")
                            ? validateApprovedAmount(
                                draftAmounts[application.id] ?? "",
                                application.requestedAmount
                              )
                            : "Press Enter or click outside to save"
                        }
                        inputProps={{
                          inputMode: "decimal",
                          min: 0,
                        }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(application.formDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
