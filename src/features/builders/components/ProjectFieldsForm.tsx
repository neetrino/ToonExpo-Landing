import {
  EXPO_EDIT_SECTIONS,
  EXPO_FIELD_GROUPS,
  EXPO_FIELD_LABELS_HY,
  type ExpoEditSectionId,
  type ExpoFieldGroupId,
} from "@/shared/constants/expoFieldKeys";
import type { ExpoFieldsFormValues } from "@/shared/lib/expoFields";
import { UploadFieldButton } from "@/features/builders/components/UploadFieldButton";
import { MediaListField } from "@/features/builders/components/MediaListField";
import { ProjectMediaFolderHint } from "@/features/builders/components/ProjectMediaFolderHint";
import {
  MEDIA_EMBED_EXTERNAL_URL_FIELD_KEYS,
  MEDIA_GALLERY_FIELD_KEYS,
  MEDIA_HIDDEN_PRESERVE_FIELD_KEYS,
} from "@/features/builders/constants/adminMediaFieldGroups";

/** Multiple images (gallery): upload several or add URLs */
const MEDIA_LIST_FIELD_KEYS = new Set(["expo_field_43", "expo_field_44"]);

const URL_FIELD_KEYS = new Set([
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

const EMBED_URL_KEYS = new Set<string>(MEDIA_EMBED_EXTERNAL_URL_FIELD_KEYS);
const GALLERY_KEYS = new Set<string>(MEDIA_GALLERY_FIELD_KEYS);
const HIDDEN_MEDIA_KEYS = new Set<string>(MEDIA_HIDDEN_PRESERVE_FIELD_KEYS);

const GALLERY_URL_HINT_HY =
  "Հանրային URL-ներ՝ նախընտրելի է Cloudflare R2 (կամ ավելացրեք վերբեռնված ֆայլերից ստացված հղումները)։";

export type ProjectFieldsFormProps = {
  defaults: ExpoFieldsFormValues;
  /** If set, only this group is rendered */
  groupId?: ExpoFieldGroupId;
  /** Merged edit section (several field groups) */
  sectionId?: ExpoEditSectionId;
  /** Միայն «media» բաժնի համար — R2 լոգոյի նախադիտում */
  mediaFolderLogoUrl?: string | null;
  mediaFolderId?: string | null;
  exampleLogoPublicUrl?: string | null;
};

const FIELD_INPUT_CLASS =
  "min-w-0 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-[#2eb0b4] focus:outline-none focus:ring-1 focus:ring-[#2eb0b4]";

function FieldRow({
  keyId,
  label,
  val,
  isUrl,
  isLong,
  hideUrlUpload = false,
  urlHint,
}: {
  keyId: string;
  label: string;
  val: string;
  isUrl: boolean;
  isLong: boolean;
  /** Տուր/տեսանյութի դաշտեր — արտաքին embed, ոչ թե ֆայլի վերբեռնում */
  hideUrlUpload?: boolean;
  urlHint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={keyId} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {urlHint ? <p className="text-xs text-slate-500">{urlHint}</p> : null}
      {isLong ? (
        <>
          <textarea
            id={keyId}
            name={keyId}
            rows={4}
            defaultValue={val}
            className={FIELD_INPUT_CLASS}
          />
          {isUrl && !hideUrlUpload ? (
            <div className="flex justify-end pt-1">
              <UploadFieldButton inputName={keyId} />
            </div>
          ) : null}
        </>
      ) : isUrl ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <input
            id={keyId}
            name={keyId}
            type="text"
            defaultValue={val}
            className={`${FIELD_INPUT_CLASS} sm:flex-1`}
          />
          {!hideUrlUpload ? (
            <div className="flex shrink-0 items-center sm:items-stretch">
              <UploadFieldButton inputName={keyId} />
            </div>
          ) : null}
        </div>
      ) : (
        <input
          id={keyId}
          name={keyId}
          type="text"
          defaultValue={val}
          className={FIELD_INPUT_CLASS}
        />
      )}
    </div>
  );
}

function resolveGroups(
  sectionId: ExpoEditSectionId | undefined,
  groupId: ExpoFieldGroupId | undefined,
) {
  if (sectionId) {
    const section = EXPO_EDIT_SECTIONS.find((s) => s.id === sectionId);
    if (!section) {
      return EXPO_FIELD_GROUPS;
    }
    const idSet = new Set(section.groupIds);
    return EXPO_FIELD_GROUPS.filter((g) => idSet.has(g.id));
  }
  if (groupId) {
    return EXPO_FIELD_GROUPS.filter((g) => g.id === groupId);
  }
  return EXPO_FIELD_GROUPS;
}

const EMBED_URL_HINT_HY =
  "Արտաքին embed հղում (օր. Matterport, YouTube) — ֆայլը չի վերբեռնվում այստեղ, միայն URL։";

export function ProjectFieldsForm({
  defaults,
  groupId,
  sectionId,
  mediaFolderLogoUrl = null,
  mediaFolderId = null,
  exampleLogoPublicUrl = null,
}: ProjectFieldsFormProps) {
  const d = defaults as Record<string, string>;
  const groups = resolveGroups(sectionId, groupId);

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <fieldset
          key={group.id}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <legend className="px-2 text-base font-semibold text-slate-800">
            {group.titleHy}
          </legend>
          <div className="mt-4 flex flex-col gap-4">
            {group.id === "media" ? (
              <>
                <ProjectMediaFolderHint
                  mediaFolderId={mediaFolderId}
                  folderLogoUrl={mediaFolderLogoUrl}
                  exampleLogoPublicUrl={exampleLogoPublicUrl}
                />
                {group.keys.map((key) => {
                  const label = EXPO_FIELD_LABELS_HY[key] ?? key;
                  const val = d[key] ?? "";
                  if (HIDDEN_MEDIA_KEYS.has(key)) {
                    return (
                      <input key={key} type="hidden" name={key} value={val} />
                    );
                  }
                  if (GALLERY_KEYS.has(key)) {
                    return (
                      <MediaListField
                        key={key}
                        name={key}
                        label={label}
                        defaultValue={val}
                        hint={GALLERY_URL_HINT_HY}
                      />
                    );
                  }
                  if (EMBED_URL_KEYS.has(key)) {
                    return (
                      <FieldRow
                        key={key}
                        keyId={key}
                        label={label}
                        val={val}
                        isUrl
                        isLong={false}
                        hideUrlUpload
                        urlHint={EMBED_URL_HINT_HY}
                      />
                    );
                  }
                  const isUrl = URL_FIELD_KEYS.has(key);
                  const isLong = LONG_FIELDS.has(key) || key === "expo_field_19";
                  return (
                    <FieldRow
                      key={key}
                      keyId={key}
                      label={label}
                      val={val}
                      isUrl={isUrl}
                      isLong={isLong}
                    />
                  );
                })}
              </>
            ) : (
              group.keys.map((key) => {
                const label = EXPO_FIELD_LABELS_HY[key] ?? key;
                const val = d[key] ?? "";
                if (MEDIA_LIST_FIELD_KEYS.has(key)) {
                  return (
                    <MediaListField
                      key={key}
                      name={key}
                      label={label}
                      defaultValue={val}
                    />
                  );
                }
                const isUrl = URL_FIELD_KEYS.has(key);
                const isLong = LONG_FIELDS.has(key) || key === "expo_field_19";
                return (
                  <FieldRow
                    key={key}
                    keyId={key}
                    label={label}
                    val={val}
                    isUrl={isUrl}
                    isLong={isLong}
                  />
                );
              })
            )}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
