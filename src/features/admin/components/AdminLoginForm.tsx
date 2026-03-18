"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

type Props = {
  callbackUrl: string;
};

export function AdminLoginForm({ callbackUrl }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setPending(false);
    if (res?.error) {
      setError("Սխալ էլ. փոստ կամ գաղտնաբառ");
      return;
    }
    window.location.href = callbackUrl;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-600">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-600">Գաղտնաբառ</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#2ba8b0] py-2.5 font-medium text-white disabled:opacity-50"
      >
        {pending ? "…" : "Մուտք"}
      </button>
    </form>
  );
}
