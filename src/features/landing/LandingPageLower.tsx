import Link from "next/link";
import { parseLatLng, parseMediaUrls } from "@/shared/lib/mediaUrls";
import { isFieldNonEmpty } from "@/shared/lib/expoFields";
import type { ExpoMap } from "@/features/landing/lib/blockVisibility";
import { visibleBlocks } from "@/features/landing/lib/blockVisibility";

import { HomeMapPreview } from "@/features/map/components/HomeMapPreview";
import { GallerySlider } from "@/features/landing/GallerySlider";
import { Tour3DBlock } from "@/features/landing/Tour3DBlock";
import { VideoEmbedBlock } from "@/features/landing/VideoEmbedBlock";

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

type Props = {
  fields: ExpoMap;
  title: string;
};

export function LandingPageLower({ fields, title }: Props) {
  const vis = visibleBlocks(fields);

  return (
    <>
      {vis.investment ? (
        <Section id="investment" className="bg-[#2ba8b0] px-4 py-16 text-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-2xl font-bold uppercase">Ներդրում</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                ["expo_field_07", "Մակերեսի min (դրամ)"],
                ["expo_field_08", "Մակերեսի max (դրամ)"],
                ["expo_field_17", "Միավոր min"],
                ["expo_field_18", "Միավոր max"],
                ["expo_field_10", "Բանկեր"],
                ["expo_field_09", "Եկամտային հարկ"],
              ].map(([k, lab]) =>
                isFieldNonEmpty(fields[k]) ? (
                  <div key={k} className="rounded-lg bg-white/10 p-4">
                    <p className="text-sm text-white/80">{lab}</p>
                    <p className="font-semibold">{fields[k]}</p>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </Section>
      ) : null}

      {vis.apartments ? (
        <Section id="apartments" className="px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold text-[#2ba8b0]">Բնակարաններ</h2>
            <pre className="whitespace-pre-wrap rounded-xl border border-[#2ba8b0]/30 bg-slate-50 p-4 text-sm">
              {fields.expo_field_06}
            </pre>
            <div className="mt-4 grid gap-2 text-sm md:grid-cols-3">
              {["expo_field_26", "expo_field_27", "expo_field_28"].map((k) =>
                isFieldNonEmpty(fields[k]) ? (
                  <p key={k}>
                    <span className="text-slate-500">{k.replace("expo_field_", "")}: </span>
                    {fields[k]}
                  </p>
                ) : null,
              )}
            </div>
          </div>
        </Section>
      ) : null}

      {vis.gallery ? (
        <Section id="gallery" className="bg-slate-100 px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 text-2xl font-bold text-[#2ba8b0]">Պատկերասրահ</h2>
            <GallerySlider
              urls={[
                ...parseMediaUrls(fields.expo_field_43),
                ...parseMediaUrls(fields.expo_field_44),
              ]}
            />
          </div>
        </Section>
      ) : null}

      {vis.payment ? (
        <Section id="payment" className="bg-[#ffd24d] px-4 py-16 text-slate-900">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-2xl font-bold">Վճարման պայմաններ</h2>
            <p className="whitespace-pre-wrap">{fields.expo_field_19}</p>
            {isFieldNonEmpty(fields.expo_field_09) ? (
              <p className="mt-4 font-medium">Եկամտային հարկ: {fields.expo_field_09}</p>
            ) : null}
          </div>
        </Section>
      ) : null}

      {vis.infrastructure ? (
        <Section id="infrastructure" className="px-4 py-16">
          <h2 className="mx-auto mb-6 max-w-3xl text-2xl font-bold text-[#2ba8b0]">
            Ինֆրակառուցվածք
          </h2>
          <p className="mx-auto max-w-3xl whitespace-pre-wrap">{fields.expo_field_33}</p>
        </Section>
      ) : null}

      {vis.construction ? (
        <Section id="construction" className="bg-slate-900 px-4 py-16 text-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-2xl font-bold uppercase">Շինարարություն</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["expo_field_20", "Տեսակ"],
                ["expo_field_21", "Երեսպատում"],
                ["expo_field_22", "Մեկուսացում"],
                ["expo_field_25", "Հարկայնություն"],
                ["expo_field_29", "Առաստաղ"],
                ["expo_field_30", "Վերելակներ"],
                ["expo_field_31", "Հանձնում"],
                ["expo_field_23", "Հող"],
                ["expo_field_24", "Բնակելի"],
                ["expo_field_35", "Ջեռուցում"],
                ["expo_field_36", "Հովացում"],
              ].map(([k, lab]) =>
                isFieldNonEmpty(fields[k]) ? (
                  <div key={k} className="rounded-lg border border-white/10 p-3">
                    <p className="text-xs text-[#2ba8b0]">{lab}</p>
                    <p>{fields[k]}</p>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </Section>
      ) : null}

      {vis.parking ? (
        <Section id="parking" className="bg-[#2ba8b0] px-4 py-16 text-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-2xl font-bold">Կայանատեղի և կոմերցիոն</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {[
                ["expo_field_37", "Բաց"],
                ["expo_field_38", "Փակ"],
                ["expo_field_39", "Չափ"],
                ["expo_field_40", "Արժեք"],
                ["expo_field_41", "Կոմերցիոն"],
              ].map(([k, lab]) =>
                isFieldNonEmpty(fields[k]) ? (
                  <div key={k}>
                    <p className="text-sm text-white/80">{lab}</p>
                    <p className="font-semibold">{fields[k]}</p>
                  </div>
                ) : null,
              )}
            </div>
            {isFieldNonEmpty(fields.expo_field_42) ? (
              <p className="mt-6 text-sm whitespace-pre-wrap">{fields.expo_field_42}</p>
            ) : null}
          </div>
        </Section>
      ) : null}

      {vis.tours ? (
        <Section id="tours" className="px-4 py-16">
          <div className="mx-auto max-w-4xl space-y-10">
            <h2 className="border-b border-[#2eb0b4] pb-2 text-2xl font-bold uppercase tracking-wide text-[#2eb0b4]">
              Tours &amp; Media
            </h2>
            {isFieldNonEmpty(fields.expo_field_45) ? (
              <div>
                <Tour3DBlock
                  url={fields.expo_field_45}
                  title={fields.expo_field_02 || "Տիպային տուր"}
                />
                <p className="mt-2 text-sm text-slate-500">Տիպային ինտերակտիվ տուր</p>
              </div>
            ) : null}
            {isFieldNonEmpty(fields.expo_field_47) ? (
              <div>
                <Tour3DBlock
                  url={fields.expo_field_47}
                  title={fields.expo_field_02 || "Արտաքին տուր"}
                />
                <p className="mt-2 text-sm text-slate-500">Արտաքին ինտերակտիվ տուր</p>
              </div>
            ) : null}
            {isFieldNonEmpty(fields.expo_field_46) ? (
              <div>
                <VideoEmbedBlock
                  url={fields.expo_field_46}
                  title={fields.expo_field_02}
                />
                <p className="mt-2 text-sm text-slate-500">Տեսանյութ</p>
              </div>
            ) : null}
            {isFieldNonEmpty(fields.expo_field_48) ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="mb-2 inline-block rounded bg-[#ffd24d] px-2.5 py-1 text-xs font-bold uppercase text-slate-900">
                  2D
                </span>
                <p className="mb-2 font-medium text-slate-800">2D հատակագծեր</p>
                <a
                  href={fields.expo_field_48}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-[#2eb0b4] underline"
                >
                  Բացել հղումը
                </a>
              </div>
            ) : null}
            {isFieldNonEmpty(fields.expo_field_49) ? (
              <div>
                <Tour3DBlock
                  url={fields.expo_field_49}
                  title={fields.expo_field_02 || "3D"}
                />
                <p className="mt-2 text-sm text-slate-500">3D / վիզուալիզացիա</p>
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      {vis.location && parseLatLng(fields.expo_field_16) ? (
        <Section id="location" className="bg-slate-100 px-0 py-0">
          <h2 className="sr-only">Տեղադիրք</h2>
          <div className="h-[400px] w-full">
            <HomeMapPreview
              markers={[
                {
                  lat: parseLatLng(fields.expo_field_16)!.lat,
                  lng: parseLatLng(fields.expo_field_16)!.lng,
                  label: fields.expo_field_15 || title,
                },
              ]}
              className="h-full w-full"
            />
          </div>
          {isFieldNonEmpty(fields.expo_field_15) ? (
            <p className="px-4 py-4 text-center text-slate-700">{fields.expo_field_15}</p>
          ) : null}
        </Section>
      ) : vis.location && isFieldNonEmpty(fields.expo_field_15) ? (
        <Section id="location" className="px-4 py-8">
          <p>{fields.expo_field_15}</p>
        </Section>
      ) : null}

      {vis.footer ? (
        <footer id="contacts" className="border-t border-slate-200 bg-slate-900 px-4 py-12 text-white">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {isFieldNonEmpty(fields.expo_field_51) ? (
                <a href={fields.expo_field_51} className="text-[#2ba8b0] underline" target="_blank" rel="noreferrer">
                  Կայք
                </a>
              ) : null}
              {isFieldNonEmpty(fields.expo_field_52) ? (
                <a href={fields.expo_field_52} className="text-[#2ba8b0] underline" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              ) : null}
              {isFieldNonEmpty(fields.expo_field_53) ? (
                <a href={fields.expo_field_53} className="text-[#2ba8b0] underline" target="_blank" rel="noreferrer">
                  Facebook
                </a>
              ) : null}
            </div>
            <Link href="/" className="text-sm text-slate-400">
              ← Toon Expo
            </Link>
          </div>
        </footer>
      ) : (
        <footer className="border-t bg-slate-900 px-4 py-8 text-center text-slate-400">
          <Link href="/">Toon Expo</Link>
        </footer>
      )}
    </>
  );
}
