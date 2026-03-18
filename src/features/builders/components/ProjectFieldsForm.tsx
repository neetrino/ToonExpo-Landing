import { EXPO_FIELD_GROUPS, EXPO_FIELD_LABELS_HY } from "@/shared/constants/expoFieldKeys";
import type { ExpoFieldsFormValues } from "@/shared/lib/expoFields";
import { UploadFieldButton } from "@/features/builders/components/UploadFieldButton";

const URL_FIELD_KEYS = new Set([
  "expo_field_43",
  "expo_field_44",
  "expo_field_45",
  "expo_field_46",
  "expo_field_47",
  "expo_field_48",
  "expo_field_49",
  "expo_field_50",
  "expo_field_51",
  "expo_field_52",
  "expo_field_53",
]);

const LONG_FIELDS = new Set([
  "expo_field_06",
  "expo_field_19",
  "expo_field_33",
  "expo_field_34",
  "expo_field_42",
]);

type Props = {
  defaults: ExpoFieldsFormValues;
};

export function ProjectFieldsForm({ defaults }: Props) {
  const d = defaults as Record<string, string>;

  return (
    <div className="flex flex-col gap-10">
      {EXPO_FIELD_GROUPS.map((group) => (
        <fieldset key={group.id} className="rounded-xl border border-slate-200 p-4">
          <legend className="px-2 text-lg font-semibold text-slate-800">{group.titleHy}</legend>
          <div className="mt-4 flex flex-col gap-4">
            {group.keys.map((key) => {
              const label = EXPO_FIELD_LABELS_HY[key] ?? key;
              const val = d[key] ?? "";
              const isUrl = URL_FIELD_KEYS.has(key);
              const isLong = LONG_FIELDS.has(key) || key === "expo_field_19";
              return (
                <div key={key} className="flex flex-col gap-1">
                  <label htmlFor={key} className="text-sm font-medium text-slate-700">
                    {label}
                  </label>
                  {isLong ? (
                    <textarea
                      id={key}
                      name={key}
                      rows={4}
                      defaultValue={val}
                      className="rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
                    />
                  ) : (
                    <input
                      id={key}
                      name={key}
                      type="text"
                      defaultValue={val}
                      className="rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
                    />
                  )}
                  {isUrl ? <UploadFieldButton inputName={key} /> : null}
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
