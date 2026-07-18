"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/app/components/auth/AuthShell";
import OtpInput from "@/app/components/auth/OtpInput";

function VerifyOtpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const purpose = params.get("purpose") || "register"; // "register" | "login"

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const [resendKey, setResendKey] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const API = process.env.NEXT_PUBLIC_API_URL;

const endpoint =
  purpose === "login"
    ? `${API}/api/auth/verify-login-otp`
    : `${API}/api/auth/verify-otp`;

  const handleVerify = async (code: string) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid code");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Could not resend code");
      }
      setCooldown(30);
      setResendKey((k) => k + 1);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthShell
      eyebrow={purpose === "login" ? "SECURITY CHECK" : "STEP 2 OF 2"}
      title="Enter verification code"
      subtitle={`We sent a 6-digit code to ${email || "your email"}.`}
    >
      <div key={resendKey}>
        <OtpInput onComplete={handleVerify} />
      </div>

      {error && (
        <p className="font-body text-sm text-[#FBBF24] mt-4">{error}</p>
      )}
      {loading && (
        <p className="font-mono text-xs text-[#A78BCA] mt-4">Verifying…</p>
      )}

      <button
        onClick={handleResend}
        disabled={cooldown > 0}
        className="w-full mt-6 font-body text-sm text-[#2DD4BF] disabled:text-[#A78BCA] transition-colors"
      >
        {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
      </button>
    </AuthShell>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}