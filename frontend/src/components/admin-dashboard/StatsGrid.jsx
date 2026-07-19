import React from "react";

export default function StatsGrid() {
  const stats = [
    {
      title: "Shop Sales",
      value: "₹1,42,800",
      change: "+12%",
      changeType: "positive",
      period: "vs last month",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconColor: "text-heritage-bronze bg-heritage-cream",
    },
    {
      title: "Chapter Members",
      value: "1,248",
      change: "+48",
      changeType: "positive",
      period: "new this week",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      iconColor: "text-heritage-bronze bg-heritage-cream",
    },
    {
      title: "Pending Reviews",
      value: "3",
      change: "Urgent",
      changeType: "neutral",
      period: "requires action",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      iconColor: "text-heritage-red bg-heritage-red/10",
    },
    {
      title: "Planned Events",
      value: "14",
      change: "Next 30 Days",
      changeType: "info",
      period: "scheduled walks/crafts",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      iconColor: "text-heritage-bronze bg-heritage-cream",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-heritage-cream-light p-6 rounded-xl border border-heritage-border/80 hover:border-heritage-bronze transition-all duration-300 shadow-[0_4px_15px_rgba(43,33,24,0.04)] group hover:shadow-[0_10px_25px_rgba(43,33,24,0.08)]"
        >
          <div className="flex justify-between items-start flex-wrap gap-2 mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border border-heritage-border/30 shadow-sm shrink-0 ${stat.iconColor}`}>
              {stat.icon}
            </div>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                stat.changeType === "positive"
                  ? "text-emerald-700 bg-emerald-50 border border-emerald-100"
                  : stat.changeType === "neutral"
                  ? "text-heritage-red bg-heritage-red/5 border border-heritage-red/10 animate-pulse"
                  : "text-heritage-charcoal/70 bg-heritage-cream-dark/50 border border-heritage-border/30"
              }`}
            >
              {stat.change}
            </span>
          </div>
          <p className="text-heritage-charcoal/60 font-sans text-xs font-semibold uppercase tracking-wider">
            {stat.title}
          </p>
          <h3 className="font-serif text-3xl font-bold text-heritage-espresso mt-1.5 tracking-tight">
            {stat.value}
          </h3>
          <p className="text-[11px] text-heritage-charcoal/50 font-sans mt-2">
            {stat.period}
          </p>
        </div>
      ))}
    </div>
  );
}
