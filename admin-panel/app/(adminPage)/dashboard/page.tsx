"use client";

import React, { useEffect, useState } from "react";
import { AxiosInstance } from "@/api/axios/axios";
import { endPoints } from "@/api/endPoints/endPoints";
import {
  Users,
  LayoutGrid,
  CalendarCheck,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const DashboardOverview = () => {
  const [counts, setCounts] = useState({
    doctors: 0,
    departments: 0,
    totalAppointments: 0,
    confirmed: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, depRes, appRes] = await Promise.all([
          AxiosInstance.get(endPoints.doctor.list(1, 1000)),
          AxiosInstance.get(endPoints.department.list),
          AxiosInstance.get(endPoints.appointment.list),
        ]);

        const apps = appRes.data.data || [];

        setCounts({
          doctors: docRes.data.totalItems || docRes.data.data.length,
          departments: depRes.data.data.length,
          totalAppointments: apps.length,
          confirmed: apps.filter((a: any) => a.status === "Confirmed").length,
          pending: apps.filter((a: any) => a.status === "Pending").length,
        });

        setRecentAppointments(apps.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { title: "Doctors", count: counts.doctors, icon: Users },
    { title: "Departments", count: counts.departments, icon: LayoutGrid },
    { title: "Appointments", count: counts.totalAppointments, icon: CalendarCheck },
    { title: "Confirmed", count: counts.confirmed, icon: CheckCircle },
    { title: "Pending", count: counts.pending, icon: Clock },
  ];

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen text-white bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#2563eb]">

      {/* ===== TITLE ===== */}
      <h2 className="text-2xl font-bold mb-6 text-center">
        Admin Dashboard 
      </h2>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#2563eb]border border-white/10 shadow-lg hover:scale-105 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">{item.title}</p>
                  <h3 className="text-2xl font-bold">
                    {item.count}
                  </h3>
                </div>

                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Icon size={20} className="text-blue-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== RECENT APPOINTMENTS ===== */}
      <div className="mt-8 bg-gradient-to-br from-[#1e3a8a] to-[#1d4ed8] rounded-xl border border-white/10 shadow-lg">

        {/* HEADER */}
        <div className="p-5 flex justify-between items-center border-b border-white/10">
          <h3 className="font-semibold text-white">
            Recent Appointments
          </h3>

          <Link
            href="/appointments"
            className="text-blue-400 text-sm flex items-center gap-1 hover:underline"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* TABLE */}
        <table className="w-full text-sm">
          <thead className="bg-[#0f172a] text-gray-400">
            <tr>
              <th className="p-3 text-left">Patient</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-right">Status</th>
            </tr>
          </thead>

          <tbody>
            {recentAppointments.map((app) => (
              <tr
                key={app._id}
                className="border-t border-white/10 hover:bg-blue-400/20 transition"
              >
                <td className="p-3">{app.name}</td>

                <td className="p-3">
                  {new Date(app.date).toLocaleDateString()} - {app.time}
                </td>

                <td className="p-3 text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${app.status === "Confirmed"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                      }`}
                  >
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
};

export default DashboardOverview;