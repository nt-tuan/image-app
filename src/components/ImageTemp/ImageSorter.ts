export type SortDirection = "asc" | "desc";

export const getNumberComparer = (field: string) => (a: any, b: any) =>
  ((a[field] as number | undefined) ?? 0) -
  ((b[field] as number | undefined) ?? 0);

export const fullnameComparer = (
  a: { fullname: string },
  b: { fullname: string }
) => {
  if (a.fullname < b.fullname) return -1;
  if (a.fullname === b.fullname) return 0;
  return 1;
};

export const atComparer = (a: { at?: string }, b: { at?: string }) => {
  if (a.at == null && b.at == null) return 0;
  if (a.at == null) return -1;
  if (b.at == null) return 1;
  try {
    const aTime = new Date(a.at);
    const bTime = new Date(b.at);
    return aTime.getTime() - bTime.getTime();
  } catch {
    return 0;
  }
};

export const sortImages = <T>(
  images: T[],
  direction: SortDirection,
  func: (a: T, b: T) => number
) => {
  const factor = direction === "asc" ? 1 : -1;
  return images.sort((a, b) => func(a, b) * factor);
};

export const comparer = {
  filename: fullnameComparer,
  at: atComparer,
  width: getNumberComparer("width"),
  height: getNumberComparer("height"),
  diskSize: getNumberComparer("diskSize"),
};
