import { useState, useEffect } from "react";
import axios from "axios";
import UploadFile from "../../components/UploadFile";
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from "jwt-decode";

export default function SevakWelfareForm() {

  const [form, setForm] = useState({
    hrmsNo: "",
    applicantName: "",
    branchName: "",
    joiningDate: "",
    designation: "",
    totalService: "",
    monthlySalary: "",
    mobileNo: "",
    patientName: "",
    relation: "Self",
    illnessNature: "",
    illnessDuration: "",
    medicineBill: 0,
    doctorBill: 0,
    otherExpenses: 0,
    totalExpenses: 0,
    certificatesAttached: 'à¤¹à¥‹à¤¯',
    sanctionLetter: "",
    previousHelp: "à¤¹à¥‹à¤¯",
    previousHelpDetails: "",
    annualDeductions: "à¤¹à¥‹à¤¯",
    requestedAmountNumbers: 0,
    requestedAmountWords: "",
    branchNameForDeposit: "",
    savingsAccountNo: "",
    officerRecommendation: "",
    applicantSignature: null,
  });

  const [uploads, setUploads] = useState({
    id: '',
    isUploaded: false,
    applicantSignature: '',
    urls: {},
    length: 0
  });
  const [signaturePreview, setSignaturePreview] = useState(null);
  // const [files, setFiles] = useState([]);

  const handleDocsUpload = (upds) => {
    console.log("handleDocsUpload called ");
    if (!upds.isUploaded) return;
    setUploads(upds);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  useEffect(() => {
    const med = Number(form.medicineBill) || 0;
    const doc = Number(form.doctorBill) || 0;
    const oth = Number(form.otherExpenses) || 0;
    const total = med + doc + oth;
    
    if (form.totalExpenses !== total) {
      setForm((prev) => ({ ...prev, totalExpenses: total }));
    }
  }, [form.medicineBill, form.doctorBill, form.otherExpenses]);

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        alert("Please upload a valid image or PDF file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }
      setForm((p) => ({ ...p, applicantSignature: file }));

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setSignaturePreview(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setSignaturePreview(null);
      }
    }
  };

  const handlePrint = (e) => {
    e.preventDefault();
    window.print();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.applicantName || !form.branchName || !form.mobileNo) {
      alert("Please fill in all required fields (Name, Branch, Mobile)");
      return;
    }

    if (!uploads.isUploaded || !uploads.id || !uploads.applicantSignature) {
      alert("Please upload and submit all required documents before submitting the welfare form.");
      return;
    }

    if (form.certificatesAttached === 'à¤¨à¤¾à¤¹à¥€') {
      alert('please upload documents and update the documents attached status');
      return;
    }

    try {

      const today = new Date();

      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); 
      const yyyy = today.getFullYear();

      const formattedDate = `${dd}/${mm}/${yyyy}`;

      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const formData = {
        ...form,
        ...uploads.urls,
        formDate: formattedDate,
        applicantSignature: uploads.applicantSignature,
        hrmsNo: decoded.hrmsNo,
        patientId: uuidv4(),
        expensesId: uuidv4(),
        requestId: uploads.id,
        previousId: uuidv4(),
      };

      console.log(`request id: ${formData.requestId}`);

      const response = await axios.post(
        "https://rayat-backend.onrender.com/user/submit-welfare-form",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Form submitted successfully!");
      } else {
        alert(`status code: ${response.status}`);
      }

      console.log("Response:", response.data);

      setForm({
        hrmsNo: "",
        applicantName: "",
        branchName: "",
        joiningDate: "",
        designation: "",
        totalService: "",
        monthlySalary: "",
        mobileNo: "",
        patientName: "",
        relation: "Self",
        illnessNature: "",
        illnessDuration: "",
        medicineBill: 0,
        doctorBill: 0,
        otherExpenses: 0,
        totalExpenses: 0,
        certificatesAttached: 'à¤¹à¥‹à¤¯',
        sanctionLetter: "",
        previousHelp: "à¤¹à¥‹à¤¯",
        previousHelpDetails: "",
        annualDeductions: "à¤¹à¥‹à¤¯",
        requestedAmountNumbers: 0,
        requestedAmountWords: "",
        branchNameForDeposit: "",
        savingsAccountNo: "",
        officerRecommendation: "",
        applicantSignature: null,
      });

      setUploads({
        id: '',
        isUploaded: false,
        applicantSignature: '',
        urls: {},
        length: 0
      });
      setSignaturePreview(null);

    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Server error. Please try again.");
    }
  };


  return (
    <div className="min-h-screen bg-neutral-100 py-6 px-4 sm:px-6 lg:px-8">
      {/* Import Noto Sans Devanagari for Marathi */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap');`}
      </style>

      <div
        className="max-w-6xl mx-auto bg-white shadow-md rounded-md p-8 print:p-4 print:shadow-none print:rounded-none"
        style={{ fontSize: "1.5rem", lineHeight: "1.6" }}
      >
        {/* Form area */}
        <form className="text-gray-900">
          {/* Header (keeps same Marathi text) */}
          <div
            className="text-center mb-4 print:mb-2"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <h1 className="text-2xl font-bold">
              à¤°à¤¯à¤¤ à¤¶à¤¿à¤•à¥à¤·à¤£ à¤¸à¤‚à¤¸à¥à¤¥à¤¾, à¤°à¤¯à¤¤ à¤¸à¥‡à¤µà¤• à¤µà¥‡à¤²à¤«à¥‡à¤…à¤° à¤«à¤‚à¤¡, à¤¸à¤¾à¤¤à¤¾à¤°à¤¾.
            </h1>
            <h2 className="text-xl underline font-medium mt-1">
              à¤®à¤¦à¤¤ à¤®à¤¾à¤—à¤£à¥€ à¤…à¤°à¥à¤œ
            </h2>
          </div>

          {/* Address block */}
          <div
            className="mb-4 text-base"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <p>à¤ªà¥à¤°à¤¤à¤¿,</p>
            <p>à¤®à¤¾. à¤šà¥‡à¤…à¤°à¤®à¤¨à¤¸à¥‹,</p>
            <p>à¤°à¤¯à¤¤ à¤¶à¤¿à¤•à¥à¤·à¤£ à¤¸à¤‚à¤¸à¥à¤¥à¤¾, à¤°à¤¯à¤¤ à¤¸à¥‡à¤µà¤• à¤µà¥‡à¤²à¤«à¥‡à¤…à¤° à¤«à¤‚à¤¡, à¤¸à¤¾à¤¤à¤¾à¤°à¤¾.</p>
          </div>

          <div
            className="mb-4 text-base"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <p className="ml-10">
              <strong>
                à¤µà¤¿à¤·à¤¯: à¤¸à¥‡à¤µà¤• à¤µà¥‡à¤²à¥à¤«à¥‡à¤…à¤° à¤«à¤‚à¤¡à¤¾à¤¤à¥‚à¤¨ à¤†à¤°à¥à¤¥à¤¿à¤• à¤®à¤¦à¤¤ à¤®à¤¿à¤³à¤£à¥à¤¯à¤¾à¤¬à¤¾à¤¬à¤¤.
              </strong>
            </p>
          </div>

          <div
            className="mb-6 text-base"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <p>
              à¤®à¤¹à¤¾à¤¶à¤¯, <br />
              <p className="ml-5">
                à¤®à¥€ à¤–à¤¾à¤²à¥€à¤² à¤•à¤¾à¤°à¤£à¤¾à¤•à¤°à¤¿à¤¤à¤¾ à¤†à¤ªà¤²à¥à¤¯à¤¾ à¤¸à¥‡à¤µà¤• à¤µà¥‡à¤²à¥à¤«à¥‡à¤…à¤° à¤«à¤‚à¤¡à¤¾à¤¤à¥‚à¤¨ à¤†à¤°à¥à¤¥à¤¿à¤• à¤®à¤¦à¤¤
                à¤®à¤¿à¤³à¤¾à¤µà¥€ à¤®à¥à¤¹à¤£à¥‚à¤¨ à¤¹à¤¾ à¤…à¤°à¥à¤œ à¤•à¤°à¥€à¤¤ à¤†à¤¹à¥‡. à¤¤à¥à¤¯à¤¾à¤¸à¤¾à¤ à¥€ à¤®à¥€ à¤®à¤¾à¤à¥€ à¤ªà¥à¤¢à¥€à¤²à¤ªà¥à¤°à¤®à¤¾à¤£à¥‡
                à¤®à¤¾à¤¹à¤¿à¤¤à¥€ à¤¦à¥‡à¤¤ à¤†à¤¹à¥‡.
              </p>
            </p>
          </div>

          {/* 1. Applicant details */}
          <div
            className="mb-4 space-y-3"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <div className="flex items-center gap-3 text-base">
              <div className="w-1/3">
                à¥§ à¤…) à¤…à¤°à¥à¤œà¤¦à¤¾à¤°à¤¾à¤šà¥‡ à¤¸à¤‚à¤ªà¥‚à¤°à¥à¤£ à¤¨à¤¾à¤µ (à¤ªà¥à¤°à¤¥à¤® à¤†à¤¡à¤¨à¤¾à¤µ )
              </div>
              <div className="flex-1">
                <input
                  name="applicantName"
                  value={form.applicantName}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                  placeholder="_______________________________________"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 text-base">
              <div className="w-1/3">à¤¬) à¤¶à¤¾à¤–à¥‡à¤šà¥‡ à¤¨à¤¾à¤µ</div>
              <div className="flex-1">
                <input
                  name="branchName"
                  value={form.branchName}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                  placeholder="_______________________________________________________"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-base">
              <div className="flex-1 min-w-40">
                à¤•) à¤¨à¥‡à¤®à¤£à¥‚à¤• à¤¤à¤¾à¤°à¥€à¤–
                <div>
                  <input
                    name="joiningDate"
                    value={form.joiningDate}
                    onChange={handleChange}
                    type="date"
                    className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-[120px]">
                à¤¡)à¤¹à¥à¤¦à¥à¤¦à¤¾
                <div>
                  <input
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                    placeholder="____"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-40">
                à¤ˆ) à¤¸à¤‚à¤¸à¥à¤¥à¥‡à¤¤à¥€à¤² à¤à¤•à¥‚à¤£ à¤¸à¥‡à¤µà¤¾à¤•à¤¾à¤²à¤¾à¤µà¤§à¥€
                <div>
                  <input
                    name="totalService"
                    value={form.totalService}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                    placeholder="______________"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Salary and mobile */}
          <div
            className="mb-4 text-base"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-1/2">à¥¨. à¤¦à¤°à¤®à¤¹à¤¾ à¤¸à¤°à¥à¤µ à¤ªà¤—à¤¾à¤°</div>
              <div className="w-1/2">
                <input
                  name="monthlySalary"
                  value={form.monthlySalary}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                  placeholder="__________________"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <div className="w-1/2">à¤®à¥‹à¤¬à¤¾à¤ˆà¤² à¤¨à¤‚.</div>
              <div className="w-1/2">
                <input
                  name="mobileNo"
                  value={form.mobileNo}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                  placeholder="________________________"
                />
              </div>
            </div>
          </div>

          {/* 3. Patient details */}
          <div
            className="mb-4 space-y-3 text-base"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <div className="flex gap-3 items-start">
              <div className="w-1/3">
                à¥©. à¤…) à¤œà¥à¤¯à¤¾à¤šà¥‡ à¤†à¤œà¤¾à¤°à¤¾à¤¸à¤¾à¤ à¥€ à¤®à¤¦à¤¤ à¤¹à¤µà¥€ à¤†à¤¹à¥‡ à¤¤à¥à¤¯à¤¾à¤šà¥‡ à¤¸à¤‚à¤ªà¥‚à¤°à¥à¤£ à¤¨à¤¾à¤µ
              </div>
              <div className="flex-1">
                <input
                  name="patientName"
                  value={form.patientName}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                  placeholder="______________________________________"
                />
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-1/3">à¤¸à¥‡à¤µà¤•à¤¾à¤¶à¥€ à¤¨à¤¾à¤¤à¥‡</div>
              <div className="w-1/3">
                <select
                  name="relation"
                  value={form.relation}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                  placeholder="________________"
                >
                  <option value="Self">Self</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                </select>
              </div>

              <div className="w-1/3">
                à¤¬) à¤†à¤œà¤¾à¤°à¤¾à¤šà¥‡ à¤¸à¥à¤µà¤°à¥‚à¤ª
                <input
                  name="illnessNature"
                  value={form.illnessNature}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base mt-1"
                  placeholder="_________________________"
                />
              </div>
            </div>

            <div>
              à¤•) à¤†à¤œà¤¾à¤°à¤¾à¤šà¤¾ à¤•à¤¾à¤²à¤¾à¤µà¤§à¥€
              <input
                name="illnessDuration"
                value={form.illnessDuration}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base mt-1"
                placeholder="__________________________________________________"
              />
            </div>
          </div>

          {/* 4. Bills and expenses */}
          <div
            className="mb-4 text-base space-y-2"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <div className="flex gap-3 items-center">
              <div className="w-1/3">à¥ª à¤…) à¤”à¤·à¤§à¥‡ à¤°à¥.</div>
              <div className="w-1/3">
                <input
                  name="medicineBill"
                  value={form.medicineBill}
                  type="number"
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                  placeholder="____________________"
                />
              </div>

              <div className="w-1/3">à¤¬) à¤¡à¥‰à¤•à¥à¤Ÿà¤°à¤¾à¤‚à¤šà¥‡ à¤¬à¤¿à¤² à¤°à¥.</div>
              <div className="w-1/3">
                <input
                  name="doctorBill"
                  type="number"
                  value={form.doctorBill}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                  placeholder="____________________"
                />
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-1/3">à¤•) à¤‡à¤¤à¤° à¤–à¤°à¥à¤š à¤°à¥.</div>
              <div className="w-1/3">
                <input
                  name="otherExpenses"
                  type="number"
                  value={form.otherExpenses}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                  placeholder="____________________"
                />
              </div>

              <div className="w-1/3">à¤¡) à¤à¤•à¥‚à¤£ à¤à¤¾à¤²à¥‡à¤²à¤¾ à¤–à¤°à¥à¤š à¤°à¥.</div>
              <div className="w-1/3">
                <input
                  name="totalExpenses"
                  type="number"
                  value={form.totalExpenses}
                  readOnly
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base bg-transparent text-gray-500 cursor-not-allowed"
                  placeholder="___________________"
                />
              </div>
            </div>
          </div>

          {/* 5-7 additional declarations */}
          <div
            className="mb-4 text-base space-y-2"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <div>
              à¥«. à¤µà¤°à¥€à¤² à¤ªà¥à¤°à¤®à¤¾à¤£à¥‡ à¤à¤¾à¤²à¥‡à¤²à¥à¤¯à¤¾ à¤–à¤°à¥à¤šà¤¾à¤šà¥€ à¤¬à¤¿à¤²à¥‡ à¤µ à¤ªà¤¾à¤µà¤¤à¥à¤¯à¤¾ à¤•à¥à¤°à¤®à¤¾à¤‚à¤• à¥¦à¥§ à¤¤à¥‡ ___
              à¤¸à¥‹à¤¬à¤¤ à¤œà¥‹à¤¡à¤²à¥‡à¤²à¥€ à¤†à¤¹à¥‡à¤¤.
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-1/2">
                à¥¬. à¤µà¤° à¤¨à¤®à¥‚à¤¦ à¤•à¥‡à¤²à¥‡à¤²à¥à¤¯à¤¾ à¤†à¤œà¤¾à¤°à¤¾à¤‚à¤¬à¤¾à¤¬à¤¤ à¤¡à¥‰à¤•à¥à¤Ÿà¤°à¤¾à¤‚à¤šà¥‡ à¤¸à¤°à¥à¤Ÿà¤¿à¤«à¤¿à¤•à¥‡à¤Ÿ à¤œà¥‹à¤¡à¤²à¥‡ à¤†à¤¹à¥‡.
              </div>
              <div className="w-1/2">
                <select
                  name="certificatesAttached"
                  value={form.certificatesAttached}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base bg-transparent"
                >
                  <option value="à¤¹à¥‹à¤¯">à¤¹à¥‹à¤¯</option>
                  <option value="à¤¨à¤¾à¤¹à¥€">à¤¨à¤¾à¤¹à¥€</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-1/3">
                à¥­. à¤¯à¤¾à¤ªà¥‚à¤°à¥à¤µà¥€ à¤«à¤‚à¤¡à¤¾à¤¤à¥‚à¤¨ à¤®à¤¦à¤¤ à¤˜à¥‡à¤¤à¤²à¥€ à¤†à¤¹à¥‡ / à¤¨à¤¾à¤¹à¥€
              </div>
              <div className="w-2/3">
                <select
                  name="previousHelp"
                  value={form.previousHelp}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base bg-transparent"
                >
                  <option value="à¤¹à¥‹à¤¯">à¤¹à¥‹à¤¯</option>
                  <option value="à¤¨à¤¾à¤¹à¥€">à¤¨à¤¾à¤¹à¥€</option>
                </select>
                <textarea
                  name="previousHelpDetails"
                  value={form.previousHelpDetails}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                />
              </div>
            </div>
          </div>

          {/* 8-9 account & requested amount */}
          <div
            className="mb-4 text-base space-y-2"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <div className="flex gap-3 items-center">
              <div className="w-1/2">
                à¥® à¤…) à¤ªà¥à¤°à¤¤à¥à¤¯à¥‡à¤• à¤µà¤°à¥à¤·à¤¾à¤¸à¤¾à¤ à¥€ à¤¸à¥‡à¤µà¤• à¤µà¥‡à¤²à¤«à¥‡à¤…à¤° à¤«à¤‚à¤¡à¤¾à¤šà¥€ à¤µà¤—à¤£à¥€ à¤¦à¤¿à¤²à¥‡à¤²à¥€ à¤†à¤¹à¥‡ à¤•à¤¾à¤¯
              </div>
              <div className="w-1/2">
                <select
                  name="annualDeductions"
                  value={form.annualDeductions}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base bg-transparent"
                  placeholder="____________________________"
                >
                  <option value="à¤¹à¥‹à¤¯">à¤¹à¥‹à¤¯</option>
                  <option value="à¤¨à¤¾à¤¹à¥€">à¤¨à¤¾à¤¹à¥€</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-1/3">
                à¥¯ à¤…) à¤†à¤¤à¤¾ à¤•à¤¿à¤¤à¥€ à¤®à¤¦à¤¤à¥€à¤šà¥€ à¤†à¤µà¤¶à¥à¤¯à¤•à¤¤à¤¾ à¤†à¤¹à¥‡ à¤¤à¥€ à¤°à¤•à¥à¤•à¤® à¤°à¥. à¤…à¤‚à¤•à¥€ à¤µ à¤…à¤•à¥à¤·à¤°à¥€
              </div>
              <div className="w-2/3">
                <input
                  name="requestedAmountNumbers"
                  type="number"
                  value={form.requestedAmountNumbers}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base mb-1"
                  placeholder="(à¤…à¤‚à¤•à¥€) ___________________"
                />
                <input
                  name="requestedAmountWords"
                  value={form.requestedAmountWords}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                  placeholder="(à¤…à¤•à¥à¤·à¤°à¥€) ____________________________________"
                />
              </div>
            </div>

            <div className="mt-2">
              à¤¬) à¤•à¤¿à¤®à¤¤à¥€à¤¨à¥‡ à¤®à¤‚à¤œà¥‚à¤° à¤•à¥‡à¤²à¥‡à¤²à¥€ à¤®à¤¦à¤¤ à¤œà¤®à¤¾ à¤°à¤¯à¤¤ à¤¸à¥‡à¤µà¤• à¤•à¥‹-à¤‘à¤ªà¤°à¥‡à¤Ÿà¤¿à¤µà¥à¤¹ à¤¬à¤à¤• à¤²à¤¿à¤®à¤¿à¤Ÿà¥‡à¤¡
              à¤¸à¤¾à¤¤à¤¾à¤°à¤¾ à¤¶à¤¾à¤–à¤¾
              <div className="flex gap-3 mt-2">
                <div className="w-1/2">
                  à¤¶à¤¾à¤–à¤¾
                  <input
                    name="branchNameForDeposit"
                    value={form.branchNameForDeposit}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                    placeholder="__________"
                  />
                </div>
                <div className="w-1/2">
                  à¤¸à¥‡à¤µà¤¿à¤‚à¤— à¤ à¥‡à¤µ à¤–à¤¾à¤¤à¥‡ à¤•à¥à¤°.
                  <input
                    name="savingsAccountNo"
                    value={form.savingsAccountNo}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                    placeholder="___________________"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Declaration & signatures */}
          <div
            className="mb-6 text-base"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <p>
              à¤…à¤°à¥à¤œà¤¾à¤¤ à¤µà¤° à¤¦à¤¿à¤²à¥‡à¤²à¥€ à¤®à¤¾à¤¹à¤¿à¤¤à¥€ à¤–à¤°à¥€ à¤µ à¤ªà¤°à¤¿à¤¸à¥à¤¥à¤¿à¤¤à¥€à¤¤ à¤§à¤°à¥‚à¤¨ à¤†à¤¹à¥‡. à¤¤à¥à¤¯à¤¾à¤®à¤§à¥à¤¯à¥‡ à¤•à¤¾à¤¹à¥€
              à¤šà¥‚à¤• à¤…à¤—à¤° à¤µà¤¿à¤¸à¤‚à¤—à¤¤à¥€ à¤†à¤¢à¤³à¤²à¥à¤¯à¤¾à¤¸ à¤¤à¥à¤¯à¤¾à¤¬à¤¾à¤¬à¤¤ à¤¸à¤‚à¤¸à¥à¤¥à¥‡à¤•à¤¡à¥‚à¤¨ à¤®à¤¾à¤à¥à¤¯à¤¾à¤µà¤¿à¤°à¥à¤¦à¥à¤§
              à¤¹à¥‹à¤£à¤¾à¤±à¥à¤¯à¤¾ à¤•à¤¾à¤°à¤µà¤¾à¤ˆà¤¸ à¤®à¥€ à¤œà¤¬à¤¾à¤¬à¤¦à¤¾à¤° à¤°à¤¾à¤¹à¥€à¤² à¤¯à¤¾à¤šà¥€ à¤®à¤²à¤¾ à¤ªà¥‚à¤°à¥à¤£ à¤œà¤¾à¤£à¥€à¤µ à¤†à¤¹à¥‡ à¤¤à¤°à¥€
              à¤®à¤¾à¤à¥à¤¯à¤¾ à¤…à¤°à¥à¤œà¤¾à¤šà¤¾ à¤¸à¤¹à¤¾à¤¨à¥à¤­à¥‚à¤¤à¥€à¤ªà¥‚à¤°à¥à¤µà¤• à¤µà¤¿à¤šà¤¾à¤° à¤•à¤°à¥‚à¤¨ à¤«à¤‚à¤¡à¤¾à¤¤à¥‚à¤¨ à¤®à¤²à¤¾ à¤®à¤¦à¤¤ à¤®à¤¿à¤³à¤¾à¤µà¥€
              à¤…à¤¶à¥€ à¤µà¤¿à¤¨à¤‚à¤¤à¥€ à¤†à¤¹à¥‡
            </p>
          </div>

          {/* applicant signature at right side */}
          <div
            className="mb-6 mt-8 flex justify-end"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <div className="w-64">
              <p className="mb-2 text-right font-medium text-lg text-gray-800">à¤…à¤°à¥à¤œà¤¦à¤¾à¤°à¤¾à¤šà¥€ à¤¸à¤¹à¥€ :</p>
              
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 rounded-lg p-4 cursor-pointer transition w-full h-full text-center">
                {!signaturePreview ? (
                  <>
                    <span className="text-gray-600 block mb-1">Click to Upload Signature</span>
                    <span className="text-sm text-gray-500">(Image or PDF max 5MB)</span>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <img
                      src={signaturePreview}
                      alt="Signature Preview"
                      className="max-h-24 object-contain mb-2"
                    />
                    <span className="text-sm text-blue-600 font-semibold truncate w-full px-2">
                       Change Signature
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleSignatureUpload}
                  className="hidden"
                />
              </label>

              {form.applicantSignature && !signaturePreview && (
                <p className="text-sm text-gray-600 mt-2 text-center truncate">
                  ðŸ“Ž {form.applicantSignature.name}
                </p>
              )}
            </div>
          </div>

          <UploadFile applicantSignature={form.applicantSignature} hrmsNo={'123456'} onUpload={handleDocsUpload} />
          {/* Print / Submit button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-blue-600 text-white px-4 py-2 text-xl rounded-md hover:bg-blue-700 focus:outline-none transition"
            >
              ðŸ–¨ï¸ Print
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 text-xl rounded-md hover:bg-green-700 focus:outline-none transition shadow-lg shadow-green-500/30"
            >
              âœ“ Submit
            </button>
          </div>
        </form>
      </div>

      {/* Print styles */}
      <style>
        {`
          /* Print pdesignation settings */
          @pdesignation {
            size: A4 portrait;
            margin: 12mm;
          }

          @media print {
            /* Hide everything outside the form wrapper to keep print clean */
            body * {
              visibility: hidden;
            }
            /* Show only the form card content */
            .max-w-6xl, .max-w-6xl * {
              visibility: visible;
            }
            .max-w-3xl {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              box-shadow: none !important;
              border-radius: 0 !important;
              margin: 0;
              padding: 6mm !important;
            }

            /* Hide interactive elements that shouldn't print */
            button, input[type="date"]::-webkit-calendar-picker-indicator {
              display: none !important;
            }

            /* Remove borders of inputs/selects/textarea when printing */
            input, textarea, select {
              border: none !important;
              background: transparent !important;
              box-shadow: none !important;
              -webkit-print-color-adjust: exact;
              color: #000;
            }

            /* Reduce spacing slightly for compact print */
            .max-w-3xl { padding: 8mm !important; }
            .max-w-3xl input, .max-w-3xl textarea { font-size: 18pt !important; }
            .max-w-3xl { font-size: 18pt !important; }

            /* Avoid pdesignation-break inside important blocks */
            form, form > * { pdesignation-break-inside: avoid; }

            /* Hide the print button */
            button { display: none !important; }
          }

          /* ensure Devanagari font used on screen too */
          * { font-family: 'Noto Sans Devanagari', sans-serif; }
        `}
      </style>
    </div>
  );
}

