import Image from "next/image";
import Link from "next/link";
import { parseMediaUrls } from "@/shared/lib/mediaUrls";
import { isFieldNonEmpty } from "@/shared/lib/expoFields";
import { visibleBlocks, type ExpoMap } from "@/features/landing/lib/blockVisibility";
import { LandingPageLower } from "@/features/landing/LandingPageLower";
import type { LandingBlockId } from "@/features/landing/lib/blockVisibility";

type Props = {
  fields: ExpoMap;
};

const NAV: { id: string; hy: string; block: LandingBlockId }[] = [
  { id: "about", hy: "Մասին", block: "about" },
  { id: "investment", hy: "Ներդրում", block: "investment" },
  { id: "apartments", hy: "Բնակարաններ", block: "apartments" },
  { id: "gallery", hy: "Պատկերասրահ", block: "gallery" },
  { id: "payment", hy: "Վճարում", block: "payment" },
  { id: "infrastructure", hy: "Ինֆրակառուցվածք", block: "infrastructure" },
  { id: "construction", hy: "Շինարարություն", block: "construction" },
  { id: "parking", hy: "Կայանատեղի", block: "parking" },
  { id: "tours", hy: "Տուրեր և մեդիա", block: "tours" },
  { id: "location", hy: "Տեղադիրք", block: "location" },
  { id: "contacts", hy: "Կոնտակտ", block: "footer" },
];

function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}

export function LandingPage({ fields }: Props) {
  const vis = visibleBlocks(fields);
  const navItems = NAV.filter((n) => vis[n.block]);
  const title = fields.expo_field_02 || fields.expo_field_01 || "Նախագիծ";
  const heroImgs = parseMediaUrls(fields.expo_field_43);
  const heroBg = heroImgs[0];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="fixed left-0 right-0 top-0 z-50 bg-black/70 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <Link href="/" className="text-sm font-semibold text-[#2ba8b0]">
            Toon Expo
          </Link>
          <nav className="flex max-h-[40vh] flex-wrap justify-end gap-x-4 gap-y-1 text-xs uppercase tracking-wide">
            {navItems.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="hover:text-[#2ba8b0]">
                {n.hy}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {vis.hero || heroBg || title ? (
        <div className="relative min-h-[70vh] w-full pt-14">
          {heroBg ? (
            <Image
              src={heroBg}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-800" />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 mx-auto flex max-w-3xl flex-col gap-4 px-6 py-24 text-white">
            {isFieldNonEmpty(fields.expo_field_50) ? (
              <div className="relative h-16 w-40">
                <Image
                  src={fields.expo_field_50}
                  alt=""
                  fill
                  className="object-contain object-left"
                />
              </div>
            ) : null}
            <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
            {isFieldNonEmpty(fields.expo_field_34) ? (
              <p className="max-w-xl text-lg text-white/90">{fields.expo_field_34.slice(0, 280)}</p>
            ) : null}
            {isFieldNonEmpty(fields.expo_field_03) ? (
              <p className="text-sm text-white/80">{fields.expo_field_03}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {vis.about ? (
        <Section id="about" className="bg-slate-900 px-4 py-16 text-white">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold uppercase text-[#2ba8b0]">Մասին</h2>
            <div className="space-y-4 text-slate-200">
              {(
                [
                  ["expo_field_11", "Կառուցապատող"],
                  ["expo_field_12", "Նախագծող"],
                  ["expo_field_13", "Շինարարություն"],
                  ["expo_field_14", "Կառավարում"],
                ] as const
              ).map(([k, lab]) =>
                isFieldNonEmpty(fields[k]) ? (
                  <p key={k}>
                    <span className="text-[#2ba8b0]">{lab}: </span>
                    {fields[k]}
                  </p>
                ) : null,
              )}
              {isFieldNonEmpty(fields.expo_field_34) ? (
                <p className="whitespace-pre-wrap">{fields.expo_field_34}</p>
              ) : null}
            </div>
          </div>
        </Section>
      ) : null}

      <LandingPageLower fields={fields} title={title} />
    </div>
  );
}
