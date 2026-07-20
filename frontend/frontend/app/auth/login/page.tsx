"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/app/components/auth/AuthShell";



export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");

     if (data.otp_required) {
  router.push(
    `/auth/verify-otp?email=${encodeURIComponent(form.email)}&purpose=login`
  );
} else {
  switch (data.user.role) {
    case "SUPER_ADMIN":
      router.push("/super-admin/superadmindashboard");
      break;

    case "ADMIN":
      router.push("/admin/dashboard");
      break;

    case "TEACHER":
      router.push("/teacher/dashboard");
      break;

    case "STUDENT":
      router.push("/student/dashboard");
      break;

    default:
      router.push("/");
  }
}
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="WELCOME BACK"
      title="Log in"
      subtitle="Enter your credentials to continue your session."
      footer={
        <>
          New here?{" "}
          <a href="/register" className="text-[#2DD4BF] hover:underline">Create an account</a>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-body text-xs text-[#A78BCA] mb-1.5">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#1B1035] border border-[#3D2B6B] rounded-xl font-body text-sm text-[#F5F3FF] focus:outline-none focus:border-[#2DD4BF] transition-colors"
            placeholder="ada@university.edu"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block font-body text-xs text-[#A78BCA]">Password</label>
            <a href="/forgot-password" className="font-body text-xs text-[#2DD4BF] hover:underline">
              Forgot?
            </a>
          </div>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#1B1035] border border-[#3D2B6B] rounded-xl font-body text-sm text-[#F5F3FF] focus:outline-none focus:border-[#2DD4BF] transition-colors"
            placeholder="Enter password"
          />
        </div>

        {error && (
          <p className="font-body text-sm text-[#FBBF24]">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#2DD4BF] text-[#1B1035] font-body font-semibold hover:bg-[#5EEAD4] transition-colors disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}