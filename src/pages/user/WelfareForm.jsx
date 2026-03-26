import { useState } from "react";
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
    certificatesAttached: 'होय',
    sanctionLetter: "",
    previousHelp: "होय",
    previousHelpDetails: "",
    annualDeductions: "होय",
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

    if (form.certificatesAttached === 'नाही') {
      alert('please upload documents and update the documents attached status');
      return;
    }

    try {

      const today = new Date();

      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); 
      const yyyy = today.getFullYear();

      const formattedDate = `${dd}/${mm}/${yyyy}`;

      let formData = { ...form, ...uploads.urls };

      form.formDate = formattedDate;
      formData.applicantSignature = uploads.applicantSignature;
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      formData.hrmsNo = decoded.hrmsNo;

      formData.patientId = uuidv4();
      formData.expensesId = uuidv4();
      formData.requestId = uploads.id;
      formData.previousId = uuidv4();

      console.log(`request id: ${formData.requestId}`);

      const response = await axios.post(
        "http://localhost:3000/user/submit-welfare-form",
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
        certificatesAttached: 'होय',
        sanctionLetter: "",
        previousHelp: "होय",
        previousHelpDetails: "",
        annualDeductions: "होय",
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
              रयत शिक्षण संस्था, रयत सेवक वेलफेअर फंड, सातारा.
            </h1>
            <h2 className="text-xl underline font-medium mt-1">
              मदत मागणी अर्ज
            </h2>
          </div>

          {/* Address block */}
          <div
            className="mb-4 text-base"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <p>प्रति,</p>
            <p>मा. चेअरमनसो,</p>
            <p>रयत शिक्षण संस्था, रयत सेवक वेलफेअर फंड, सातारा.</p>
          </div>

          <div
            className="mb-4 text-base"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <p className="ml-10">
              <strong>
                विषय: सेवक वेल्फेअर फंडातून आर्थिक मदत मिळण्याबाबत.
              </strong>
            </p>
          </div>

          <div
            className="mb-6 text-base"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <p>
              महाशय, <br />
              <p className="ml-5">
                मी खालील कारणाकरिता आपल्या सेवक वेल्फेअर फंडातून आर्थिक मदत
                मिळावी म्हणून हा अर्ज करीत आहे. त्यासाठी मी माझी पुढीलप्रमाणे
                माहिती देत आहे.
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
                १ अ) अर्जदाराचे संपूर्ण नाव (प्रथम आडनाव )
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
              <div className="w-1/3">ब) शाखेचे नाव</div>
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
                क) नेमणूक तारीख
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
                ड)हुद्दा
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
                ई) संस्थेतील एकूण सेवाकालावधी
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
              <div className="w-1/2">२. दरमहा सर्व पगार</div>
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
              <div className="w-1/2">मोबाईल नं.</div>
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
                ३. अ) ज्याचे आजारासाठी मदत हवी आहे त्याचे संपूर्ण नाव
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
              <div className="w-1/3">सेवकाशी नाते</div>
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
                ब) आजाराचे स्वरूप
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
              क) आजाराचा कालावधी
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
              <div className="w-1/3">४ अ) औषधे रु.</div>
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

              <div className="w-1/3">ब) डॉक्टरांचे बिल रु.</div>
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
              <div className="w-1/3">क) इतर खर्च रु.</div>
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

              <div className="w-1/3">ड) एकूण झालेला खर्च रु.</div>
              <div className="w-1/3">
                <input
                  name="totalExpenses"
                  type="number"
                  value={form.totalExpenses}
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
              ५. वरील प्रमाणे झालेल्या खर्चाची बिले व पावत्या क्रमांक ०१ ते ___
              सोबत जोडलेली आहेत.
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-1/2">
                ६. वर नमूद केलेल्या आजारांबाबत डॉक्टरांचे सर्टिफिकेट जोडले आहे.
              </div>
              <div className="w-1/2">
                <select
                  name="certificatesAttached"
                  value={form.certificatesAttached}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base bg-transparent"
                >
                  <option value="होय">होय</option>
                  <option value="नाही">नाही</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-1/3">
                ७. यापूर्वी फंडातून मदत घेतली आहे / नाही
              </div>
              <div className="w-2/3">
                <select
                  name="previousHelp"
                  value={form.previousHelp}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base bg-transparent"
                >
                  <option value="होय">होय</option>
                  <option value="नाही">नाही</option>
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
                ८ अ) प्रत्येक वर्षासाठी सेवक वेलफेअर फंडाची वगणी दिलेली आहे काय
              </div>
              <div className="w-1/2">
                <select
                  name="annualDeductions"
                  value={form.annualDeductions}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base bg-transparent"
                  placeholder="____________________________"
                >
                  <option value="होय">होय</option>
                  <option value="नाही">नाही</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-1/3">
                ९ अ) आता किती मदतीची आवश्यकता आहे ती रक्कम रु. अंकी व अक्षरी
              </div>
              <div className="w-2/3">
                <input
                  name="requestedAmountNumbers"
                  type="number"
                  value={form.requestedAmountNumbers}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base mb-1"
                  placeholder="(अंकी) ___________________"
                />
                <input
                  name="requestedAmountWords"
                  value={form.requestedAmountWords}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                  placeholder="(अक्षरी) ____________________________________"
                />
              </div>
            </div>

            <div className="mt-2">
              ब) किमतीने मंजूर केलेली मदत जमा रयत सेवक को-ऑपरेटिव्ह बँक लिमिटेड
              सातारा शाखा
              <div className="flex gap-3 mt-2">
                <div className="w-1/2">
                  शाखा
                  <input
                    name="branchNameForDeposit"
                    value={form.branchNameForDeposit}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-700 focus:outline-none py-1 text-base"
                    placeholder="__________"
                  />
                </div>
                <div className="w-1/2">
                  सेविंग ठेव खाते क्र.
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
              अर्जात वर दिलेली माहिती खरी व परिस्थितीत धरून आहे. त्यामध्ये काही
              चूक अगर विसंगती आढळल्यास त्याबाबत संस्थेकडून माझ्याविरुद्ध
              होणाऱ्या कारवाईस मी जबाबदार राहील याची मला पूर्ण जाणीव आहे तरी
              माझ्या अर्जाचा सहानुभूतीपूर्वक विचार करून फंडातून मला मदत मिळावी
              अशी विनंती आहे
            </p>
          </div>

          {/* applicant signature at right side */}
          <div
            className="mb-6 text-base flex justify-end"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            <div className="text-right">
              <p className="mb-2">अर्जदाराची सही :</p>
              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*,.pdf"
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
                  📎 {form.applicantSignature.name}
                </p>
              )}
              <p className="text-base text-gray-500 mt-1">
                (Image or PDF max 5MB)
              </p>
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
              🖨️ Print
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-700 text-white px-4 py-2 text-xl rounded-md hover:bg-green-800 focus:outline-none transition"
            >
              ✓ Submit
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
