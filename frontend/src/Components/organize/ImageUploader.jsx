import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

function ImageUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB.");
      return;
    }

    try {
      setUploading(true);
      toast.loading("Uploading image...", { id: "img-upload" });

      // First attempt CDN upload via backend /api/upload
      try {
        const formData = new FormData();
        formData.append("image", file);
        const { data } = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (data?.url) {
          onChange(data.url);
          toast.success("Image uploaded to CDN!", { id: "img-upload" });
          setUploading(false);
          return;
        }
      } catch (cdnErr) {
        console.warn("Backend CDN upload skipped/failed, using local reader fallback:", cdnErr.message);
      }

      // Fallback: local data URL for offline or unconfigured Cloudinary
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
        toast.success("Image attached successfully!", { id: "img-upload" });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error("Image upload failed.", { id: "img-upload" });
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-[#e0d6cc] group">
          <img src={value} alt="Event preview" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
          <p className="text-[11px] text-[#a09080] mt-2 text-center italic">Click image to remove</p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          disabled={uploading}
          className="w-full h-40 border-2 border-dashed border-[#d5ccc3] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#b8862f] hover:bg-[#faf7f4] transition-colors cursor-pointer disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 size={24} className="text-[#b8862f] animate-spin" />
          ) : (
            <Upload size={24} className="text-[#b8862f]" />
          )}
          <span className="text-sm font-medium text-[#3d2a2a]">
            {uploading ? "Processing..." : "Upload Event Image"}
          </span>
          <span className="text-[11px] text-[#a09080]">JPG, PNG, WEBP - max 5MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default ImageUploader;
