// SevakWelfareForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import UploadFile from '../components/UploadFile';

export default function UserForm({ role }) {
  const [form, setForm] = useState({
    applicantName: '',
    branchName: '',
    joiningDate: '',
    designation: '',
    totalService: '',
    monthlySalary: '',
    mobile: '',
    patientName: '',
    relation: '',
    illnessNature: '',
    illnessDuration: '',
    medicineBill: '',
    doctorBill: '',
    otherExpenses: '',
    totalExpenses: '',
    certificatesAttached: '',
    sanctionLetter: '',
    previousHelp: '',
    previousHelpDetails: '',
    annualDeductions: '',
    currentDeductionMonth: '',
    requestedAmountNumbers: '',
    requestedAmountWords: '',
    branchNameForDeposit: '',
    savingsAccountNo: '',
    officerRecommendation: '',
    applicantSignature: null,
  });

  const [signaturePreview, setSignaturePreview] = useState(null);
  const [files, setFiles] = useState([]);

  const handleDocsUpload = (uploadedFiles) => {
    console.log('handleDocsUpload called');
    setFiles(uploadedFiles);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        alert('Please upload a valid image or PDF file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }
      setForm((p) => ({ ...p, applicantSignature: file }));

      // Create preview for images
      if (file.type.startsWith('image/')) {
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

    // Validate required fields
    if (!form.applicantName || !form.branchName || !form.mobile) {
      alert('Please fill in all required fields (Name, Branch, Mobile)');
      return;
    }

    if (!files || !files.isUploaded) {
      alert('Please upload all required documents first');
      return;
    }

    try {
      // Merge document URLs into form data
      const formDataToSend = {
        ...form,
        ...files.urls, // Include document URLs
        applicantSignature: files.applicantSignature, // Include signature URL
        requestId: files.id, // Use the same ID as requestId
      };

      // Submit to backend
      const response = await axios.post(
        'https://rayat-backend.onrender.com/user/submit-welfare-form',
        formDataToSend,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      alert('Form submitted successfully!');
      console.log('Response:', response.data);

      // Reset form after successful submission
      setForm({
        applicantName: '',
        branchName: '',
        joiningDate: '',
        designation: '',
        totalService: '',
        monthlySalary: '',
        mobile: '',
        patientName: '',
        relation: '',
        illnessNature: '',
        illnessDuration: '',
        medicineBill: '',
        doctorBill: '',
        otherExpenses: '',
        totalExpenses: '',
        certificatesAttached: '',
        sanctionLetter: '',
        previousHelp: '',
        previousHelpDetails: '',
        annualDeductions: '',
        currentDeductionMonth: '',
        requestedAmountNumbers: '',
        requestedAmountWords: '',
        branchNameForDeposit: '',
        savingsAccountNo: '',
        officerRecommendation: '',
        applicantSignature: null,
      });
      setSignaturePreview(null);
      setFiles([]);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <div className={role !== 'user' ? 'pointer-events-none opacity-70' : ''}>
      <div className="min-h-screen bg-neutral-100 py-6 px-4 sm:px-6 lg:px-8">
        {/* Import Noto Sans Devanagari for Marathi */}
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap');`}
        </style>

        <div
          className="max-w-6xl mx-auto bg-white shadow-md rounded-md p-8 print:p-4 print:shadow-none print:rounded-none"
          style={{ fontSize: '1.5rem', lineHeight: '1.6' }}
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
                    disabled={role !== 'user'}
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
                    disabled={role !== 'user'}
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
                      disabled={role !== 'user'}
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
                      disabled={role !== 'user'}
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
                      disabled={role !== 'user'}
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
                    disabled={role !== 'user'}
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
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    disabled={role !== 'user'}
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
                    disabled={role !== 'user'}
                    className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                    placeholder="______________________________________"
                  />
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-1/3">à¤¸à¥‡à¤µà¤•à¤¾à¤¶à¥€ à¤¨à¤¾à¤¤à¥‡</div>
                <div className="w-1/3">
                  <input
                    name="relation"
                    value={form.relation}
                    disabled={role !== 'user'}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                    placeholder="________________"
                  />
                </div>

                <div className="w-1/3">
                  à¤¬) à¤†à¤œà¤¾à¤°à¤¾à¤šà¥‡ à¤¸à¥à¤µà¤°à¥‚à¤ª
                  <input
                    name="illnessNature"
                    value={form.illnessNature}
                    disabled={role !== 'user'}
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
                  disabled={role !== 'user'}
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
                    disabled={role !== 'user'}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                    placeholder="____________________"
                  />
                </div>

                <div className="w-1/3">à¤¬) à¤¡à¥‰à¤•à¥à¤Ÿà¤°à¤¾à¤‚à¤šà¥‡ à¤¬à¤¿à¤² à¤°à¥.</div>
                <div className="w-1/3">
                  <input
                    name="doctorBill"
                    value={form.doctorBill}
                    disabled={role !== 'user'}
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
                    value={form.otherExpenses}
                    onChange={handleChange}
                    disabled={role !== 'user'}
                    className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                    placeholder="____________________"
                  />
                </div>

                <div className="w-1/3">à¤¡) à¤à¤•à¥‚à¤£ à¤à¤¾à¤²à¥‡à¤²à¤¾ à¤–à¤°à¥à¤š à¤°à¥.</div>
                <div className="w-1/3">
                  <input
                    name="totalExpenses"
                    value={form.totalExpenses}
                    disabled={role !== 'user'}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
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
                à¥«. à¤µà¤°à¥€à¤² à¤ªà¥à¤°à¤®à¤¾à¤£à¥‡ à¤à¤¾à¤²à¥‡à¤²à¥à¤¯à¤¾ à¤–à¤°à¥à¤šà¤¾à¤šà¥€ à¤¬à¤¿à¤²à¥‡ à¤µ à¤ªà¤¾à¤µà¤¤à¥à¤¯à¤¾ à¤•à¥à¤°à¤®à¤¾à¤‚à¤• à¥¦à¥§ à¤¤à¥‡
                ___ à¤¸à¥‹à¤¬à¤¤ à¤œà¥‹à¤¡à¤²à¥‡à¤²à¥€ à¤†à¤¹à¥‡à¤¤.
              </div>

              <div className="flex gap-3 items-center">
                <div className="w-1/2">
                  à¥¬. à¤µà¤° à¤¨à¤®à¥‚à¤¦ à¤•à¥‡à¤²à¥‡à¤²à¥à¤¯à¤¾ à¤†à¤œà¤¾à¤°à¤¾à¤‚à¤¬à¤¾à¤¬à¤¤ à¤¡à¥‰à¤•à¥à¤Ÿà¤°à¤¾à¤‚à¤šà¥‡ à¤¸à¤°à¥à¤Ÿà¤¿à¤«à¤¿à¤•à¥‡à¤Ÿ à¤œà¥‹à¤¡à¤²à¥‡
                  à¤†à¤¹à¥‡.
                </div>
                <div className="w-1/2">
                  <select
                    name="certificatesAttached"
                    value={form.certificatesAttached}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base bg-transparent"
                  >
                    <option value="">-- à¤¨à¤¿à¤µà¤¡à¤¾ --</option>
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
                    disabled={role !== 'user'}
                    className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base bg-transparent"
                  >
                    <option value="">-- à¤¨à¤¿à¤µà¤¡à¤¾ --</option>
                    <option value="à¤¹à¥‹à¤¯">à¤¹à¥‹à¤¯</option>
                    <option value="à¤¨à¤¾à¤¹à¥€">à¤¨à¤¾à¤¹à¥€</option>
                  </select>
                  <textarea
                    name="previousHelpDetails"
                    value={form.previousHelpDetails}
                    disabled={role !== 'user'}
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
                  à¥® à¤…) à¤ªà¥à¤°à¤¤à¥à¤¯à¥‡à¤• à¤µà¤°à¥à¤·à¤¾à¤¸à¤¾à¤ à¥€ à¤¸à¥‡à¤µà¤• à¤µà¥‡à¤²à¤«à¥‡à¤…à¤° à¤«à¤‚à¤¡à¤¾à¤šà¥€ à¤µà¤—à¤£à¥€ à¤¦à¤¿à¤²à¥‡à¤²à¥€ à¤†à¤¹à¥‡
                  à¤•à¤¾à¤¯
                </div>
                <div className="w-1/2">
                  <select
                    name="annualDeductions"
                    value={form.annualDeductions}
                    disabled={role !== 'user'}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base bg-transparent"
                    // placeholder="____________________________"
                  />
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <div className="w-1/3">
                  à¥¯ à¤…) à¤†à¤¤à¤¾ à¤•à¤¿à¤¤à¥€ à¤®à¤¦à¤¤à¥€à¤šà¥€ à¤†à¤µà¤¶à¥à¤¯à¤•à¤¤à¤¾ à¤†à¤¹à¥‡ à¤¤à¥€ à¤°à¤•à¥à¤•à¤® à¤°à¥. à¤…à¤‚à¤•à¥€ à¤µ à¤…à¤•à¥à¤·à¤°à¥€
                </div>
                <div className="w-2/3">
                  <input
                    name="requestedAmountNumbers"
                    value={form.requestedAmountNumbers}
                    onChange={handleChange}
                    disabled={role !== 'user'}
                    className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base mb-1"
                    placeholder="(à¤…à¤‚à¤•à¥€) ___________________"
                  />
                  <input
                    name="requestedAmountWords"
                    value={form.requestedAmountWords}
                    onChange={handleChange}
                    disabled={role !== 'user'}
                    className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                    placeholder="(à¤…à¤•à¥à¤·à¤°à¥€) ____________________________________"
                  />
                </div>
              </div>

              <div className="mt-2">
                à¤¬) à¤•à¤¿à¤®à¤¤à¥€à¤¨à¥‡ à¤®à¤‚à¤œà¥‚à¤° à¤•à¥‡à¤²à¥‡à¤²à¥€ à¤®à¤¦à¤¤ à¤œà¤®à¤¾ à¤°à¤¯à¤¤ à¤¸à¥‡à¤µà¤• à¤•à¥‹-à¤‘à¤ªà¤°à¥‡à¤Ÿà¤¿à¤µà¥à¤¹ à¤¬à¤à¤•
                à¤²à¤¿à¤®à¤¿à¤Ÿà¥‡à¤¡ à¤¸à¤¾à¤¤à¤¾à¤°à¤¾ à¤¶à¤¾à¤–à¤¾
                <div className="flex gap-3 mt-2">
                  <div className="w-1/2">
                    à¤¶à¤¾à¤–à¤¾
                    <input
                      name="branchNameForDeposit"
                      value={form.branchNameForDeposit}
                      onChange={handleChange}
                      disabled={role !== 'user'}
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
                      disabled={role !== 'user'}
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
                à¤…à¤°à¥à¤œà¤¾à¤¤ à¤µà¤° à¤¦à¤¿à¤²à¥‡à¤²à¥€ à¤®à¤¾à¤¹à¤¿à¤¤à¥€ à¤–à¤°à¥€ à¤µ à¤ªà¤°à¤¿à¤¸à¥à¤¥à¤¿à¤¤à¥€à¤¤ à¤§à¤°à¥‚à¤¨ à¤†à¤¹à¥‡. à¤¤à¥à¤¯à¤¾à¤®à¤§à¥à¤¯à¥‡
                à¤•à¤¾à¤¹à¥€ à¤šà¥‚à¤• à¤…à¤—à¤° à¤µà¤¿à¤¸à¤‚à¤—à¤¤à¥€ à¤†à¤¢à¤³à¤²à¥à¤¯à¤¾à¤¸ à¤¤à¥à¤¯à¤¾à¤¬à¤¾à¤¬à¤¤ à¤¸à¤‚à¤¸à¥à¤¥à¥‡à¤•à¤¡à¥‚à¤¨ à¤®à¤¾à¤à¥à¤¯à¤¾à¤µà¤¿à¤°à¥à¤¦à¥à¤§
                à¤¹à¥‹à¤£à¤¾à¤±à¥à¤¯à¤¾ à¤•à¤¾à¤°à¤µà¤¾à¤ˆà¤¸ à¤®à¥€ à¤œà¤¬à¤¾à¤¬à¤¦à¤¾à¤° à¤°à¤¾à¤¹à¥€à¤² à¤¯à¤¾à¤šà¥€ à¤®à¤²à¤¾ à¤ªà¥‚à¤°à¥à¤£ à¤œà¤¾à¤£à¥€à¤µ à¤†à¤¹à¥‡ à¤¤à¤°à¥€
                à¤®à¤¾à¤à¥à¤¯à¤¾ à¤…à¤°à¥à¤œà¤¾à¤šà¤¾ à¤¸à¤¹à¤¾à¤¨à¥à¤­à¥‚à¤¤à¥€à¤ªà¥‚à¤°à¥à¤µà¤• à¤µà¤¿à¤šà¤¾à¤° à¤•à¤°à¥‚à¤¨ à¤«à¤‚à¤¡à¤¾à¤¤à¥‚à¤¨ à¤®à¤²à¤¾ à¤®à¤¦à¤¤ à¤®à¤¿à¤³à¤¾à¤µà¥€
                à¤…à¤¶à¥€ à¤µà¤¿à¤¨à¤‚à¤¤à¥€ à¤†à¤¹à¥‡
              </p>
            </div>

            {/* applicant signature at right side */}
            <div
              className="mb-6 text-base flex justify-end"
              style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
            >
              <div className="text-right">
                <p className="mb-2">à¤…à¤°à¥à¤œà¤¦à¤¾à¤°à¤¾à¤šà¥€ à¤¸à¤¹à¥€ :</p>
                <div className="mb-3">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    disabled={role !== 'user'}
                    onChange={handleSignatureUpload}
                    className="text-base"
                  />
                </div>
                {signaturePreview && (
                  <div className="mb-2 border border-gray-300 p-2 rounded">
                    <img
                      src={signaturePreview}
                      alt="Signature Preview"
                      className="max-h-20 max-w-32"
                    />
                  </div>
                )}
                {form.applicantSignature && (
                  <p className="text-base text-gray-600">
                    ðŸ“Ž {form.applicantSignature.name}
                  </p>
                )}
                <p className="text-base text-gray-500 mt-1">
                  (Image or PDF max 5MB)
                </p>
              </div>
            </div>

            {role === 'user' ? (
              <UploadFile onUpload={handleDocsUpload} />
            ) : (
              <p className="text-lg mt-4 text-blue-800">
                ðŸ“„ Documents will be viewed by you in panel below.
              </p>
            )}

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
                className="bg-green-700 text-white px-4 py-2 text-xl rounded-md hover:bg-green-800 focus:outline-none transition"
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
    </div>
  );
}

