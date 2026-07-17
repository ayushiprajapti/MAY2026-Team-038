import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatsGrid from "../components/admin-dashboard/StatsGrid";
import SalesChart from "../components/admin-dashboard/SalesChart";
import EventsPanel from "../components/admin-dashboard/EventsPanel";
import VolunteerUploads from "../components/admin-dashboard/VolunteerUploads";
import AdminSidebar from "../components/shared/AdminSidebar";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [reviewCount, setReviewCount] = useState(3);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New volunteer upload",
      description: "Rahul Kulkarni uploaded Pataleshwar Caves monolithic shrine review.",
      time: "10 mins ago",
      read: false,
    },
    {
      id: 2,
      title: "Payment success",
      description: "Order #1248 payment of ₹450 was completed.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Walk Capacity Reached",
      description: "Kasba Peth Heritage Walk has met participant limit.",
      time: "3 hours ago",
      read: false,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-heritage-cream/90 flex text-heritage-espresso">
      {/* Shared Sidebar Component */}
      <AdminSidebar activePage="dashboard" />

      {/* Main Content Area */}
      <main className="flex-1 ml-80 p-8 md:p-12 overflow-y-auto">
        {/* Inline Dashboard Header */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full mb-10 text-left">
          <div>
            <h2 className="font-serif text-3xl font-bold text-heritage-espresso">
              Conservation Dashboard
            </h2>
            <p className="text-sm text-heritage-charcoal/70 mt-1 font-sans">
              Welcome back, administrator. Overview of Pune's heritage pulse.
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 sm:mt-0 select-none relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-heritage-border/60 bg-heritage-cream-light/30 hover:bg-heritage-cream text-heritage-charcoal/80 transition-all duration-300 relative shadow-sm cursor-pointer"
              title="Notifications"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-heritage-red rounded-full ring-2 ring-heritage-cream-light animate-pulse" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 mt-2 w-80 bg-heritage-cream-light border border-heritage-border rounded-xl shadow-lg z-50 p-5 text-left transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center border-b border-heritage-border/30 pb-2 mb-3">
                  <h5 className="font-serif text-sm font-bold text-heritage-espresso">
                    Notifications ({unreadCount})
                  </h5>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] text-heritage-red hover:underline font-semibold font-sans uppercase tracking-wider cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                
                <div className="space-y-4 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-heritage-charcoal/50 text-center py-4 font-sans">
                      No notifications available.
                    </p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`text-xs flex items-start gap-2.5 transition-opacity duration-300 ${
                          notif.read ? "opacity-45" : "opacity-100"
                        }`}
                      >
                        {/* Status dot indicator */}
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.read ? "bg-transparent" : "bg-heritage-red"}`} />
                        
                        <div className="flex-1">
                          <p className={`font-semibold text-heritage-espresso ${notif.read ? "line-through decoration-heritage-charcoal/20" : ""}`}>
                            {notif.title}
                          </p>
                          <p className="text-heritage-charcoal/70 mt-0.5 leading-relaxed font-sans">
                            {notif.description}
                          </p>
                          <span className="text-[10px] text-heritage-charcoal/40 font-mono mt-1 block">
                            {notif.time}
                          </span>
                        </div>

                        {/* Check Button to Mark as Read */}
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="w-5 h-5 rounded-full border border-heritage-border flex items-center justify-center hover:bg-heritage-cream text-heritage-charcoal hover:text-heritage-red shrink-0 cursor-pointer transition-all duration-300"
                            title="Mark as read"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* 1. Summary Statistics Grid */}
        <section className="mb-8">
          <StatsGrid />
        </section>

        {/* 2. Bento Layout: Analytics & Schedules */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
          <div className="lg:col-span-8 h-full">
            <SalesChart />
          </div>
          <div className="lg:col-span-4 h-full">
            <EventsPanel />
          </div>
        </section>

        {/* 3. Volunteer Submissions Review Grid */}
        <section className="mb-4">
          <VolunteerUploads onReviewCountChange={(count) => setReviewCount(count)} />
        </section>
      </main>
    </div>
  );
}
