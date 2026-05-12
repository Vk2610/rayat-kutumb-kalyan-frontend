import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WELFARE_FORM_LABELS as labels } from './constants';
import { FormSection, FormInput, FormSelect } from './components/FormElements';
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
    relation: 'Self',
    illnessNature: '',
    illnessDuration: '',
    medicineBill: 0,
    doctorBill: 0,
    otherExpenses: 0,
    totalExpenses: 0,
    certificatesAttached: 'होय',
    previousHelp: 'नाही',
    previousHelpDetails: '',
    annualDeductions: 'होय',
    requestedAmountNumbers: '',
    requestedAmountWords: '',
    branchNameForDeposit: '',
    savingsAccountNo: '',
    applicantSignature: null,
  });

  const [signaturePreview, setSignaturePreview] = useState(null);
  const [files, setFiles] = useState([]);

  // Auto-calculate total expenses
  useEffect(() => {
    const total = Number(form.medicineBill) + Number(form.doctorBill) + Number(form.otherExpenses);
    setForm(prev => ({ ...prev, totalExpenses: total }));
  }, [form.medicineBill, form.doctorBill, form.otherExpenses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(p => ({ ...p, applicantSignature: file }));
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => setSignaturePreview(event.target.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implementation of submission logic...
    console.log("Submitting form:", form);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden print:shadow-none print:m-0">
        
        {/* Header Section */}
        <div className="bg-blue-700 text-white p-8 text-center print:bg-white print:text-black">
          <h1 className="text-2xl font-bold mb-2">{labels.header.title}</h1>
          <h2 className="text-xl underline">{labels.header.subtitle}</h2>
        </div>

        <div className="p-8 space-y-8 print:p-4">
          <div className="text-gray-700 space-y-1">
            <p className="font-bold">{labels.header.to}</p>
            <p>{labels.header.chairman}</p>
            <p>{labels.header.fundName}</p>
            <p className="pt-4 font-bold underline">{labels.header.subject}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            <FormSection title={labels.sections.applicant.title}>
              <FormInput 
                label={labels.sections.applicant.name} 
                name="applicantName" 
                value={form.applicantName} 
                onChange={handleChange} 
                disabled={role !== 'user'} 
              />
              <FormInput 
                label={labels.sections.applicant.branch} 
                name="branchName" 
                value={form.branchName} 
                onChange={handleChange} 
                disabled={role !== 'user'} 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput 
                  label={labels.sections.applicant.joiningDate} 
                  name="joiningDate" 
                  type="date" 
                  value={form.joiningDate} 
                  onChange={handleChange} 
                  disabled={role !== 'user'} 
                />
                <FormInput 
                  label={labels.sections.applicant.designation} 
                  name="designation" 
                  value={form.designation} 
                  onChange={handleChange} 
                  disabled={role !== 'user'} 
                />
              </div>
            </FormSection>

            <FormSection>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput 
                  label={labels.sections.salary.monthlySalary} 
                  name="monthlySalary" 
                  type="number" 
                  value={form.monthlySalary} 
                  onChange={handleChange} 
                  disabled={role !== 'user'} 
                />
                <FormInput 
                  label={labels.sections.salary.mobile} 
                  name="mobile" 
                  value={form.mobile} 
                  onChange={handleChange} 
                  disabled={role !== 'user'} 
                />
              </div>
            </FormSection>

            <FormSection title={labels.sections.patient.title}>
              <FormInput 
                label={labels.sections.patient.name} 
                name="patientName" 
                value={form.patientName} 
                onChange={handleChange} 
                disabled={role !== 'user'} 
              />
              <FormSelect 
                label={labels.sections.patient.relation} 
                name="relation" 
                value={form.relation} 
                onChange={handleChange} 
                disabled={role !== 'user'}
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

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-600 italic leading-relaxed">{labels.sections.footer.declaration}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end gap-8 pt-8">
              <div className="w-full md:w-64">
                 <p className="font-bold mb-2">{labels.sections.footer.signature}</p>
                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    {signaturePreview ? (
                      <img src={signaturePreview} alt="Signature" className="max-h-full object-contain" />
                    ) : (
                      <span className="text-gray-400 text-sm">Upload Signature</span>
                    )}
                    <input type="file" className="hidden" onChange={handleSignatureUpload} />
                 </div>
              </div>
              
              <div className="flex gap-4">
                <button type="button" onClick={() => window.print()} className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-all">Print</button>
                <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 transition-all shadow-lg">Submit Form</button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
