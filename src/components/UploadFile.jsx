import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Alert,
  Paper
} from "@mui/material";
import {
  Upload as UploadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon
} from "@mui/icons-material";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";

export default function UploadComponent({
  maxFileSizeMB = 10,
  accept = ["image/jpeg", "image/png", "image/jpg"],
  applicantSignature,
  hrmsNo,
  onUpload
}) {

  const [documents, setDocuments] = useState([
    { id: 1, name: "dischargeCertificate", file: null, previewUrl: null, isMandatory: true },
    { id: 2, name: "doctorPrescription", file: null, previewUrl: null, isMandatory: true },
    { id: 3, name: "medicineBills", file: null, previewUrl: null, isMandatory: true },
    { id: 4, name: "diagnosticReports", file: null, previewUrl: null, isMandatory: true },
  ]);

  const [dynamicRows, setDynamicRows] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: "", severity: "error" });

  const showAlert = (message, severity = "error") => {
    setAlert({ show: true, message, severity });
    setTimeout(() => setAlert({ show: false, message: "", severity: "error" }), 3000);
  };

  // ------------------------ VALIDATION --------------------------
  const handleFileUpload = (docId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      showAlert(`File is larger than ${maxFileSizeMB} MB`);
      return;
    }

    // Validate image type
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      showAlert("Only JPG, JPEG, PNG files are allowed");
      return;
    }

    const docRecord = documents.find(d => d.id === docId) || dynamicRows.find(d => d.id === docId);

    const previewUrl = URL.createObjectURL(file);

    // update state
    setDocuments(prev =>
      prev.map(doc => (doc.id === docId ? { ...doc, file, previewUrl } : doc))
    );

    setDynamicRows(prev =>
      prev.map(row => (row.id === docId ? { ...row, file, previewUrl } : row))
    );

    if (docRecord) {
      const formattedName = docRecord.name.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
      toast.success(`${formattedName} uploaded successfully.`);
    }
  };

  const handleRemoveFile = (docId) => {
    setDocuments(prev =>
      prev.map(doc => (doc.id === docId ? { ...doc, file: null, previewUrl: null } : doc))
    );
    setDynamicRows(prev =>
      prev.map(row => (row.id === docId ? { ...row, file: null, previewUrl: null } : row))
    );
    toast.info("Document removed successfully.");
  };

  // ------------------------ ADD/REMOVE ROWS --------------------------
  const addDynamicRow = () => {
    if (dynamicRows.length >= 5) {
      showAlert("Maximum 5 additional documents allowed", "warning");
      return;
    }

    const newId = Math.max(...documents.map(d => d.id), ...dynamicRows.map(d => d.id), 0) + 1;

    setDynamicRows(prev => [
      ...prev,
      { id: newId, name: `Document ${dynamicRows.length + 1}`, file: null, previewUrl: null, isMandatory: false }
    ]);
  };

  const removeDynamicRow = (id) => {
    setDynamicRows(prev => prev.filter(row => row.id !== id));
  };

  // ------------------------ CLOUDINARY UPLOAD --------------------------
  const CLOUD_NAME = "dcnzddzni";
  const UPLOAD_PRESET = "welfare_uploads";
  const CLOUD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const uploadToCloudinary = async (file, folderPath, publicId) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);
    fd.append("folder", folderPath);
    fd.append("public_id", publicId);

    const res = await axios.post(CLOUD_URL, fd);
    return res.data.secure_url;
  };

  // ------------------------ FORM SUBMIT --------------------------
  const handleSubmit = async () => {
    // ensure mandatory docs
    for (let doc of documents) {
      if (doc.isMandatory && !doc.file) {
        showAlert(`Please upload ${doc.name}`, "warning");
        return;
      }
    }

    if (!applicantSignature) {
      showAlert("Please upload applicant signature", "warning");
      return;
    }

    const id = uuidv4();
    let urls = {};

    const allDocs = [...documents, ...dynamicRows].filter(doc => doc.file);

    try {
      // upload signature
      const signPath = `welfare_uploads/${hrmsNo}/${id}`;
      const applicantSignatureUrl = await uploadToCloudinary(
        applicantSignature,
        signPath,
        "applicantSignature"
      );

      // upload other docs
      for (let doc of allDocs) {
        const path = `welfare_uploads/${hrmsNo}/${id}`;
        const publicId = doc.name.replace(/\s+/g, "_");

        const url = await uploadToCloudinary(doc.file, path, publicId);
        urls[doc.name] = url;
      }

      toast.success("All documents uploaded successfully! They are now ready for printing or final form submission.");

      const tempUpload = {...{
        id,
        isUploaded: true,
        applicantSignature: applicantSignatureUrl,
        urls,
        length: allDocs.length
      }};

      onUpload(tempUpload);

    } catch (error) {
      console.error("Upload failed:", error);
      showAlert("Upload failed!", "error");
    }
  };

  // ------------------------ UI COMPONENT --------------------------
  const DocumentCard = ({ doc, onFileUpload, onRemove, onFileRemove }) => (
    <Card sx={{ mb: 2, boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: 2, backgroundColor: doc.file ? '#f0fdf4' : '#f8fafc' }}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap={{ xs: 'wrap', sm: 'nowrap' }} gap={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <DescriptionIcon sx={{ color: doc.file ? '#22c55e' : '#94a3b8' }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#334155', lineHeight: 1.2 }}>{doc.name}</Typography>
              {doc.isMandatory && (
                <Chip label="Required" size="small" sx={{ ml: 1, height: 20, fontSize: '0.65rem', backgroundColor: '#fee2e2', color: '#ef4444' }} />
              )}
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            {doc.file ? (
              <Chip
                icon={<CheckCircleIcon />}
                label={doc.file.name}
                color="success"
                variant="outlined"
                onDelete={() => onFileRemove(doc.id)}
              />
            ) : (
              <Button variant="contained" component="label" startIcon={<UploadIcon />}>
                Upload
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => onFileUpload(doc.id, e)}
                  hidden
                />
              </Button>
            )}

            {!doc.isMandatory && (
              <IconButton color="error" size="small" onClick={onRemove}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // ------------------------ RENDER --------------------------
  return (
    <Box sx={{ width: '100%', mt: 4, pt: 4, borderTop: '2px dashed #e2e8f0', '@media print': { borderTop: 'none', mt: 0, pt: 0 } }}>
      <Box sx={{ '@media print': { display: 'none' } }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e293b' }}>
          आवश्यक कागदपत्रे अपलोड करा (Upload Documents)
        </Typography>

        {alert.show && (
          <Alert severity={alert.severity} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        <Paper elevation={0} sx={{ p: 0, pt: 1, backgroundColor: 'transparent' }}>
          {documents.map(doc => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onFileUpload={handleFileUpload}
              onFileRemove={handleRemoveFile}
            />
          ))}

          {dynamicRows.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'bold', color: '#475569' }}>
                Additional Documents
              </Typography>

              {dynamicRows.map(doc => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  onFileUpload={handleFileUpload}
                  onRemove={() => removeDynamicRow(doc.id)}
                  onFileRemove={handleRemoveFile}
                />
              ))}
            </>
          )}

          <Box display="flex" justifyContent="flex-start" gap={2} mt={3}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={addDynamicRow} sx={{ textTransform: 'none', borderColor: '#cbd5e1', color: '#475569' }}>
              Add Extra Document ({dynamicRows.length}/5)
            </Button>

            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ textTransform: 'none', backgroundColor: '#3b82f6', boxShadow: 'none' }}>
              Submit All Documents
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Print rendering container mapping preview URLs to physical page ends */}
      <Box sx={{ display: 'none', '@media print': { display: 'block', mt: 4 } }}>
         {[...documents, ...dynamicRows].filter(d => d.previewUrl).map((doc, idx) => (
             <div key={idx} style={{ pageBreakBefore: 'always', width: '100%', textAlign: 'center', paddingTop: '20px' }}>
                <h2 style={{ marginBottom: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>{doc.name} Attachment</h2>
                <img src={doc.previewUrl} alt={doc.name} style={{ maxWidth: '100%', maxHeight: '900px', objectFit: 'contain' }} />
             </div>
         ))}
      </Box>

    </Box>
  );
}
