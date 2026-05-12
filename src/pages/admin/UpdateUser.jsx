import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Save, Search } from "lucide-react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { getSchemeTheme } from "../../utils/schemeTheme";
import { BRANCHES, REGION, BRANCH_TYPE, DESIGNATIONS } from "../../utils/branches";

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
  Nominee1: "",
  Relation1: "",
  Nominee2: "",
  Relation2: "",
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

const InputField = ({ name, label, type = "text", value, onChange, required = true }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none 
      focus:border-green-600 focus:ring-1 focus:ring-green-500/30 transition-all text-sm"
    />
  </div>
);

const SearchableSelectField = ({ name, label, value, onChange, options, required = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value || "");
  const wrapperRef = useRef(null);

  useEffect(() => {
    setSearch(value || "");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (selectedValue) => {
    setSearch(selectedValue);
    onChange({ target: { name, value: selectedValue } });
    setIsOpen(false);
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative leading-none">
        <input
          type="text"
          value={search}
          placeholder={`Select or type ${label}...`}
          onClick={() => setIsOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            onChange({ target: { name, value: e.target.value } });
            setIsOpen(true);
          }}
          required={required}
          autoComplete="off"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none 
          focus:border-green-600 focus:ring-1 focus:ring-green-500/30 transition-all text-sm text-slate-800"
        />

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <div
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className="px-4 py-3 text-sm text-slate-700 hover:bg-green-50 cursor-pointer border-b border-slate-50 last:border-0"
                >
                  {opt}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-slate-400">No match found</div>
            )}
          </div>
        )}

        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

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
        `${import.meta.env.VITE_BASE_URL}/employees/get-emp-prf/${searchInput}`
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
        `${import.meta.env.VITE_BASE_URL}/employees/upd-emp/${form.hrmsNo}`,
        form
      );
      toast.success("User updated successfully!");
      console.log(res.data);
    } catch (err) {
      console.error("ERROR RESPONSE:", err.response?.data);
      console.error("FULL ERROR:", err);
      toast.error("Error updating user!");

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
            options={["Teaching", "Non-Teaching"]}
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
          <SearchableSelectField
            name="branchName"
            label="Branch Name"
            value={form.branchName}
            onChange={handleChange}
            options={BRANCHES}
          />
          <SearchableSelectField
            name="branchRegionName"
            label="Branch Region Name"
            value={form.branchRegionName}
            onChange={handleChange}
            options={REGION}
          />

          <SearchableSelectField
            name="branchType"
            label="Branch Type"
            value={form.branchType}
            onChange={handleChange}
            options={BRANCH_TYPE}
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

        <FormSection title="Designation">
          <SearchableSelectField
            name="designation"
            label="Designation"
            value={form.designation}
            onChange={handleChange}
            options={DESIGNATIONS}
          />
        </FormSection>

        {/* Nominee */}
        <FormSection title="Nominee Details">
          <InputField
            name="Nominee1"
            label="Nominee 1"
            value={form.Nominee1}
            onChange={handleChange}
            required={false}
          />
          <InputField
            name="Relation1"
            label="Relation 1"
            value={form.Relation1}
            onChange={handleChange}
            required={false}
          />
          <InputField
            name="Nominee2"
            label="Nominee 2"
            value={form.Nominee2}
            onChange={handleChange}
            required={false}
          />
          <InputField
            name="Relation2"
            label="Relation 2"
            value={form.Relation2}
            onChange={handleChange}
            required={false}
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

