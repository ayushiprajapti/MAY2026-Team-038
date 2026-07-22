import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar({ activePage }) {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState({
    fullName: "Admin User",
    role: "Chapter Head",
  });

  useEffect(() => {
    const stored = localStorage.getItem("intach_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAdminUser({
          fullName: parsed.fullName || "Admin User",
          role:
            parsed.role === "event_coordinator" ?
              "Chapter Head"
            : "Heritage Expert",
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
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
          />
        </svg>
      ),
    },
    {
      id: "shop",
      name: "Heritage Shop",
      to: "/admin-shop",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
    {
      id: "events",
      name: "Manage Events",
      to: "/admin/events",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "database",
      name: "Heritage Database",
      to: "/admin-db",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
          />
        </svg>
      ),
    },
    {
      id: "chat",
      name: "Expert Chat",
      to: "/admin-chat",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      id: "old-admin",
      name: "Admin Review",
      to: "/admin-review",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
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
                  isActive ?
                    "bg-heritage-red text-white shadow-md"
                  : "text-heritage-charcoal hover:bg-heritage-cream/60 hover:text-heritage-red"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            );
          })}
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
