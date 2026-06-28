"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, MapPin, Users } from "lucide-react";

export default function EmergencyBanner() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API exposed previously on localhost:3000
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/reports", {
          // Use no-cache or stale-while-revalidate depending on the need
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setReports(data.reports || []);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
    // Poll every 15 seconds to keep the banner updated without being too aggressive
    const interval = setInterval(fetchReports, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading || reports.length === 0) {
    return null; // Don't show anything if loading or no data
  }

  // Get the 3 most recent reports
  const latestReports = reports.slice(0, 3);

  return (
    <div className="w-full bg-red-600 text-white border-b-4 border-red-800">
      <div className="max-w-[1400px] mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <AlertTriangle className="w-5 h-5 font-bold" />
            <h3 className="font-bold text-sm uppercase tracking-wider">Reportes de Emergencia Sismo</h3>
          </div>

          <div className="flex-1 w-full overflow-hidden">
            <div className="flex flex-wrap md:flex-nowrap gap-4 text-sm justify-start md:justify-center">
              {latestReports.map((report) => (
                <div key={report.id} className="flex items-center gap-1.5 bg-red-700/50 px-3 py-1.5 rounded-md border border-red-500">
                  <MapPin className="w-4 h-4 text-red-200" />
                  <span className="font-semibold truncate max-w-[120px] md:max-w-[180px]">{report.place}</span>
                  {report.affected > 0 && (
                    <span className="flex items-center gap-1 text-red-100 text-xs ml-1">
                      <Users className="w-3 h-3" /> {report.affected} afect.
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 text-sm">
            <a 
              href="http://localhost:3000" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-white text-red-700 font-bold px-4 py-1.5 rounded hover:bg-red-50 transition-colors"
            >
              Ir al Mapa Oficial →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
