"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/app/components/auth/AuthShell";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
     const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
    }
);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");
      router.push(`/auth/verify-otp?email=${encodeURIComponent(form.email)}&purpose=register`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="STEP 1 OF 2"
      title="Create your account"
      subtitle="We'll send a verification code to your email."
      footer={
        <>
          Already have an account?{" "}
          <a href="/login" className="text-[#2DD4BF] hover:underline">Log in</a>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-body text-xs text-[#A78BCA] mb-1.5">Full name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#1B1035] border border-[#3D2B6B] rounded-xl font-body text-sm text-[#F5F3FF] focus:outline-none focus:border-[#2DD4BF] transition-colors"
            placeholder="Ada Lovelace"
          />
        </div>

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
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#1B1035] border border-[#3D2B6B] rounded-xl font-body text-sm text-[#F5F3FF] focus:outline-none focus:border-[#2DD4BF] transition-colors"
            placeholder="At least 8 characters"
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
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}