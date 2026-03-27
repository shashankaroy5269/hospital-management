"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  LogOut,
  Search,
  Bell,
  Menu,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import styles from "./layout.module.css";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarProfileOpen, setIsSidebarProfileOpen] = useState(false);
  const [isHeaderProfileOpen, setIsHeaderProfileOpen] = useState(false);

  const [adminData, setAdminData] = useState({
    name: "Admin",
    email: "admin@hospital.com",
  });

  useEffect(() => {
    const storedName = sessionStorage.getItem("userName");
    const storedEmail = sessionStorage.getItem("userEmail");

    if (storedName || storedEmail) {
      setAdminData({
        name: storedName || "Admin",
        email: storedEmail || "admin@hospital.com",
      });
    }
  }, []);

  const firstLetter = adminData.name.charAt(0).toUpperCase();

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/auth/login";
  };

  return (
    <div className={styles.wrapper}>
      
      {/* SIDEBAR */}
      <aside
        className={`${styles.sidebar} ${
          !isSidebarOpen ? styles.collapsed : ""
        }`}
      >
        <div className={styles.logoSection}>
          <Building2 size={28} />
          {isSidebarOpen && <span>CarePlus</span>}
        </div>

        <nav className={styles.navLinks}>
          <Link href="/dashboard" className={styles.navItem}>
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </Link>

          <Link href="/departments" className={styles.navItem}>
            <Building2 size={18} /> <span>Department</span>
          </Link>

          <Link href="/doctors/list" className={styles.navItem}>
            <Stethoscope size={18} /> <span>Doctors</span>
          </Link>

          <Link href="/appointments" className={styles.navItem}>
            <CalendarCheck size={18} /> <span>Appointment</span>
          </Link>
        </nav>

        {/* PROFILE */}
        <div
          className={styles.sidebarProfile}
          onClick={() => setIsSidebarProfileOpen(!isSidebarProfileOpen)}
        >
          <div className={styles.avatar}>{firstLetter}</div>

          {isSidebarOpen && (
            <div>
              <p>{adminData.name}</p>
              <p className={styles.email}>{adminData.email}</p>
            </div>
          )}

          {isSidebarProfileOpen && isSidebarOpen && (
            <div className={styles.dropdown}>
              
              <div onClick={handleLogout}>
                <LogOut size={14} /> Logout
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <main className={styles.mainArea}>
        
        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={20} />
            </button>
            <h1>Hospital Management  Admin Panel</h1>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.search}>
              <Search size={16} />
              <input placeholder="Search..." />
            </div>

            <Bell size={20} />

            <div
              className={styles.avatar}
              onClick={() => setIsHeaderProfileOpen(!isHeaderProfileOpen)}
            >
              {firstLetter}
            </div>

            {isHeaderProfileOpen && (
              <div className={styles.headerDropdown}>
                <p>{adminData.name}</p>
                <p>{adminData.email}</p>
              </div>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <section className={styles.content}>{children}</section>
      </main>
    </div>
  );
};

export default DashboardLayout;