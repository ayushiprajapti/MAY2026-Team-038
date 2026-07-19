import React, { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

// Register all Chart.js controllers, scales, elements
Chart.register(...registerables);

export default function SalesChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Jan - Jun 2026");
  const periods = ["Jan - Jun 2026", "Jul - Dec 2026"];

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClose = () => setDropdownOpen(false);
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, [dropdownOpen]);

  // Mock DBML-aligned data: Orders aggregated by month (Jan-Jun)
  // Values represent total_cents converted to INR (divided by 100)
  const salesData = [
    { month: "Jan", totalCents: 4500000, displayValue: 45000 },
    { month: "Feb", totalCents: 5800000, displayValue: 58000 },
    { month: "Mar", totalCents: 4800000, displayValue: 48000 },
    { month: "Apr", totalCents: 7200000, displayValue: 72000 },
    { month: "May", totalCents: 8500000, displayValue: 85000 },
    { month: "Jun", totalCents: 14280000, displayValue: 142800 }, // Matches ₹1,42,800
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    
    // Create soft gradient fill under line
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(140, 45, 25, 0.2)");
    gradient.addColorStop(1, "rgba(140, 45, 25, 0.0)");

    // Destroy existing chart instance to prevent canvas leakage on re-render
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: salesData.map((d) => d.month),
        datasets: [
          {
            label: "Monthly Sales (₹)",
            data: salesData.map((d) => d.displayValue),
            borderColor: "#8c2d19", // heritage-red
            borderWidth: 3.5,
            backgroundColor: gradient,
            fill: true,
            tension: 0.38,
            pointBackgroundColor: "#f4e3c1", // heritage-cream-dark
            pointBorderColor: "#8c2d19",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: "#b87333", // heritage-bronze
            pointHoverBorderColor: "#FAF1DD",
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "#2b2118", // heritage-charcoal
            titleFont: {
              family: "Satoshi, sans-serif",
              size: 13,
              weight: "600",
            },
            bodyFont: {
              family: "Satoshi, sans-serif",
              size: 13,
              weight: "500",
            },
            bodyColor: "#FAF1DD", // heritage-cream-light
            padding: 10,
            cornerRadius: 6,
            displayColors: false,
            callbacks: {
              label: (context) => {
                return `Revenue: ₹${context.raw.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#2b2118", // heritage-charcoal
              font: {
                family: "Satoshi, sans-serif",
                size: 11,
                weight: "500",
              },
            },
          },
          y: {
            grid: {
              color: "rgba(230, 208, 172, 0.25)", // heritage-border
            },
            ticks: {
              color: "#2b2118",
              font: {
                family: "Satoshi, sans-serif",
                size: 11,
                weight: "500",
              },
              callback: (value) => `₹${value >= 1000 ? value / 1000 + "k" : value}`,
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-heritage-cream-light p-6 md:p-8 rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)] h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="font-serif text-2xl font-semibold text-heritage-espresso">
            Revenue Analytics
          </h4>
          <p className="text-xs text-heritage-charcoal/60 mt-1 font-sans">
            Aggregate book & craft sales metrics (DBML orders: paid)
          </p>
        </div>
        
        <div className="relative select-none text-left">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }}
            className="flex items-center gap-2 bg-heritage-cream border border-heritage-border/60 text-heritage-espresso text-xs rounded font-sans px-3 py-1.5 hover:border-heritage-bronze transition-all duration-300 cursor-pointer font-medium shadow-sm focus:outline-none"
          >
            <span>{selectedPeriod}</span>
            <svg
              className={`w-3 h-3 text-heritage-charcoal/70 transition-transform duration-300 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-40 bg-heritage-cream-light border border-heritage-border/90 rounded-lg shadow-lg z-30 overflow-hidden font-sans text-xs animate-in fade-in slide-in-from-top-1">
              {periods.map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 hover:bg-heritage-cream text-heritage-espresso transition-colors duration-200 flex justify-between items-center cursor-pointer ${
                    selectedPeriod === period ? "font-semibold bg-heritage-cream/40" : ""
                  }`}
                >
                  <span>{period}</span>
                  {selectedPeriod === period && (
                    <svg className="w-3 h-3 text-heritage-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative h-60 w-full flex-1">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
