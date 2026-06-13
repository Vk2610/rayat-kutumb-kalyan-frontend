import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Alert,
  Paper,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

export default function UploadComponent({
  maxFileSizeMB = 10,
  accept = ['image/jpeg', 'image/png', 'image/jpg'],
  applicantSignature,
  hrmsNo,
  onUpload,
  onFileChange,
  existingDocs = null,
}) {
  const [documents, setDocuments] = useState(() => {
    const defaultDocs = [
      {
        id: 1,
        name: 'dischargeCertificate',
        file: null,
        previewUrl: existingDocs?.dischargeCertificate || null,
        isMandatory: true,
      },
      {
        id: 2,
        name: 'doctorPrescription',
        file: null,
        previewUrl: existingDocs?.doctorPrescription || null,
        isMandatory: true,
      },
      {
        id: 3,
        name: 'medicineBills',
        file: null,
        previewUrl: existingDocs?.medicineBills || null,
        isMandatory: true,
      },
      {
        id: 4,
        name: 'diagnosticReports',
        file: null,
        previewUrl: existingDocs?.diagnosticReports || null,
        isMandatory: true,
      },
    ];
    return defaultDocs;
  });

  const [dynamicRows, setDynamicRows] = useState(() => {
    if (!existingDocs) return [];
    const rows = [];
    let idCounter = 5;
    for (let i = 1; i <= 5; i++) {
      const key = `otherDoc${i}`;
      if (existingDocs[key]) {
        rows.push({
          id: idCounter++,
          name: key,
          file: null,
          previewUrl: existingDocs[key],
          isMandatory: false,
        });
      }
    }
    return rows;
  });
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    severity: 'error',
  });

  const showAlert = (message, severity = 'error') => {
    setAlert({ show: true, message, severity });
    setTimeout(
      () => setAlert({ show: false, message: '', severity: 'error' }),
      3000,
    );
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
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      showAlert('Only JPG, JPEG, PNG files are allowed');
      return;
    }

    const docRecord =
      documents.find((d) => d.id === docId) ||
      dynamicRows.find((d) => d.id === docId);

    const previewUrl = URL.createObjectURL(file);

    // update state
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, file, previewUrl } : doc,
      ),
    );

    setDynamicRows((prev) =>
      prev.map((row) =>
        row.id === docId ? { ...row, file, previewUrl } : row,
      ),
    );

    if (onFileChange) onFileChange();

    if (docRecord) {
      const formattedName = docRecord.name.startsWith('otherDoc')
        ? `Other Document ${docRecord.name.replace('otherDoc', '')}`
        : docRecord.name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase());
      toast.success(`${formattedName} uploaded successfully.`);
    }
  };

  const handleRemoveFile = (docId) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, file: null, previewUrl: null } : doc,
      ),
    );
    setDynamicRows((prev) =>
      prev.map((row) =>
        row.id === docId ? { ...row, file: null, previewUrl: null } : row,
      ),
    );
    if (onFileChange) onFileChange();
    toast.info('Document removed successfully.');
  };

  // ------------------------ ADD/REMOVE ROWS --------------------------
  const addDynamicRow = () => {
    if (dynamicRows.length >= 5) {
      showAlert('Maximum 5 additional documents allowed', 'warning');
      return;
    }

    const newId =
      Math.max(
        ...documents.map((d) => d.id),
        ...dynamicRows.map((d) => d.id),
        0,
      ) + 1;

    // Find next available otherDoc key from otherDoc1 to otherDoc5
    let nextIndex = 1;
    while (dynamicRows.some((row) => row.name === `otherDoc${nextIndex}`)) {
      nextIndex++;
    }
    const newName = `otherDoc${nextIndex}`;

    setDynamicRows((prev) => [
      ...prev,
      {
        id: newId,
        name: newName,
        file: null,
        previewUrl: null,
        isMandatory: false,
      },
    ]);

    if (onFileChange) onFileChange();
  };

  const removeDynamicRow = (id) => {
    setDynamicRows((prev) => prev.filter((row) => row.id !== id));
    if (onFileChange) onFileChange();
  };

  // ------------------------ CLOUDINARY UPLOAD --------------------------
  const CLOUD_NAME = 'dcnzddzni';
  const UPLOAD_PRESET = 'welfare_uploads';
  const CLOUD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const uploadToCloudinary = async (file, folderPath, publicId) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', UPLOAD_PRESET);
    fd.append('folder', folderPath);
    fd.append('public_id', publicId);

    const res = await axios.post(CLOUD_URL, fd);
    return res.data.secure_url;
  };

  // ------------------------ FORM SUBMIT --------------------------
  const handleSubmit = async () => {
    // ensure mandatory docs
    for (let doc of documents) {
      if (doc.isMandatory && !doc.file && !doc.previewUrl) {
        const formattedName = doc.name
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase());
        showAlert(`Please upload ${formattedName}`, 'warning');
        return;
      }
    }

    if (!applicantSignature) {
      showAlert('Please upload applicant signature', 'warning');
      return;
    }

    const id = existingDocs?.id || uuidv4();
    let urls = {
      otherDoc1: null,
      otherDoc2: null,
      otherDoc3: null,
      otherDoc4: null,
      otherDoc5: null,
    };

    try {
      // upload signature
      let applicantSignatureUrl = applicantSignature;
      if (applicantSignature instanceof File) {
        const signPath = `welfare_uploads/${hrmsNo}/${id}`;
        applicantSignatureUrl = await uploadToCloudinary(
          applicantSignature,
          signPath,
          'applicantSignature',
        );
      }

      // upload other docs
      for (let doc of [...documents, ...dynamicRows]) {
        if (doc.file) {
          const path = `welfare_uploads/${hrmsNo}/${id}`;
          const publicId = doc.name.replace(/\s+/g, '_');

          const url = await uploadToCloudinary(doc.file, path, publicId);
          urls[doc.name] = url;
        } else if (doc.previewUrl) {
          urls[doc.name] = doc.previewUrl;
        }
      }

      toast.success(
        'All documents uploaded successfully! They are now ready for printing or final form submission.',
      );

      const tempUpload = {
        id,
        isUploaded: true,
        applicantSignature: applicantSignatureUrl,
        urls,
        length: [...documents, ...dynamicRows].filter(d => d.file || d.previewUrl).length,
      };

      onUpload(tempUpload);
    } catch (error) {
      console.error('Upload failed:', error);
      showAlert('Upload failed!', 'error');
    }
  };

  // ------------------------ UI COMPONENT --------------------------
  const DocumentCard = ({ doc, onFileUpload, onRemove, onFileRemove }) => (
    <Card
      sx={{
        mb: 2,
        boxShadow: 'none',
        border: '1px solid #e2e8f0',
        borderRadius: 2,
        backgroundColor: (doc.file || doc.previewUrl) ? '#f0fdf4' : '#f8fafc',
      }}
    >
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <DescriptionIcon sx={{ color: (doc.file || doc.previewUrl) ? '#22c55e' : '#94a3b8' }} />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: '#334155', lineHeight: 1.2 }}
              >
                {doc.name.startsWith('otherDoc') 
                  ? `Other Document ${doc.name.replace('otherDoc', '')}`
                  : doc.name.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </Typography>
              {doc.isMandatory && (
                <Chip
                  label="Required"
                  size="small"
                  sx={{
                    ml: 1,
                    height: 20,
                    fontSize: '0.65rem',
                    backgroundColor: '#fee2e2',
                    color: '#ef4444',
                  }}
                />
              )}
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            {doc.file || doc.previewUrl ? (
              <Chip
                icon={<CheckCircleIcon />}
                label={doc.file ? doc.file.name : 'Existing Document'}
                color="success"
                variant="outlined"
                onDelete={() => onFileRemove(doc.id)}
              />
            ) : (
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
              >
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
    <Box
      sx={{
        width: '100%',
        mt: 4,
        pt: 4,
        borderTop: '2px dashed #e2e8f0',
        '@media print': { borderTop: 'none', mt: 0, pt: 0 },
      }}
    >
      <Box sx={{ '@media print': { display: 'none' } }}>
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 'bold', color: '#1e293b' }}
        >
          आवश्यक कागदपत्रे अपलोड करा (Upload Documents)
        </Typography>

        {alert.show && (
          <Alert severity={alert.severity} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{ p: 0, pt: 1, backgroundColor: 'transparent' }}
        >
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onFileUpload={handleFileUpload}
              onFileRemove={handleRemoveFile}
            />
          ))}

          {dynamicRows.length > 0 && (
            <>
              <Typography
                variant="subtitle1"
                sx={{ mt: 3, mb: 1, fontWeight: 'bold', color: '#475569' }}
              >
                Additional Documents
              </Typography>

              {dynamicRows.map((doc) => (
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
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addDynamicRow}
              sx={{
                textTransform: 'none',
                borderColor: '#cbd5e1',
                color: '#475569',
              }}
            >
              Add Extra Document ({dynamicRows.length}/5)
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{
                textTransform: 'none',
                backgroundColor: '#3b82f6',
                boxShadow: 'none',
              }}
            >
              Submit All Documents
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Print rendering container mapping preview URLs into fixed-size pages */}
      <Box
        sx={{
          display: 'none',
          '@media print': {
            display: 'block',
            mt: 0,
            pageBreakBefore: 'always',
            breakBefore: 'page',
          },
        }}
      >
        {[...documents, ...dynamicRows]
          .filter((d) => d.previewUrl)
          .map((doc, idx) => (
            <Box
              key={idx}
              sx={{
                width: '195mm',
                height: '285mm',
                margin: '0 auto',
                padding: '6mm',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fff',
                pageBreakBefore: 'always',
                pageBreakAfter: 'always',
                pageBreakInside: 'avoid',
                breakBefore: 'page',
                breakAfter: 'page',
                breakInside: 'avoid-page',
              }}
            >
              <Typography
                sx={{
                  mb: 1,
                  fontSize: '13pt',
                  fontWeight: 700,
                  textAlign: 'center',
                  color: '#0f172a',
                  flexShrink: 0,
                }}
              >
                {doc.name.startsWith('otherDoc') 
                  ? `Other Document ${doc.name.replace('otherDoc', '')}`
                  : doc.name.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} Attachment
              </Typography>

              <Box
                sx={{
                  flex: 1,
                  width: '100%',
                  minHeight: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#fff',
                  p: '2mm',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="img"
                  src={doc.previewUrl}
                  alt={doc.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    display: 'block',
                  }}
                />
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
}
