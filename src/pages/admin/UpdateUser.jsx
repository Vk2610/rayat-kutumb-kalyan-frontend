import { useState } from "react";
import axios from "axios";
import { Save, Search } from "lucide-react";
import dayjs from "dayjs";
import { getSchemeTheme } from "../../utils/schemeTheme";

/* ----------------------- Helpers ----------------------- */

const toInputDate = (date) => {
  if (!date) return "";
  const d = dayjs(date);
  return d.isValid() ? d.format("YYYY-MM-DD") : "";
};

/* ----------------------- Default Empty Form ----------------------- */

const defaultEmptyForm = {
  id: "",
  hrmsNo: "",
  password: "",
  employeeName: "",
  profileType: "",
  gender: "",
  maritalStatus: "",
  panNo: "",
  emailId: "",
  mobileNo: "",
  presentAddress: "",
  permanentAddress: "",
  branchName: "",
  branchRegionName: "",
  branchType: "",
  branchJoiningDate: "",
  designation: "",
  currentAppointmentDate: "",
  currentAppointmentType: "",
  firstAppointmentDate: "",
  firstJoiningDate: "",
  firstAppointmentType: "",
  employeeType: "",
  approvalRefNo: "",
  approvalLetterDate: "",
  retirementDate: "",
  appointmentNature: "",
  qualifications: "",
  role: "",
};

/* ----------------------- Components ----------------------- */

const FormSection = ({ title, children }) => (
  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-soft border border-slate-200 mb-10">
    <h3 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-200">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

const InputField = ({ name, label, type = "text", value, onChange }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none 
      focus:border-green-600 focus:ring-1 focus:ring-green-500/30 transition-all text-sm"
      required
    />
  </div>
);

const SelectField = ({ name, label, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none 
      focus:border-green-600 focus:ring-1 focus:ring-green-500/30 transition-all text-sm"
      required
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const TextAreaField = ({ name, label, value, onChange }) => (
  <div className="space-y-2 md:col-span-2">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <textarea
      rows={3}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none 
      focus:border-green-600 focus:ring-1 focus:ring-green-500/30 transition-all text-sm resize-none"
      required
    ></textarea>
  </div>
);

/* ----------------------- Main Page ----------------------- */

export default function UpdateUser() {
  const formType = localStorage.getItem("formType") || "welfare";
  const schemeTheme = getSchemeTheme(formType);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState(defaultEmptyForm);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ----------------------- Search API ----------------------- */

  const handleSearch = async () => {
    if (!searchInput) return alert("Enter HRMS Number");

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `http://localhost:3000/employees/get-emp-prf/${searchInput}`
      );

      if (!res.data) {
        setError("User not found");
        return;
      }

      // Auto-format all date fields
      const formattedData = {
        ...res.data,
        currentAppointmentDate: toInputDate(res.data.currentAppointmentDate),
        firstAppointmentDate: toInputDate(res.data.firstAppointmentDate),
        firstJoiningDate: toInputDate(res.data.firstJoiningDate),
        approvalLetterDate: toInputDate(res.data.approvalLetterDate),
        retirementDate: toInputDate(res.data.retirementDate),
        branchJoiningDate: toInputDate(res.data.branchJoiningDate),
      };

      setForm({ ...defaultEmptyForm, ...formattedData });
    } catch (err) {
      console.error(err);
      setError("User not found");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------- Update API ----------------------- */

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:3000/employees/upd-emp/${form.hrmsNo}`,
        form
      );
      alert("User updated successfully!");
      console.log(res.data);
    } catch (err) {
      console.error("ERROR RESPONSE:", err.response?.data);
      console.error("FULL ERROR:", err);
      alert("Error updating user!");

    }
  };

  /* ----------------------- UI ----------------------- */

  return (
    <div className="px-10 py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-10">Update User</h1>

      {/* Search */}
      <FormSection title="Search User">
        <InputField
          name="search"
          label="Enter HRMS Number"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <div className="flex items-center md:col-span-2 mt-3">
          <button
            type="button"
            onClick={handleSearch}
            className="text-white px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all"
            style={{
              backgroundColor: schemeTheme.primary,
              boxShadow: `0 12px 24px ${schemeTheme.primaryMuted}`,
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.filter = "brightness(0.92)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.filter = "brightness(1)";
            }}
          >
            <Search size={18} /> Search
          </button>
        </div>

        {loading && <p className="mt-2 text-blue-600">Searching user...</p>}
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </FormSection>

      {/* Update Form */}
      <form onSubmit={handleUpdate}>
        {/* Basic Info */}
        <FormSection title="Basic Information">
          <InputField
            name="hrmsNo"
            label="HRMS Number"
            value={form.hrmsNo}
            onChange={handleChange}
          />
          <InputField
            name="employeeName"
            label="Employee Name"
            value={form.employeeName}
            onChange={handleChange}
          />

          <SelectField
            name="profileType"
            label="Profile Type"
            value={form.profileType}
            onChange={handleChange}
            options={["Permanent", "Teaching", "Contract"]}
          />

          <SelectField
            name="gender"
            label="Gender"
            value={form.gender}
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
          />

          <SelectField
            name="maritalStatus"
            label="Marital Status"
            value={form.maritalStatus}
            onChange={handleChange}
            options={["Single", "Married", "Divorced", "Widowed"]}
          />

          <InputField
            name="panNo"
            label="PAN Number"
            value={form.panNo}
            onChange={handleChange}
          />
          <InputField
            name="emailId"
            label="Email ID"
            value={form.emailId}
            onChange={handleChange}
          />
          <InputField
            name="mobileNo"
            label="Mobile Number"
            value={form.mobileNo}
            onChange={handleChange}
          />
        </FormSection>

        {/* Appointment */}
        <FormSection title="Appointment Details">
          <InputField
            name="currentAppointmentDate"
            label="Current Appointment Date"
            type="date"
            value={form.currentAppointmentDate}
            onChange={handleChange}
          />
          <InputField
            name="currentAppointmentType"
            label="Current Appointment Type"
            value={form.currentAppointmentType}
            onChange={handleChange}
          />

          <InputField
            name="firstAppointmentDate"
            label="First Appointment Date"
            type="date"
            value={form.firstAppointmentDate}
            onChange={handleChange}
          />
          <InputField
            name="firstJoiningDate"
            label="First Joining Date"
            type="date"
            value={form.firstJoiningDate}
            onChange={handleChange}
          />

          <InputField
            name="firstAppointmentType"
            label="First Appointment Type"
            value={form.firstAppointmentType}
            onChange={handleChange}
          />
          <InputField
            name="employeeType"
            label="Employee Type"
            value={form.employeeType}
            onChange={handleChange}
          />
          <InputField
            name="appointmentNature"
            label="Appointment Nature"
            value={form.appointmentNature}
            onChange={handleChange}
          />
        </FormSection>

        {/* Administrative */}
        <FormSection title="Administrative">
          <InputField
            name="approvalRefNo"
            label="Approval Reference No"
            value={form.approvalRefNo}
            onChange={handleChange}
          />
          <InputField
            name="approvalLetterDate"
            label="Approval Letter Date"
            type="date"
            value={form.approvalLetterDate}
            onChange={handleChange}
          />

          <InputField
            name="retirementDate"
            label="Retirement Date"
            type="date"
            value={form.retirementDate}
            onChange={handleChange}
          />
          <InputField
            name="qualifications"
            label="Qualifications"
            value={form.qualifications}
            onChange={handleChange}
          />
          <InputField
            name="role"
            label="Role"
            value={form.role}
            onChange={handleChange}
          />
        </FormSection>

        {/* Address */}
        <FormSection title="Address">
          <TextAreaField
            name="presentAddress"
            label="Present Address"
            value={form.presentAddress}
            onChange={handleChange}
          />
          <TextAreaField
            name="permanentAddress"
            label="Permanent Address"
            value={form.permanentAddress}
            onChange={handleChange}
          />
        </FormSection>

        {/* Branch */}
        <FormSection title="Branch Information">
          <InputField
            name="branchName"
            label="Branch Name"
            value={form.branchName}
            onChange={handleChange}
          />
          <InputField
            name="branchRegionName"
            label="Branch Region Name"
            value={form.branchRegionName}
            onChange={handleChange}
          />

          <InputField
            name="branchType"
            label="Branch Type"
            value={form.branchType}
            onChange={handleChange}
          />
          <InputField
            name="branchJoiningDate"
            label="Branch Joining Date"
            type="date"
            value={form.branchJoiningDate}
            onChange={handleChange}
          />
        </FormSection>

        {/* Bank */}
        {/* <FormSection title="Bank Details">
          <InputField
            name="bankName"
            label="Bank Name"
            value={form.bankName}
            onChange={handleChange}
          />
          <InputField
            name="accountNo"
            label="Account Number"
            value={form.accountNo}
            onChange={handleChange}
          />
          <InputField
            name="ifsc"
            label="IFSC Code"
            value={form.ifsc}
            onChange={handleChange}
          />
        </FormSection> */}

        {/* Nominee */}
        <FormSection title="Nominee Details">
          <InputField
            name="nomineeName"
            label="Nominee Name"
            value={form.nomineeName}
            onChange={handleChange}
          />
          <InputField
            name="nomineeRelation"
            label="Nominee Relation"
            value={form.nomineeRelation}
            onChange={handleChange}
          />
        </FormSection>

        {/* Status & Dept */}
        <FormSection title="Employment Status">
          <InputField
            name="status"
            label="Employment Status"
            value={form.status}
            onChange={handleChange}
          />
          <InputField
            name="department"
            label="Department"
            value={form.department}
            onChange={handleChange}
          />
        </FormSection>

        {/* Submit */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="text-white px-8 py-4 rounded-xl shadow-lg flex items-center gap-3 font-bold transition-all hover:scale-105"
            style={{
              backgroundColor: schemeTheme.primary,
              boxShadow: `0 18px 36px ${schemeTheme.primaryMuted}`,
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.filter = "brightness(0.92)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.filter = "brightness(1)";
            }}
          >
            <Save size={20} />
            Update User
          </button>
        </div>
      </form>
    </div>
  );
}
