import React from "react";
import dayjs from "dayjs";

export default function RayatBill({ data, onClose }) {

  // Helper: calculate years between two dates
  const getYears = (start, end) => {
    try {
      if (!start || !end) return 0;
      const s = new Date(start);
      const e = new Date(end);
      if (isNaN(s) || isNaN(e)) return 0;
      
      const years = (e - s) / (1000 * 60 * 60 * 24 * 365.25);
      return Math.max(0, years); // Prevent negative periods
    } catch {
      return 0;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'N/A' || dateStr === '—') return 'N/A';
    const d = dayjs(dateStr);
    return d.isValid() ? d.format('DD/MM/YYYY') : dateStr;
  };

  // Dynamic Calculation
  let bonus = 0;
  let total = 0;
  
  const fundAmount = Number(data.fund) || 0;

  if (data.scheme === "Old Scheme") {
    if (fundAmount >= 1200) {
      bonus = 1200;
    } else {
      bonus = 0;
    }
    total = fundAmount + bonus;
  }

  if (data.scheme === "New Scheme") {
    if (fundAmount >= 5000) {
      const years = getYears(data.installment1Date || data.joining, data.retirement);

      if (years >= 5 && years < 10) {
        bonus = 2000;
      } else if (years >= 10 && years < 15) {
        bonus = 3000;
      } else if (years >= 15) {
        bonus = 5000;
      }
    } else {
      bonus = 0;
    }

    total = fundAmount + bonus;
  }

  const serviceYears = getYears(data.installment1Date || data.joining, data.retirement);
  const servicePeriodFormatted = serviceYears > 0 ? `${serviceYears.toFixed(1)} Years` : 'N/A';

  return (
    <>
      <style>{`
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          body {
            margin: 0;
            -webkit-print-color-adjust: exact;
          }

          .no-print {
            display: none !important;
          }

          .print-container {
            width: 210mm;
            height: 297mm;
            padding: 20mm;
            box-sizing: border-box;
            margin: 0 auto;
          }

          .shadow-lg {
            box-shadow: none !important;
          }
        }
      `}</style>

      <div className="bg-gray-100 min-h-screen py-10 print:bg-white print:py-0">
        <div className="print-container max-w-4xl mx-auto bg-white p-10 shadow-lg border border-gray-300">

          {/* Header */}
          <div className="text-center border-b pb-4 mb-6 relative">
            {onClose && (
              <button 
                onClick={onClose} 
                className="absolute right-0 top-0 text-gray-500 hover:text-red-500 no-print text-xl font-bold px-3 py-1 bg-gray-100 rounded"
              >
                ✕
              </button>
            )}
            <h1 className="text-2xl font-bold uppercase tracking-wide">
              Rayat Kutumb Kalyan Yojana
            </h1>
            <p className="text-sm text-gray-600">
              Rayat Shikshan Sanstha, Satara - 415002
            </p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <p><b>Name:</b> {data.name}</p>
            <p><b>HRMS No:</b> {data.hrms}</p>
            <p><b>Scheme Type:</b> {data.scheme}</p>
            <p><b>Mobile No:</b> {data.mobile}</p>
            <p><b>Meeting Date:</b> {formatDate(data.meetingDate)}</p>
            <p><b>Cheque No:</b> {data.checkNo || 'N/A'}</p>
            <p><b>1st Installment Date:</b> {formatDate(data.installment1Date)}</p>
            <p><b>Retirement Date:</b> {formatDate(data.retirement)}</p>
            <p className="col-span-2"><b>Bonus Period:</b> {servicePeriodFormatted}</p>
          </div>

          {/* Table */}
          <table className="w-full border border-gray-400 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Sr. No.</th>
                <th className="border p-2 text-left">Particulars</th>
                <th className="border p-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 text-center">1</td>
                <td className="border p-2">Fund</td>
                <td className="border p-2 text-right">{fundAmount.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="border p-2 text-center">2</td>
                <td className="border p-2">Bonus</td>
                <td className="border p-2 text-right">{bonus.toLocaleString()}</td>
              </tr>
              <tr>
                <td colSpan="2" className="border p-2 text-right font-semibold">Total</td>
                <td className="border p-2 text-right font-bold">₹ {total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <div className="flex justify-between mt-16 text-sm">
            <div>
              <p>Date: {data.meetingDate && data.meetingDate !== '—' ? formatDate(data.meetingDate) : dayjs().format('DD/MM/YYYY')}</p>
            </div>
            <div className="text-right">
              <p className="mb-12">________________________</p>
              <p className="font-semibold">Authorized Signatory</p>
            </div>
          </div>

        </div>

        <div className="text-center mt-6 no-print flex justify-center gap-4">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow transition-colors font-semibold"
          >
            Print Bill
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded shadow transition-colors font-semibold"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </>
  );
}
