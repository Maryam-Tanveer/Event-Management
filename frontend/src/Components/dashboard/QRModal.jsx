import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Download, Ticket } from "lucide-react";

// QR Modal — ticket ka QR code dikhata hai
// QR code mein encode hota hai: ticketId, event title, ticket type, attendee
// Organizer event pe isko scan karke entry verify kar sakta hai

function QRModal({ ticket, onClose }) {
  const qrRef = useRef(null);

  // QR code mein encode kiya jaane wala data
  // JSON string banao — easily parseable
  const qrData = JSON.stringify({
    ticketId: ticket.ticketId,
    eventId: ticket.id,
    title: ticket.title,
    type: ticket.accessType,
    date: ticket.date,
    issued: new Date().toISOString().split("T")[0],
  });

  // QR code SVG download karo as PNG
  const handleDownload = () => {
    const svgElement = qrRef.current?.querySelector("svg");
    if (!svgElement) return;

    // SVG → Canvas → PNG
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 300;
    canvas.height = 300;

    img.onload = () => {
      // White background add karo (transparent SVG PNG mein problem)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `ticket-${ticket.ticketId}.png`;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Backdrop click se modal close ho
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    // Full screen overlay
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Ticket QR Code"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Ticket size={16} className="text-[#8C6B45]" />
            <span className="text-sm font-semibold text-[#3d2a2a] tracking-wide">
              Your Ticket QR Code
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={15} className="text-gray-500" />
          </button>
        </div>

        {/* QR Code */}
        <div className="px-6 pt-6 pb-4 flex flex-col items-center">
          {/* Branded QR container */}
          <div
            ref={qrRef}
            className="bg-[#FDF6EC] rounded-xl p-5 border border-[#e8ddd0] mb-5"
          >
            <QRCodeSVG
              value={qrData}
              size={200}
              bgColor="#FDF6EC"
              fgColor="#2d1a0e"
              level="H"           // H = high error correction — agar QR thoda damage ho toh bhi scan ho
              includeMargin={false}
            />
          </div>

          {/* Ticket details */}
          <div className="w-full space-y-2 mb-5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-medium uppercase tracking-wider">Event</span>
              <span className="text-[#3d2a2a] font-semibold text-right max-w-[60%] leading-tight">
                {ticket.title}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-medium uppercase tracking-wider">Ticket ID</span>
              <span className="text-[#3d2a2a] font-mono font-bold">{ticket.ticketId}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-medium uppercase tracking-wider">Type</span>
              <span className="text-[#3d2a2a] font-semibold">{ticket.accessType}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-medium uppercase tracking-wider">Date</span>
              <span className="text-[#3d2a2a]">{ticket.date}</span>
            </div>
          </div>

          {/* Divider with dots — boarding pass style */}
          <div className="w-full flex items-center gap-1 mb-5">
            <div className="w-3 h-3 rounded-full bg-gray-100 -ml-8 shrink-0" />
            <div className="flex-1 border-t-2 border-dashed border-gray-200" />
            <div className="w-3 h-3 rounded-full bg-gray-100 -mr-8 shrink-0" />
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#3d1823] hover:bg-[#2c1119] text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <Download size={14} />
            Download QR Code
          </button>

          <p className="text-[10px] text-gray-400 mt-3 text-center">
            Present this QR code at the event entrance for verification.
          </p>
        </div>
      </div>
    </div>
  );
}

export default QRModal;
