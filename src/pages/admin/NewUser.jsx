import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Save } from "lucide-react";
import { toast } from "react-toastify";
import { BRANCHES, REGION, BRANCH_TYPE, DESIGNATIONS } from "../../utils/branches";
import { getSchemeTheme } from "../../utils/schemeTheme";

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
const InputField = ({ name, label, type = "text", placeholder = "", required = true }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-600">{label}</label>
    <input
      required={required}
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none 
      focus:border-green-600 focus:ring-1 focus:ring-green-500/30 transition-all 
      text-sm text-slate-800 placeholder:text-slate-400"
    />
  </div>
);

// Searchable Select Field (Tailwind Dropdown)
const SelectField = ({ name, label, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (opt) => {
    setSearch(opt);
    setSelected(opt);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <div className="relative leading-none">
        <input
          type="text"
          placeholder={`Select or type ${label}...`}
          value={search}
          onClick={() => setIsOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelected(e.target.value);
            setIsOpen(true);
          }}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none 
          focus:border-green-600 focus:ring-1 focus:ring-green-500/30 transition-all 
          text-sm text-slate-800"
          autoComplete="off"
        />
        <input type="hidden" name={name} value={selected} />

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
  const formType = localStorage.getItem("formType") || "welfare";
  const schemeTheme = getSchemeTheme(formType);

  // API Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const payload = {
      ...Object.fromEntries(formData.entries()),
      schemeType: "New Scheme",
    };
    console.log("Submitting:", payload);

    try {
      const res = await axios.post("https://rayat-backend.onrender.com/employees/create", payload);
      toast.success("User added successfully!");
      console.log(res.data);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Error adding user!");
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
          <SelectField name="profileType" label="Profile Type" options={["Teaching", "Non-teaching"]} />
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
          <SelectField name="currentAppointmentType" label="Current Appointment Type" options={["Permanent", "Probation"]} />
          <InputField name="firstAppointmentDate" label="First Appointment Date" type="date" />
          <InputField name="firstJoiningDate" label="First Joining Date" type="date" />
          <SelectField name="firstAppointmentType" label="First Appointment Type" options={["Permanent", "Probation"]} />
          <SelectField name="employeeType" label="Employee Type" options={["Granted", "Non-Granted"]} />
          <SelectField name="appointmentNature" label="Appointment Nature" options={["Full time", "Part time"]} />
        </FormSection>

        {/* Administrative */}
        <FormSection title="Administrative Details">
          <InputField name="approvalRefNo" label="Approval Reference No" />
          <InputField name="approvalLetterDate" label="Approval Letter Date" type="date" />
          <InputField name="retirementDate" label="Retirement Date" type="date" />
          <InputField name="qualifications" label="Qualifications" placeholder="BSc, MSc, etc." />
          <SelectField name="role" label="Role" options={["user", "Manager", "Admin"]} />
        </FormSection>

        <FormSection title="Nominee Details">
          <InputField
            name="Nominee1"
            label="Nominee 1"
            placeholder="Enter nominee name"
            required={false}
          />
          <InputField
            name="Relation1"
            label="Relation 1"
            placeholder="Enter relation"
            required={false}
          />
          <InputField
            name="Nominee2"
            label="Nominee 2"
            placeholder="Enter nominee name"
            required={false}
          />
          <InputField
            name="Relation2"
            label="Relation 2"
            placeholder="Enter relation"
            required={false}
          />
        </FormSection>

        {/* Address */}
        <FormSection title="Address Information">
          <TextAreaField name="presentAddress" label="Present Address" />
          <TextAreaField name="permanentAddress" label="Permanent Address" />
        </FormSection>

        {/* Branch */}
        <FormSection title="Branch Details">
          <SelectField name="branchName" label="Branch Name" options={BRANCHES} />
          <SelectField name="branchRegionName" label="Branch Region Name" options={REGION} />
          <SelectField
            name="branchType"
            label="Branch Type"
            options={BRANCH_TYPE}
          />
          <InputField name="branchJoiningDate" label="Branch Joining Date" type="date" />
        </FormSection>

        {/* Designation */}
        <FormSection title="Designation">
          <SelectField name="designation" label="Designation" options={DESIGNATIONS} />
        </FormSection>

        {/* Hidden Field */}
        <input type="hidden" name="id" />

        {/* Submit */}
        <div className="fixed bottom-6 right-8 z-40">
          <button
            type="submit"
            className="text-white px-8 py-4 rounded-full shadow-lg flex items-center gap-3 font-bold transition-all hover:scale-105"
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
            Submit Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewUser;

