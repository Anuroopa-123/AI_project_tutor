"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/app/components/auth/AuthShell";
import { saveSession, roleHomePath } from "@/app/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
     const API_URL = process.env.NEXT_PUBLIC_API_URL;

const res = await fetch(`${API_URL}/api/auth/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(form),
});
      const data = await res.json();
      console.log("Login Response:", data);
      if (!res.ok) throw new Error(data.detail || "Login failed");

if (data.otp_required) {
  // Store email so OTP page knows which account to verify
  sessionStorage.setItem("login_email", form.email);

  router.push("/auth/verify-otp");
  return;
}

// Login success
saveSession(
  data.access_token,
  data.refresh_token,
  data.user
);

const path = roleHomePath(data.user.role);
console.log("Redirecting to:", path);

router.push(path);
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
          <a href="/auth/register" className="text-[#2DD4BF] hover:underline">Create an account</a>
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
          <label className="block font-body text-xs text-[#A78BCA] mb-1.5">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#1B1035] border border-[#3D2B6B] rounded-xl font-body text-sm text-[#F5F3FF] focus:outline-none focus:border-[#2DD4BF] transition-colors"
            placeholder="Enter password"
          />
        </div>

        {error && <p className="font-body text-sm text-[#FBBF24]">{error}</p>}

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