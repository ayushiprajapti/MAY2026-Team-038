import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("english");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms & Privacy Policy");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("intach_users") || "[]");
      
      // Check if user already exists
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        setError("Email is already registered. Try signing in.");
        setIsLoading(false);
        return;
      }

      const newUser = {
        fullName,
        email,
        phone,
        language,
        password,
        role: "registered_member",
      };

      users.push(newUser);
      localStorage.setItem("intach_users", JSON.stringify(users));

      setSuccess("Account created successfully! Redirecting to login...");
      setIsLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }, 1200);
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Full-bleed Heritage Background Collage */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: "url('/pune_heritage_collage.png')" }}
        />
        {/* Warm Terracotta Overlay */}
        <div className="absolute inset-0 bg-heritage-red/65 backdrop-blur-[2px]"></div>
      </div>

      {/* Floating Register Card */}
      <div className="relative z-10 w-full max-w-lg bg-heritage-cream-light/95 backdrop-blur-md rounded-xl p-6 md:p-8 border border-heritage-border/30 shadow-[0_20px_50px_rgba(26,17,11,0.25)] flex flex-col max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div>
          <div className="text-center mb-5">
            <h2 className="font-serif text-2xl font-semibold text-heritage-espresso leading-tight">
              Join INTACH Pune
            </h2>
            <p className="font-sans text-xs text-heritage-charcoal/80 mt-1">
              Become a steward of Pune's heritage
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-800 text-xs rounded font-sans text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-2 bg-green-50 border border-green-200 text-green-800 text-xs rounded font-sans text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="relative group text-left">
              <label
                className="block font-sans text-xs font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <input
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-heritage-border/60 text-heritage-espresso font-sans py-1.5 px-1 focus:border-heritage-bronze focus:ring-0 focus:outline-none transition-all duration-300 placeholder:text-heritage-charcoal/30 text-sm"
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Malhar Rao"
              />
            </div>

            {/* Email Address */}
            <div className="relative group text-left">
              <label
                className="block font-sans text-xs font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-heritage-border/60 text-heritage-espresso font-sans py-1.5 px-1 focus:border-heritage-bronze focus:ring-0 focus:outline-none transition-all duration-300 placeholder:text-heritage-charcoal/30 text-sm"
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="malhar@example.com"
              />
            </div>

            {/* Phone & Language Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative group text-left">
                <label
                  className="block font-sans text-xs font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <input
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-heritage-border/60 text-heritage-espresso font-sans py-1.5 px-1 focus:border-heritage-bronze focus:ring-0 focus:outline-none transition-all duration-300 placeholder:text-heritage-charcoal/30 text-sm"
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="relative group text-left">
                <label
                  className="block font-sans text-xs font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1"
                  htmlFor="language"
                >
                  Preferred Language
                </label>
                <select
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-heritage-border/60 text-heritage-espresso font-sans py-1.5 px-1 focus:border-heritage-bronze focus:ring-0 focus:outline-none transition-all duration-300 cursor-pointer text-sm"
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="english" className="bg-heritage-cream-light text-heritage-espresso">English</option>
                  <option value="marathi" className="bg-heritage-cream-light text-heritage-espresso">Marathi (मराठी)</option>
                  <option value="hindi" className="bg-heritage-cream-light text-heritage-espresso">Hindi (हिन्दी)</option>
                </select>
              </div>
            </div>

            {/* Password & Confirm Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative group text-left">
                <label
                  className="block font-sans text-xs font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-heritage-border/60 text-heritage-espresso font-sans py-1.5 px-1 focus:border-heritage-bronze focus:ring-0 focus:outline-none transition-all duration-300 placeholder:text-heritage-charcoal/30 text-sm"
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="relative group text-left">
                <label
                  className="block font-sans text-xs font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-heritage-border/60 text-heritage-espresso font-sans py-1.5 px-1 focus:border-heritage-bronze focus:ring-0 focus:outline-none transition-all duration-300 placeholder:text-heritage-charcoal/30 text-sm"
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2 py-1 text-left">
              <input
                className="mt-0.5 rounded-sm border-heritage-border text-heritage-red focus:ring-heritage-red/45 h-3.5 w-3.5 bg-transparent cursor-pointer"
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <label
                className="font-sans text-[11px] text-heritage-charcoal/80 cursor-pointer select-none leading-normal"
                htmlFor="terms"
              >
                I agree to the{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Privacy Policy Details"); }} className="text-heritage-red hover:underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Membership Terms Details"); }} className="text-heritage-red hover:underline">
                  Terms
                </a>
                .
              </label>
            </div>

            {/* Register Button */}
            <button
              className={`w-full bg-heritage-red py-3.5 rounded text-white font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-md hover:bg-heritage-red/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-heritage-red/20 cursor-pointer ${
                isLoading ? "opacity-90 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer login link */}
        <div className="mt-5 pt-4 border-t border-heritage-border/20 text-center">
          <p className="font-sans text-xs text-heritage-charcoal/80">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-heritage-red font-bold hover:underline transition-all ml-1"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
