import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router";
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  LoaderIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="w-full flex items-center justify-center bg-slate-900 min-h-screen">
      <div className="relative w-full max-w-6xl md:h-[700px] bg-slate-900 rounded-lg  border-slate-800/40 shadow-md">
        <div className="w-full flex flex-col md:flex-row justify-center items-center h-full">
          {/* FORM COLUMN */}
          <div className="w-full md:w-1/2 p-10 flex items-center justify-center md:border-r border-slate-700/40 h-full">
            <div className="w-full max-w-md flex flex-col justify-center items-center">
              {/* HEADER */}
              <div className="text-center mb-8">
                <MessageCircleIcon className="w-12 h-12 mx-auto text-cyan-400 mb-4" />
                <h2 className="text-3xl font-bold text-slate-200 mb-2">
                  Welcome Back
                </h2>
                <p className="text-slate-400">
                  Login to access to your account
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-6 w-full ">
                {/* EMAIL */}
                <div>
                  <label className="auth-input-label">Email</label>
                  <div className="relative">
                    <MailIcon className="auth-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                    <input
                      type="email"
                      autoComplete="on"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="input w-full pl-12 outline-none focus:border-cyan-400"
                      placeholder="Enter your Email Address"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="auth-input-label">Password</label>
                  <div className="relative">
                    <LockIcon className="auth-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                    {showPassword ? (
                      <EyeIcon
                        className="auth-input-icon absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 cursor-pointer size-4 md:size-5"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      />
                    ) : (
                      <EyeOffIcon
                        className="auth-input-icon absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 cursor-pointer size-4 md:size-5"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      />
                    )}

                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="input w-full pl-12 pr-12 outline-none focus:border-cyan-400"
                      placeholder="Enter your Password"
                    />
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  className="auth-btn bg-cyan-400 w-full h-10 rounded-md mt-2 font-bold text-slate-900 hover:cursor-pointer"
                  type="submit"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <LoaderIcon className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                Don't have an account?
                <Link
                  to="/signup"
                  className="auth-link text-cyan-400 ml-3 underline"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          {/* ILLUSTRATION */}
          <div className="hidden md:flex md:w-1/2 items-center justify-center p-10 bg-linear-to-bl from-slate-800/40 to-transparent h-full">
            <div className="text-center">
              <img
                src="/login.png"
                alt="Signup Illustration"
                className="w-full max-w-sm mx-auto object-contain drop-shadow-lg"
              />

              <h3 className="text-xl font-medium text-cyan-400 mt-6">
                Connect anytime, anywhere
              </h3>

              <div className="mt-4 flex justify-center gap-4">
                <span className="auth-badge bg-cyan-900/60 pl-2 pr-2 h-5 flex justify-center items-center rounded-full text-xs text-cyan-400">
                  Free
                </span>
                <span className="auth-badge bg-cyan-900/60  pl-2 pr-2 flex justify-center items-center rounded-full text-xs text-cyan-400">
                  Easy Setup
                </span>
                <span className="auth-badge bg-cyan-900/60  pl-2 pr-2 flex justify-center items-center rounded-full text-xs text-cyan-400">
                  Private
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
