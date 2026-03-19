import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Toon Expo",
  description: "Toon Expo privacy policy",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#050b10] px-5 py-12 text-white/85 lg:px-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-10 inline-block text-sm uppercase tracking-[0.16em] text-[#2ba8b0] transition hover:text-[#4ec8cf]"
        >
          ← Back to home
        </Link>
        <h1 className="text-2xl font-semibold uppercase tracking-[0.12em] text-white">
          Privacy policy
        </h1>
        <p className="mt-8 text-sm leading-relaxed text-white/60">
          This page will contain the full privacy policy for Toon Expo. Please add the final legal
          text when it is ready.
        </p>
      </div>
    </div>
  );
}
