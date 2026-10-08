import React from "react";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

function DocumentItem({ doc }) {
  const handleDownload = () => {
    const content = `LUXE EVENTS OFFICIAL PASS & RECEIPT\n----------------------------------------\nDocument: ${doc.title}\nDetails: ${doc.subtitle}\nIssued to: Authenticated Attendee\nVerification Code: LXE-${Math.random().toString(36).substring(2, 9).toUpperCase()}\nStatus: Verified Access\nIssued Date: ${new Date().toLocaleDateString()}\n----------------------------------------\nThank you for choosing LuxeEvents.`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded: ${doc.title}`);
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[#F5E6D8] rounded-md flex items-center justify-center text-sm">
          {doc.icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{doc.title}</p>
          <p className="text-xs text-gray-500">{doc.subtitle}</p>
        </div>
      </div>
      <button
        onClick={handleDownload}
        title="Download Document"
        aria-label={`Download ${doc.title}`}
        className="p-2 text-gray-500 hover:text-[#8b2d3a] hover:bg-[#F5E6D8] rounded-full transition-colors cursor-pointer"
      >
        <Download size={16} />
      </button>
    </div>
  );
}
export default DocumentItem;