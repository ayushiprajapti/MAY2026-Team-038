import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

// Register all Chart.js controllers, scales, elements
Chart.register(...registerables);

function formatMonthLabel(month) {
  // month is "YYYY-MM" from the backend
  const [year, m] = month.split("-").map(Number);
  return new Date(year, m - 1, 1).toLocaleDateString("en-IN", { month: "short" });
}

export default function SalesChart({ points = [] }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || points.length === 0) return;

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
        labels: points.map((p) => formatMonthLabel(p.month)),
        datasets: [
          {
            label: "Monthly Sales (₹)",
            data: points.map((p) => Math.round(p.total_cents / 100)),
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
  }, [points]);

  return (
    <div className="bg-heritage-cream-light p-6 md:p-8 rounded-xl border border-heritage-border/80 shadow-[0_4px_15px_rgba(43,33,24,0.04)] h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="font-serif text-2xl font-semibold text-heritage-espresso">
            Revenue Analytics
          </h4>
          <p className="text-xs text-heritage-charcoal/60 mt-1 font-sans">
            Aggregate book & craft sales, last 6 months
          </p>
        </div>
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-heritage-bronze bg-heritage-cream px-2.5 py-1 rounded border border-heritage-border/40">
          Last 6 Months
        </span>
      </div>

      <div className="relative h-60 w-full flex-1">
        {points.length === 0 ? (
          <p className="text-xs text-heritage-charcoal/50 font-sans absolute inset-0 flex items-center justify-center">
            No sales data yet.
          </p>
        ) : (
          <canvas ref={canvasRef} />
        )}
      </div>
    </div>
  );
}
