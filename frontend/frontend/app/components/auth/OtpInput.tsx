"use client";

import { useRef, useState } from "react";

export default function OtpInput({
  length = 6,
  onComplete,
}: {
  length?: number;
  onComplete: (code: string) => void;
}) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...values];
    next[i] = val.slice(-1);
    setValues(next);

    if (val && i < length - 1) inputsRef.current[i + 1]?.focus();

    const code = next.join("");
    if (code.length === length && !next.includes("")) onComplete(code);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !values[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    const next = pasted.split("");
    while (next.length < length) next.push("");
    setValues(next);
    if (pasted.length === length) onComplete(pasted);
  };

  return (
    <div className="flex justify-between gap-2" onPaste={handlePaste}>
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          className="w-11 h-13 py-3 text-center font-mono text-xl bg-[#1B1035] border border-[#3D2B6B] rounded-xl text-[#F5F3FF] focus:outline-none focus:border-[#2DD4BF] transition-colors"
        />
      ))}
    </div>
  );
}