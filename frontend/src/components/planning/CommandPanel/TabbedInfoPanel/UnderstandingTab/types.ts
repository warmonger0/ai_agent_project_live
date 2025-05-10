// File: types.ts

export interface CriteriaItem {
  id: string;
  text: string;
  locked: boolean;
}

export interface UnderstandingData {
  overview: CriteriaItem[];
  functionality: CriteriaItem[];
  features: CriteriaItem[];
  lookAndFeel: CriteriaItem[];
  deployment: CriteriaItem[];
}

export const initialUnderstanding: UnderstandingData = {
  overview: [],
  functionality: [],
  features: [],
  lookAndFeel: [],
  deployment: [],
};

export function safeParseUnderstanding(raw: any): UnderstandingData | null {
  try {
    if (typeof raw === "string") return JSON.parse(raw);
    return raw || null;
  } catch {
    return null;
  }
}

export function handleToggleItem(
  data: UnderstandingData,
  section: keyof UnderstandingData,
  id: string
): UnderstandingData {
  return {
    ...data,
    [section]: data[section].map((item) =>
      item.id === id ? { ...item, locked: !item.locked } : item
    ),
  };
}

export function handleDeleteItem(
  data: UnderstandingData,
  section: keyof UnderstandingData,
  id: string
): UnderstandingData {
  return {
    ...data,
    [section]: data[section].filter((item) => item.id !== id),
  };
}

export function isAllCriteriaLocked(
  data: UnderstandingData,
  panelLocked: boolean
): boolean {
  return (
    panelLocked &&
    Object.values(data).every((section) => section.every((item) => item.locked))
  );
}
