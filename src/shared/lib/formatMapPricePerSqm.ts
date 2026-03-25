const SQM_SUFFIX = " - ք/մ" as const;

/**
 * Ձևաչափում է մեկ քառակուսի մետրի գինը («Մինիմում արժեք» / «Մաքսիմում արժեք») — քարտեզի մարկերի տեքստի համար։
 *
 * @returns null, եթե երկու դաշտերն էլ դատարկ են
 */
export function formatMapPricePerSqm(
  minValue: string | undefined,
  maxValue: string | undefined,
): string | null {
  const min = minValue?.trim();
  const max = maxValue?.trim();

  if (!min && !max) {
    return null;
  }

  if (min && max) {
    return min === max ? `${min}${SQM_SUFFIX}` : `${min} — ${max}${SQM_SUFFIX}`;
  }

  return `${min || max}${SQM_SUFFIX}`;
}
