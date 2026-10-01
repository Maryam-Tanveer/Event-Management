import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema
const schema = yup.object({
  email: yup.string().email("Please enter a valid email.").required("Email is required."),
  password: yup.string().min(6, "Password must be at least 6 characters.").required("Password is required."),
});

function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success("Successfully logged in!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials. Please try again.");
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
            CONCIERGE<br />ACCESS
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
          <div className="flex-1 bg-white text-center py-2.5 rounded-md font-semibold text-[13px] text-[#3d2a2a] shadow-sm cursor-default">
            Sign In
          </div>
          <Link to="/create-account" className="flex-1 text-center py-2.5 font-medium text-[13px] text-[#7a6a6a] hover:text-[#5c4a4a]">
            Create Account
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mb-2">
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
                {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
              </button>
              {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 mt-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-3.5 h-3.5" />
              <span className="text-[11px] text-[#7a6a6a] font-medium group-hover:text-[#5c4a4a]">Keep active session</span>
            </label>
            <Link to="/forgot-password" className="text-[11px] text-[#8C6B45] font-semibold hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3d1823] hover:bg-[#2c1119] text-[#FDF6EC] py-3.5 rounded-md text-[13px] font-semibold tracking-[0.1em] flex items-center justify-center gap-2 transition-colors mb-6 disabled:opacity-60"
          >
            {isSubmitting ? "AUTHORIZING..." : "AUTHORIZE ENTRY"} <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </form>

        <div className="text-center text-[10px] text-[#9a8a8a] leading-relaxed">
          Access subject to verification under the LuxeEvents Charter. <a href="/" className="underline decoration-[#d4c5b9] hover:text-[#5c4a4a]">Concierge Terms</a> & <a href="/" className="underline decoration-[#d4c5b9] hover:text-[#5c4a4a]">Discretion Policy</a>.
        </div>

      </div>
    </div>
  );
}

export default SignInPage;