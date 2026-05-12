import React from 'react';

export const FormSection = ({ title, children }) => (
  <div className="mb-6 border-b pb-4 border-gray-100 last:border-0">
    {title && <h3 className="text-lg font-bold text-gray-800 mb-3">{title}</h3>}
    <div className="space-y-3">{children}</div>
  </div>
);

export const FormInput = ({ label, name, value, onChange, type = "text", placeholder, disabled, className = "", readOnly = false }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-base">
    {label && <label className="sm:w-1/3 font-medium text-gray-700">{label}</label>}
    <div className="flex-1">
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1 transition-colors ${readOnly ? 'bg-gray-50 text-gray-500' : 'bg-transparent'} ${className}`}
      />
    </div>
  </div>
);

export const FormSelect = ({ label, name, value, onChange, options, disabled }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-base">
    {label && <label className="sm:w-1/3 font-medium text-gray-700">{label}</label>}
    <div className="flex-1">
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-1 bg-transparent transition-colors"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  </div>
);
