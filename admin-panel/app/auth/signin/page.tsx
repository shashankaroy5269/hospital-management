"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cookies } from "react-cookie";

export default function LoginPage() {
  const router = useRouter();
  const cookies = new Cookies();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/admin/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 🔥 IMPORTANT
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    // ✅ save token in cookie
    cookies.set("token", data.token, { path: "/" });

    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
      <form onSubmit={handleLogin} className="bg-white/10 p-8 rounded-xl w-96">
        <h2 className="text-2xl mb-4 text-center">Admin Login</h2>

        <input
          className="w-full p-2 mb-3 bg-white/20 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 mb-3 bg-white/20 rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-500 p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}