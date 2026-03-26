import axios from "axios";
import { Save } from "lucide-react";

// Form Section Wrapper
const FormSection = ({ title, children }) => (
  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft border border-slate-100 mb-8">
    <h3 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">{children}</div>
  </div>
);

// Input Field
const InputField = ({ name, label, type = "text", placeholder = "" }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-600">{label}</label>
    <input
      required
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none 
      focus:border-green-600 focus:ring-1 focus:ring-green-500/30 transition-all 
      text-sm text-slate-800 placeholder:text-slate-400"
    />
  </div>
);

// Select Field
const SelectField = ({ name, label, options }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-600">{label}</label>
    <div className="relative">
      <select
        required
        name={name}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none 
        focus:border-green-600 focus:ring-1 focus:ring-green-500/30 transition-all 
        text-sm text-slate-800 appearance-none cursor-pointer"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
        <svg
          className="w-4 h-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

// Textarea Field
const TextAreaField = ({ name, label, rows = 3 }) => (
  <div className="space-y-2 md:col-span-2">
    <label className="text-sm font-medium text-slate-600">{label}</label>
    <textarea
      required
      name={name}
      rows={rows}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none 
      focus:border-green-600 focus:ring-1 focus:ring-green-500/30 transition-all text-sm text-slate-800 
      resize-none"
    ></textarea>
  </div>
);

const NewUser = () => {
  // API Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const payload = Object.fromEntries(formData.entries());
    console.log("Submitting:", payload);

    try {
      const res = await axios.post("http://localhost:3000/employees/create", payload);
      alert("User added successfully!");
      console.log(res.data);
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Error adding user!");
    }
  };

  return (
    <div className="relative pb-24 max-w-full mx-40">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Add New User</h1>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Basic Information */}
        <FormSection title="Basic Information">
          <InputField name="employeeName" label="Employee Name" placeholder="Full Name" />
          <InputField name="hrmsNo" label="HRMS Number" placeholder="EMP12345" />
          <SelectField name="profileType" label="Profile Type" options={["Permanent", "Probation", "Contract"]} />
          <SelectField name="gender" label="Gender" options={["Male", "Female", "Other"]} />
          <SelectField name="maritalStatus" label="Marital Status" options={["Single", "Married", "Divorced", "Widowed"]} />
        </FormSection>

        {/* Contact */}
        <FormSection title="Identification & Contact">
          <InputField name="panNo" label="PAN Number" placeholder="ABCDE1234F" />
          <InputField name="emailId" label="Email ID" type="email" placeholder="email@example.com" />
          <InputField name="mobileNo" label="Mobile Number" type="tel" placeholder="9876543210" />
        </FormSection>

        {/* Appointment */}
        <FormSection title="Appointment Details">
          <InputField name="currentAppointmentDate" label="Current Appointment Date" type="date" />
          <SelectField name="currentAppointmentType" label="Current Appointment Type" options={["Regular", "Promotion", "Transfer"]} />
          <InputField name="firstAppointmentDate" label="First Appointment Date" type="date" />
          <InputField name="firstJoiningDate" label="First Joining Date" type="date" />
          <SelectField name="firstAppointmentType" label="First Appointment Type" options={["Direct", "Quota"]} />
          <SelectField name="employeeType" label="Employee Type" options={["Class I", "Class II", "Class III", "Class IV"]} />
          <SelectField name="appointmentNature" label="Appointment Nature" options={["Permanent", "Temporary"]} />
        </FormSection>

        {/* Administrative */}
        <FormSection title="Administrative Details">
          <InputField name="approvalRefNo" label="Approval Reference No" />
          <InputField name="approvalLetterDate" label="Approval Letter Date" type="date" />
          <InputField name="retirementDate" label="Retirement Date" type="date" />
          <InputField name="qualifications" label="Qualifications" placeholder="BSc, MSc, etc." />
          <SelectField name="role" label="Role" options={["Employee", "Manager", "Admin"]} />
        </FormSection>

        {/* Address */}
        <FormSection title="Address Information">
          <TextAreaField name="presentAddress" label="Present Address" />
          <TextAreaField name="permanentAddress" label="Permanent Address" />
        </FormSection>

        {/* Branch */}
        <FormSection title="Branch Details">
          <InputField name="branchName" label="Branch Name" />
          <InputField name="branchRegionName" label="Branch Region Name" />
          <SelectField
            name="branchType"
            label="Branch Type"
            options={["Head Office", "Regional Office", "Field Office"]}
          />
          <InputField name="branchJoiningDate" label="Branch Joining Date" type="date" />
        </FormSection>

        {/* Designation */}
        <FormSection title="Designation">
          <InputField name="designation" label="Designation" />
        </FormSection>

        {/* Hidden Field */}
        <input type="hidden" name="id" />

        {/* Submit */}
        <div className="fixed bottom-6 right-8 z-40">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full shadow-lg 
            shadow-green-500/40 flex items-center gap-3 font-bold transition-all hover:scale-105"
          >
            <Save size={20} />
            Submit Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewUser;
