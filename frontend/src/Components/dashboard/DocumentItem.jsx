import { Download } from "lucide-react";

function DocumentItem({ doc }) {
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
      <button className="text-gray-500 hover:text-gray-800">
        <Download size={16} />
      </button>
    </div>
  );
}
export default DocumentItem;