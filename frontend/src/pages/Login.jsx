import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize default coordinator (admin) and member (user) users if none exist
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("intach_users") || "[]");

    // Seed Admin/Coordinator
    if (!users.some((u) => u.email === "admin@intachpune.org")) {
      users.push({
        fullName: "Pune admin",
        email: "admin@intachpune.org",
        phone: "+91 98765 43210",
        language: "english",
        password: "password123",
        role: "event_admin",
      });
    }

    // Seed General User
    if (!users.some((u) => u.email === "user@intachpune.org")) {
      users.push({
        fullName: "Heritage Member",
        email: "user@intachpune.org",
        phone: "+91 98230 11223",
        language: "english",
        password: "password123",
        role: "member",
      });
    }

    localStorage.setItem("intach_users", JSON.stringify(users));
  }, []);

  const handleQuickFill = (role) => {
    if (role === "admin") {
      setEmail("admin@intachpune.org");
      setPassword("password123");
    } else {
      setEmail("user@intachpune.org");
      setPassword("password123");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("intach_users") || "[]");
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password,
      );

      if (user) {
        localStorage.setItem("intach_user", JSON.stringify(user));
        // Dispatch custom event to notify Header about auth change
        window.dispatchEvent(new Event("auth-change"));
        setIsLoading(false);

        // Role-based routing: admin goes to dashboard, user goes to homepage
        if (user.role === "event_admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError("Invalid email or password. Use quick-fill options below.");
        setIsLoading(false);
      }
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

      {/* Floating Login Card */}
      <div className="relative z-10 w-full max-w-md bg-heritage-cream-light/95 backdrop-blur-md rounded-xl p-6 md:p-8 border border-heritage-border/30 shadow-[0_20px_50px_rgba(26,17,11,0.25)] flex flex-col max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div>
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl font-semibold text-heritage-espresso leading-tight">
              Welcome Back
            </h2>
            <p className="font-sans text-xs text-heritage-charcoal/80 mt-1">
              Access your heritage dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-800 text-xs rounded font-sans text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="relative group text-left">
              <label
                className="block font-sans text-xs font-semibold text-heritage-charcoal/70 uppercase tracking-wider mb-1 ml-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-heritage-border/60 text-heritage-espresso font-sans py-2 px-1 focus:border-heritage-bronze focus:ring-0 focus:outline-none transition-all duration-300 placeholder:text-heritage-charcoal/30 text-sm"
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coordinator@intachpune.org"
              />
            </div>

            {/* Password Field */}
            <div className="relative group text-left">
              <div className="flex justify-between items-center mb-1 ml-1">
                <label
                  className="font-sans text-xs font-semibold text-heritage-charcoal/70 uppercase tracking-wider"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(
                      "Default password is 'password123' for coordinator@intachpune.org",
                    );
                  }}
                  className="font-sans text-xs font-semibold text-heritage-red hover:text-heritage-red/80 transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <input
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-heritage-border/60 text-heritage-espresso font-sans py-2 px-1 focus:border-heritage-bronze focus:ring-0 focus:outline-none transition-all duration-300 placeholder:text-heritage-charcoal/30 text-sm"
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {/* Sign In Button */}
            <button
              className={`w-full bg-heritage-red py-3.5 rounded text-white font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-md hover:bg-heritage-red/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-heritage-red/20 cursor-pointer ${
                isLoading ? "opacity-90 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ?
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
                  Authenticating...
                </>
              : <>
                  <span>Sign In</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </>
              }
            </button>
          </form>

          {/* Quick Login Selections (Tester helper) */}
          <div className="mt-5 border-t border-heritage-border/20 pt-4 text-left font-sans text-[11px] select-none">
            <span className="block font-bold text-heritage-charcoal/60 uppercase tracking-wider mb-2 ml-1 text-[9px]">
              Quick Login Selection (Mock Roles)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickFill("admin")}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-heritage-red/5 hover:bg-heritage-red/10 text-heritage-red border border-heritage-red/20 hover:border-heritage-red/35 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>Admin Portal</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("user")}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-heritage-green/5 hover:bg-heritage-green/10 text-heritage-green border border-heritage-green/20 hover:border-heritage-green/35 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>User Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer registration link */}
        <div className="mt-6 pt-4 border-t border-heritage-border/20 text-center">
          <p className="font-sans text-xs text-heritage-charcoal/80">
            New to the portal?{" "}
            <Link
              to="/register"
              className="text-heritage-red font-bold hover:underline transition-all ml-1"
            >
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Decorative Blueprint Line Graphic */}
      <div className="absolute bottom-10 left-10 opacity-15 pointer-events-none hidden md:block select-none">
        <svg
          className="stroke-heritage-cream-dark"
          height="140"
          viewBox="0 0 100 100"
          width="140"
        >
          <path d="M10,90 L10,10 L90,10" fill="none" strokeWidth="0.5" />
          <path d="M20,90 L20,20 L90,20" fill="none" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  );
}
