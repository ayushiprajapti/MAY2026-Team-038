import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar({ activePage }) {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState({ fullName: "Admin User", role: "Chapter Head" });

  useEffect(() => {
    const stored = localStorage.getItem("intach_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAdminUser({
          fullName: parsed.fullName || "Admin User",
          role: parsed.role === "event_coordinator" ? "Chapter Head" : "Heritage Expert",
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("intach_user");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      to: "/admin-dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      id: "shop",
      name: "Heritage Shop",
      to: "/admin-shop",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      id: "old-admin",
      name: "Old Admin Review",
      to: "/admin",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-80 border-r border-heritage-border/30 bg-heritage-cream-light/60 backdrop-blur-md flex flex-col justify-between py-8 px-5 fixed h-screen top-0 left-0 z-40 select-none">
      <div>
        {/* Logo & Brand */}
        <div className="mb-12 px-4 flex flex-col text-left">
          <h1 className="font-serif text-2xl font-bold text-heritage-espresso tracking-tight">
            INTACH Pune
          </h1>
          <span className="font-sans text-[10px] tracking-wider text-heritage-charcoal/60 uppercase font-bold mt-1">
            Conservation Chapter
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 text-left">
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <a
                key={item.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.to);
                }}
                className={`flex items-center gap-4 rounded-lg px-5 py-3 transition-all duration-300 font-sans text-sm font-semibold ${
                  isActive
                    ? "bg-heritage-red text-white shadow-md"
                    : "text-heritage-charcoal hover:bg-heritage-cream/60 hover:text-heritage-red"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            );
          })}

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            className="flex items-center gap-4 text-heritage-charcoal hover:bg-heritage-cream/60 hover:text-heritage-red rounded-lg px-5 py-3 transition-all duration-300 font-sans text-sm font-semibold"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Chapter Home</span>
          </a>
        </nav>
      </div>

      {/* User Card & Logout */}
      <div className="border-t border-heritage-border/30 pt-6 px-4">
        <div className="flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-full bg-heritage-cream-dark border border-heritage-border flex items-center justify-center text-heritage-red font-bold font-serif shadow-sm">
            {adminUser.fullName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-sm font-bold text-heritage-espresso truncate">
              {adminUser.fullName}
            </p>
            <p className="font-sans text-[10px] text-heritage-charcoal/60 truncate font-semibold uppercase tracking-wider">
              {adminUser.role}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-5 py-2.5 bg-heritage-red/5 hover:bg-heritage-red/10 text-heritage-red font-sans text-xs font-bold uppercase tracking-wider rounded border border-heritage-red/20 transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
