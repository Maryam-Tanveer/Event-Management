import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight, Ticket, Building } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  fullName: yup.string().min(2, "Name must be at least 2 characters.").required("Full name is required."),
  email: yup.string().email("Please enter a valid email.").required("Email is required."),
  password: yup.string().min(6, "Password must be at least 6 characters.").required("Password is required."),
});

function CreateAccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { registerUser } = useAuth();
  const [role, setRole] = useState(location.state?.role || "attendee");
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data.fullName, data.email, data.password, role);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center bg-[#FDF6EC] py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8">

        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#8C6B45] font-semibold mb-1">
              Private Members<br />Portal
            </h2>
            <h1 className="text-2xl font-serif text-[#3d2a2a] font-bold">LuxeEvents</h1>
          </div>
          <button type="button" className="flex items-center gap-1.5 bg-[#F5E6D8] px-3 py-1.5 rounded-md text-[10px] font-medium text-[#5c4a4a]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C6B45]"></span>
            CONCIERGE<br/>ACCESS
          </button>
        </div>

        <div className="relative w-full h-32 rounded-xl overflow-hidden mb-6">
          <img src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=2070&auto=format&fit=crop" alt="Gala" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#4a1f2b]/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#4a1f2b] via-[#4a1f2b]/80 to-transparent flex flex-col justify-end p-4">
            <p className="text-white font-serif italic text-[15px] leading-tight mb-1">
              "The definitive standard for bespoke galas..."
            </p>
            <p className="text-[#F5E6D8] text-[10px]">
              <span className="font-bold text-[#b8862f]">Hélène de Montmirail</span> • Cultural Patron
            </p>
          </div>
        </div>

        <div className="bg-[#F5E6D8] p-1 rounded-lg flex mb-6">
          <Link to="/signin" className="flex-1 text-center py-2.5 font-medium text-[13px] text-[#7a6a6a]">
            Sign In
          </Link>
          <div className="flex-1 bg-white text-center py-2.5 rounded-md font-semibold text-[13px] text-[#3d2a2a] shadow-sm cursor-default">
            Create Account
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[13px] text-[#5c4a4a] font-medium mb-3">Select Tier & Role</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setRole("attendee")}
              className={`flex-1 flex flex-col items-center justify-center py-4 rounded-md transition-colors border ${role === 'attendee' ? 'bg-[#3d1823] text-white border-[#3d1823]' : 'bg-[#FDF6EC] text-[#3d2a2a] border-transparent hover:border-[#ebd8c5]'}`}
            >
              <Ticket size={20} className="mb-2" />
              <span className="text-[11px] font-bold tracking-wider mb-1">ATTENDEE</span>
              <span className={`text-[9px] ${role === 'attendee' ? 'text-gray-300' : 'text-[#7a6a6a]'}`}>Private Invitations</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("organizer")}
              className={`flex-1 flex flex-col items-center justify-center py-4 rounded-md transition-colors border ${role === 'organizer' ? 'bg-[#3d1823] text-white border-[#3d1823]' : 'bg-[#FDF6EC] text-[#3d2a2a] border-transparent hover:border-[#ebd8c5]'}`}
            >
              <Building size={20} className="mb-2" />
              <span className="text-[11px] font-bold tracking-wider mb-1">ORGANIZER</span>
              <span className={`text-[9px] ${role === 'organizer' ? 'text-gray-300' : 'text-[#7a6a6a]'}`}>Host Galas & Soirées</span>
            </button>
          </div>
          {/* Note: role selection is for UI preference — backend assigns attendee by default for all new accounts */}
          <p className="text-[10px] text-[#9a8a8a] mt-2 text-center">
            {role === "organizer"
              ? "Organizer access allows you to create and host events on LuxeEvents."
              : "Attendee access lets you browse and purchase tickets to exclusive events."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mb-2">
            <div>
              <input
                type="text"
                {...register("fullName")}
                placeholder="Full Legal Name"
                className={`w-full bg-[#FDF6EC] border px-4 py-3.5 rounded-md text-[13px] text-[#3d2a2a] placeholder-[#9a8a8a] focus:outline-none focus:ring-1 focus:ring-[#8C6B45] ${errors.fullName ? "border-red-400" : "border-transparent"}`}
              />
              {errors.fullName && <p className="text-red-500 text-[11px] mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <input
                type="email"
                {...register("email")}
                placeholder="Official Member Email"
                className={`w-full bg-[#FDF6EC] border px-4 py-3.5 rounded-md text-[13px] text-[#3d2a2a] placeholder-[#9a8a8a] focus:outline-none focus:ring-1 focus:ring-[#8C6B45] ${errors.email ? "border-red-400" : "border-transparent"}`}
              />
              {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className={`w-full bg-[#FDF6EC] border px-4 py-3.5 rounded-md text-[13px] text-[#3d2a2a] placeholder-[#9a8a8a] focus:outline-none focus:ring-1 focus:ring-[#8C6B45] ${errors.password ? "border-red-400" : "border-transparent"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a8a8a] hover:text-[#5c4a4a]"
              >
                {showPassword ? <EyeOff size={16} strokeWidth={2}/> : <Eye size={16} strokeWidth={2}/>}
              </button>
              {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div className="flex justify-start items-center mb-6 mt-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-3.5 h-3.5" />
              <span className="text-[11px] text-[#7a6a6a] font-medium group-hover:text-[#5c4a4a]">Keep active session</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3d1823] hover:bg-[#2c1119] text-[#FDF6EC] py-3.5 rounded-md text-[13px] font-semibold tracking-[0.1em] flex items-center justify-center gap-2 transition-colors mb-6 disabled:opacity-60"
          >
            {isSubmitting ? "PROCESSING..." : "REQUEST PRIVATE ACCESS"} <ArrowRight size={16} strokeWidth={2.5}/>
          </button>
        </form>

        <div className="text-center text-[10px] text-[#9a8a8a] leading-relaxed">
          Access subject to verification under the LuxeEvents Charter. <a href="/" className="underline decoration-[#d4c5b9] hover:text-[#5c4a4a]">Concierge Terms</a> & <a href="/" className="underline decoration-[#d4c5b9] hover:text-[#5c4a4a]">Discretion Policy</a>.
        </div>

      </div>
    </div>
  );
}

export default CreateAccountPage;