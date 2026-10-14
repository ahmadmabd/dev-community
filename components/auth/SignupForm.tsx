"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import PasswordInput from "@/components/auth/PasswordInput";

export default function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setPasswordError("");

    // Check that both passwords match.
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must contain at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: normalizedEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Automatically log in after registration.
      const result = await signIn("credentials", {
        email: normalizedEmail,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        router.push("/login");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {/* Full Name */}
      <div>
        <label
          htmlFor="signup-name"
          className="mb-2 block text-sm text-slate-300"
        >
          Full Name
        </label>

        <input
          id="signup-name"
          type="text"
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          autoComplete="name"
          className="w-full rounded-xl border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none focus:border-violet-500"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="signup-email"
          className="mb-2 block text-sm text-slate-300"
        >
          Email Address
        </label>

        <input
          id="signup-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full rounded-xl border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none focus:border-violet-500"
        />
      </div>

      {/* Password */}
      <PasswordInput
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="At least 8 characters"
        autoComplete="new-password"
        minLength={8}
      />

      {/* Confirm Password */}
      <PasswordInput
        label="Confirm Password"
        value={confirmPassword}
        onChange={(value) => {
          setConfirmPassword(value);
          setPasswordError("");
        }}
        placeholder="Re-enter your password"
        autoComplete="new-password"
        minLength={8}
      />

      {/* Password validation */}
      {passwordError && (
        <p role="alert" className="text-sm text-red-400">
          {passwordError}
        </p>
      )}

      {/* API errors */}
      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
