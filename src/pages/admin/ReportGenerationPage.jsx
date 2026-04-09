import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  MenuItem,
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
import {
  FaDownload,
  FaFileExcel,
  FaPrint,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { getReportApplications } from "../../services/form_services";
import { REGION } from "../../utils/branches";

const DEFAULT_SORT = {
  sortBy: "approvedAmountDate",
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

export default function ReportGenerationPage() {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState("");
  const [approvedDateFrom, setApprovedDateFrom] = useState("");
  const [approvedDateTo, setApprovedDateTo] = useState("");
  const [zone, setZone] = useState("");
  const [isMoreThan50KRequired, setIsMoreThan50KRequired] = useState(false);

  const fetchReportApplications = async (currentPage = page) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await getReportApplications({
        page: currentPage,
        limit,
        search: searchTerm.trim(),
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
        approvedDateFrom,
        approvedDateTo,
        minRequestedAmount: isMoreThan50KRequired ? 50000 : "",
        zone,
      });

      setApplications(response.applications || []);
      setTotalRecords(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (fetchError) {
      console.error("Error fetching report applications:", fetchError);
      setError("Failed to load report applications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportApplications(page);
  }, [
    page,
    searchTerm,
    sortConfig.sortBy,
    sortConfig.sortOrder,
    approvedDateFrom,
    approvedDateTo,
    isMoreThan50KRequired,
    zone,
  ]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, approvedDateFrom, approvedDateTo, isMoreThan50KRequired, zone]);

  const totalApprovedAmount = useMemo(() => {
    return applications.reduce(
      (sum, application) => sum + Number(application.approvedAmount || 0),
      0,
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

  const fetchAllRowsForExport = async () => {
    const response = await getReportApplications({
      page: 1,
      limit: Math.max(totalRecords || 1, limit),
      search: searchTerm.trim(),
      sortBy: sortConfig.sortBy,
      sortOrder: sortConfig.sortOrder,
      approvedDateFrom,
      approvedDateTo,
      minRequestedAmount: isMoreThan50KRequired ? 50000 : "",
      zone,
    });

    return response.applications || [];
  };

  const buildPdfDocument = (rows) => {
    const document = new jsPDF("landscape");
    const pageHeight = document.internal.pageSize.height;
    const pageWidth = document.internal.pageSize.width;
    const reportDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    document.setFontSize(16);
    document.text("Report Generation", 14, 18);
    document.setFontSize(10);
    document.text(`Generated on: ${reportDate}`, 14, 26);

    autoTable(document, {
      startY: 32,
      head: [[
        "Sr. No",
        "HRMS No",
        "Username",
        "Phone No",
        "Requested Amount",
        "Approved Amount",
        "Approved Amount Date",
        "Bank Account No.",
      ]],
      body: rows.map((application, index) => [
        index + 1,
        application.hrmsNo,
        application.username,
        application.phoneNo || "-",
        formatPdfCurrency(application.requestedAmount),
        formatPdfCurrency(application.approvedAmount),
        formatDate(application.approvedAmountDate),
        application.savingsAccountNo || "-",
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

    const totalApproved = rows.reduce(
      (sum, application) => sum + Number(application.approvedAmount || 0),
      0,
    );
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
      `Total Approved Amount: ${formatPdfCurrency(totalApproved)}`,
      14,
      summaryY,
    );
    document.setFont(undefined, "normal");

    return document;
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);

    try {
      const rows = await fetchAllRowsForExport();
      const document = buildPdfDocument(rows);
      document.save("report-generation.pdf");
    } catch (exportError) {
      console.error("Error exporting PDF:", exportError);
      setError("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintPdf = async () => {
    setIsPrinting(true);

    try {
      const rows = await fetchAllRowsForExport();
      const document = buildPdfDocument(rows);
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
    } catch (printError) {
      console.error("Error printing PDF:", printError);
      setError("Failed to prepare print preview. Please try again.");
    } finally {
      setIsPrinting(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);

    try {
      const rows = await fetchAllRowsForExport();
      const exportData = rows.map((application, index) => ({
        "Sr. No": index + 1,
        "HRMS No": application.hrmsNo,
        Username: application.username,
        "Phone No": application.phoneNo || "-",
        "Requested Amount": Number(application.requestedAmount || 0),
        "Approved Amount": Number(application.approvedAmount || 0),
        "Approved Amount Date": formatDate(application.approvedAmountDate),
        "Bank Account No.": application.savingsAccountNo || "-",
        Zone: application.zone || "-",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report Generation");
      XLSX.writeFile(workbook, "report-generation.xlsx");
    } catch (excelError) {
      console.error("Error exporting Excel:", excelError);
      setError("Failed to export Excel. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const sortIcon =
    sortConfig.sortOrder === "asc" ? (
      <FaSortAmountUp size={12} />
    ) : (
      <FaSortAmountDown size={12} />
    );

  const activeFilters = [
    approvedDateFrom && approvedDateTo
      ? {
          key: "dateRange",
          label: `Date: ${approvedDateFrom} to ${approvedDateTo}`,
          onDelete: () => {
            setApprovedDateFrom("");
            setApprovedDateTo("");
          },
        }
      : null,
    approvedDateFrom && !approvedDateTo
      ? {
          key: "dateFrom",
          label: `From: ${approvedDateFrom}`,
          onDelete: () => setApprovedDateFrom(""),
        }
      : null,
    !approvedDateFrom && approvedDateTo
      ? {
          key: "dateTo",
          label: `To: ${approvedDateTo}`,
          onDelete: () => setApprovedDateTo(""),
        }
      : null,
    isMoreThan50KRequired
      ? {
          key: "moreThan50K",
          label: "Requested Amount > 50K",
          onDelete: () => setIsMoreThan50KRequired(false),
        }
      : null,
    zone
      ? {
          key: "zone",
          label: `Zone: ${zone}`,
          onDelete: () => setZone(""),
        }
      : null,
  ].filter(Boolean);

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
              Report Generation
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: "#64748b" }}>
              View all approved applications with approved amount greater than
              zero, then export or print the report.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.5,
              alignItems: { xs: "stretch", sm: "center" },
              flexWrap: "wrap",
            }}
          >
            <TextField
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by username, HRMS no or phone no"
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 320 }, backgroundColor: "#fff" }}
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
              onClick={handleDownloadPdf}
              disabled={isExporting || isPrinting || totalRecords === 0}
              startIcon={<FaDownload />}
              sx={{
                minWidth: 170,
                height: 40,
                fontWeight: 600,
                fontSize: "0.82rem",
              }}
            >
              {isExporting ? "Preparing..." : "Download PDF"}
            </Button>

            <Button
              variant="outlined"
              onClick={handleExportExcel}
              disabled={isExporting || isPrinting || totalRecords === 0}
              startIcon={<FaFileExcel />}
              sx={{ minWidth: 170, height: 40, fontWeight: 600 }}
            >
              Excel Export
            </Button>

            <Button
              variant="outlined"
              onClick={handlePrintPdf}
              disabled={isPrinting || isExporting || totalRecords === 0}
              startIcon={<FaPrint />}
              sx={{ minWidth: 170, height: 40, fontWeight: 600 }}
            >
              {isPrinting ? "Opening Print..." : "Print PDF"}
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 1.5,
            alignItems: { xs: "stretch", lg: "center" },
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="Approved Date From"
            type="date"
            size="small"
            value={approvedDateFrom}
            onChange={(event) => setApprovedDateFrom(event.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: { xs: "100%", sm: 190 }, backgroundColor: "#fff" }}
          />

          <TextField
            label="Approved Date To"
            type="date"
            size="small"
            value={approvedDateTo}
            onChange={(event) => setApprovedDateTo(event.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: { xs: "100%", sm: 190 }, backgroundColor: "#fff" }}
          />

          <TextField
            select
            label="Zone"
            size="small"
            value={zone}
            onChange={(event) => setZone(event.target.value)}
            sx={{ minWidth: { xs: "100%", sm: 240 }, backgroundColor: "#fff" }}
          >
            <MenuItem value="">All Zones</MenuItem>
            {REGION.map((region) => (
              <MenuItem key={region} value={region}>
                {region}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant={isMoreThan50KRequired ? "contained" : "outlined"}
            onClick={() => setIsMoreThan50KRequired((previous) => !previous)}
            sx={{ minWidth: 220, height: 40, fontWeight: 600 }}
          >
            More than 50K required
          </Button>
        </Box>

        {activeFilters.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            {activeFilters.map((filter) => (
              <Chip
                key={filter.key}
                label={filter.label}
                onDelete={filter.onDelete}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        ) : null}

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
            Total records: {totalRecords}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f766e" }}>
            Current page approved amount sum: {formatCurrency(totalApprovedAmount)}
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
          <>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 2,
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
                    <TableCell sx={{ fontWeight: 700 }}>Phone No</TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, cursor: "pointer" }}
                      onClick={() => handleSort("requestedAmount")}
                    >
                      Requested Amount{" "}
                      {sortConfig.sortBy === "requestedAmount" ? sortIcon : null}
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, cursor: "pointer" }}
                      onClick={() => handleSort("approvedAmount")}
                    >
                      Approved Amount{" "}
                      {sortConfig.sortBy === "approvedAmount" ? sortIcon : null}
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, cursor: "pointer" }}
                      onClick={() => handleSort("approvedAmountDate")}
                    >
                      Approved Amount Date{" "}
                      {sortConfig.sortBy === "approvedAmountDate" ? sortIcon : null}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      Bank Account No.
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((application, index) => (
                    <TableRow key={application.id} hover>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>{application.hrmsNo}</TableCell>
                      <TableCell>{application.username}</TableCell>
                      <TableCell>{application.phoneNo || "-"}</TableCell>
                      <TableCell>{formatCurrency(application.requestedAmount)}</TableCell>
                      <TableCell>{formatCurrency(application.approvedAmount)}</TableCell>
                      <TableCell>{formatDate(application.approvedAmountDate)}</TableCell>
                      <TableCell>{application.savingsAccountNo || "-"}</TableCell>
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
                Showing page {page} of {totalPages}
              </Typography>

              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
