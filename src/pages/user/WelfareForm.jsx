import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from "jwt-decode";
import { WELFARE_FORM_LABELS as labels } from '../../wf-form/constants';
import { FormSection, FormInput, FormSelect } from '../../wf-form/components/FormElements';
import UploadFile from "../../components/UploadFile";
import api from "../../services/api";

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
    certificatesAttached: 'होय',
    previousHelp: "नाही",
    previousHelpDetails: "",
    annualDeductions: "होय",
    requestedAmountNumbers: 0,
    requestedAmountWords: "",
    branchNameForDeposit: "",
    savingsAccountNo: "",
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

  useEffect(() => {
    const total = Number(form.medicineBill) + Number(form.doctorBill) + Number(form.otherExpenses);
    setForm(prev => ({ ...prev, totalExpenses: total }));
  }, [form.medicineBill, form.doctorBill, form.otherExpenses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleDocsUpload = (upds) => {
    if (upds.isUploaded) setUploads(upds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.applicantName || !form.branchName || !form.mobileNo) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const formData = {
        ...form,
        ...uploads.urls,
        formDate: new Date().toLocaleDateString('en-GB'),
        applicantSignature: uploads.applicantSignature,
        hrmsNo: decoded.hrmsNo,
        patientId: uuidv4(),
        expensesId: uuidv4(),
        requestId: uploads.id,
        previousId: uuidv4(),
      };

      await api.post("/user/submit-welfare-form", formData);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden print:shadow-none">
        <div className="bg-blue-700 text-white p-8 text-center print:bg-white print:text-black">
          <h1 className="text-2xl font-bold mb-2">{labels.header.title}</h1>
          <h2 className="text-xl underline">{labels.header.subtitle}</h2>
        </div>

        <div className="p-8 space-y-8">
           <form onSubmit={handleSubmit} className="space-y-6">
              <FormSection title={labels.sections.applicant.title}>
                <FormInput label={labels.sections.applicant.name} name="applicantName" value={form.applicantName} onChange={handleChange} />
                <FormInput label={labels.sections.applicant.branch} name="branchName" value={form.branchName} onChange={handleChange} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput label={labels.sections.applicant.joiningDate} name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} />
                  <FormInput label={labels.sections.applicant.designation} name="designation" value={form.designation} onChange={handleChange} />
                </div>
              </FormSection>

              <FormSection title={labels.sections.patient.title}>
                <FormInput label={labels.sections.patient.name} name="patientName" value={form.patientName} onChange={handleChange} />
                <FormSelect 
                  label={labels.sections.patient.relation} 
                  name="relation" 
                  value={form.relation} 
                  onChange={handleChange}
                  options={[
                    { value: 'Self', label: 'Self' },
                    { value: 'Spouse', label: 'Spouse' },
                    { value: 'Son', label: 'Son' },
                    { value: 'Daughter', label: 'Daughter' },
                    { value: 'Mother', label: 'Mother' },
                    { value: 'Father', label: 'Father' }
                  ]}
                />
              </FormSection>

              <FormSection title="खर्चाचा तपशील">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput label={labels.sections.expenses.medicine} name="medicineBill" type="number" value={form.medicineBill} onChange={handleChange} />
                  <FormInput label={labels.sections.expenses.doctor} name="doctorBill" type="number" value={form.doctorBill} onChange={handleChange} />
                  <FormInput label={labels.sections.expenses.other} name="otherExpenses" type="number" value={form.otherExpenses} onChange={handleChange} />
                  <FormInput label={labels.sections.expenses.total} name="totalExpenses" value={form.totalExpenses} readOnly />
                </div>
              </FormSection>

              <UploadFile applicantSignature={form.applicantSignature} hrmsNo={'user'} onUpload={handleDocsUpload} />

              <div className="flex justify-end gap-4 pt-6">
                <button type="button" onClick={() => window.print()} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Print</button>
                <button type="submit" className="px-10 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg">Submit</button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
}
