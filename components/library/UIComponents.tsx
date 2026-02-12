import React from 'react';

// 1. The Button Component (Fixed the name and props)
export const RyzeButton = ({ label, variant = "primary" }: { label: string, variant?: "primary" | "secondary" }) => {
  const styles = variant === "primary" 
    ? "bg-blue-600 text-white hover:bg-blue-700" 
    : "bg-gray-200 text-gray-800 hover:bg-gray-300";
  return (
    <button className={`px-4 py-2 rounded-md font-medium transition-colors ${styles}`}>
      {label}
    </button>
  );
};

// 2. The Card Component (Fixed the double declaration)
export const RyzeCard = ({ title, children }: { title?: string, children: React.ReactNode }) => (
  <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm mb-4 w-full">
    {title && <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">{title}</h2>}
    <div className="text-gray-600">{children}</div>
  </div>
);

// 3. The Input Component
export const RyzeInput = ({ label, placeholder }: { label?: string, placeholder?: string }) => (
  <div className="flex flex-col gap-1 mb-4 w-full">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input 
      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none w-full text-black"
      placeholder={placeholder}
    />
  </div>
);

// This object links the names to the components for the AI
export const RYZE_COMPONENTS = {
  RyzeButton,
  RyzeCard,
  RyzeInput
};