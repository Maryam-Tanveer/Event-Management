import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

function MultipleImageUploader({ values, onChange }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    
    // Validation
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File too large (max 5MB): ${file.name}`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      setUploading(true);
      toast.loading(`Processing ${validFiles.length} image(s)...`, { id: "multi-img-upload" });

      const newImages = [];
      for (const file of validFiles) {
        let uploadedUrl = null;
        try {
          const formData = new FormData();
          formData.append("image", file);
          const { data } = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          if (data?.url) {
            uploadedUrl = data.url;
          }
        } catch (cdnErr) {
          console.warn("Backend CDN upload skipped/failed for image, using reader fallback");
        }

        if (!uploadedUrl) {
          uploadedUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }
        newImages.push(uploadedUrl);
      }

      onChange([...(values || []), ...newImages]);
      toast.success("Images uploaded successfully!", { id: "multi-img-upload" });
    } catch (err) {
      toast.error("Image upload failed.", { id: "multi-img-upload" });
    } finally {
      setUploading(false);
      // Reset input value to allow uploading the same file again if removed
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove) => {
    const newValues = values.filter((_, idx) => idx !== indexToRemove);
    onChange(newValues);
  };

  return (
    <div className="w-full">
      {values && values.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {values.map((imgSrc, idx) => (
            <div key={idx} className="relative rounded-xl overflow-hidden border border-[#e0d6cc] group h-32">
              <img src={imgSrc} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current.click()}
        disabled={uploading}
        className="w-full h-32 border-2 border-dashed border-[#d5ccc3] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#b8862f] hover:bg-[#faf7f4] transition-colors cursor-pointer disabled:opacity-60"
      >
        {uploading ? (
          <Loader2 size={24} className="text-[#b8862f] animate-spin" />
        ) : (
          <Upload size={24} className="text-[#b8862f]" />
        )}
        <span className="text-sm font-medium text-[#3d2a2a]">
          {uploading ? "Processing..." : "Add Gallery Images"}
        </span>
        <span className="text-[11px] text-[#a09080]">JPG, PNG, WEBP - max 5MB (Multiple allowed)</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default MultipleImageUploader;
