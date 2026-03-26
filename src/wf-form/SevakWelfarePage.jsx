import React, { useState } from "react";
import UserForm from "./UserForm";
import SubAdminExtra from "./SubAdminExtra";
import AdminExtra from "./AdminExtra";
import ViewDocuments from "./ViewDocuments";


export default function SevakWelfarePage() {
  const role = localStorage.getItem('role');
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
  return (
    <div className="min-h-screen bg-neutral-100 py-6 px-4 sm:px-6 lg:px-8 "
    >

      {/* ---------------- USER FORM SECTION (Visible for all roles) --------------- */}
      <UserForm role={role} />

      {/* ---------------- SUB-ADMIN SECTION (Image 1 content only) --------------- */}
      {role === "sub-admin" && (
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-md p-8 mt-6 print:shadow-none print:rounded-none">
          <SubAdminExtra />
          <ViewDocuments docs={uploadedDocuments} />
        </div>
      )}

      {/* ---------------- ADMIN SECTION (Image 1 + Image 2 + Docs) --------------- */}
      {role === "admin" && (
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-md p-8 mt-6 print:shadow-none print:rounded-none">
          <SubAdminExtra />
          <AdminExtra />
          <ViewDocuments docs={uploadedDocuments} />
        </div>
      )}
    </div>
  );
}
